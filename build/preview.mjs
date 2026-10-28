// Writes preview/*.html: the templates with sample data filled in, for browser checks only.
// Never upload these; upload the root templates (they keep the {{VARIABLES}}).
// Run: yarn preview
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'preview');
mkdirSync(OUT, { recursive: true });

const SAMPLE = {
  USER_NAME: 'Mari',
  FIRST_NAME: 'Mari',
  REWARD_NAME: 'Õhtulehe kingikaart',
  REWARD_DESCRIPTION: 'Soodustus Õhtulehe digitellimusele',
  REWARD_POINTS: '500',
  POINTS_REDEEMED: '300',
  REWARD: '10% allahindlus Õhtulehe e-poes',
  COUPON_CODE: 'OL-DIGI-2026',
  BALANCE_POINTS: '1 250',
  MERCHANT_NAME: 'Õhtulehe Digiklubi',
  MERCHANT_WEB_URL: 'https://www.ohtuleht.ee',
  UNSUBSCRIBE_TEXT: 'Loobu',
  REDEEMABLE_POINTS: '800',
  POINTS_REMAINING: '150',
  NOTIFICATION_TEXT: 'Said 20 punkti artikli lugemise eest.',
  REFERRAL_LINK: 'https://www.ohtuleht.ee/digiklubi/r/mari123',
};

const files = ['welcome', 'posWelcome', 'eligibleRewards', 'rewardsWithinReach', 'couponReward', 'pointsEarned', 'referrerThankYou'];
for (const f of files) {
  let html = readFileSync(join(ROOT, `${f}.html`), 'utf8');
  html = html.replace(/\{\{(\w+)\}\}/g, (_, k) => SAMPLE[k] ?? `{{${k}}}`);
  // Inline the placeholder images so previews also work as standalone snapshots.
  html = html.replace(/src="images\/([\w-]+\.png)"/g, (_, n) => `src="data:image/png;base64,${readFileSync(join(ROOT, 'images', n)).toString('base64')}"`);
  writeFileSync(join(OUT, `${f}.html`), html);
}
writeFileSync(
  join(OUT, 'index.html'),
  `<!doctype html><meta charset="utf-8"><title>Previews</title><body style="font-family:Arial;padding:24px"><h1>Template previews</h1><ul>${files.map((f) => `<li><a href="${f}.html">${f}</a></li>`).join('')}</ul>`,
);
console.log('preview/ written');
