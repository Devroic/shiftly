# Icon source

Editable SVG sources for the app icon (a sun merging into a crescent moon — day shift into night shift).

- `icon.svg` — full composition (gradient background + glyph), rasterized to `icon.png` and `favicon.png`.
- `background.svg` — gradient only, rasterized to `android-icon-background.png`.
- `foreground.svg` — glyph only, transparent background, scaled to fit Android's adaptive-icon safe zone. Rasterized to `android-icon-foreground.png`, `android-icon-monochrome.png` (system-tinted, so color doesn't matter — it's already a single flat white shape), and `splash-icon.png`.

To regenerate after editing a source file (requires no permanent install — `sharp-cli` runs via `npx`):

```bash
npx --yes sharp-cli -i assets/source/icon.svg -o assets/icon.png resize 1024 1024
npx --yes sharp-cli -i assets/source/icon.svg -o assets/favicon.png resize 196 196
npx --yes sharp-cli -i assets/source/background.svg -o assets/android-icon-background.png resize 1024 1024
npx --yes sharp-cli -i assets/source/foreground.svg -o assets/android-icon-foreground.png resize 1024 1024
npx --yes sharp-cli -i assets/source/foreground.svg -o assets/android-icon-monochrome.png resize 1024 1024
npx --yes sharp-cli -i assets/source/foreground.svg -o assets/splash-icon.png resize 1024 1024
```
