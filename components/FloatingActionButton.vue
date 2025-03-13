<template>
  <button
    class="fixed bottom-8 border border-navy right-8 p-3 z-30 bg-yellow rounded-full shadow-lg"
    @click="handleClick"
  >
    <IconPlus class="text-navy h-6 w-6" stroke-width="3" />
  </button>
</template>

<script setup>
import { IconPlus } from "@tabler/icons-vue";
import { ref } from "vue";

const emit = defineEmits(["click"]);
let clickCount = 0;
let clickTimer = null;

function handleClick() {
  if (typeof window === "undefined") return;

  clickCount++;

  // Emit immediate click event for modal
  if (clickCount === 1) {
    emit("click");
  }

  // Clear previous timer
  if (clickTimer) clearTimeout(clickTimer);

  // Set new timer
  clickTimer = setTimeout(() => {
    clickCount = 0;
  }, 1000);

  // Handle triple click
  if (clickCount === 3) {
    emit("triple-click");
    clickCount = 0;
    clearTimeout(clickTimer);
  }
}
</script>
