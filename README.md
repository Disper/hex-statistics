# hex-statistics

Go crawler (`crawler/`) scrapes the tournament army matrix into `armiesStats.json`.

## Web UI

React + Vite + Tailwind CSS v4 in `web/`. Styling follows the Neuroshima Hex dark “stone” panel pattern (see `.cursor/skills/neuroshima-hex-ui-style/SKILL.md`).

```bash
cd web
npm install
npm run sync-stats   # copy ../armiesStats.json → public/ + generates public/data.js
npm run dev
```

Open the app at **http://localhost:5173/stats/** (Vite `base` is `/stats/` for GitHub Pages).

Build: `npm run build`, preview: `npm run preview` (preview at **http://localhost:4173/stats/**).

After re-running the crawler at the repo root, run `npm run sync-stats` inside `web/` so the UI loads fresh data.

### GitHub Pages (`https://<user>.github.io/stats/`)

GitHub Pages serves **static files only**. If you see a **404 for `main.tsx`**, the site is serving the **development** `index.html` (which points at `/src/main.tsx`). You must deploy the **production build** output from `web/dist/`:

1. `cd web && npm run sync-stats && npm run build`
2. Copy **everything** under `dist/` into your `stats/` folder in the `username.github.io` repo: `index.html`, `assets/`, `data.js`, and `armiesStats.json` (optional; `data.js` already embeds stats when generated from `armiesStats.json`).
3. Commit and push.

Do **not** commit the Vite `src/` tree as the live site unless you also run a build step in CI.