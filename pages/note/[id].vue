<template>
  <div class="max-w-2xl mx-auto">
    <ViewHeader />
    <input
      v-model="noteTitle"
      placeholder="Note"
      class="text-3xl font-bold mb-4 w-full p-2 rounded-lg text-white font-secondary border-none focus:outline-none focus:ring-0 bg-light-navy"
    />
    <div
      contenteditable="true"
      :textContent="noteContent"
      class="w-full min-h-[200px] bg-transparent p-2 focus:outline-none text-white font-secondary text-3xl contenteditable-placeholder"
      @input="(e) => (noteContent = e.target.textContent)"
    ></div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const noteTitle = ref("");
const noteContent = ref("");

// Load and auto-save logic
watchEffect(() => {
  const items = JSON.parse(localStorage.getItem("items") || "[]");
  const note = items.find((item) => item.id === Number(route.params.id));
  if (note) {
    noteTitle.value = note.title;
    noteContent.value = note.content;
  }
});

watchEffect(() => {
  const items = JSON.parse(localStorage.getItem("items") || "[]");
  const index = items.findIndex((item) => item.id === Number(route.params.id));
  if (index >= 0) {
    items[index] = {
      ...items[index],
      title: noteTitle.value,
      content: noteContent.value,
    };
    localStorage.setItem("items", JSON.stringify(items));
  }
});
</script>

<style scoped>
.contenteditable-placeholder:empty::before {
  content: "Start writing...";
  color: #9ca3af;
}
</style>
