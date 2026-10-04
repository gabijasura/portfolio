# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gabija Sura's portfolio — static HTML/CSS/JS site, no build tools, no frameworks. Showcases motion design and UX work.

## Development

No build step. Serve locally:

```bash
python3 -m http.server 8080
# or
npx serve .
```

## Design System

- **Background:** dark-but-not-black plum (`--bg: #2a2030`) with raspberry / teal / violet radial glows (`--grad`), painted on a fixed `html::before` layer (not background-attachment). User wants it this light — don't go back to near-black. (The pastel gradient was the March version.)
- **Fonts:** Jost 800 (headings) + Urbanist (body) — Google Fonts
- **Text:** white throughout (`rgba(255,255,255,0.7–0.9)` for body)
- **Nav:** fixed, transparent (soft blurred bar once scrolled), "GABIJA SURA" top-left, links top-right; on ≤768px a hamburger + full-screen menu built by `js/main.js`
- **Footer:** centered single line
- **Grain overlay:** animated SVG noise via `body::before`, z-index 9000, opacity 0.022 (user found more too noisy)
- **Custom cursor:** `.cursor` div, `mix-blend-mode: difference`, `cursor: none` on body

## Key Interactions (`js/main.js`)

- Custom cursor tracking + hover expansion
- Slot machine spin logic (lever click → spin 3 reels → land with links)
- Scroll reveal (`.reveal` → `.visible`)
- Work page video hover autoplay
- Hero float parallax on mousemove

## Hero Page (`index.html`) Specifics

- Cards fan (4 playing cards, bottom-right, `position: absolute`) animate **left** on scroll via inline script — each card has a different x-speed factor
- `.hero` uses `overflow: visible` so cards swipe off-screen without clipping
- Slot machine section below hero — reels show transparent gifs (no opaque box background)
- Float elements: `fenyx.gif` (cat, left edge), `dice.png`, `8ball.png`

## Project Pages

All share `css/style.css`. Custom layouts are inlined per page (mushroom.html, duck.html). Standard layout uses `.proj-page` + `.proj-media` (16:9) + `.proj-title` + `.proj-text`.

## Assets

`assets/`: 8ball.png, ball-small.mp4, card-clubs/diamonds/hearts/spades.jpg (old), card-clubs/spades/hearts/diamonds-new.webp (new clean cards used on hero), chip-email.webp, chip-linkedin.webp, cherry.webp, dice.png (old), dice-pink.png + dice-pink2.png (new pink heart dice used on hero), duck.gif, fenyx.gif, fenyx.mp4, flame-opt.gif, frog.gif, gabija-comp.jpg, gabija-small.jpg, mushroom.mp4, nightfall-opt.gif, passion.png, star-big.webp + star-small.webp (black illustrated stars for slot section), yarn.gif

Missing/placeholder: coral video, yennenga video.

## Hero float elements
- `float-cat`: fenyx.gif, left:-20px, top:38% — peeking from left edge
- `float-dice`: dice-pink.png (tilted), left:7%, top:30%
- `float-dice-2`: dice-pink2.png (straight), left:14%, top:52% — second dice
- `float-8ball`: 8ball.png, right:24%, top:22%

## Cards (hero)
320×480 desktop. Paper = `assets/card-paper.webp` (blank torn card), video in `.card-art` window (inset 7% / 16%), corner indices `assets/idx-<suit>.png` — clubs & spades black, diamonds & hearts pink. Never put the indices over the video with mix-blend (pink turns black over dark footage).

## Hero title
One line "GABIJA SURA" (WebGL canvas) — the dice/8-ball positions depend on that width. Intro glitch + rare micro-glitches via `uGlitch` in RENDER_FRAG. Subtitle "Motion & AI Creative Designer · Stockholm", spinning badge, twinkling sparkles.

## Slot machine
- Pastel style on purpose (user liked it): lilac #c4bef8, 4px #111 border, hard black drop shadow, marquee bulbs, white tilted "Spin to explore" pill, pink lever. Three matching reels → "Jackpot!" badge + coin burst (main.js).
- Frame: background #c4bef8, border 4px solid #111, border-radius 24px, max-width 860px
- Reels: background rgba(255,215,232,0.5), border 3px solid #111, border-radius 14px, overflow hidden
- Lever: no border/background on button element — lever-ball and lever-base use box-shadow only
- Stars: star-big.webp (88px) + star-small.webp (58px), positioned left of section
- Cherry: cherry.webp (110px), positioned top-right of section

## Lcky Group page — AI Work section
- `#ai-work` sits at the top of `lckygroup.html` (also linked from the "AI Work" tile on `work.html`).
- Feature: Happy Casino × Pirots 4 — characters animated in Weavy.
- "More AI experiments" grid (`.ai-grid`) hides itself while empty. To add a video: put the file in `videos/ai/` and add
  `<div class="ai-item"><video src="videos/ai/NAME.mp4" muted loop playsinline preload="metadata" data-lazy></video></div>` inside `.ai-grid`.

## Mobile / touch
- `js/main.js` sets `IS_TOUCH` + `html.touch`; custom cursor and hover parallax are skipped on touch screens.
- Videos with `data-lazy` (or `autoplay`) only play while on screen — use `data-lazy` + `preload="metadata"` for new videos.
- Mobile home (≤768px) shows the playing cards as a swipeable row plus a "See all work" button.
