// PWA initialization plugin
import { prefetchAppModules } from "../src/utils/prefetchModules";

export default defineNuxtPlugin(async () => {
  // Only run in browser
  if (typeof window === "undefined") return;

  // Wait for the app to be mounted
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Check if service worker is supported
  if ("serviceWorker" in navigator) {
    try {
      // Register event listener for when the service worker is active
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log(
          "[PWA] Service worker controller changed, prefetching modules"
        );
        prefetchAppModules();
      });

      // If service worker is already active, prefetch modules
      if (navigator.serviceWorker.controller) {
        console.log("[PWA] Service worker already active, prefetching modules");
        prefetchAppModules();
      }
    } catch (error) {
      console.error("[PWA] Error initializing service worker:", error);
    }
  }
});
