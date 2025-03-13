<template>
  <button
    class="fixed bottom-8 right-8 p-3 bg-yellow rounded-full shadow-lg"
    @click="$emit('click')"
  >
    <IconPlus class="text-navy h-6 w-6" />
  </button>
</template>

<script setup>
import { IconPlus } from "@tabler/icons-vue";
</script>
