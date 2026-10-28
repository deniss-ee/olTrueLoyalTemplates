// Generates the 7 TrueLoyal email templates from shared components.
// Run: yarn build   (writes the .html files into the project root)
// All design tokens live in one place (TOKENS) so a brand change is a one-line edit.

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// ---------- Design tokens (from Õhtuleht Brand hub, Figma) ----------
const T = {
  red: '#F50000', // primary-red/600 (brand base)
  red50: '#FFF5F5',
  yellow50: '#FFF9D6',
  yellow300: '#FAC500',
  ink50: '#F7F7F8',
  ink200: '#DFDFE2',
  ink300: '#C9CACF',
  ink700: '#67686F',
  ink800: '#545459',
  ink950: '#2A2A2D',
  // Fira Sans / Inter load via Google Fonts where supported, otherwise Arial.
  head: "'Fira Sans', Arial, Helvetica, sans-serif",
  body: "Inter, Arial, Helvetica, sans-serif",
};

// Image slots. Swap these for hosted URLs (see README) when uploading to TrueLoyal.
const IMG = {
  logo: 'images/logo.png',
  heroWelcome: 'images/hero-welcome.png',
  heroGift: 'images/hero-gift.png',
  heroPoints: 'images/hero-points.png',
  heroFriends: 'images/hero-friends.png',
  heroNext: 'images/hero-next-reward.png',
  reward: 'images/reward.png',
};

// ---------- Text helpers ----------
// Outlook (Word engine) rounds odd px values: keep font sizes and line-heights EVEN and in px.
const p = (html, { align = 'left', mb = 12, size = 14, lh = 20, weight = 400, color = T.ink800 } = {}) =>
  `<p style="margin:0 0 ${mb}px;font-family:${T.body};font-size:${size}px;line-height:${lh}px;mso-line-height-rule:exactly;font-weight:${weight};color:${color};text-align:${align};">${html}</p>`;

const greeting = (html, align) => p(html, { align, mb: 4, weight: 500, color: T.ink700 });

const h1 = (html, align) =>
  `<h1 class="h1" style="margin:0 0 12px;font-family:${T.head};font-size:24px;line-height:30px;mso-line-height-rule:exactly;font-weight:600;color:${T.ink950};text-align:${align};">${html}</h1>`;

const h2 = (html, align) =>
  `<h2 class="h2" style="margin:0 0 12px;font-family:${T.head};font-size:20px;line-height:26px;mso-line-height-rule:exactly;font-weight:600;color:${T.ink950};text-align:${align};">${html}</h2>`;

// ---------- Structure helpers ----------
const row = (inner, { cls = 'esd-structure px', pad = '0 24px', align = 'left', cond } = {}) =>
  `<tr><td class="${cls}" align="${align}" style="padding:${pad};"${cond ? ` esd-custom-display-condition="${cond}"` : ''}>${inner}</td></tr>`;

const textBlock = (inner, o = {}) => row(`<div class="esd-block-text">${inner}</div>`, { pad: '20px 24px 4px', ...o });

const heroRow = (src, size = 120) =>
  row(
    `<img src="${src}" width="${size}" height="${size}" alt="" class="esd-block-image" style="display:block;margin:0 auto;width:${size}px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;" />`,
    { pad: '20px 24px 0', align: 'center' },
  );

// Bulletproof button: VML for Outlook; for everyone else the background + radius sit on the <td>
// (so the colour still shows if a client ignores padding on the <a>, a known Outlook-on-web bug).
const button = ({ label, variant = 'primary', cond, pad = '4px 24px 4px' }) => {
  const primary = variant === 'primary';
  const bg = primary ? T.red : '#FFFFFF';
  const fg = primary ? '#FFFFFF' : T.ink950;
  const border = primary ? T.red : T.ink950;
  const w = Math.max(144, label.length * 9 + 48);
  const vml = primary
    ? `stroke="f" fillcolor="${bg}"`
    : `strokecolor="${border}" strokeweight="2px" fillcolor="${bg}"`;
  return row(
    `<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{{MERCHANT_WEB_URL}}" style="height:40px;v-text-anchor:middle;width:${w}px;" arcsize="20%" ${vml}><w:anchorlock/><center style="color:${fg};font-family:Arial,sans-serif;font-size:14px;font-weight:bold;">${label}</center></v:roundrect><![endif]-->` +
      `<!--[if !mso]><!-- --><table role="presentation" class="btn-wrap" align="center" cellpadding="0" cellspacing="0" style="border-collapse:separate;"><tr><td align="center" bgcolor="${bg}" style="background-color:${bg};border:2px solid ${border};border-radius:8px;"><a href="{{MERCHANT_WEB_URL}}" target="_blank" class="btn ${primary ? 'btn-primary' : 'btn-secondary'}" style="display:block;min-width:140px;padding:10px 22px;font-family:${T.body};font-size:14px;line-height:16px;font-weight:700;color:${fg};text-align:center;text-decoration:none;">${label}</a></td></tr></table><!--<![endif]-->`,
    { cls: 'esd-structure esd-block-button px', pad, align: 'center', cond },
  );
};

