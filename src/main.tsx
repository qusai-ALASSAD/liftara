import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
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

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  import('virtual:pwa-register')
    .then(({ registerSW }) => registerSW({ immediate: true }))
    .catch(() => { /* PWA-Registrierung ist optional */ });
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
