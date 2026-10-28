// Compares the built templates against a baseline folder (default: originals/).
// Usage: node build/parity.mjs [baselineDir]
// Checks {{variables}}, esd-custom-display-condition hooks and the ordered visible text.
import { readFileSync } from 'node:fs';
const base = process.argv[2] || 'originals';
const files = ['welcome', 'posWelcome', 'eligibleRewards', 'rewardsWithinReach', 'couponReward', 'pointsEarned', 'referrerThankYou'];
const count = (h, re) => { const m = {}; for (const x of h.match(re) || []) m[x] = (m[x] || 0) + 1; return m; };
const diff = (a, b) => [...new Set([...Object.keys(a), ...Object.keys(b)])].filter((k) => a[k] !== b[k]).map((k) => `${k}: ${a[k] || 0}->${b[k] || 0}`);
const text = (h) => h.replace(/<div style="display:none;max-height:0[\s\S]*?<\/div>/, ' ').replace(/<!--[\s\S]*?-->/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<title>[\s\S]*?<\/title>/g, ' ').replace(/<p class="unsub-hide"[\s\S]*?<\/p>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&copy;/g, '©').replace(/&rarr;|→/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').replace(/ \| /g, ' ').trim().split(' ');
const bag = (a) => a.reduce((m, w) => ((m[w] = (m[w] || 0) + 1), m), {});
for (const f of files) {
  const o = readFileSync(`${base}/${f}.html`, 'utf8'), n = readFileSync(`${f}.html`, 'utf8');
  const to = bag(text(o)), tn = bag(text(n));
  const tw = [...new Set([...Object.keys(to), ...Object.keys(tn)])].filter((k) => to[k] !== tn[k]).map((k) => `${k}:${(tn[k] || 0) - (to[k] || 0)}`);
  console.log(`== ${f}\n vars: ${diff(count(o, /\{\{\w+\}\}/g), count(n, /\{\{\w+\}\}/g)).join('; ') || 'same'}\n conds: ${diff(count(o, /esd-custom-display-condition="[^"]+"/g), count(n, /esd-custom-display-condition="[^"]+"/g)).join('; ') || 'same'}\n text word diff (new-old): ${tw.join(' ') || 'identical'}`);
}
