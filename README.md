# Muhammad Abubakkar — 3D Interactive Portfolio

> **Breaking systems safely. Building intelligent solutions.**

A premium, fully interactive 3D personal portfolio for **Muhammad Abubakkar** — cybersecurity student, ethical hacker and AI application developer from Swabi, Pakistan.

**Live:** https://abubakkarcyber-a11y.github.io/3d-portfolio/ *(after Pages is enabled)*

## Highlights

- **Cinematic 3D stage** (Three.js / React Three Fiber): dark-navy scene, electric-blue & violet lighting, reflective floor and ambient particles
- **Animated 3D presenter with a pointer stick** — walks in from the right, moves beside the active project and points at it, with idle breathing, blinking, weight shifts and glances at the visitor
- **Curved 3D project carousel** — three cards (AI · Cybersecurity · Networking) on a real arc; click, arrows, dots, keyboard (← →), drag/swipe and mouse parallax
- **Interactive terminal** — a working Kali-style terminal (`help`, `whoami`, `skills`, `labs`, `certs`, …)
- Complete sections: About, Skills, Hands-on Experience, Featured Builds, Labs & Platforms, Certifications, Education, Contact (validated form, copy-email, WhatsApp/LinkedIn/GitHub/TryHackMe links)
- Real, downloadable CV · verified certification links only · no fake stats
- Responsive (desktop / laptop / tablet / Android) · reduced-motion support · graceful CSS-only fallback when WebGL is unavailable

## Tech

React 18 · TypeScript · Vite · Tailwind CSS · Three.js (@react-three/fiber + drei) · Framer Motion · Lucide icons · self-hosted fonts (Sora / Inter / JetBrains Mono)

## Run locally

```bash
npm install
npm run dev      # dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Deployment

GitHub Pages deploys automatically on every push to `main` via the included workflow (`.github/workflows/deploy.yml`). Enable **Settings → Pages → Source: GitHub Actions** once after creating the repository.

## Project structure

```
src/
  data/content.ts            ← all portfolio content (single source of truth)
  components/three/          ← 3D stage, presenter, carousel, stage layout math
  components/ui/             ← all page sections & UI primitives
public/images/               ← optimized project images
design-assets/               ← original uploaded artwork
```

---

© Muhammad Abubakkar — [abubakkar.cyber@gmail.com](mailto:abubakkar.cyber@gmail.com)
