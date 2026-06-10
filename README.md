# VOLK — Men's Clothing Website

A minimalist, dark-themed frontend concept for a men's clothing brand. Built with pure HTML, CSS, and vanilla JavaScript — no frameworks, no dependencies.

---

## Live Demo

🔗https://mohammedimad01.github.io/Volk-clothing-brand/

---

## Overview

VOLK is a single-page clothing brand website designed around a dark monochrome aesthetic with an off-white, navy, and stone palette. The project demonstrates modern frontend UI/UX design principles — editorial typography, smooth interactions, and a clean product-focused layout — without a single line of framework code.

---

## Features

- **Sticky Navigation** — Transparent on load, transitions to solid dark background on scroll with smooth color shift
- **Hero Section** — Full-viewport split layout with editorial copy and brand stats
- **Live Category Filter** — Filter products by Outerwear, Tops, Trousers, Footwear, and Accessories instantly
- **Product Grid** — 6-card 3×2 grid with hover overlays and Quick View reveal
- **Trending Now Strip** — Horizontally scrollable editorial trend cards
- **Brand Ethos Section** — Full-bleed photo with oversized type
- **Newsletter Signup** — Minimal two-field form
- **Animated Ticker** — Scrolling marquee with season and shipping info
- **Custom Cursor** — Lagging dot that expands to a ring on interactive elements
- **Scroll Animations** — IntersectionObserver-powered fade-up reveals on all sections
- **Fully Responsive-ready** — Clean grid structure built for extension

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (Custom Properties, Grid, Flexbox) |
| Interactivity | Vanilla JavaScript (ES6+) |
| Fonts | Google Fonts — Bebas Neue, DM Sans |
| Images | Unsplash (free, no attribution required) |
| Hosting | GitHub Pages |

---

## Project Structure

```
volk-clothing/
│
├── index.html        # Single self-contained file (HTML + CSS + JS)
└── README.md         # You are here
```

All CSS is written inside a `<style>` block and all JavaScript inside a `<script>` block at the bottom of `index.html`. This keeps the project portable and easy to open locally with zero setup.

---

## Getting Started

No build tools or installs needed. Just clone and open.

```bash
git clone https://github.com/YOUR-USERNAME/volk-clothing.git
cd volk-clothing
open index.html
```

Or simply drag `index.html` into any browser.

---

## Design Decisions

**Why no framework?** This project was built to demonstrate that production-quality UI can be achieved with raw HTML, CSS, and JS. No React, no Tailwind, no build step.

**Typography** — `Bebas Neue` is used for all display and headline type — condensed, aggressive, masculine. `DM Sans` handles all body copy, labels, and navigation for clean legibility.

**Palette** — Off-white (`#f5f3ef`) + Navy (`#1b2a3b`) + Stone (`#9e9a93`) on a near-black ink base (`#0a0f14`). The palette stays strict — no accent colors, no gradients. Every contrast decision is intentional.

**Zero border-radius** — All cards and buttons use sharp edges (0–1.5px max). This reinforces the brand's raw, architectural aesthetic.

---

## Customisation

To adapt this for a real brand, swap out the following:

- **Brand name** — Search and replace `VOLK` with your brand name
- **Product images** — Replace Unsplash URLs in the `<img>` tags with your own CDN or local image paths
- **Prices & product names** — Directly editable in the HTML
- **Colour palette** — All colours are CSS custom properties in `:root {}` — one block to change everything
- **Fonts** — Swap the Google Fonts `<link>` and update `font-family` references

---

## Screenshots

| Section | Preview |
|---|---|
| Hero | Split-viewport with editorial copy |
| Collections | 3×2 product grid with category filter |
| Trending | Horizontal scroll editorial strip |
| Ethos | Full-bleed brand statement |

---

## Author

**Mohammed** — Frontend Developer
Building data, AI, and product projects.

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

> *"Clothing for the man who moves without noise."*
