<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const isLoading = ref(true);
const router = useRouter();

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});
</script>

<template>
  <div class="bg-navy min-h-screen">
    <div class="p-4 h-full overflow-hidden">
      <SplashScreen v-if="isLoading" />
      <NuxtPage v-else />
    </div>
  </div>
</template>

<style>
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
}

.slide-left-enter-from {
  transform: translateX(100%);
  z-index: 2;
}

.slide-left-enter-to {
  transform: translateX(0);
}

.slide-left-leave-active {
  z-index: 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0.8;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
}

.slide-right-enter-from {
  transform: translateX(-100%);
  z-index: 2;
}

.slide-right-enter-to {
  transform: translateX(0);
}

.slide-right-leave-active {
  z-index: 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0.8;
}
</style>
