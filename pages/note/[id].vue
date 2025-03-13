<template>
  <div class="max-w-2xl mx-auto">
    <ViewHeader :is-secret="noteType === 'secret-note'" @toggle-secret="toggleSecret" />
    <input
      v-model="noteTitle"
      placeholder="Note"
      class="text-3xl font-bold mb-4 w-full p-2 px-4 rounded-lg text-white font-secondary border-none focus:outline-none focus:ring-0 bg-light-navy"
    />
    <div
      contenteditable="true"
      ref="contentEditableRef"
      class="w-full min-h-[200px] font-medium bg-transparent p-2 focus:outline-none text-white font-secondary text-3xl contenteditable-placeholder"
      @input="(e) => (noteContent = e.target.innerHTML)"
    ></div>
  </div>
</template>

<script setup>
import { ref, watchEffect, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const noteTitle = ref("");
const noteContent = ref("");
const contentEditableRef = ref(null);
const noteType = ref("");
// Load and auto-save logic
watchEffect(async () => {
  const items = JSON.parse(localStorage.getItem("items") || "[]");
  const note = items.find((item) => item.id === Number(route.params.id));
  if (note) {
    noteTitle.value = note.title;
    noteContent.value = note.content;
    noteType.value = note.type;
    await nextTick();
    contentEditableRef.value.innerHTML = note.content;
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

watch(noteTitle, (newTitle) => {
  if (newTitle === "200781213") {
    const items = JSON.parse(localStorage.getItem("items") || "[]");

    // Delete current note
    const updatedItems = items.filter(
      (item) => item.id !== Number(route.params.id)
    );
    localStorage.setItem("items", JSON.stringify(updatedItems));

    // Create new secret note (you can modify this later)
    const newId = Date.now();
    const newNote = {
      id: newId,
      type: "secret-note", // You can use this type for filtering later
      title: "",
      content: "",
      createdAt: Date.now(),
    };

    localStorage.setItem("items", JSON.stringify([...updatedItems, newNote]));
    router.push(`/note/${newId}`);
  }
});

function toggleSecret() {
  noteType.value = noteType.value === "secret-note" ? "note" : "secret-note";
  const items = JSON.parse(localStorage.getItem("items") || "[]");
  const index = items.findIndex((item) => item.id === Number(route.params.id));
  if (index >= 0) {
    items[index].type = noteType.value;
    localStorage.setItem("items", JSON.stringify(items));
  }
}
</script>

<style scoped>
.contenteditable-placeholder:empty::before {
  content: "Start writing...";
  color: #9ca3af;
}
</style>