// ---------- Reward cards (esd-custom-display-condition hooks are required by TrueLoyal) ----------
const card = ({ img, imgW, pts }) => `
<td class="card-cell" valign="top" style="padding:0 6px 12px;" esd-custom-display-condition="reward-container">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border:1px solid ${T.ink200};border-radius:12px;border-collapse:separate;">
    <tr><td align="center" class="esd-block-image" style="padding:12px 12px 4px;font-size:0;line-height:0;"><img src="${img}" width="${imgW}" height="${imgW}" alt="" style="display:block;width:${imgW}px;max-width:100%;height:auto;border:0;" /></td></tr>
    <tr><td align="center" class="esd-block-text" style="padding:4px 12px 0;"><h3 style="margin:0;font-family:${T.head};font-size:16px;line-height:20px;mso-line-height-rule:exactly;font-weight:600;color:${T.ink950};">{{REWARD_NAME}}</h3></td></tr>
    <tr><td align="center" class="esd-block-text" style="padding:2px 12px 0;"><p style="margin:0;font-family:${T.body};font-size:12px;line-height:18px;mso-line-height-rule:exactly;color:${T.ink800};">{{REWARD_DESCRIPTION}}</p></td></tr>
    <tr><td align="center" class="esd-block-text" style="padding:8px 12px 12px;">
      <table role="presentation" align="center" cellpadding="0" cellspacing="0" style="border-collapse:separate;"><tr><td bgcolor="${T.red50}" style="background-color:${T.red50};border-radius:12px;padding:4px 10px;font-family:${T.body};font-size:12px;line-height:16px;mso-line-height-rule:exactly;font-weight:700;color:${T.red};text-align:center;">${pts}</td></tr></table>
    </td></tr>
  </table>
</td>`;

// n cards in a row; hybrid inline-block columns + MSO ghost table so it stacks on mobile.
const rewardRow = (n, cond, cards) => {
  if (n === 1) {
    return row(
      `<table role="presentation" class="one" width="264" align="center" cellpadding="0" cellspacing="0" style="width:100%;max-width:264px;"><tr>${cards[0]}</tr></table>`,
      { cls: 'esd-structure cards-px', pad: '0 18px', align: 'center', cond },
    );
  }
  const colW = n === 2 ? 280 : 186; // 600 - 2 (border) - 2*18 (row padding) = 562 available; keep 2px slack
  const cols = cards
    .map(
      (c, i) =>
        `${i === 0 ? `<!--[if mso]><table role="presentation" width="${colW * n}" cellpadding="0" cellspacing="0"><tr><td width="${colW}" valign="top"><![endif]-->` : `<!--[if mso]></td><td width="${colW}" valign="top"><![endif]-->`}` +
        `<div class="col" style="display:inline-block;width:${n === 2 ? 50 : 33.3}%;max-width:${colW}px;vertical-align:top;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${c}</tr></table></div>`,
    )
    .join('');
  return row(`${cols}<!--[if mso]></td></tr></table><![endif]-->`, {
    cls: 'esd-structure cards-px',
    pad: '0 18px',
    align: 'center',
    cond,
  });
};

// pts(i): text for the i-th card (0..5); first card uses a hero image, the rest the reward image.
const rewardGrid = ({ heroImg, pts }) => {
  const mk = (i) => card({ img: i === 0 ? heroImg : IMG.reward, imgW: i === 0 ? 140 : 80, pts: pts(i) });
  return [
    rewardRow(1, 'allrewards-1', [mk(0)]),
    rewardRow(2, 'allrewards-2', [mk(1), mk(2)]),
    rewardRow(3, 'allrewards-3', [mk(3), mk(4), mk(5)]),
  ].join('\n');
};

