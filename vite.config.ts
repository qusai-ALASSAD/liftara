import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

const base = process.env.VITE_BASE ?? '/';

export default defineConfig({
  base,
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png'],
      workbox: {
        // Vorab zwischengespeichert wird nur die Oberfläche: Code, Stile, Schriften,
        // Icons und die eigenen SVG-Grafiken. Übungsfotos und Videos bewusst NICHT –
        // sie würden den ersten Start um mehrere Megabyte verlängern.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        globIgnores: ['**/media/exercises/**'],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/media\//],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        runtimeCaching: [
          {
            // Übungsfotos: beim ersten Anzeigen holen, danach offline verfügbar.
            urlPattern: ({ url }) => url.pathname.includes('/media/exercises/') && /\.(webp|png|jpg|jpeg)$/i.test(url.pathname),
            handler: 'CacheFirst',
            options: {
              cacheName: 'liftara-exercise-images',
              expiration: { maxEntries: 400, maxAgeSeconds: 60 * 60 * 24 * 180 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            // Videos werden nur auf Abruf und einzeln zwischengespeichert.
            urlPattern: ({ url }) => url.pathname.includes('/media/exercises/') && /\.(webm|mp4)$/i.test(url.pathname),
            handler: 'CacheFirst',
            options: {
              cacheName: 'liftara-exercise-videos',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 90 },
              rangeRequests: true,
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      },
      manifest: {
        name: 'LIFTARA - Train Smart. Grow Strong.',
        short_name: 'LIFTARA',
        description: 'Mehrsprachiger Gym-Begleiter: Trainingsplan, Ausführung, Muskelkarte, Fortschritt. Offline-first.',
        lang: 'de',
        dir: 'ltr',
        start_url: base,
        scope: base,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#FFFFFF',
        theme_color: '#FF6B00',
        categories: ['health', 'fitness', 'sports'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      }
    })
  ],
  build: {
    // Charts und Datenbank werden getrennt ausgeliefert – der Einstieg bleibt schlank.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          data: ['dexie', 'zustand'],
          i18n: ['i18next', 'react-i18next']
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false
  }
} as Parameters<typeof defineConfig>[0]);
