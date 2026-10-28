// Builds a bookmark that needs no hosting: the whole page is packed into a data: URL.
// Run: yarn colors   -> writes colors/dist/bookmark.txt and colors/dist/bookmark.html
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(DIR, 'index.html'), 'utf8').replace(
  '<script src="colors.js"></script>',
  () => `<script>${readFileSync(join(DIR, 'colors.js'), 'utf8')}</script>`,
);
// Light minify: drop indentation and blank lines (keeps JS/CSS working, they use ; and braces).
const small = html.split('\n').map((l) => l.trim()).filter(Boolean).join('\n');
const url = 'data:text/html;charset=utf-8,' + encodeURIComponent(small);

mkdirSync(join(DIR, 'dist'), { recursive: true });
writeFileSync(join(DIR, 'dist', 'bookmark.txt'), url);
writeFileSync(
  join(DIR, 'dist', 'bookmark.html'),
  `<!doctype html><meta charset="utf-8"><title>Lisa järjehoidja</title>
<body style="font-family:Arial,sans-serif;max-width:560px;margin:48px auto;padding:0 16px;line-height:1.5">
<h1>Õhtuleht värvid</h1>
<p>1. Näita järjehoidjate riba (Ctrl+Shift+B).</p>
<p>2. Lohista see nupp järjehoidjate ribale:</p>
<p><a href="${url.replace(/"/g, '&quot;')}" style="display:inline-block;padding:10px 20px;background:#F50000;color:#fff;border-radius:8px;text-decoration:none;font-weight:700">Õhtuleht värvid</a></p>
<p>3. Edaspidi piisab klõpsust sellel järjehoidjal. Värvil klõpsates kopeeritakse HEX-kood.</p>
</body>`,
);
console.log(`bookmark URL: ${(url.length / 1024).toFixed(1)} KB`);
