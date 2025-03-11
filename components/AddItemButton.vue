<template>
  <div
    class="w-full rounded p-4 bg-light-navy flex flex-row items-center gap-4 cursor-pointer transition-transform hover:scale-[1.02]"
    @click="$emit('click')"
  >
    <div class="flex flex-col items-center justify-center flex-shrink-0">
      <IconPlus class="text-navy h-8 w-8" />
    </div>
    <h3 class="font-bold text-navy font-secondary text-xl">
      Click to create item
    </h3>
  </div>
</template>

<script setup>
import { IconPlus } from "@tabler/icons-vue";
</script>
