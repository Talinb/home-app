<template>
  <div class="flex flex-col items-center justify-center h-full">
    <h1 class="text-white font-primary text-4xl text-center mb-4">Hi Talin</h1>
    <!-- Items list -->
    <div class="mb-8 w-full h-full max-w-2xl space-y-4">
      <template v-if="items.length > 0">
        <ListItem
          v-for="item in items"
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

    <FloatingActionButton @click="showModal = true" />

    <!-- Updated selection modal -->
    <div
      v-if="showModal"
      @click.self="showModal = false"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-yellow p-8 rounded-lg space-y-2 flex flex-col gap-4">
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
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import {
  IconSquareCheck,
  IconNote,
  IconTrash,
  IconPlus,
} from "@tabler/icons-vue";
import ListItem from "@/components/ListItem.vue";
import FloatingActionButton from "@/components/FloatingActionButton.vue";
import AddItemButton from "@/components/AddItemButton.vue";

const showModal = ref(false);
const router = useRouter();
const items = ref([]);

// Add new reactive state
const swipeStartX = ref(0);
const currentSwipeItem = ref(null);

// Load saved items on mount
onMounted(() => {
  const saved = localStorage.getItem("items");
  if (saved) items.value = JSON.parse(saved);
});

// Save items to localStorage whenever they change
watch(
  items,
  (newVal) => {
    localStorage.setItem("items", JSON.stringify(newVal));
  },
  { deep: true }
);

const navigateTo = (type, id = null) => {
  showModal.value = false;

  if (id) {
    // Navigate to existing item
    router.push(`/${type}/${id}`);
  } else {
    // Create new item
    const newItem = {
      id: Date.now(),
      type,
      title: "",
      content: type === "todo" ? [] : "",
      swipeOffset: 0,
      isSwiping: false,
    };
    items.value.push(newItem);
    router.push(`/${type}/${newItem.id}`);
  }
};

const clearStorage = () => {
  localStorage.clear();
  items.value = [];
  showModal.value = false;
};

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

const deleteItem = (item) => {
  items.value = items.value.filter((i) => i.id !== item.id);
  // Also remove from localStorage
  localStorage.removeItem(`note_${item.id}`);
  localStorage.removeItem(`todo_${item.id}`);
};

// Add this date formatter function
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
</script>
