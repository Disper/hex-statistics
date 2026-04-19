#!/usr/bin/env node
/**
 * Validates a freshly crawled armiesStats.json against a previous snapshot.
 * Exits 0 only if structure is sane and every (army, opponent) matchup has
 * armyGamesCount >= previous (monotonic non-decrease).
 *
 * Usage: node scripts/validate-stats.mjs <previous.json> <new.json>
 */

import { readFileSync } from "node:fs";
import { exit } from "node:process";

const USAGE = "Usage: node scripts/validate-stats.mjs <previous.json> <new.json>\n";

function load(path, label) {
  let raw;
  try {
    raw = readFileSync(path, "utf8");
  } catch (e) {
    console.error(`${label}: cannot read file: ${path}`);
    console.error(e?.message ?? e);
    exit(2);
  }
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error(`${label}: invalid JSON: ${path}`);
    console.error(e?.message ?? e);
    exit(2);
  }
  return data;
}

function isPlainObject(x) {
  return x !== null && typeof x === "object" && !Array.isArray(x);
}

function getMap(doc, label) {
  if (!isPlainObject(doc)) {
    console.error(`${label}: root must be a JSON object`);
    exit(1);
  }
  const m = doc.ArmiesStatsMap;
  if (!isPlainObject(m) || Object.keys(m).length === 0) {
    console.error(`${label}: ArmiesStatsMap must be a non-empty object`);
    exit(1);
  }
  return m;
}

function iterMatchups(map, fn) {
  for (const [army, row] of Object.entries(map)) {
    const vs = row?.StatsVsOtherArmiesMap;
    if (!isPlainObject(vs)) {
      console.error(`Invalid row for army "${army}": missing StatsVsOtherArmiesMap`);
      exit(1);
    }
    for (const [opponent, det] of Object.entries(vs)) {
      fn(army, opponent, det);
    }
  }
}

function totalGamesAndPairs(map) {
  let totalGames = 0;
  let pairs = 0;
  let fiftyPct = 0;
  iterMatchups(map, (_a, _o, det) => {
    pairs += 1;
    totalGames += det.armyGamesCount;
    if (det.armyWinPercentage === 50) fiftyPct += 1;
  });
  return { totalGames, pairs, fiftyPct };
}

function validateDetails(army, opponent, det, label) {
  if (!isPlainObject(det)) {
    console.error(`${label}: "${army}" vs "${opponent}": details must be an object`);
    exit(1);
  }
  const g = det.armyGamesCount;
  const w = det.armyWinPercentage;
  if (typeof g !== "number" || !Number.isFinite(g) || g < 0 || !Number.isInteger(g)) {
    console.error(`${label}: "${army}" vs "${opponent}": armyGamesCount must be a non-negative integer, got ${JSON.stringify(g)}`);
    exit(1);
  }
  if (typeof w !== "number" || !Number.isFinite(w) || w < 0 || w > 100) {
    console.error(`${label}: "${army}" vs "${opponent}": armyWinPercentage must be in [0, 100], got ${JSON.stringify(w)}`);
    exit(1);
  }
}

function main() {
  const [, , prevPath, newPath] = process.argv;
  if (!prevPath || !newPath) {
    console.error(USAGE);
    exit(2);
  }

  const prevDoc = load(prevPath, "previous");
  const newDoc = load(newPath, "new");

  const prevMap = getMap(prevDoc, "previous");
  const newMap = getMap(newDoc, "new");

  const prevArmies = Object.keys(prevMap).sort();
  const newArmies = Object.keys(newMap).sort();

  for (const army of prevArmies) {
    if (!(army in newMap)) {
      console.error(`Regression: army "${army}" present in previous but missing in new dataset`);
      exit(1);
    }
  }

  const regressions = [];
  const maxPrint = 40;

  for (const army of prevArmies) {
    const prevVs = prevMap[army].StatsVsOtherArmiesMap;
    const newVs = newMap[army].StatsVsOtherArmiesMap;
    if (!isPlainObject(newVs)) {
      console.error(`Regression: army "${army}" has no StatsVsOtherArmiesMap in new`);
      exit(1);
    }
    const prevOpp = Object.keys(prevVs).length;
    const newOpp = Object.keys(newVs).length;
    if (newOpp < prevOpp) {
      console.error(`Regression: army "${army}" opponent count dropped (${prevOpp} -> ${newOpp})`);
      exit(1);
    }
    for (const [opponent, prevDet] of Object.entries(prevVs)) {
      validateDetails(army, opponent, prevDet, "previous");
      const newDet = newVs[opponent];
      if (newDet === undefined) {
        regressions.push(`${army} vs ${opponent}: matchup missing in new (had ${prevDet.armyGamesCount} games)`);
        continue;
      }
      validateDetails(army, opponent, newDet, "new");
      if (newDet.armyGamesCount < prevDet.armyGamesCount) {
        regressions.push(
          `${army} vs ${opponent}: games ${prevDet.armyGamesCount} -> ${newDet.armyGamesCount}`,
        );
      }
    }
  }

  if (regressions.length > 0) {
    console.error("Validation failed: game count regressions or missing matchups:");
    for (const line of regressions.slice(0, maxPrint)) {
      console.error(`  - ${line}`);
    }
    if (regressions.length > maxPrint) {
      console.error(`  ... and ${regressions.length - maxPrint} more`);
    }
    exit(1);
  }

  iterMatchups(newMap, (army, opponent, det) => {
    validateDetails(army, opponent, det, "new");
  });

  const prevS = totalGamesAndPairs(prevMap);
  const newS = totalGamesAndPairs(newMap);
  if (newS.totalGames < prevS.totalGames) {
    console.error(
      `Regression: total armyGamesCount across all matchups ${prevS.totalGames} -> ${newS.totalGames}`,
    );
    exit(1);
  }

  const prevRatio = prevS.pairs > 0 ? prevS.fiftyPct / prevS.pairs : 0;
  const newRatio = newS.pairs > 0 ? newS.fiftyPct / newS.pairs : 0;
  const spike = newS.fiftyPct - prevS.fiftyPct;
  if (spike > 0.2 * prevS.pairs && newRatio > prevRatio + 0.15) {
    console.error(
      `Suspicious: exact 50% win-rate matchups jumped (${prevS.fiftyPct} -> ${newS.fiftyPct} of ${newS.pairs}); possible partial page load`,
    );
    exit(1);
  }

  const created = newDoc.created ?? "(no created field)";
  console.log("validate-stats: OK");
  console.log(`  created: ${created}`);
  console.log(`  armies: ${newArmies.length} (previous had ${prevArmies.length})`);
  console.log(`  matchups: ${newS.pairs} (prev ${prevS.pairs})`);
  console.log(`  total games (sum of counts): ${newS.totalGames} (prev ${prevS.totalGames}, +${newS.totalGames - prevS.totalGames})`);
}

main();
