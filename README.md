# olTrueLoyalTemplates

7 TrueLoyal (Zinrelo) notification emails for Õhtulehe Digiklubi, rebuilt on the Õhtuleht brand (Figma Brand hub).

## Templates

| File | Purpose | Size |
|---|---|---|
| `welcome.html` | Welcome + reward grid | 19 KB |
| `posWelcome.html` | Welcome (POS) + reward grid | 19 KB |
| `eligibleRewards.html` | Points ready to redeem | 18 KB |
| `rewardsWithinReach.html` | Few points missing | 19 KB |
| `couponReward.html` | Coupon code after redeeming | 8 KB |
| `pointsEarned.html` | Points added | 7 KB |
| `referrerThankYou.html` | Referral link | 8 KB |

All are far below Gmail's 102 KB clipping limit.

## Run locally

1. `yarn build` regenerates the 7 templates from `build/build.mjs`.
2. `yarn preview` writes `preview/*.html` (sample data + inline images). Open `preview/index.html`.
3. `build/parity.mjs` (`node build/parity.mjs`) compares variables, display conditions and copy against `originals/`.

Edit design tokens (colours, fonts) in `TOKENS` at the top of `build/build.mjs`, then `yarn build`.

## What to upload

1. Upload the 7 root `*.html` files (not `preview/`, not `originals/`).
2. Upload the images from `images/` to the TrueLoyal image library.
3. In each template replace `images/xxx.png` with the hosted URL.

## Image slots (replace the placeholders, keep sizes)

| File | Shown at | Make it | Used in |
|---|---|---|---|
| `logo.png` | 144×28 | 288×56 | all |
| `hero-welcome.png` | 140 wide | 280×280 | welcome, posWelcome (first reward card) |
| `hero-next-reward.png` | 140 wide | 280×280 | eligibleRewards, rewardsWithinReach (first reward card) |
| `hero-gift.png` | 120 | 240×240 | couponReward |
| `hero-points.png` | 120 | 240×240 | pointsEarned |
| `hero-friends.png` | 120 | 240×240 | referrerThankYou |
| `reward.png` | 80 | 160×160 | reward cards (5 per reward template) |

PNG or JPG, no SVG (Gmail/Outlook block it). Transparent PNGs work on the white background.

## Variables (unchanged)

`{{USER_NAME}}` `{{FIRST_NAME}}` `{{MERCHANT_NAME}}` `{{MERCHANT_WEB_URL}}` `{{UNSUBSCRIBE_TEXT}}` `{{REWARD}}` `{{REWARD_NAME}}` `{{REWARD_DESCRIPTION}}` `{{REWARD_POINTS}}` `{{POINTS_REDEEMED}}` `{{BALANCE_POINTS}}` `{{REDEEMABLE_POINTS}}` `{{POINTS_REMAINING}}` `{{NOTIFICATION_TEXT}}` `{{COUPON_CODE}}` `{{REFERRAL_LINK}}`

Reward rows keep `esd-custom-display-condition="allrewards-1|2|3"` and `reward-container`. Do not remove these.

## Server / sending settings

- No environment variables, no HTTPS/CORS needs for the HTML itself.
- Image URLs must be public HTTPS.
- Fonts: Fira Sans and Inter load from Google Fonts in Apple Mail, iOS and some Android clients. Gmail and Outlook fall back to Arial.

## Copy changes (UI labels only)

| Template | Old | New |
|---|---|---|
| welcome, posWelcome, eligibleRewards, rewardsWithinReach | Vaata rohkem | Vaata kõiki kingitusi |
| welcome | Sisene | Logi sisse |
| rewardsWithinReach | Logi sisse | Vaata, kuidas punkte koguda |
| couponReward | Logi sisse | Kasuta soodustust |
| pointsEarned | Logi sisse | Vaata oma punktisaldot |
| referrerThankYou | Logi sisse; "Hei, {{FIRST_NAME}}!" | Vaata oma punktisaldot; "Tere, {{FIRST_NAME}}!" |

Button arrows removed. Headlines and body copy are unchanged.

## Copy, share, preheader, dark mode

- **No real one-tap copy:** JavaScript is stripped by every mail client, so a copy-to-clipboard button cannot be built. Instead the coupon code and the referral link use CSS `user-select: all`: one tap/click selects the whole value (Apple Mail, iOS, Gmail web mostly; Outlook desktop ignores it).
- **Share buttons** in `referrerThankYou`: "E-post" and "SMS" open the user's mail/SMS app with the link prefilled. New copy to approve: subject "Liitu Õhtulehe Digiklubiga", text "Liitu minuga Õhtulehe Digiklubis: {{REFERRAL_LINK}}". Needs a real test send: TrueLoyal must replace `{{REFERRAL_LINK}}` inside `href`, and a link containing `&` or `?` may cut the message.
- **Preheader** (inbox preview line) added to all 7, reusing each email's first sentence.
- **Dark mode** for Apple Mail, iOS Mail and Outlook apps (`prefers-color-scheme`). Gmail may invert on its own. Hero images and the logo should be transparent PNGs, otherwise white-background images show as light boxes.
- Key point numbers are bold brand red (colour only, same size).
- The previous version is kept in `versions/v1-compact/`. Compare with `node build/parity.mjs versions/v1-compact`.

## Email-client fixes built in

- Even px font sizes and px line-heights (classic Outlook rounds odd values and can clip buttons).
- Outlook buttons are VML; other clients use a coloured table cell, so the button colour still shows where `<a>` padding is ignored (Outlook on the web bug).
- Columns are ghost tables for Outlook and inline-blocks elsewhere. Layout is table-based; padding sits on cells, not on text.
- Gmail: web fonts are not supported there (Arial fallback); mobile stacking uses a head `<style>`, which Gmail apps with non-Gmail accounts may ignore, so only the small tweaks (smaller headings, full-width buttons) are lost there; the reward columns still wrap by themselves (hybrid layout). Not tested in a real Gmail app.
- Dark mode: `color-scheme: light` is requested, but Gmail apps and Outlook can still invert colours. Use a logo that reads on both light and dark backgrounds (transparent PNG with light outline).

## Open items

1. **Test in real clients** (Gmail, Outlook desktop, Apple Mail, iOS) by sending a test from TrueLoyal. Outlook was not testable locally; it uses VML buttons and table columns.
2. **Contrast:** white text on brand red `#F50000` and red text on the pale pink pill are about 4:1 (WCAG AA needs 4.5:1). Chosen on purpose to stay on brand red; a darker red can be set in `TOKENS` if a strict check is needed.
3. **Reward images:** reward cards use the static `reward.png` slot, as before. Confirm TrueLoyal swaps in the real reward image; if it does not, the same image appears on every card.
4. **Stripo classes:** old `es-*` classes were removed (they had no CSS in the export). `esd-*` classes and the `esd-custom-display-condition` attributes were kept. Test one import into TrueLoyal's editor first.
5. Footer: copyright line removed in all templates; `referrerThankYou` now links "Kasutustingimused" like the others.
6. Preheader text (inbox preview line) was not added; needs copy from marketing.
7. Reward cards: `Sul on juba {{REWARD_POINTS}} punkti.` (first card in welcome, all cards in posWelcome) may read as the customer's balance or the reward price. Left as is; confirm what the variable means.
8. A `backup/` folder exists in the repo root and was not touched.
