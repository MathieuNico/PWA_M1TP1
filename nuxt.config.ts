// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-10-23',
  ssr: false,

  css: ['~/assets/css/app.css'],

  modules: [
    '@vite-pwa/nuxt'
  ],

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'PWA Chat',
      short_name: 'ChatPWA',
      description: 'Application Chat PWA',
      theme_color: '#667eea',
      background_color: '#ffffff',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: 'icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      cleanupOutdatedCaches: true
    }
  },

  nitro: {
    preset: 'node-server'
  },

  experimental: {
    appManifest: false,
    payloadExtraction: false
  },

  app: {
    baseURL: '/',
    buildAssetsDir: '/_nuxt/',
    head: {
      title: 'PWA Chat',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})
