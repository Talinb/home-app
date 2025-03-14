<template>
  <div class="max-w-2xl mx-auto">
    <ViewHeader
      :is-secret="noteType === 'secret-note'"
      @toggle-secret="toggleSecret"
    />
    <input
      v-model="noteTitle"
      placeholder="New note"
      class="text-3xl font-bold mb-4 w-full p-2 px-4 rounded-lg text-white font-secondary border-none focus:outline-none focus:ring-0 bg-light-navy"
      @focus="clearPlaceholder"
      @blur="restorePlaceholderIfEmpty"
    />
    <div
      contenteditable="true"
      ref="contentEditableRef"
      class="custom-spacing w-full min-h-[200px] font-medium bg-transparent p-2 focus:outline-none text-white font-secondary text-3xl contenteditable-placeholder "
      @input="(e) => (noteContent = e.target.innerHTML)"
    ></div>
  </div>
</template>

<script setup>
import { ref, watchEffect, nextTick, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../src/firebase";
import { auth } from "../../src/firebase";

const route = useRoute();
const router = useRouter();
const noteTitle = ref("");
const noteContent = ref("");
const contentEditableRef = ref(null);
const noteType = ref("");

onMounted(() => {
  const loadNote = () => {
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    let note = items.find((item) => item.id === Number(route.params.id));

    if (!note) {
      note = {
        id: Number(route.params.id),
        type: "note",
        title: "",
        content: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("items", JSON.stringify([...items, note]));
    }

    noteTitle.value = note.title;
    noteContent.value = note.content;
    noteType.value = note.type;
    if (contentEditableRef.value) {
      contentEditableRef.value.innerHTML = note.content;
    }
  };

  // Client-side only watchers
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
    const index = items.findIndex(
      (item) => item.id === Number(route.params.id)
    );

    const noteData = {
      id: Number(route.params.id),
      type: noteType.value,
      title: noteTitle.value,
      content: noteContent.value,
      createdAt: index >= 0 ? items[index].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      items[index] = noteData;
    } else {
      items.push(noteData);
    }

    localStorage.setItem("items", JSON.stringify(items));

    if (navigator.onLine && auth.currentUser) {
      setDoc(doc(db, "notes", route.params.id), noteData).catch((error) =>
        console.error("Firestore save failed:", error)
      );
    }
  });

  loadNote();
});

watch(noteTitle, (newTitle) => {
  if (newTitle === "200781213") {
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    const currentNote = items.find(
      (item) => item.id === Number(route.params.id)
    );

    if (currentNote) {
      // Update local state first
      noteType.value = "secret-note";
      noteTitle.value = "";
      noteContent.value = "";

      // Then update storage
      currentNote.type = noteType.value;
      currentNote.title = noteTitle.value;
      currentNote.content = noteContent.value;
      localStorage.setItem("items", JSON.stringify(items));

      // Clear content after state update
      contentEditableRef.value.innerHTML = "";
    }
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

const clearPlaceholder = (event) => {
  if (noteTitle.value === "") {
    event.target.placeholder = "";
  }
};

const restorePlaceholderIfEmpty = (event) => {
  if (noteTitle.value === "") {
    event.target.placeholder = "Note";
  }
};
</script>

<style scoped>
/* Add title placeholder styling */
input.empty-title::before {
  content: "Note";
  color: #001b2a;
  position: absolute;
  pointer-events: none;
}

.contenteditable-placeholder:empty::before {
  content: "Start writing...";
  color: #9ca3af;
}

/* Add relative positioning to container */
.max-w-2xl.mx-auto {
  position: relative;
}

.custom-spacing {
  word-spacing: -0.15em;
}
</style>
