export async function prefetchAppModules() {
  if (typeof window === "undefined") return; // Only run in browser

  console.log("[Prefetch] Starting module prefetch for offline use");

  try {
    // Define routes to prefetch
    const routesToPrefetch = ["/", "/todo", "/note"];

    // Prefetch routes
    for (const route of routesToPrefetch) {
      try {
        // Create a prefetch link for the route
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = route;
        document.head.appendChild(link);
        console.log(`[Prefetch] Added prefetch link for: ${route}`);
      } catch (err) {
        console.warn(`[Prefetch] Failed to prefetch ${route}:`, err);
      }
    }

    // Dynamically import components to ensure they're cached
    await Promise.all([
      // Prefetch core components
      import("../../components/ListItem.vue"),
      import("../../components/FloatingActionButton.vue"),
      import("../../components/AddItemButton.vue"),

      // Prefetch services
      import("../services/itemsService"),
      import("./sync"),
    ]);

    console.log("[Prefetch] All critical modules loaded successfully");
  } catch (error) {
    console.error("[Prefetch] Error prefetching modules:", error);
  }
}
