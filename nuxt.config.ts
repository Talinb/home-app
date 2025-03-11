// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@vite-pwa/nuxt", "@nuxtjs/tailwindcss"],
  css: ["~/assets/css/fonts.css"],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  pwa: {
    strategies: "injectManifest",
    srcDir: "service-worker",
    filename: "sw.ts",
    registerType: "autoUpdate",
    manifest: {
      name: "My Home App",
      short_name: "HomeApp",
      theme_color: "#003049",
      icons: [
        {
          src: "/icons/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/icons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: ({ url }) =>
            ["/", "/todo/.*", "/note/.*"].some((path) =>
              new RegExp(path).test(url.pathname)
            ),
          handler: "NetworkFirst",
          options: {
            cacheName: "page-cache",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
            networkTimeoutSeconds: 3,
          },
        },
      ],
    },
    devOptions: {
      enabled: true,
      type: "module",
      suppressWarnings: true,
    },
    injectRegister: "auto",
    includeAssets: ["/icons/*.png"],
  },
  future: {
    compatibilityVersion: 4,
  },
  build: {},
  vite: {
    build: {
      rollupOptions: {
        external: [
          "workbox-precaching",
          "workbox-routing",
          "workbox-strategies",
        ],
      },
    },
  },
});
