import 'fake-indexeddb/auto';
import { beforeEach } from 'vitest';

/** Jeder Test startet mit leerem localStorage – die App-Einstellungen liegen dort. */
beforeEach(() => {
  localStorage.clear();
});

// jsdom kennt window.scrollTo nicht – die Page-Komponente ruft es beim Routenwechsel auf.
window.scrollTo = (() => {}) as typeof window.scrollTo;

// matchMedia wird von applyTheme genutzt und existiert in jsdom nicht.
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false
    })
  });
}
