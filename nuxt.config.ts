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
    registerType: "autoUpdate",
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
      globPatterns: ["**/*.{js,css,html,ico,png,svg,ttf}"],
      navigateFallback: "/",
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      skipWaiting: true,
    },
    devOptions: {
      enabled: true,
      type: "module",
      navigateFallback: "/",
    },
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
