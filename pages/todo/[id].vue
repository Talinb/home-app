<template>
  <div class="max-w-2xl mx-auto">
    <ViewHeader />

    <input
      v-model="todoTitle"
      placeholder="Todo List"
      class="text-3xl font-bold mb-4 w-full p-2 px-4 rounded-lg text-white font-secondary border-none focus:outline-none focus:ring-0 bg-light-navy"
      @focus="clearPlaceholder"
      @blur="restorePlaceholderIfEmpty"
    />
    <TransitionGroup name="todo-list" tag="div" class="space-y-2">
      <div
        v-for="(item, index) in displayedTodos"
        :key="item.id || index"
        class="relative overflow-hidden group"
      >
        <!-- Delete button -->
        <div class="absolute right-0 top-0 bottom-0 w-[48px]">
          <button
            @click="removeTodo(index)"
            class="w-full h-full bg-red-500 text-white flex items-center justify-center px-3"
          >
            <IconTrash class="text-white h-6 w-6" />
          </button>
        </div>

        <!-- Swipe container -->
        <div
          class="flex items-center gap-2 transition-transform duration-300"
          :style="{ transform: `translateX(${item.swipeOffset || 0}px)` }"
          @touchstart="touchStart(index, $event)"
          @touchmove="touchMove(index, $event)"
          @touchend="touchEnd(index)"
        >
          <div
            @click="toggleCompleted(index)"
            class="cursor-pointer"
            :class="index >= todoItems.length ? 'opacity-50' : ''"
          >
            <IconSquareCheck
              v-if="item.completed"
              class="w-5 h-5 text-green-400"
            />
            <IconSquare v-else class="w-5 h-5 text-gray-400" />
          </div>
          <input
            :value="item.text"
            @input="handleInput(index, $event.target.value)"
            class="flex-1 p-1 bg-light-navy rounded text-white focus:outline-none"
            :class="index >= todoItems.length ? 'text-gray-400' : ''"
          />
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref, watchEffect, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import ViewHeader from "@/components/ViewHeader.vue";
import { IconTrash, IconSquare, IconSquareCheck } from "@tabler/icons-vue";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../src/firebase";
import { auth } from "../../src/firebase";

const route = useRoute();
const todoTitle = ref("");
const todoItems = ref([]);

// Add swipe state
const touchStartX = ref(0);
const isSwiping = ref(false);

const loadTodo = () => {
  if (typeof window === "undefined") return;

  const items = JSON.parse(localStorage.getItem("items") || "[]");
  const todo = items.find((item) => item.id === Number(route.params.id));
  if (todo) {
    todoTitle.value = todo.title;
    todoItems.value = todo.content;
  }
};

onMounted(() => {
  loadTodo();
});

// Modified auto-save functionality
const saveTodo = () => {
  const items = JSON.parse(localStorage.getItem("items") || "[]");
  const index = items.findIndex((item) => item.id === Number(route.params.id));

  const todoData = {
    id: Number(route.params.id),
    type: "todo",
    title: todoTitle.value,
    content: todoItems.value,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    items[index] = todoData;
  } else {
    items.push(todoData);
  }

  localStorage.setItem("items", JSON.stringify(items));

  if (navigator.onLine && auth.currentUser) {
    setDoc(doc(db, "notes", route.params.id), todoData).catch((error) =>
      console.error("Firestore save failed:", error)
    );
  }
};

// Update watchers
watch(
  [todoTitle, todoItems],
  () => {
    saveTodo();
  },
  { deep: true }
);

const displayedTodos = computed(() => {
  // Separate completed and uncompleted items
  const uncompleted = todoItems.value.filter((item) => !item.completed);
  const completed = todoItems.value.filter((item) => item.completed);

  // Return combined list with empty placeholder at end
  return [...uncompleted, ...completed, { text: "", completed: false }];
});

function handleInput(index, value) {
  if (index < todoItems.value.length) {
    // Update existing item
    todoItems.value[index].text = value;
  } else {
    // Create new item when typing in empty slot
    if (value.trim()) {
      todoItems.value.push({ text: value, completed: false });
    }
  }
}

function toggleCompleted(index) {
  if (index < todoItems.value.length) {
    const updatedItems = [...todoItems.value];
    updatedItems[index].completed = !updatedItems[index].completed;

    // Update local storage immediately
    todoItems.value = updatedItems;

    // Sync to Firestore
    if (navigator.onLine && auth.currentUser) {
      const items = JSON.parse(localStorage.getItem("items") || "[]");
      const todo = items.find((item) => item.id === Number(route.params.id));
      if (todo) {
        setDoc(doc(db, "notes", route.params.id), todo).catch((error) =>
          console.log("Firestore update failed:", error)
        );
      }
    }
  }
}

const touchStart = (index, event) => {
  touchStartX.value = event.touches[0].clientX;
  todoItems.value[index].swipeOffset = 0;
  todoItems.value[index].showDelete = false;
};

const touchMove = (index, event) => {
  const currentX = event.touches[0].clientX;
  const deltaX = currentX - touchStartX.value;

  // Allow left swipes up to 48px (trash icon 24px + 12px padding each side)
  if (deltaX < 0) {
    const maxOffset = -48;
    todoItems.value[index].swipeOffset = Math.max(deltaX, maxOffset);
  }
};

const touchEnd = (index) => {
  // Require 36px swipe to reveal delete (75% of 48px)
  if (todoItems.value[index].swipeOffset <= -36) {
    todoItems.value[index].swipeOffset = -48; // Snap to full offset
    todoItems.value[index].showDelete = true;
  } else {
    todoItems.value[index].swipeOffset = 0;
    todoItems.value[index].showDelete = false;
  }
};

const removeTodo = (index) => {
  // Add temporary ID for animation
  todoItems.value[index].isDeleting = true;

  setTimeout(() => {
    todoItems.value.splice(index, 1);
  }, 300); // Match animation duration
};

const clearPlaceholder = (event) => {
  if (todoTitle.value === "") {
    event.target.placeholder = "";
  }
};

const restorePlaceholderIfEmpty = (event) => {
  if (todoTitle.value === "") {
    event.target.placeholder = "Todo List";
  }
};
</script>

<style scoped>
.todo-list-enter-active,
.todo-list-leave-active,
.todo-list-move {
  transition: all 0.3s ease;
}

.todo-list-enter-from,
.todo-list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.todo-list-leave-active {
  position: absolute;
  width: 100%;
}

/* Keep existing swipe styles */
</style>
