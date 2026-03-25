/**
 * Writes public/data.js as `var DATA = { ... }` for GitHub Pages (same pattern as disper.github.io).
 * Input: armiesStats.json path (default: ../../armiesStats.json from repo root).
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..", "..");
const defaultJson = join(repoRoot, "armiesStats.json");
const outPath = join(__dirname, "..", "public", "data.js");
const inputPath = process.env.ARMIES_STATS_JSON ?? defaultJson;

if (!existsSync(inputPath)) {
  const stub = `// Run: npm run sync-stats (or set ARMIES_STATS_JSON). Dev falls back to armiesStats.json fetch.\nvar DATA = undefined;\n`;
  writeFileSync(outPath, stub, "utf8");
  console.warn("generate-data-js: missing", inputPath, "— wrote stub data.js");
  process.exit(0);
}

const raw = readFileSync(inputPath, "utf8");
JSON.parse(raw); // validate
const content = `var DATA = ${raw};\n`;
writeFileSync(outPath, content, "utf8");
console.log("Wrote", outPath, "from", inputPath);
