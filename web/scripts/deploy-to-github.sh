#!/usr/bin/env bash
set -euo pipefail

# Build the Vite app, then sync web/dist/ to the GitHub Pages stats folder (sibling repo).
# Override destination: DEPLOY_GITHUB_STATS_DIR=/path/to/stats

web_root="$(cd "$(dirname "$0")/.." && pwd)"
repo_root="$(cd "$web_root/.." && pwd)"
dist_dir="$web_root/dist"
default_dest="$repo_root/../disper.github.io/stats"
dest="${DEPLOY_GITHUB_STATS_DIR:-$default_dest}"

if [[ ! -d "$dest" ]]; then
  echo "deploy-to-github: destination does not exist: $dest" >&2
  echo "Clone or create the repo, or set DEPLOY_GITHUB_STATS_DIR." >&2
  exit 1
fi

echo "Building production bundle in $web_root ..."
(cd "$web_root" && npm run build)

if [[ ! -d "$dist_dir" ]]; then
  echo "deploy-to-github: build did not produce dist/: $dist_dir" >&2
  exit 1
fi

echo "Syncing $dist_dir/ -> $dest/ (removing stale hashed assets)"
rsync -av --delete "$dist_dir/" "$dest/"
touch "$dest/.nojekyll"

echo "Done. Commit and push in the disper.github.io repo to publish."
