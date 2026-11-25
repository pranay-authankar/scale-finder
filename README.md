# Scale Studio (React + Vite PWA)

A beginner-friendly mobile-ready music toolkit featuring:

1. **Find Scale by Piano** — Play 7 notes in any order via on-screen piano, QWERTY keyboard, MIDI controller, or text input to identify the most beginner-friendly scale and related modes.
2. **Find Scale by Mic** — Hum, sing, or play 7 notes into your microphone with live YIN pitch detection.

## Install on Mobile Phone & Automatic Updates

Scale Studio is configured as an **auto-updating Progressive Web App (PWA)** (`vite-plugin-pwa` with `registerType: 'autoUpdate'`):

1. Build and host the `dist/` folder over **HTTPS** (for example on Cloudflare Pages, Netlify, Vercel, or GitHub Pages — HTTPS is required by Android/iOS for home-screen installation and microphone access).
2. Open the HTTPS URL on your phone:
   - **Android (Chrome/Edge):** Tap **Install App on Phone** (or browser menu → *Install app*).
   - **iPhone / iPad (Safari):** Tap **Share** → **Add to Home Screen**.
3. **Automatic updates:** Whenever you deploy a new build (`npm run build`), the app checks for updates on launch/focus, downloads the new assets in the background, and refreshes automatically on the installed phone app.

## Local Development

```powershell
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

## Scripts

- `npm run dev` — Start Vite dev server on `http://localhost:5173`
- `npm run build` — Build production PWA bundle and Service Worker to `dist/`
- `npm test` — Run unit tests (`node --test`)
