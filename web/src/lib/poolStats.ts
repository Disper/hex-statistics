import type { ArmiesStatsPayload } from "../types";

export type MatchupSlice = {
  opponent: string;
  winPct: number;
  games: number;
};

export type ArmyPoolSummary = {
  army: string;
  matchups: MatchupSlice[];
  min: number;
  max: number;
  /** Arithmetic mean of win% across selected opponent matchups */
  avg: number;
  /** Sum of games across those matchups */
  totalGames: number;
  /** Win rate weighted by games in each matchup */
  weightedAvg: number;
};

/**
 * For each of `yourArmies`, collect win% vs every opponent in `opponentArmies`
 * (excluding mirror matchups). Aggregates min / max / mean win%, plus games-weighted mean.
 */
export function buildPoolSummaries(
  data: ArmiesStatsPayload,
  yourArmies: string[],
  opponentArmies: string[],
): ArmyPoolSummary[] {
  const map = data.ArmiesStatsMap;
  const oppSet = new Set(opponentArmies);
  const out: ArmyPoolSummary[] = [];

  for (const army of yourArmies) {
    const row = map[army];
    if (!row) continue;

    const matchups: MatchupSlice[] = [];
    for (const opp of oppSet) {
      if (opp === army) continue;
      const cell = row.StatsVsOtherArmiesMap[opp];
      if (!cell) continue;
      matchups.push({
        opponent: opp,
        winPct: cell.armyWinPercentage,
        games: cell.armyGamesCount,
      });
    }

    if (matchups.length === 0) continue;

    const winPcts = matchups.map((m) => m.winPct);
    const min = Math.min(...winPcts);
    const max = Math.max(...winPcts);
    const avg = winPcts.reduce((a, b) => a + b, 0) / winPcts.length;
    const totalGames = matchups.reduce((a, m) => a + m.games, 0);
    const weightedAvg =
      totalGames > 0
        ? matchups.reduce((a, m) => a + m.winPct * m.games, 0) / totalGames
        : avg;

    out.push({
      army,
      matchups,
      min,
      max,
      avg,
      totalGames,
      weightedAvg,
    });
  }

  return out.sort((a, b) => b.avg - a.avg);
}
