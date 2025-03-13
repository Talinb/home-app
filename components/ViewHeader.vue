<template>
  <div class="flex justify-between items-center">
    <button @click="handleBack" class="py-4">
      <IconChevronLeft class="w-6 h-6 text-white" />
    </button>
    <IconLockPassword v-if="isSecret" class="w-6 h-6 text-white" @click="toggleSecret" />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { IconChevronLeft, IconLockPassword } from "@tabler/icons-vue";
defineProps({
  isSecret: {
    type: Boolean,
    required: false,
  },
});
const router = useRouter();
const emit = defineEmits(["toggle-secret"]);

function handleBack() {
  router.push("/");
}

function toggleSecret() {
  emit("toggle-secret");
}
</script>
