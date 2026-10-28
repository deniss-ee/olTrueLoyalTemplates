// Fixes the white background in the Ad Manager video template, canvas + video only.
// Usage: node adManager/patch-template.mjs path/to/original.html [output.html]
// Default output: <original>.fixed.html (the original file is never changed).
import { readFileSync, writeFileSync } from 'node:fs';

const [src, out = (process.argv[2] || '').replace(/\.html?$/i, '') + '.fixed.html'] = process.argv.slice(2);
if (!src) { console.error('Usage: node adManager/patch-template.mjs original.html [output.html]'); process.exit(1); }

let html = readFileSync(src, 'utf8');
const edits = [
  // 1. Follow the page's light/dark theme (otherwise the iframe canvas is painted opaque white).
  [/(<meta name="viewport"[^>]*>)/, '$1\n    <meta name="color-scheme" content="light dark" />'],
  [/<style>/, '<style>\n      :root {\n        color-scheme: light dark;\n      }'],
  // 2. Transparent canvas and video in CSS.
  [/(#canvas \{\s*position: absolute;)/, '$1\n        background: transparent;'],
  [/(#video \{[^}]*?width: 100%;)/, '$1\n        background: transparent;'],
  // 3. Remove the hard-coded colorCode background.
  [/\s*if \(this\.variables\.colorCode\.length > 0\) \{\s*document\.getElementsByTagName\("body"\)\[0\]\.style\.backgroundColor = this\.variables\.colorCode;\s*\}/, ''],
  // 4. Inline !important on canvas + video beats any page stylesheet !important.
  [/(document\.getElementsByTagName\("video"\)\[0\]\.style\.width = "auto";)/,
   '$1\n          ["canvas", "video"].forEach(function (id) {\n            document.getElementById(id).style.setProperty("background", "transparent", "important");\n          });'],
];

for (const [re, rep] of edits) {
  if (!re.test(html)) { console.error('NOT FOUND, no file written:', String(re).slice(0, 70)); process.exit(1); }
  html = html.replace(re, rep);
}
writeFileSync(out, html);
console.log('Written:', out);
