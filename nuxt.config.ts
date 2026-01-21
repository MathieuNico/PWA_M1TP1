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
      name: 'PWA Chat & Gallery',
      short_name: 'ChatPWA',
      description: 'PWA Chat Application',
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
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    }
  },

  nitro: {
    // Standard Nitro server
  },

  experimental: {
    appManifest: false,
    payloadExtraction: false
  },

  app: {
    head: {
      title: 'PWA Chat',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#667eea' }
      ]
    }
  }
})
