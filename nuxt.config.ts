// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-10-23',
  ssr: false,
  modules: [
    '@vite-pwa/nuxt'
  ],

  pwa: {
    // temporarily disable to check if it's the cause of 500 errors
    // disable: true, 
    registerType: 'autoUpdate',
    manifest: {
      name: 'PWA Chat & Gallery - Application Progressive',
      short_name: 'PWA Chat',
      description: 'Application PWA avec chat, caméra, notifications et mode offline',
      theme_color: '#667eea',
      background_color: '#ffffff',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      orientation: 'portrait-primary',
      icons: [
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/index.html',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365
            }
          }
        }
      ]
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      type: 'module'
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 20
    }
  },
  nitro: {
    experimental: {
      websocket: false
    }
  },
  experimental: {
    appManifest: false,
    payloadExtraction: false
  }
})
