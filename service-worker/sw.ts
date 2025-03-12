/// <reference types="vite-plugin-pwa/client" />

import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";

declare const self: ServiceWorkerGlobalScope;

// Precache core assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache navigation requests
registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({ cacheName: "pages" })
);

// Modified service worker installation
self.addEventListener("install", (event) => {
  // Skip waiting but don't claim immediately
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  // Claim clients only after becoming active
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Clean up old caches if needed
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== "current-cache-name")
            .map((name) => caches.delete(name))
        );
      }),
    ])
  );
});