// ---------- Page shell ----------
const header = `<tr><td class="esd-structure esd-header-popover" align="center" bgcolor="#FFFFFF" style="padding:12px 24px 0;background-color:#FFFFFF;">
  <img src="${IMG.logo}" width="144" height="28" alt="Õhtuleht Digiklubi" class="esd-block-image" style="display:block;margin:0 auto;width:144px;height:auto;border:0;" />
</td></tr>`;

const footer = `<tr><td class="esd-structure esd-footer-popover px" align="center" bgcolor="${T.ink950}" style="padding:16px 24px;background-color:${T.ink950};">
  <p style="margin:0 0 4px;font-family:${T.head};font-size:14px;line-height:20px;mso-line-height-rule:exactly;font-weight:600;color:#FFFFFF;text-align:center;">{{MERCHANT_NAME}}</p>
  <p style="margin:0;font-family:${T.body};font-size:12px;line-height:18px;mso-line-height-rule:exactly;color:${T.ink300};text-align:center;">
    <a href="https://www.ohtulehtkirjastus.ee/uldtingimused/" target="_blank" style="color:#FFFFFF;text-decoration:underline;">Kasutustingimused</a>&nbsp;&nbsp;|&nbsp;
    <a href="https://www.ohtuleht.ee/minu-konto?tab=profiil" target="_blank" style="color:#FFFFFF;text-decoration:underline;">Minu konto</a>&nbsp;|&nbsp;
    <a href="mailto:klienditeenindus@ohtulehtkirjastus.ee" style="color:#FFFFFF;text-decoration:underline;">klienditeenindus@ohtulehtkirjastus.ee</a>
  </p>
  <p class="unsub-hide" style="display:none;mso-hide:all;max-height:0;overflow:hidden;font-size:0;line-height:0;color:${T.ink950};">{{UNSUBSCRIBE_TEXT}}</p>
</td></tr>`;

const page = ({ title, rows }) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="et" dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>${title}</title>
    <!--[if mso]>
      <noscript><xml><o:OfficeDocumentSettings><o:AllowPNG></o:AllowPNG><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
      <style type="text/css">
        table, td, p, a, h1, h2, h3 { font-family: Arial, sans-serif !important; }
        a { text-decoration: none; }
      </style>
    <![endif]-->
    <!--[if !mso]><!-- -->
    <link href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@500;600&amp;family=Inter:wght@400;500;700&amp;display=swap" rel="stylesheet" />
    <!--<![endif]-->
    <style type="text/css">
      body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      img { -ms-interpolation-mode: bicubic; }
      a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
      @media only screen and (max-width: 620px) {
        .container { width: 100% !important; }
        .px { padding-left: 16px !important; padding-right: 16px !important; }
        .cards-px { padding-left: 10px !important; padding-right: 10px !important; }
        .h1 { font-size: 22px !important; line-height: 28px !important; }
        .h2 { font-size: 18px !important; line-height: 24px !important; }
        .btn-wrap { width: 100% !important; }
      }
      /* Reward columns stay side by side down to 480px (also in narrow editor previews), stack below. */
      @media only screen and (max-width: 480px) {
        .col { width: 100% !important; max-width: 100% !important; }
        .one { max-width: 100% !important; }
      }
    </style>
  </head>
  <body class="body" style="margin:0;padding:0;background-color:#FFFFFF;">
    <div dir="ltr" class="esd-email-paddings" style="background-color:#FFFFFF;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;">
        <tr><td align="center" class="esd-stripe" style="padding:0;" valign="top">
          <!--[if mso]><table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
          <table role="presentation" class="container" width="600" align="center" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="width:100%;max-width:600px;background-color:#FFFFFF;border-collapse:collapse;">
${rows.join('\n')}
          </table>
          <!--[if mso]></td></tr></table><![endif]-->
        </td></tr>
      </table>
    </div>
  </body>
