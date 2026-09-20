import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'node:path';

/**
 * Vorschau-Build: die komplette App als eine einzelne HTML-Datei.
 * Nur zum Anschauen und Teilen gedacht – der normale Build bleibt die PWA.
 */
export default defineConfig({
  base: './',
  define: { 'import.meta.env.VITE_SINGLE_FILE': JSON.stringify('1') },
  resolve: {
    alias: [
      // Vorschau nutzt das Manifest mit eingebetteten Bildern.
      {
        find: /^\.\/mediaManifest\.json$/,
        replacement: path.resolve(__dirname, 'src/content/mediaManifest.preview.json')
      },
      { find: '@', replacement: path.resolve(__dirname, 'src') }
    ]
  },
  plugins: [react(), viteSingleFile({ removeViteModuleLoader: true })],
  build: {
    outDir: 'dist-preview',
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    rollupOptions: { output: { inlineDynamicImports: true } }
  }
});
