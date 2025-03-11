<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const isLoading = ref(true);
const router = useRouter();

onMounted(() => {
  setTimeout(async () => {
    if ("serviceWorker" in navigator) {
      try {
        await navigator.serviceWorker.register("/sw.js");
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    }
    isLoading.value = false;
  }, 1000);
});
</script>

<template>
  <div>
    <Head>
      <title>HomeApp</title>
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content="HomeApp" />
      <meta name="mobile-web-app-capable" content="yes" />
      <link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" />
      <link rel="mask-icon" href="/maskable_icon-512x512.png" color="#000" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <link rel="manifest" href="/manifest.webmanifest" />
    </Head>
    <div class="bg-navy min-h-screen">
      <div class="p-4 h-full overflow-hidden">
        <SplashScreen v-if="isLoading" />
        <NuxtPage v-else />
      </div>
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
