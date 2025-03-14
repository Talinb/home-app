import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase"; // Import the db instance

export const syncWithFirestore = async (user) => {
  if (!user) return;

  try {
    // 1. Get all documents from Firestore
    const firestoreSnapshot = await getDocs(collection(db, "notes"));
    const firestoreItems = firestoreSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: Number(doc.id), // Convert string ID to number to match local format
    }));

    // 2. Get local items
    const localItems = JSON.parse(localStorage.getItem("items") || "[]");

    // 3. Process pending deletions first
    const pendingDeletions = localItems.filter(
      (item) => item.deleted && item.deletionStatus === "pending"
    );

    // Delete from Firestore and update status
    const deleteResults = await Promise.allSettled(
      pendingDeletions.map((item) =>
        deleteDoc(doc(db, "notes", String(item.id)))
          .then(() => ({ success: true, id: item.id }))
          .catch((error) => ({ success: false, id: item.id, error }))
      )
    );

    // Update local deletion statuses
    const updatedLocalItems = localItems.map((item) => {
      const result = deleteResults.find((r) => r.value?.id === item.id);
      if (!result) return item;

      return {
        ...item,
        deletionStatus: result.value.success ? "completed" : "failed",
        ...(result.value.error && { lastError: result.value.error.message }),
      };
    });

    // 4. Filter out completed deletions
    const activeItems = updatedLocalItems.filter(
      (item) => !item.deleted || item.deletionStatus !== "completed"
    );

    // 5. Merge with Firestore items
    const firestoreItemsMap = new Map(
      firestoreItems.map((item) => [item.id, item])
    );
    const mergedItems = activeItems.map((item) => {
      const firestoreItem = firestoreItemsMap.get(item.id);

      // If firestore item exists and is deleted, always prioritize
      if (firestoreItem?.deleted) {
        return firestoreItem;
      }

      // Otherwise use standard merge logic
      return firestoreItem &&
        new Date(firestoreItem.updatedAt) > new Date(item.updatedAt)
        ? firestoreItem
        : item;
    });

    // Add special handling for firestore deletions
    firestoreItems.forEach((firestoreItem) => {
      // Add any Firestore item that doesn't exist locally
      const exists = mergedItems.some((item) => item.id === firestoreItem.id);
      if (!exists) {
        mergedItems.push(firestoreItem);
      }
    });

    // After merging items, add this cleanup
    const finalItems = mergedItems.filter((item) => {
      // Remove all completed deletions regardless of origin
      if (item.deleted && item.deletionStatus === "completed") {
        return false;
      }
      return true;
    });

    // 6. Save merged items
    localStorage.setItem("items", JSON.stringify(finalItems));

    return finalItems;
  } catch (error) {
    console.error("Sync error:", error);
    return JSON.parse(localStorage.getItem("items") || "[]");
  }
};
