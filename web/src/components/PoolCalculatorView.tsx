import { Fragment, useCallback, useMemo, useState } from "react";
import type { ArmiesStatsPayload } from "../types";
import { getArmyAccent } from "../data/armyAccents";
import { ArmyPoolToggle } from "./ArmyPoolToggle";
import { buildPoolSummaries } from "../lib/poolStats";
import { winPctHeatmapClass } from "../lib/winPctHeatmap";
import { compareArmiesByDisplayOrder, sortArmiesByDisplayOrder } from "../data/armyOrder";

type Props = {
  data: ArmiesStatsPayload;
  armyNames: string[];
};

export function PoolCalculatorView({ data, armyNames }: Props) {
  const [your, setYour] = useState<string[]>([]);
  const [opp, setOpp] = useState<string[]>([]);
  const [showGameCounts, setShowGameCounts] = useState(false);
  const [expandedArmies, setExpandedArmies] = useState<Set<string>>(() => new Set());

  const yourSet = useMemo(() => new Set(your), [your]);
  const oppSet = useMemo(() => new Set(opp), [opp]);

  const toggleYour = useCallback((name: string) => {
    setYour((prev) =>
      prev.includes(name)
        ? prev.filter((x) => x !== name)
        : sortArmiesByDisplayOrder([...prev, name]),
    );
  }, []);

  const toggleOpp = useCallback((name: string) => {
    setOpp((prev) =>
      prev.includes(name)
        ? prev.filter((x) => x !== name)
        : sortArmiesByDisplayOrder([...prev, name]),
    );
  }, []);

  const swapPools = useCallback(() => {
    setYour(sortArmiesByDisplayOrder(opp));
    setOpp(sortArmiesByDisplayOrder(your));
  }, [your, opp]);

  const toggleArmyExpanded = useCallback((army: string) => {
    setExpandedArmies((prev) => {
      const next = new Set(prev);
      if (next.has(army)) next.delete(army);
      else next.add(army);
      return next;
    });
  }, []);

  const summaries = useMemo(() => {
    if (your.length === 0 || opp.length === 0) return [];
    return buildPoolSummaries(data, your, opp);
  }, [data, your, opp]);

  const canRun = your.length > 0 && opp.length > 0;
  const emptyResult = canRun && summaries.length === 0;
  const resultColCount = showGameCounts ? 5 : 4;

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
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-stone-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showGameCounts}
              onChange={(e) => setShowGameCounts(e.target.checked)}
              className="rounded border-stone-600 bg-stone-900 text-amber-500 focus:ring-amber-500/40 focus:ring-offset-stone-950"
            />
            Show game counts
          </label>
          <button
            type="button"
            onClick={swapPools}
            className="rounded-md border border-stone-600 bg-stone-800/80 px-3 py-1.5 text-xs font-medium text-stone-200 hover:bg-stone-700/80 hover:border-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:ring-offset-2 focus:ring-offset-stone-950"
          >
            Swap your / opponent
          </button>
        </div>
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
              selected opponent armies. Average is the simple mean of those percentages.{" "}
              <span className="text-stone-400">
                Click a row for per-opponent win %{showGameCounts ? " and games" : ""} vs each selected
                opponent.
              </span>
            </p>
            <table className="w-full text-sm border-collapse min-w-[320px]">
              <thead>
                <tr className="border-b border-stone-700 text-left text-stone-400">
                  <th className="pb-3 w-8" aria-hidden />
                  <th className="pb-3 pr-4 font-semibold">Your army</th>
                  <th className="pb-3 pr-4 font-semibold tabular-nums">Min %</th>
                  <th className="pb-3 pr-4 font-semibold tabular-nums">Avg %</th>
                  <th className="pb-3 pr-4 font-semibold tabular-nums">Max %</th>
                  {showGameCounts ? (
                    <th className="pb-3 font-semibold tabular-nums">Σ games</th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {summaries.map((row) => {
                  const accent = getArmyAccent(row.army);
                  const isOpen = expandedArmies.has(row.army);
                  const matchupsOrdered = [...row.matchups].sort((a, b) => {
                    if (b.winPct !== a.winPct) return b.winPct - a.winPct;
                    return compareArmiesByDisplayOrder(a.opponent, b.opponent);
                  });
                  return (
                    <Fragment key={row.army}>
                      <tr
                        className="border-b border-stone-800/80 align-top transition-colors hover:bg-stone-900/60 cursor-pointer select-none"
                        role="button"
                        tabIndex={0}
                        aria-expanded={isOpen}
                        aria-label={`${isOpen ? "Collapse" : "Expand"} matchup details for ${row.army}`}
                        onClick={() => toggleArmyExpanded(row.army)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleArmyExpanded(row.army);
                          }
                        }}
                      >
                        <td className="py-3 pr-1 w-8 text-stone-500 align-middle" aria-hidden>
                          <span
                            className={`inline-block text-xs transition-transform ${isOpen ? "rotate-90" : ""}`}
                          >
                            ▸
                          </span>
                        </td>
                        <td className="py-3 pr-4 font-medium">
                          <span style={{ color: accent }}>{row.army}</span>
                        </td>
                        <td
                          className={`py-3 pr-4 tabular-nums ${winPctHeatmapClass(row.min) || "text-stone-200"}`}
                        >
                          {row.min.toFixed(1)}
                        </td>
                        <td
                          className={`py-3 pr-4 tabular-nums font-medium ${winPctHeatmapClass(row.avg) || "text-stone-100"}`}
                        >
                          {row.avg.toFixed(1)}
                        </td>
                        <td
                          className={`py-3 pr-4 tabular-nums ${winPctHeatmapClass(row.max) || "text-stone-200"}`}
                        >
                          {row.max.toFixed(1)}
                        </td>
                        {showGameCounts ? (
                          <td className="py-3 tabular-nums text-stone-400">{row.totalGames}</td>
                        ) : null}
                      </tr>
                      {isOpen ? (
                        <tr className="border-b border-stone-800/80 bg-stone-950/70">
                          <td colSpan={resultColCount + 1} className="px-0 pb-4 pt-0">
                            <div className="mx-3 mb-1 mt-1 rounded-lg border border-stone-700/80 bg-stone-900/50 px-4 py-3">
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-2">
                                vs selected opponents
                              </p>
                              <table className="w-full text-xs border-collapse min-w-[280px]">
                                <thead>
                                  <tr className="border-b border-stone-700/80 text-left text-stone-500">
                                    <th className="pb-2 pr-3 font-medium">Opponent</th>
                                    <th className="pb-2 pr-3 font-medium tabular-nums">Win %</th>
                                    {showGameCounts ? (
                                      <th className="pb-2 font-medium tabular-nums">Games</th>
                                    ) : null}
                                  </tr>
                                </thead>
                                <tbody>
                                  {matchupsOrdered.map((m) => {
                                    const oppAccent = getArmyAccent(m.opponent);
                                    return (
                                      <tr key={m.opponent} className="border-b border-stone-800/40 last:border-0">
                                        <td className="py-2 pr-3 font-medium" style={{ color: oppAccent }}>
                                          {m.opponent}
                                        </td>
                                        <td
                                          className={`py-2 pr-3 tabular-nums ${winPctHeatmapClass(m.winPct) || "text-stone-200"}`}
                                        >
                                          {m.winPct.toFixed(1)}
                                        </td>
                                        {showGameCounts ? (
                                          <td className="py-2 tabular-nums text-stone-400">{m.games}</td>
                                        ) : null}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
