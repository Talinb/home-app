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
          @swipe-start="(e) => startSwipe(item, e)"
          @swipe-move="(e) => handleSwipe(item, e)"
          @swipe-end="(e) => endSwipe(item, e)"
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
import ListItem from "../components/ListItem.vue";
import FloatingActionButton from "../components/FloatingActionButton.vue";
import AddItemButton from "../components/AddItemButton.vue";
import { ItemService } from "../src/services/itemsService";
import { auth } from "../src/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { prefetchAppModules } from "../src/utils/prefetchModules";

const { items } = ItemService;

const filteredItems = computed(() =>
  ItemService.getFilteredItems(showSecretNotes.value)
);

const showModal = ref(false);
const showSecretNotes = ref(false);
const isOnline = ref(true);

const router = useRouter();

const navigateTo = (type, id = null) => {
  // Normalize route path for note types
  const routeType = type === "secret-note" ? "note" : type;

  if (!id) {
    const newId = Date.now();
    const newItem = {
      id: newId,
      type: type === "note" && showSecretNotes.value ? "secret-note" : type,
      title: "",
      content: type === "todo" ? [] : "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    ItemService.saveItem(newItem);
    router.push(`/${routeType}/${newId}`);
  } else {
    router.push(`/${routeType}/${id}`);
  }
};

const deleteItem = async (item) => {
  await ItemService.deleteItem(item);
};

// Add swipe handlers after the deleteItem function
const swipeStartX = ref(0);
const swipeStartTime = ref(0);
const currentSwipeItem = ref(null);

const startSwipe = (item, event) => {
  if (!event.touches) return;
  swipeStartTime.value = Date.now();

  // Reset previous swipe item
  if (currentSwipeItem.value && currentSwipeItem.value !== item) {
    currentSwipeItem.value.swipeOffset = 0;
    currentSwipeItem.value.showDelete = false;
  }

  currentSwipeItem.value = item;
  swipeStartX.value = event.touches[0].clientX;
};

const handleSwipe = (item, event) => {
  if (!event.touches) return;
  const currentX = event.touches[0].clientX;
  const delta = currentX - swipeStartX.value;

  // Limit swipe to delete button width (96px)
  item.swipeOffset = Math.min(0, Math.max(delta, -96));

  if (Math.abs(delta) > 10) {
    event.preventDefault();
  }
};

const endSwipe = (item) => {
  const swipeThreshold = -48; // Half of delete button width
  item.showDelete = item.swipeOffset <= swipeThreshold;

  // Snap to either fully open or closed
  item.swipeOffset = item.showDelete ? -96 : 0;
};

onMounted(() => {
  if (typeof window === "undefined") return;

  ItemService.initialize();
  isOnline.value = navigator.onLine;
  setupNetworkListener();

  // Add prefetching after initial setup
  if ("serviceWorker" in navigator) {
    prefetchAppModules();
  }

  onAuthStateChanged(auth, async (user) => {
    if (user) await ItemService.syncItems();
  });
});

const setupNetworkListener = () => {
  const syncAndUpdate = async () => {
    isOnline.value = navigator.onLine;
    if (isOnline.value) {
      await ItemService.syncItems();
      // Force UI update
      items.value = [...ItemService.items.value];
    }
  };

  // Add visibility change listener
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      syncAndUpdate();
    }
  };

  window.addEventListener("online", syncAndUpdate);
  window.addEventListener("offline", () => (isOnline.value = false));
  document.addEventListener("visibilitychange", handleVisibilityChange);

  // Sync every 10 seconds when online
  const syncInterval = setInterval(syncAndUpdate, 10000);

  // Cleanup
  onUnmounted(() => {
    clearInterval(syncInterval);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  });

  // Initial sync
  syncAndUpdate();
};
</script>

<style scoped>
/* Add this to your existing styles */
.swipe-transition {
  transition: transform 0.3s ease-out;
}
</style>
