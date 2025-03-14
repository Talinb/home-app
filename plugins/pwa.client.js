// PWA plugin for handling service worker registration and offline functionality
import { prefetchAppModules } from "../src/utils/prefetchModules";

export default defineNuxtPlugin(async (nuxtApp) => {
  // Only run in browser
  if (typeof window === "undefined") return;

  // Wait for app to mount before initializing PWA features
  nuxtApp.hook("app:mounted", () => {
    setTimeout(async () => {
      console.log("🔄 Initializing PWA features...");

      // Check if service worker is supported
      if ("serviceWorker" in navigator) {
        // Listen for service worker controller change (indicates SW activation)
        navigator.serviceWorker.addEventListener(
          "controllerchange",
          async () => {
            console.log(
              "🔄 Service Worker controller changed - new version activated"
            );
            // Prefetch modules when service worker becomes active
            await prefetchAppModules();
          }
        );

        // Force service worker to check for updates on page load
        navigator.serviceWorker.ready.then((registration) => {
          registration.update().catch((err) => {
            console.error("❌ Error updating service worker:", err);
          });
        });
      }

      // Prefetch modules regardless of service worker status
      await prefetchAppModules();

      // Add event listeners for online/offline status (for logging only)
      window.addEventListener("online", () => {
        console.log("🌐 App is online");
      });

      window.addEventListener("offline", () => {
        console.log("📴 App is offline - using cached resources");
      });

      // Log initial online status
      console.log(
        `🔌 Initial network status: ${navigator.onLine ? "online" : "offline"}`
      );
    }, 500); // Reduced timeout for faster initialization
  });
});
