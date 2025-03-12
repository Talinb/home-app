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

// iOS requires explicit skipWaiting
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(self.clients.claim());
});
self.addEventListener("activate", () => self.clients.claim());
