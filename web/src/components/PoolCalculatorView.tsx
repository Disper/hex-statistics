import { useCallback, useMemo, useState } from "react";
import type { ArmiesStatsPayload } from "../types";
import { getArmyAccent } from "../data/armyAccents";
import { ArmyPoolToggle } from "./ArmyPoolToggle";
import { buildPoolSummaries } from "../lib/poolStats";

type Props = {
  data: ArmiesStatsPayload;
  armyNames: string[];
};

export function PoolCalculatorView({ data, armyNames }: Props) {
  const [your, setYour] = useState<string[]>([]);
  const [opp, setOpp] = useState<string[]>([]);
  const [showGameCounts, setShowGameCounts] = useState(false);

  const yourSet = useMemo(() => new Set(your), [your]);
  const oppSet = useMemo(() => new Set(opp), [opp]);

  const toggleYour = useCallback((name: string) => {
    setYour((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name].sort((a, b) => a.localeCompare(b)),
    );
  }, []);

  const toggleOpp = useCallback((name: string) => {
    setOpp((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name].sort((a, b) => a.localeCompare(b)),
    );
  }, []);

  const summaries = useMemo(() => {
    if (your.length === 0 || opp.length === 0) return [];
    return buildPoolSummaries(data, your, opp);
  }, [data, your, opp]);

  const canRun = your.length > 0 && opp.length > 0;
  const emptyResult = canRun && summaries.length === 0;

  return (
    <div className="space-y-6">
      <ArmyPoolToggle
        label="Your armies"
        armyNames={armyNames}
        selected={yourSet}
        onToggle={toggleYour}
        onSelectAll={() => setYour([...armyNames])}
        onClear={() => setYour([])}
      />
      <ArmyPoolToggle
        label="Opponent armies"
        armyNames={armyNames}
        selected={oppSet}
        onToggle={toggleOpp}
        onSelectAll={() => setOpp([...armyNames])}
        onClear={() => setOpp([])}
      />

      <div className="flex flex-wrap items-center gap-6 rounded-xl border border-stone-700 bg-stone-900/40 px-4 py-3">
        <label className="flex items-center gap-2 text-sm text-stone-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showGameCounts}
            onChange={(e) => setShowGameCounts(e.target.checked)}
            className="rounded border-stone-600 bg-stone-900 text-amber-500 focus:ring-amber-500/40 focus:ring-offset-stone-950"
          />
          Show game counts
        </label>
        <p className="text-stone-500 text-xs leading-relaxed">
          Matches the original “Podlicz statystyki / Pokaż liczbę gier” flow: aggregate win rates across
          your pool vs every opponent in their pool (mirror matchups excluded).
        </p>
      </div>

      {!canRun ? (
        <div className="panel-elevated p-6 text-stone-500 text-sm">
          Select at least one army in each list to compute min, average, and max win % for each of
          your armies.
        </div>
      ) : emptyResult ? (
        <div className="panel-elevated p-6 text-amber-200/80 text-sm border border-amber-500/20">
          No matchup cells found for this combination (missing data or only mirror picks).
        </div>
      ) : (
        <div className="panel-elevated overflow-x-auto">
          <div className="h-1.5 bg-stone-600" />
          <div className="p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-stone-200 mb-1">Results</h2>
            <p className="text-stone-500 text-xs mb-4 leading-relaxed">
              For each of your armies: minimum, average, and maximum win percentage across the
              selected opponent armies. Average is the simple mean of those percentages; weighted
              uses games played in each matchup.
            </p>
            <table className="w-full text-sm border-collapse min-w-[320px]">
              <thead>
                <tr className="border-b border-stone-700 text-left text-stone-400">
                  <th className="pb-3 pr-4 font-semibold">Your army</th>
                  <th className="pb-3 pr-4 font-semibold tabular-nums">Min %</th>
                  <th className="pb-3 pr-4 font-semibold tabular-nums">Avg %</th>
                  <th className="pb-3 pr-4 font-semibold tabular-nums">Max %</th>
                  <th className="pb-3 pr-4 font-semibold tabular-nums text-stone-500">Wtd %</th>
                  {showGameCounts ? (
                    <th className="pb-3 font-semibold tabular-nums">Σ games</th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {summaries.map((row) => {
                  const accent = getArmyAccent(row.army);
                  return (
                    <tr key={row.army} className="border-b border-stone-800/80 align-top">
                      <td className="py-3 pr-4 font-medium">
                        <span style={{ color: accent }}>{row.army}</span>
                      </td>
                      <td className="py-3 pr-4 tabular-nums text-stone-200">{row.min.toFixed(1)}</td>
                      <td className="py-3 pr-4 tabular-nums text-stone-100 font-medium">
                        {row.avg.toFixed(1)}
                      </td>
                      <td className="py-3 pr-4 tabular-nums text-stone-200">{row.max.toFixed(1)}</td>
                      <td className="py-3 pr-4 tabular-nums text-stone-500">{row.weightedAvg.toFixed(1)}</td>
                      {showGameCounts ? (
                        <td className="py-3 tabular-nums text-stone-400">{row.totalGames}</td>
                      ) : null}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {showGameCounts ? (
              <div className="mt-6 space-y-4 border-t border-stone-700/80 pt-6">
                <h3 className="text-base font-semibold text-stone-400">Per matchup</h3>
                {summaries.map((row) => {
                  const accent = getArmyAccent(row.army);
                  return (
                    <div key={`d-${row.army}`} className="rounded-lg border border-stone-700/60 bg-stone-950/40 p-4">
                      <p className="text-sm font-semibold mb-2" style={{ color: accent }}>
                        {row.army}
                      </p>
                      <ul className="text-xs text-stone-400 space-y-1.5">
                        {row.matchups.map((m) => (
                          <li key={m.opponent} className="flex flex-wrap gap-x-2 gap-y-0.5">
                            <span className="text-stone-300">vs {m.opponent}</span>
                            <span className="tabular-nums">{m.winPct.toFixed(1)}%</span>
                            <span className="text-stone-600">({m.games} games)</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
