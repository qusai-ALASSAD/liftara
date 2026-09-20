// GitHub Pages: SPA-Fallback (404.html) und .nojekyll erzeugen.
import { copyFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = resolve(process.cwd(), 'dist');
copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'));
writeFileSync(resolve(dist, '.nojekyll'), '');
console.log('postbuild: 404.html + .nojekyll erstellt');
