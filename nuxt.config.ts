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
      "icon-64x64.png",
      "icon-192x192.png",
      "icon-512x512.png",
      "maskable-icon-512x512.png",
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
      globPatterns: ["**/*"],
      additionalManifestEntries: [
        {
          url: "/",
          revision: null,
        },
        {
          url: "/todo",
          revision: null,
        },
        {
          url: "/note",
          revision: null,
        },
        {
          url: "/todo/sample",
          revision: null,
        },
        {
          url: "/note/sample",
          revision: null,
        },
        {
          url: "/_payload.json",
          revision: null,
        },
        {
          url: "/todo/_payload.json",
          revision: null,
        },
        {
          url: "/note/_payload.json",
          revision: null,
        },
        {
          url: "/todo/sample/_payload.json",
          revision: null,
        },
        {
          url: "/note/sample/_payload.json",
          revision: null,
        },
      ],
      runtimeCaching: [
        {
          urlPattern: ({ request }) => request.destination === "document",
          handler: "CacheFirst",
          options: {
            cacheName: "pages",
            cacheableResponse: { statuses: [0, 200] },
            matchOptions: {
              ignoreSearch: true,
              ignoreVary: true,
            },
          },
        },
        {
          urlPattern: /_payload\.json/,
          handler: "CacheFirst",
          options: {
            cacheName: "payloads",
            cacheableResponse: { statuses: [0, 200] },
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
          },
        },
        {
          urlPattern: /\.(?:js|css|vue)$/i,
          handler: "CacheFirst",
          options: {
            cacheName: "assets",
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          urlPattern: /\/api\//,
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "api-cache",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24,
            },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: "CacheFirst",
          options: {
            cacheName: "google-fonts-cache",
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365,
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
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          urlPattern: /\.(?:json|woff|woff2|ttf|eot)$/i,
          handler: "CacheFirst",
          options: {
            cacheName: "static-resources",
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          urlPattern: /_nuxt\/.*\.js$/,
          handler: "CacheFirst",
          options: {
            cacheName: "nuxt-js-chunks",
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          urlPattern: /\/(todo|note)(\/.*)?$/,
          handler: "CacheFirst",
          options: {
            cacheName: "dynamic-routes",
            cacheableResponse: { statuses: [0, 200] },
            matchOptions: {
              ignoreSearch: true,
              ignoreVary: true,
            },
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
      suppressWarnings: true,
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
  nitro: {
    prerender: {
      routes: ["/", "/todo", "/note", "/todo/sample", "/note/sample"],
      crawlLinks: true,
      failOnError: false,
    },
  },
});
