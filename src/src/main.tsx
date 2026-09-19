import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';
// Schriften lokal gebündelt – die PWA bleibt auch offline typografisch korrekt.
import '@fontsource/sora/latin-500.css';
import '@fontsource/sora/latin-600.css';
import '@fontsource/sora/latin-700.css';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-700.css';
import '@fontsource-variable/noto-sans-arabic/wght.css';
import './index.css';
import { useAppStore } from '@/store/appStore';
import { applyTheme } from '@/lib/settings';

const setOnline = () => useAppStore.getState().setOnline(navigator.onLine);
window.addEventListener('online', setOnline);
window.addEventListener('offline', setOnline);
window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', () => {
  applyTheme(useAppStore.getState().settings.theme);
});

void useAppStore.getState().init();

// Vorschau-Build (eine einzelne HTML-Datei) läuft ohne Server: dann Hash-Routing.
const Router = import.meta.env.VITE_SINGLE_FILE ? HashRouter : BrowserRouter;

if ('serviceWorker' in navigator && import.meta.env.PROD && !import.meta.env.VITE_SINGLE_FILE) {
  import('virtual:pwa-register')
    .then(({ registerSW }) => registerSW({ immediate: true }))
    .catch(() => { /* PWA-Registrierung ist optional */ });
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
