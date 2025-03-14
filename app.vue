<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const isLoading = ref(false);
const router = useRouter();

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);

  // Register service worker for PWA
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope
          );
        })
        .catch((error) => {
          console.log("ServiceWorker registration failed: ", error);
        });
    });
  }
});
</script>

<template>
  <div>
    <Head>
      <title>HomeApp</title>
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="HomeApp" />
      <meta name="theme-color" content="#003049" />
      <meta name="apple-mobile-web-app-status-bar" content="#003049" />
      <link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      />
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

@media (prefers-color-scheme: light) {
  body {
    background-color: #003049;
  }
}
</style>
