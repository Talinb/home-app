<template>
  <button
    @click="router.back()"
    class="py-4"
  >
    <IconChevronLeft class="w-6 h-6 text-white"/>
  </button>
</template>

<script setup>
import { useRouter } from "vue-router";
import { IconChevronLeft } from '@tabler/icons-vue';
const router = useRouter();
</script>
