# ⟨ / ⟩ Engineering Workspace — 3D Portfolio

An immersive, Awwwards-style 3D portfolio for a Software / DevOps engineer.
Not a landing page — a **futuristic engineering workspace** you walk into.

Boot sequence → a live 3D desk (monitors, laptop, server rack, robot, holograms)
→ interactive content zones for About, Projects, DevOps, Skills, a real Terminal,
Achievements, and Contact.

## Stack

- **React 19** + **Vite** + **Tailwind CSS v4**
- **Three.js / React Three Fiber / drei** — the 3D world
- **@react-three/postprocessing** — bloom, vignette, chromatic aberration (the neon glow)
- **Framer Motion** — UI/overlay animation
- **Zustand** — global experience state
- **lucide-react** — icons

## Run it

```bash
npm install       # already done
npm run dev       # http://localhost:5173
npm run build     # production build -> dist/
```

The heavy 3D bundle is lazy-loaded behind the boot screen, so first paint is light.

## Make it yours (only one file to edit)

Everything the site shows lives in **`src/data/portfolio.js`**.
Fields marked `✏️` are placeholders — update:

- `profile` — name, role, location, email, education
- `socials` — GitHub / LinkedIn / LeetCode / resume / calendar links
- `projects` — the Project Museum exhibits (add your real repos + demos)
- `skills`, `achievements`, `stats`, `timeline`, `principles`

Drop your CV at **`public/resume.pdf`** (the Resume monitor + `resume` terminal
command + Contact link point there).

## Controls & interactions

- **Boot:** press `Enter` or click to enter the workspace.
- **Explore:** hover desk objects (they lift + label), click to open a zone.
- **Dock:** bottom nav jumps to any zone. `Esc` closes an overlay.
- **Terminal:** type `help`. Try `neofetch`, `projects`, `theme`, `matrix`,
  and `sudo hire harsh`. `↑/↓` recall history.
- **Theme / sound** toggles are top-right.

## Easter eggs

- **Konami code** (`↑ ↑ ↓ ↓ ← → ← → B A`) → Matrix rain
- `matrix` command → same
- `sudo hire <name>` in the terminal → 😉
- Open the **browser console** for a message

## Structure

```
src/
  data/            portfolio.js (content) · zones.js (nav registry)
  store/           useStore.js (Zustand)
  three/           Experience · Workspace · CameraRig · Effects · Hotspot · Particles
  components/       BootSequence · HUD · Cursor · Overlay · ZoneRouter · EasterEggs
    zones/          About · Projects · DevOps · Skills · Terminal · Achievements · Contact
  index.css        design system (palette, glass, cursor, component classes)
```

## Performance & a11y

- Bloom/effects auto-disable on low-core devices; `AdaptiveDpr` scales resolution.
- `prefers-reduced-motion` shortens the boot and calms animations.
- Custom cursor falls back to the system cursor on touch devices.
- Keyboard: `Enter` to boot, `Esc` to close, `↑/↓` in the terminal, focus-visible rings.
