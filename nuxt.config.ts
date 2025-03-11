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
    manifest: {
      name: "My Home App",
      short_name: "HomeApp",
      theme_color: "#003049",
      icons: [
        {
          src: "/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    strategies: "generateSW",
    devOptions: {
      enabled: true,
      type: "module",
      navigateFallback: "/",
    },
  },
  future: {
    compatibilityVersion: 4,
  },
});
