export async function prefetchAppModules() {
  console.log("🚀 Prefetching critical app modules...");

  // Define all routes to prefetch (including dynamic routes with sample IDs)
  const routesToPrefetch = [
    "/",
    "/todo",
    "/note",
    "/todo/sample",
    "/note/sample",
  ];

  // Define critical assets to prefetch
  const criticalAssets = [
    // CSS files
    "/_nuxt/entry.css",
    // JS chunks
    "/_nuxt/entry.js",
    "/_nuxt/index.js",
    "/_nuxt/todo.js",
    "/_nuxt/note.js",
    // Images
    "/icon-64x64.png",
    "/icon-192x192.png",
    "/icon-512x512.png",
    "/maskable-icon-512x512.png",
    "/apple-touch-icon.png",
    "/apple-touch-icon-180x180.png",
    "/favicon.ico",
  ];

  try {
    // Prefetch all critical assets
    console.log("📦 Prefetching critical assets...");
    await Promise.all(
      criticalAssets.map(async (asset) => {
        try {
          const response = await fetch(asset, {
            cache: "force-cache", // Force caching even if already cached
            mode: "no-cors", // Allow cross-origin requests
          });
          console.log(`✅ Prefetched asset: ${asset}`);
          return response;
        } catch (error) {
          console.error(`❌ Failed to prefetch asset: ${asset}`, error);
        }
      })
    );

    // Prefetch all routes
    console.log("🔄 Prefetching routes...");
    await Promise.all(
      routesToPrefetch.map(async (route) => {
        try {
          const response = await fetch(route, {
            cache: "force-cache",
            mode: "no-cors",
          });
          console.log(`✅ Prefetched route: ${route}`);

          // Manually cache the route using Cache API for extra reliability
          if ("caches" in window) {
            const cache = await caches.open("pages");
            await cache.put(route, response.clone());
            console.log(`📥 Manually cached route: ${route}`);
          }

          return response;
        } catch (error) {
          console.error(`❌ Failed to prefetch route: ${route}`, error);
        }
      })
    );

    // Dynamically import core components to ensure they're cached
    console.log("🧩 Prefetching core components...");
    await Promise.all([
      import("../../components/ListItem.vue").catch((e) =>
        console.error("Failed to prefetch ListItem component", e)
      ),
      import("../../components/FloatingActionButton.vue").catch((e) =>
        console.error("Failed to prefetch FloatingActionButton component", e)
      ),
      import("../../components/AddItemButton.vue").catch((e) =>
        console.error("Failed to prefetch AddItemButton component", e)
      ),
      import("../../components/ViewHeader.vue").catch((e) =>
        console.error("Failed to prefetch ViewHeader component", e)
      ),
    ]);

    // Prefetch core services
    console.log("🔌 Prefetching core services...");
    await Promise.all([
      import("../services/itemsService").catch((e) =>
        console.error("Failed to prefetch items service", e)
      ),
      import("./sync").catch((e) =>
        console.error("Failed to prefetch sync service", e)
      ),
    ]);

    console.log("✅ All critical modules prefetched successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error prefetching modules:", error);
    return false;
  }
}
