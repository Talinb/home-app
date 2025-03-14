import { ref } from "vue";
import { syncWithFirestore } from "../utils/sync";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

// Add reactive state
const items = ref([]);

export const ItemService = {
  items, // Expose reactive reference

  async initialize() {
    items.value = await this.syncItems();
  },

  async syncItems() {
    const syncedItems = await syncWithFirestore(auth.currentUser);
    // Merge with existing reactive state to preserve UI properties
    items.value = syncedItems
      .filter((item) => !(item.deleted && item.deletionStatus === "completed"))
      .map((firestoreItem) => {
        const existing = items.value.find((i) => i.id === firestoreItem.id);
        return existing
          ? { ...existing, ...firestoreItem }
          : {
              swipeOffset: 0,
              isSwiping: false,
              ...firestoreItem,
            };
      });
    return items.value;
  },

  // Update other methods to modify items.value directly
  async saveItem(item) {
    const index = items.value.findIndex((i) => i.id === item.id);

    if (index >= 0) {
      items.value[index] = item;
    } else {
      items.value.push(item);
    }

    localStorage.setItem("items", JSON.stringify(items.value));

    if (navigator.onLine && auth.currentUser) {
      await setDoc(doc(db, "notes", String(item.id)), item);
    }
  },

  async deleteItem(item) {
    const index = items.value.findIndex((i) => i.id === item.id);
    if (index === -1) return;

    const updatedItem = {
      ...item,
      deleted: true,
      deletionStatus: "pending",
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletionOrigin: auth.currentUser?.uid,
      deletionAttempts: (item.deletionAttempts || 0) + 1,
    };

    items.value[index] = updatedItem;
    localStorage.setItem("items", JSON.stringify(items.value));

    // Immediate sync attempt if online
    if (navigator.onLine && auth.currentUser) {
      try {
        await deleteDoc(doc(db, "notes", String(item.id)));
        updatedItem.deletionStatus = "completed";
        items.value = items.value.filter((i) => i.id !== item.id);
      } catch (error) {
        updatedItem.deletionStatus = "failed";
        updatedItem.lastError = error.message;
      }
      localStorage.setItem("items", JSON.stringify(items.value));
    }
  },

  getFilteredItems(showSecretNotes) {
    return items.value.filter(
      (item) =>
        !item.deleted && (showSecretNotes || item.type !== "secret-note")
    );
  },
};
