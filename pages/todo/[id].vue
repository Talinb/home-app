<template>
  <div class="max-w-2xl mx-auto">
    <ViewHeader />

    <input
      v-model="todoTitle"
      placeholder="Todo"
      class="text-3xl font-bold mb-4 w-full p-2 rounded-lg text-white font-secondary border-none focus:outline-none focus:ring-0 bg-light-navy"
    />
    <div class="space-y-2">
      <div
        v-for="(item, index) in displayedTodos"
        :key="index"
        class="flex items-center gap-2"
      >
        <div
          @click="
            index < todoItems.length && (item.completed = !item.completed)
          "
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
          class="flex-1 p-1 bg-light-navy rounded focus:outline-none"
          :class="index >= todoItems.length ? 'text-gray-400 mr-8' : ''"
        />
        <button
          v-if="index < todoItems.length"
          @click="removeTodo(index)"
          class="text-red-500 hover:text-red-700"
        >
          <IconTrash class="p-0 text-white" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, computed } from "vue";
import { useRoute } from "vue-router";
import ViewHeader from "@/components/ViewHeader.vue";
import { IconTrash, IconSquare, IconSquareCheck } from "@tabler/icons-vue";
const route = useRoute();
const todoTitle = ref("");
const todoItems = ref([]);

// Load saved data
watchEffect(() => {
  const items = JSON.parse(localStorage.getItem("items") || "[]");
  const todo = items.find((item) => item.id === Number(route.params.id));
  if (todo) {
    todoTitle.value = todo.title;
    todoItems.value = todo.content;
  }
});

// Auto-save functionality
watchEffect(() => {
  const items = JSON.parse(localStorage.getItem("items") || "[]");
  const index = items.findIndex((item) => item.id === Number(route.params.id));
  if (index >= 0) {
    items[index] = {
      ...items[index],
      title: todoTitle.value,
      content: todoItems.value,
    };
    localStorage.setItem("items", JSON.stringify(items));
  }
});

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

function removeTodo(index) {
  todoItems.value.splice(index, 1);
}
</script>
