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
    strategies: "generateSW",
    srcDir: "",
    filename: "",
    injectRegister: "auto",
    devOptions: {
      enabled: true,
    },
    manifest: {
      name: "My Home App",
      short_name: "HomeApp",
      description: "My Home App",
      theme_color: "#003049",
      icons: [
        {
          src: "icon-64x64.png",
          sizes: "64x64",
          type: "image/png",
        },
        {
          src: "icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "apple-touch-icon-180x180.png",
          sizes: "180x180",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    workbox: {
      skipWaiting: true,
      clientsClaim: true,
      globPatterns: ["**/*.{js,css,html,ico,png,svg,ttf}"],
      maximumFileSizeToCacheInBytes: 25 * 1024 * 1024, // 25MB
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
