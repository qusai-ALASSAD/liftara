/**
 * Nachbereitung des Production-Builds für GitHub Pages.
 *
 * 1. 404.html  – GitHub Pages liefert bei unbekannten Pfaden 404.html aus.
 *    Da LIFTARA eine SPA mit BrowserRouter ist, muss dort dieselbe App
 *    starten wie in index.html. So funktioniert ein Reload auf z. B.
 *    /liftara/progress oder /liftara/exercise/bench-press.
 *    Die Datei wird bewusst NACH der Service-Worker-Generierung erzeugt,
 *    damit sie nicht zusätzlich in den Precache wandert (index.html ist
 *    bereits als navigateFallback im Precache und übernimmt offline).
 *
 * 2. .nojekyll – verhindert, dass GitHub Pages den Build durch Jekyll
 *    schickt und dabei Dateien/Ordner mit führendem Unterstrich verwirft.
 */
import { copyFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');

const index = resolve(dist, 'index.html');
if (!existsSync(index)) {
  console.error('[postbuild] dist/index.html fehlt – wurde "vite build" ausgeführt?');
  process.exit(1);
}

copyFileSync(index, resolve(dist, '404.html'));
writeFileSync(resolve(dist, '.nojekyll'), '');

console.log('[postbuild] 404.html und .nojekyll erstellt.');
