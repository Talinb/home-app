<script setup>
const isLoading = ref(true);

onMounted(() => {
  
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});
</script>

<template>
  <div class="bg-navy min-h-screen">
    <div class="p-4 h-full">
      <SplashScreen v-if="isLoading" />
      <div v-else>
        <NuxtPage />
      </div>
    </div>
  </div>
</template>
