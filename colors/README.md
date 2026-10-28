# Õhtuleht värvid

One-page colour sheet: click a swatch, the HEX code is copied. Works as a bookmark, no hosting needed.

## Make the bookmark (from the project root)
```
yarn colors
```
Creates `colors/dist/bookmark.html` and `colors/dist/bookmark.txt`.

## Give it to marketing
1. Send them `colors/dist/bookmark.html` (email/Teams).
2. They open it, show the bookmarks bar (Ctrl+Shift+B), and drag the red button onto the bar.
3. From then on one click on that bookmark opens the colour page.

Alternative: add a bookmark by hand and paste the content of `bookmark.txt` as its URL.

## Edit colours
Change values in `colors.js`, run `yarn colors`, send the new `bookmark.html`. Already-saved bookmarks keep the old colours (the page lives inside the bookmark).

## Open items
- Not tested in Firefox/Safari. Chrome and Edge accept data: bookmarks; Firefox may block opening them.
- The page loads Fira Sans/Inter from Google Fonts when online; otherwise Arial.
