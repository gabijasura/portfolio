---
name: cards-animation
description: Build the playing cards section for Gabija Sura's portfolio — exact placement, scroll animation, hover behavior
---

# Playing Cards — Exact Implementation Guide

You are building the playing cards section for Gabija Sura's portfolio. This is the most important interactive element. Follow every detail below precisely.

## Reference site
Before building, open https://readymag.website/u1944880737/5191481/ in a browser. Scroll slowly and observe:
1. How the cards peek from bottom-right on the hero view
2. How they rise and spread as you scroll down
3. Their final resting positions
4. The hover behavior

## What the cards look like

4 white playing card Aces in a row. Each card:
- White background, rough/torn paper edge effect (use `filter: url(#torn)` SVG filter or border-image)
- Size: ~320px wide × 480px tall on desktop
- "A" top-left (~28px, serif, black) + suit symbol next to it
- Suit symbol + rotated "A" bottom-right (transform: rotate(180deg))
- Project video fills the ENTIRE card face — full bleed, no inset margin, `object-fit: cover`
- Videos: autoplay muted loop playsinline

Card assignments:
- Card 1 ♣: `../1-Portfolio/For cards/the ball.mp4`
- Card 2 ♠: `../1-Portfolio/For cards/Mushroom.mp4`
- Card 3 ♦: `../1-Portfolio/For cards/coral.mp4`
- Card 4 ♥: `../1-Portfolio/For cards/nightfall.mp4`

## HTML structure

```html
<section class="cards-section">
  <div class="cards-container">
    <div class="card card-1" data-index="0">
      <div class="card-corner top-left"><span class="card-rank">A</span><span class="card-suit">♣</span></div>
      <video autoplay muted loop playsinline>
        <source src="../1-Portfolio/For cards/the ball.mp4" type="video/mp4">
      </video>
      <div class="card-corner bottom-right"><span class="card-suit">♣</span><span class="card-rank">A</span></div>
    </div>
    <!-- repeat for cards 2, 3, 4 -->
  </div>
</section>
```

## CSS

```css
.cards-section {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.cards-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 16px;
  padding: 0 40px;
}

.card {
  position: relative;
  width: 320px;
  height: 480px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 30px 80px rgba(0,0,0,0.25);
  /* torn edge filter applied via SVG filter */
  filter: url(#torn-edge);
}

.card video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-corner {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1;
  z-index: 2;
  color: black;
  font-family: serif;
}

.card-corner.top-left {
  top: 12px;
  left: 12px;
}

.card-corner.bottom-right {
  bottom: 12px;
  right: 12px;
  transform: rotate(180deg);
}

.card-rank { font-size: 26px; font-weight: bold; }
.card-suit { font-size: 22px; }

/* Red suits */
.card-2 .card-corner,
.card-4 .card-corner { color: #cc2222; }
```

## SVG torn edge filter (add to top of body)

```html
<svg style="position:absolute;width:0;height:0">
  <defs>
    <filter id="torn-edge" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" seed="2" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
</svg>
```

## GSAP scroll animation — THE CRITICAL PART

This is exactly how the animation works:

**Starting state (hero view):** Cards are clustered in the bottom-right corner, heavily rotated/fanned like a hand of cards, with only the top ~120px visible above the viewport bottom edge.

**As user scrolls:** Cards rise up from the bottom AND spread out horizontally to fill the full viewport width.

**Final state:** 4 cards evenly spaced across full viewport width, each with a gentle tilt.

```js
gsap.registerPlugin(ScrollTrigger);

const cards = gsap.utils.toArray('.card');
const finalRotations = [-3, 1, -1, 3];
const startRotations = [-35, -15, 5, 25]; // fanned starting angles
const startX = [120, 60, 0, -60];         // clustered to the right

// Set starting positions BEFORE scroll animation
gsap.set(cards, {
  y: 360,           // pushed down, only top peeking up
  rotation: (i) => startRotations[i],
  x: (i) => startX[i],
  transformOrigin: "bottom center"
});

// Scroll animation: cards rise and spread into final positions
gsap.to(cards, {
  scrollTrigger: {
    trigger: ".hero",       // triggered by hero section
    start: "top top",
    end: "bottom top",
    scrub: 1.5,             // smooth scrub tied to scroll
  },
  y: 0,
  x: 0,
  rotation: (i) => finalRotations[i],
  stagger: 0.04,
  ease: "power2.out"
});
```

## Hover animation — does NOT conflict with scroll

Store each card's resting rotation and apply hover on top:

```js
cards.forEach((card, i) => {
  const resting = finalRotations[i];

  card.addEventListener("mouseenter", () => {
    gsap.to(card, {
      y: -24,
      scale: 1.04,
      rotation: resting,   // keep tilt, just lift
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto"    // IMPORTANT: prevents conflict with scroll animation
    });
  });

  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      y: 0,
      scale: 1,
      rotation: resting,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
      overwrite: "auto"
    });
  });
});
```

## Common mistakes to AVOID

- ❌ `position: fixed` on cards — they must scroll normally with the page
- ❌ `opacity: 0` as starting state — cards must be visible peeking from bottom-right on hero load
- ❌ Video with black bars — always `object-fit: cover` on the video element
- ❌ Cards too small — minimum 280px wide on desktop
- ❌ Hover and scroll both animating `transform` without `overwrite: "auto"` — causes jitter
- ❌ Cards centered on screen in hero view — they start bottom-RIGHT, not center
