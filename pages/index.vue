<template>
  <div class="flex flex-col items-center justify-center h-full">
    <h1 class="text-white font-primary text-4xl text-center mb-4">Hi Talin</h1>
    <div v-if="!isOnline" class="text-white font-secondary mb-2">
      OFFLINE MODE
    </div>
    <!-- Items list -->
    <div class="mb-8 w-full h-full max-w-2xl space-y-4">
      <template v-if="filteredItems.length > 0">
        <ListItem
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
          @delete="deleteItem(item)"
          @navigate="navigateTo(item.type, item.id)"
          @swipe-start="startSwipe(item, $event)"
          @swipe-move="handleSwipe(item, $event)"
          @swipe-end="endSwipe(item)"
        />
      </template>
      <AddItemButton v-else @click="showModal = true" />
    </div>

    <FloatingActionButton
      @click="showModal = true"
      @triple-click="
        showSecretNotes = !showSecretNotes;
        showModal = false;
      "
    />

    <!-- Updated selection modal -->
    <div
      v-if="showModal"
      @click.self="showModal = false"
      class="fixed z-20 inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-yellow p-8 rounded-lg space-y-2 flex flex-col gap-px">
        <button
          @click="navigateTo('todo')"
          class="px-6 py-2 border-2 border-navy text-navy rounded-xl"
        >
          New Todo List
        </button>
        <button
          @click="navigateTo('note')"
          class="px-6 py-2 border-2 border-navy text-navy rounded-xl"
        >
          New Note
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import ListItem from "@/components/ListItem.vue";
import FloatingActionButton from "@/components/FloatingActionButton.vue";
import AddItemButton from "@/components/AddItemButton.vue";
import {
  collection,
  onSnapshot,
  query,
  doc,
  deleteDoc,
  where,
  setDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../src/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const showModal = ref(false);
const router = useRouter();
const items = ref([]);
const showSecretNotes = ref(false);
// Add new reactive state
const swipeStartX = ref(0);
const currentSwipeItem = ref(null);

// Initialize reactive state without browser APIs
const isOnline = ref(true);

onMounted(() => {
  // Client-side initialization
  if (typeof window !== "undefined") {
    // Load from localStorage
    items.value = JSON.parse(localStorage.getItem("items") || "[]");
    isOnline.value = navigator.onLine;

    // Set up network detection
    const updateNetworkStatus = () => {
      isOnline.value = navigator.onLine;
      if (isOnline.value && auth.currentUser) syncToFirestore(auth.currentUser);
    };

    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", () => (isOnline.value = false));

    // Initial sync
    onAuthStateChanged(auth, (user) => {
      if (user) syncToFirestore(user);
    });
  }

  cleanLocalStorage();
});

// Update saveToLocal
const saveToLocal = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("items", JSON.stringify(items.value));
  }
};

// Sync to Firestore in background
const syncToFirestore = async (user) => {
  if (!user || !isOnline.value) return;

  try {
    // Process pending deletions first
    const pendingDeletions = items.value.filter(
      (item) => item.deleted && item.deletionStatus === "pending"
    );

    // Delete from Firestore
    const deleteResults = await Promise.allSettled(
      pendingDeletions.map((item) =>
        deleteDoc(doc(db, "notes", String(item.id))).then(() => ({
          success: true,
          id: item.id,
        }))
      )
    );

    // Update local state based on results
    deleteResults.forEach((result, index) => {
      const originalItem = pendingDeletions[index];
      if (result.status === "fulfilled" && result.value.success) {
        // Mark for local removal
        originalItem.deletionStatus = "completed";
      } else {
        // Mark failed attempts
        originalItem.deletionStatus = "failed";
        originalItem.deletionAttempts =
          (originalItem.deletionAttempts || 0) + 1;
      }
    });

    // Remove successfully deleted items from local storage
    items.value = items.value.filter(
      (item) => item.deletionStatus !== "completed"
    );
    saveToLocal();

    // Now sync remaining items
    const updatePromises = items.value.map((item) =>
      setDoc(doc(db, "notes", String(item.id)), item)
    );
    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Sync error:", error);
  }
};

// Unified save handler
const saveItem = (item) => {
  const index = items.value.findIndex((i) => i.id === item.id);
  if (index >= 0) {
    items.value[index] = item;
  } else {
    items.value.push(item);
  }
  saveToLocal();
  syncToFirestore(auth.currentUser);
};

// Delete handler
const deleteItem = (item) => {
  const index = items.value.findIndex((i) => i.id === item.id);
  if (index >= 0) {
    items.value[index] = {
      ...item,
      deleted: true,
      deletionStatus: "pending",
      deletedAt: new Date().toISOString(),
    };
    saveToLocal();
    syncToFirestore(auth.currentUser); // Trigger immediate sync attempt
  }
};

// Navigation handler
const navigateTo = (type, id = null) => {
  //Normalise type secret-note to note
  if (type === "secret-note") {
    type = "note";
  }

  if (!id) {
    const newId = Date.now();
    const newItem = {
      id: newId,
      type,
      title: "",
      content: type === "todo" ? [] : "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save before navigating
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    localStorage.setItem("items", JSON.stringify([...items, newItem]));

    router.push(`/${type}/${newId}`);
  } else {
    router.push(`/${type}/${id}`);
  }
};

// Add computed property for filtered items
const filteredItems = computed(() => {
  return items.value.filter(
    (item) =>
      !item.deleted && (showSecretNotes.value || item.type !== "secret-note")
  );
});

// Add these methods
const startSwipe = (item, event) => {
  if (currentSwipeItem.value && currentSwipeItem.value !== item) {
    currentSwipeItem.value.swipeOffset = 0;
    currentSwipeItem.value.isSwiping = false;
  }
  currentSwipeItem.value = item;
  swipeStartX.value = event.touches[0].clientX;
  item.isSwiping = true;
};

const handleSwipe = (item, event) => {
  if (!item.isSwiping) return;
  const currentX = event.touches[0].clientX;
  const delta = currentX - swipeStartX.value;
  // Allow more natural swipe movement
  item.swipeOffset = Math.min(0, Math.max(delta, -100));

  // Prevent vertical scrolling while swiping
  if (Math.abs(delta) > 10) {
    event.preventDefault();
  }
};

const endSwipe = (item) => {
  item.isSwiping = false;
  // Snap based on velocity rather than fixed threshold
  const shouldDelete =
    item.swipeOffset < -40 ||
    (item.swipeOffset < -30 && Date.now() - swipeStartTime.value < 200);
  item.swipeOffset = shouldDelete ? -100 : 0;
};

// Add this to onMounted
const cleanLocalStorage = () => {
  const now = Date.now();
  items.value = items.value.filter((item) => {
    if (!item.deleted) return true;
    // Keep failed deletions for 24 hours
    return (
      item.deletionStatus === "failed" &&
      now - new Date(item.deletedAt).getTime() < 86400000
    ); // 24 hours
  });
  saveToLocal();
};
</script>
