export async function prefetchAppModules() {
  if (typeof window === "undefined") return; // Only run in browser

  console.log("[Prefetch] Starting module prefetch for offline use");

  try {
    await Promise.all([
      // Prefetch all page components
      import("@/pages/index.vue"),
      import("@/pages/note/[id].vue"),
      import("@/pages/todo/[id].vue"),

      // Prefetch core components
      import("@/components/ListItem.vue"),
      import("@/components/FloatingActionButton.vue"),
      import("@/components/AddItemButton.vue"),

      // Prefetch services
      import("../services/itemsService"),
      import("./sync"),
    ]);

    console.log("[Prefetch] All critical modules loaded successfully");
  } catch (error) {
    console.error("[Prefetch] Error prefetching modules:", error);
  }
}
