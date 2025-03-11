<template>
  <button
    class="fixed bottom-5 left-5 p-3 bg-yellow rounded-full shadow-lg"
    @click="$emit('click')"
  >
    <IconPlus class="text-navy h-5 w-5" />
  </button>
</template>

<script setup>
import { IconPlus } from "@tabler/icons-vue";
</script>
