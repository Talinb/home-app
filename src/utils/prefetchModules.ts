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

  // Get the actual chunk names from the page
  const findChunksByPattern = (pattern: string): string[] => {
    const scripts = document.querySelectorAll('script[src^="/_nuxt/"]');
    return Array.from(scripts)
      .map((script) => script.getAttribute("src"))
      .filter((src): src is string => src !== null && src.includes(pattern));
  };

  // Define critical assets to prefetch
  const criticalAssets = [
    // CSS files
    "/_nuxt/entry.css",
    "/_nuxt/index.css",
    "/_nuxt/_id_.BKiJQHGE.css", // Todo item CSS
    "/_nuxt/_id_.CXxD1jI4.css", // Note item CSS

    // JS chunks - dynamically find actual filenames
    ...findChunksByPattern("entry."),
    ...findChunksByPattern("index."),
    ...findChunksByPattern("todo."),
    ...findChunksByPattern("note."),
    ...findChunksByPattern("_id_"),
    "/_nuxt/BB0a0k49.js", // Important chunk for dynamic routes

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

    // Prefetch all payloads for routes
    console.log("🔄 Prefetching route payloads...");
    await Promise.all(
      routesToPrefetch.map(async (route) => {
        try {
          const payloadUrl =
            route === "/" ? "/_payload.json" : `${route}/_payload.json`;
          const response = await fetch(payloadUrl, {
            cache: "force-cache",
            mode: "no-cors",
          });
          console.log(`✅ Prefetched payload: ${payloadUrl}`);

          // Manually cache the payload
          if ("caches" in window) {
            const cache = await caches.open("pages");
            await cache.put(payloadUrl, response.clone());
            console.log(`📥 Manually cached payload: ${payloadUrl}`);
          }

          return response;
        } catch (error) {
          console.error(
            `❌ Failed to prefetch payload: ${route}/_payload.json`,
            error
          );
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

    // Cache all script and style resources on the page
    if ("caches" in window) {
      console.log("📦 Caching all current page resources...");
      const cache = await caches.open("assets");

      // Cache all scripts
      const scripts = document.querySelectorAll("script[src]");
      for (const script of scripts) {
        const src = script.getAttribute("src");
        if (src) {
          try {
            const response = await fetch(src, {
              cache: "force-cache",
              mode: "no-cors",
            });
            await cache.put(src, response);
            console.log(`📥 Cached script: ${src}`);
          } catch (error) {
            console.error(`❌ Failed to cache script: ${src}`, error);
          }
        }
      }

      // Cache all stylesheets
      const links = document.querySelectorAll('link[rel="stylesheet"]');
      for (const link of links) {
        const href = link.getAttribute("href");
        if (href) {
          try {
            const response = await fetch(href, {
              cache: "force-cache",
              mode: "no-cors",
            });
            await cache.put(href, response);
            console.log(`📥 Cached stylesheet: ${href}`);
          } catch (error) {
            console.error(`❌ Failed to cache stylesheet: ${href}`, error);
          }
        }
      }
    }

    console.log("✅ All critical modules prefetched successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error prefetching modules:", error);
    return false;
  }
}