</html>
`;

// ---------- Templates ----------
const pointsAll = (i) => `Sul on juba {{REWARD_POINTS}} punkti.`;
const pointsPlain = (i) => (i === 0 ? `Sul on juba {{REWARD_POINTS}} punkti.` : `{{REWARD_POINTS}} punkti`);
const pointsBare = () => `{{REWARD_POINTS}} punkti`;

const welcomeRows = (align, pts, cta) => [
  header,
  textBlock(
    greeting('Tere, {{USER_NAME}}!', align) +
      h1('Meil on hea meel, et liitusid Õhtulehe Digiklubiga – meiega saad rohkem!', align) +
      p('Õhtulehe lojaalsusprogrammis kogud punkte, mille eest saad valida endale meelepäraseid kingitusi ja eksklusiivseid soodustusi.', { align }) +
      p('Punkte saad erinevate tegevustega koguda iga päev. Loe ja kuula artikleid, pane oma teadmised mälumängudega proovile, jaga parimaid lugusid sõpradega ning veel mitmed muud tegevused, mis su punktisaldot kasvatavad. Ja vahel võib mõni tähtpäev niisama lisapunkte tuua, sest meile meeldib üllatada.', { align }) +
      p('Kogutud punktide eest saad valida endale midagi mõnusat – tellida soodushinnaga Õhtulehe paberväljaandeid, valida Õhtulehe logoga tooteid või kasutada punkte meie partnerite eksklusiivsete soodustuste saamiseks.', { align, mb: 0 }),
    { pad: '20px 24px 16px' },
  ),
  rewardGrid({ heroImg: IMG.heroWelcome, pts }),
  button({ label: 'Vaata kõiki kingitusi', variant: 'secondary', cond: 'allrewards-3' }),
  button({ label: cta, pad: '4px 24px 20px' }),
  footer,
];

const TEMPLATES = {
  'welcome.html': {
    title: 'Tere tulemast Õhtulehe Digiklubisse',
    rows: welcomeRows('left', pointsPlain, 'Logi sisse'),
  },
  'posWelcome.html': {
    title: 'Tere tulemast Õhtulehe Digiklubisse',
    rows: welcomeRows('left', pointsAll, 'Logi sisse'),
  },
  'eligibleRewards.html': {
    title: 'Sul on punkte, mida saad kohe kasutada',
    rows: [
      header,
      textBlock(
        greeting('Tere, {{USER_NAME}}', 'center') +
          h1('Hurraa!', 'center') +
          p('Sinu {{MERCHANT_NAME}} kontol on juba <strong style="color:' + T.ink950 + ';">{{REDEEMABLE_POINTS}} punkti,</strong> mida saad kohe kasutada. Vaata, mida kogutud punktide eest endale valida!', { align: 'center', mb: 0 }),
        { pad: '20px 24px 16px' },
      ),
      rewardGrid({ heroImg: IMG.heroNext, pts: pointsBare }),
      button({ label: 'Vaata kõiki kingitusi', variant: 'secondary', cond: 'allrewards-3' }),
      button({ label: 'Kasuta punkte', pad: '4px 24px 20px' }),
      footer,
    ],
  },
  'rewardsWithinReach.html': {
    title: 'Veel mõned punktid ja avad uued boonused',
    rows: [
      header,
      textBlock(
        greeting('Tere, {{USER_NAME}}', 'center') +
          h1('Veel mõned punktid...', 'center') +
          p('Sul on ainult <strong style="color:' + T.ink950 + ';">{{POINTS_REMAINING}}&nbsp;punkti puudu,</strong> et avada järgmised boonused.', { align: 'center', mb: 0 }),
        { pad: '20px 24px 16px' },
      ),
      rewardGrid({ heroImg: IMG.heroNext, pts: pointsBare }),
      button({ label: 'Vaata kõiki kingitusi', variant: 'secondary', cond: 'allrewards-3' }),
      row(p('Logi oma kontole ja vaata lähemalt, milliste tegevustega saad Õhtulehe veebis punkte juurde koguda.', { align: 'center', mb: 0 }), {
        cls: 'esd-structure esd-block-text px',
        pad: '12px 24px 12px',
        align: 'center',
      }),
      button({ label: 'Vaata, kuidas punkte koguda', pad: '4px 24px 20px' }),
      footer,
    ],
  },
  'couponReward.html': {
    title: 'Sinu soodustuskood',
    rows: [
      header,
      textBlock(
        greeting('Tere, {{USER_NAME}}', 'center') +
          p('Hea valik! Kasutasid just {{POINTS_REDEEMED}} punkti, et saada', { align: 'center', mb: 4, size: 16, lh: 24 }) +
          h1('{{REWARD}}.', 'center'),
        { pad: '20px 24px 0' },
      ),
      heroRow(IMG.heroGift),
      row(p('Soodustuse saamiseks kasuta', { align: 'center', mb: 8, weight: 600, color: T.ink950 }), { pad: '8px 24px 0', align: 'center', cls: 'esd-structure esd-block-text px' }),
      row(
        `<table role="presentation" align="center" cellpadding="0" cellspacing="0"><tr><td align="center" bgcolor="${T.yellow50}" style="background-color:${T.yellow50};border:2px dashed ${T.yellow300};border-radius:8px;padding:10px 22px;font-family:${T.body};font-size:22px;line-height:28px;mso-line-height-rule:exactly;font-weight:700;letter-spacing:2px;color:${T.ink950};">{{COUPON_CODE}}</td></tr></table>`,
        { pad: '0 24px 16px', align: 'center', cls: 'esd-structure esd-block-text px' },
      ),
      row(p('Sul on alles <strong style="color:' + T.ink950 + ';">{{BALANCE_POINTS}}</strong> punkti.', { align: 'center', mb: 0 }), { pad: '0 24px 12px', align: 'center', cls: 'esd-structure esd-block-text px' }),
      button({ label: 'Kasuta soodustust', pad: '4px 24px 20px' }),
      footer,
    ],
  },
  'pointsEarned.html': {
    title: 'Said punkte juurde',
    rows: [
      header,
      heroRow(IMG.heroPoints),
      textBlock(
        greeting('Tere, {{USER_NAME}}', 'center') +
          h2('{{NOTIFICATION_TEXT}}', 'center') +
          p('Sul on kokku <strong style="color:' + T.ink950 + ';">{{BALANCE_POINTS}}</strong> punkti.', { align: 'center', mb: 0 }),
        { pad: '16px 24px 12px' },
      ),
      row(p('Oma punktisaldo ja saadavate boonuste vaatamiseks...', { align: 'center', mb: 0 }), { pad: '4px 24px 12px', align: 'center', cls: 'esd-structure esd-block-text px' }),
      button({ label: 'Vaata oma punktisaldot', pad: '4px 24px 20px' }),
      footer,
    ],
  },
  'referrerThankYou.html': {
    title: 'Aitäh, et kutsud sõpru Digiklubisse',
    rows: [
      header,
      heroRow(IMG.heroFriends),
      textBlock(
        greeting('Tere, {{FIRST_NAME}}!', 'center') +
          h1('Väga lahe, et kutsud oma sõbrad ka Õhtulehe Digiklubisse!', 'center') +
          p('Siin on sinu personaalne link, mida saad sõpradega jagada:', { align: 'center', mb: 0 }),
        { pad: '16px 24px 12px' },
      ),
      row(
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" bgcolor="${T.ink50}" style="background-color:${T.ink50};border:1px solid ${T.ink200};border-radius:8px;padding:12px;font-family:${T.body};font-size:14px;line-height:20px;mso-line-height-rule:exactly;font-weight:700;color:${T.red};word-break:break-all;">{{REFERRAL_LINK}}</td></tr></table>`,
        { pad: '0 24px 16px', cls: 'esd-structure esd-block-text px' },
      ),
      row(p('<strong style="color:' + T.ink950 + ';">See link jääb sulle samaks ja leiad selle alati ka oma digiklubi kontolt. Jaga linki ka edaspidi ja kogu iga liitunud sõbra eest punkte.</strong>', { align: 'center' }), { pad: '0 24px 0', align: 'center', cls: 'esd-structure esd-block-text px' }),
      row(p('Vaata oma punktisaldot ja lisainfot', { align: 'center', mb: 0 }), { pad: '4px 24px 12px', align: 'center', cls: 'esd-structure esd-block-text px' }),
      button({ label: 'Vaata oma punktisaldot', pad: '4px 24px 20px' }),
      footer,
    ],
  },
};

for (const [file, t] of Object.entries(TEMPLATES)) {
  const html = page(t);
  writeFileSync(join(ROOT, file), html);
  console.log(`${file.padEnd(26)} ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`);
}
