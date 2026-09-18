import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

/**
 * Basis-Pfad des Deployments.
 * GitHub Pages liefert das Projekt unter https://<user>.github.io/liftara/ aus.
 * Über VITE_BASE lässt sich der Pfad für andere Ziele (z. B. Netlify: "/") überschreiben.
 */
const BASE = process.env.VITE_BASE ?? '/liftara/';

export default defineConfig({
  base: BASE,
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,webmanifest}'],
        navigateFallback: `${BASE}index.html`,
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'liftara-fonts', expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 } }
          }
        ]
      },
      manifest: {
        name: 'LIFTARA - Train Smart. Grow Strong.',
        short_name: 'LIFTARA',
        description: 'Mehrsprachiger Gym-Begleiter: Trainingsplan, Ausführung, Muskelkarte, Fortschritt. Offline-first.',
        lang: 'de',
        dir: 'ltr',
        start_url: BASE,
        scope: BASE,
        id: BASE,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#f8f9fb',
        theme_color: '#1f41d6',
        categories: ['health', 'fitness', 'sports'],
        icons: [
          { src: `${BASE}icons/icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: `${BASE}icons/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: `${BASE}icons/maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' }
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
