<h1 align="center">Abdulrhman Alaa — Portfolio</h1>

<p align="center">
  Personal portfolio of a Backend .NET Engineer — built from scratch with pure HTML, CSS, and vanilla JS.
  <br />
  <a href="https://abdulrhmanx9.vercel.app/" target="_blank"><strong>Live Demo »</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/No_Framework-Static_Site-6c757d?style=flat-square" />
</p>

---

## Overview

A handcrafted personal portfolio — no frameworks, no build tools, no dependencies.  
Every line of CSS and JS is written intentionally. The design leans into a **dark-first** aesthetic with a light mode toggle, clean typography (Geist + Outfit), and subtle micro-animations throughout.

---

## Features

| Feature | Details |
|---|---|
| **Dark / Light Mode** | Persistent via `localStorage`, smooth CSS variable transitions |
| **Live Codeforces Chart** | Fetches rating history from the Codeforces API, cached in `localStorage` |
| **Resume Section** | Work experience timeline + skills ledger with color-coded categories |
| **Certificates Slider** | Touch & click slider with a fullscreen PDF lightbox viewer |
| **Portfolio Section** | Filterable project cards by category (`.NET Core`, `Python`, `Games`) |
| **Fully Responsive** | Mobile sidebar, adaptive grid, works across all screen sizes |
| **Zero Dependencies** | No npm, no bundler, no framework — just a browser |

---

## Project Structure

```
Portfolio/
├── index.html              # Single-page app entry point
└── assets/
    ├── css/
    │   └── style.css       # All styles — design system, components, themes
    ├── js/
    │   └── script.js       # All logic — tabs, chart, slider, lightbox, theme
    └── images/
        ├── avatar/         # Profile photo
        ├── certificates/   # Certificate images for the slider
        ├── projects/       # Project screenshots & covers
        │   ├── planora/
        │   ├── shuryan/
        │   ├── ecommerce/
        │   └── ball-breaker/
        └── tech/           # SVG tech stack icons
```

---

## Getting Started

No installation required. Just open `index.html` in a browser — or use any static file server:

```bash
# Using VS Code Live Server (recommended)
# Right-click index.html → Open with Live Server

# Or using Python
python -m http.server 5500

# Or using Node.js
npx serve .
```

---

## Forking This

Feel free to fork and adapt it for your own portfolio. A few things to change:

1. **`index.html`** — Replace name, bio, links, projects, and certificates
2. **`assets/images/`** — Swap out avatar and project images
3. **`script.js`** → `fetchCodeforcesRating()` — Change the Codeforces handle
4. **`style.css`** → `:root` variables — Tweak the color palette to your taste

> If you fork this and build something cool with it, a ⭐ star would be appreciated!

---

## Tech Stack

Built with zero external dependencies on purpose — to keep it fast, forkable, and easy to understand.

- **HTML5** — Semantic structure, accessibility attributes
- **CSS3** — Custom properties (design tokens), CSS Grid, Flexbox, `@keyframes`
- **Vanilla JS** — Fetch API, `localStorage`, Canvas (chart), DOM manipulation
- **Google Fonts** — Geist, Geist Mono, Outfit

---

## License

MIT — use it, fork it, build on it.

---

<p align="center">
  Made with focus by <a href="https://github.com/Abdulr7man-3laa">Abdulrhman Alaa</a>
</p>
