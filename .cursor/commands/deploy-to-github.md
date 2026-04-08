# Deploy to GitHub Pages (`stats/`)

Runs `npm run build` in `web/`, then rsyncs **`web/dist/`** (production `index.html`, hashed `assets/`, `data.js`, `armies-hq/`, etc.) into the sibling checkout `../disper.github.io/stats/`. Stale files from old builds are removed (`rsync --delete`). Ensures `.nojekyll` exists.

**Run:**

```bash
cd web && npm run deploy-to-github
```

**Optional:** set `DEPLOY_GITHUB_STATS_DIR` to override the destination directory.

After syncing, commit and push in the `disper.github.io` repository to publish.
