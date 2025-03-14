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
  app: {
    head: {
      meta: [
        { name: "apple-mobile-web-app-capable", content: "yes" },
        {
          name: "apple-mobile-web-app-status-bar-style",
          content: "default",
        },
        { name: "apple-mobile-web-app-title", content: "HomeApp" },
        { name: "theme-color", content: "#003049" },
        { name: "apple-mobile-web-app-status-bar", content: "#003049" },
      ],
      link: [
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon-180x180.png",
        },
        { rel: "manifest", href: "/manifest.json" },
      ],
    },
  },
  pwa: {
    registerType: "autoUpdate",
    strategies: "generateSW",
    includeAssets: [
      "favicon.ico",
      "apple-touch-icon.png",
      "apple-touch-icon-180x180.png",
    ],
    manifest: {
      name: "HomeApp",
      short_name: "HomeApp",
      description: "My Home App PWA",
      theme_color: "#003049",
      background_color: "#003049",
      display: "standalone",
      orientation: "portrait",
      scope: "/",
      start_url: "/",
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
          src: "icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "maskable-icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "apple-touch-icon-180x180.png",
          sizes: "180x180",
          type: "image/png",
          purpose: "apple touch icon",
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: [
        "**/*.{js,css,html,png,svg,ico,vue}",
        "/_nuxt/**",
        "/components/**",
        "/pages/**",
      ],
      additionalManifestEntries: [
        {
          url: "/",
          revision: Date.now().toString(),
        },
        {
          url: "/todo",
          revision: Date.now().toString(),
        },
        {
          url: "/note",
          revision: Date.now().toString(),
        },
      ],
      runtimeCaching: [
        {
          urlPattern: ({ request }) => request.destination === "document",
          handler: "NetworkFirst",
          options: {
            cacheName: "pages",
            networkTimeoutSeconds: 3,
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          urlPattern: /\.(?:js|css|vue)$/i,
          handler: "CacheFirst",
          options: {
            cacheName: "assets",
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: "CacheFirst",
          options: {
            cacheName: "google-fonts-cache",
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/i,
          handler: "CacheFirst",
          options: {
            cacheName: "images",
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
          },
        },
        {
          urlPattern: /\.(?:js|css)$/i,
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "static-resources",
          },
        },
      ],
      skipWaiting: true,
      clientsClaim: true,
      cleanupOutdatedCaches: true,
    },
    devOptions: {
      enabled: true,
      type: "module",
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
