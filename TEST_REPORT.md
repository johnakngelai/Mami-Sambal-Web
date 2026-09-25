# Motion verification

Validated with headless Chromium at 1440×900 and 390×844.

Desktop checks:
- Hero window: 619×630 px at start → 1440×900 px at end of hero scroll.
- Hero copy fades from opacity 1 → 0 while the food image expands.
- Best-seller scene 02 wipe: clip-path transitions from 100% hidden → 0% visible.
- Best-seller scene 03 wipe: clip-path transitions from 100% hidden → 0% visible.
- Horizontal gallery track translates left with vertical section progress.
- Menu renders 14 verified preview items and filters/search are active.

Mobile checks:
- 14 menu rows render.
- Bottom MENU / ORDER / DIRECTIONS bar is visible.
- Desktop pinned sequences fall back to touch-friendly stacked/swipe layouts.

No page JavaScript errors were observed in the local Chromium checks.
