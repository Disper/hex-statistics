import { useMemo, useState } from "react";
import type { ArmyStats } from "../types";
import { getArmyAccent } from "../data/armyAccents";

type SortKey = "opponent" | "games" | "win";

type Props = {
  armyName: string;
  stats: ArmyStats;
  created?: string;
  onBack: () => void;
};

export function ArmyStatsView({
  armyName,
  stats,
  created,
  onBack,
}: Props) {
  const accent = getArmyAccent(armyName);
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "win",
    dir: "desc",
  });

  const rows = useMemo(() => {
    const map = stats.StatsVsOtherArmiesMap;
    const list = Object.entries(map).map(([opponent, d]) => ({
      opponent,
      games: d.armyGamesCount,
      win: d.armyWinPercentage,
    }));
    const mult = sort.dir === "asc" ? 1 : -1;
    list.sort((a, b) => {
      if (sort.key === "opponent")
        return mult * a.opponent.localeCompare(b.opponent);
      if (sort.key === "games") return mult * (a.games - b.games);
      return mult * (a.win - b.win);
    });
    return list;
  }, [stats.StatsVsOtherArmiesMap, sort]);

  function toggle(key: SortKey) {
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" },
    );
  }

  const isWiremen = armyName === "Wiremen";

  return (
    <div className="max-w-4xl mx-auto px-4 pb-16 pt-6">
      <div className="panel-elevated mb-6">
        <div className="h-2" style={{ background: accent }} />
        <div className="p-6 sm:p-8">
          <p className="text-base font-semibold text-stone-400 mb-1">Army matrix</p>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ color: accent }}
          >
            {armyName}
          </h1>
          <p className="mt-3 text-stone-400 text-sm leading-relaxed max-w-2xl">
            Win rate and game counts when <strong className="text-stone-300">{armyName}</strong>{" "}
            is selected in the tournament app. Each row is the opponent faction.
          </p>
          {created ? (
            <p className="mt-2 text-stone-500 text-xs">Snapshot: {created}</p>
          ) : null}

          {isWiremen ? (
            <div className="mt-6 rounded-xl border border-teal-500/25 bg-teal-950/20 px-4 py-3">
              <p className="text-teal-300/90 text-xs font-semibold uppercase tracking-wider">
                Wiremen in the matrix
              </p>
              <p className="text-stone-500 text-xs mt-1 leading-relaxed">
                Wiremen appears as an opponent in scraped rows; the crawler may not always list
                Wiremen as a primary army. Cross-check rare matchups when sample sizes are small.
              </p>
            </div>
          ) : null}

          <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-950/30 px-4 py-3">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
              Data source
            </p>
            <p className="text-stone-300 text-sm mt-1">
              Values come from the live tournament matrix page; percentages reflect reported wins
              for the selected army in that matchup.
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="mt-6 inline-flex items-center justify-center rounded-xl font-bold px-5 py-2.5 text-white transition-all duration-200 hover:brightness-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/30"
            style={{ background: accent }}
          >
            ← All armies
          </button>
        </div>
      </div>

      <section className="panel-elevated overflow-x-auto">
        <div className="h-1.5" style={{ background: accent }} />
        <div className="p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-stone-200 mb-4">Matchups</h2>
          <table className="w-full text-sm border-collapse min-w-[320px]">
            <thead>
              <tr className="border-b border-stone-700 text-left text-stone-400">
                <th className="pb-3 pr-4 font-semibold">
                  <button
                    type="button"
                    onClick={() => toggle("opponent")}
                    className="hover:text-stone-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 rounded"
                  >
                    Opponent {sort.key === "opponent" ? (sort.dir === "asc" ? "↑" : "↓") : ""}
                  </button>
                </th>
                <th className="pb-3 pr-4 font-semibold">
                  <button
                    type="button"
                    onClick={() => toggle("games")}
                    className="hover:text-stone-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 rounded"
                  >
                    Games {sort.key === "games" ? (sort.dir === "asc" ? "↑" : "↓") : ""}
                  </button>
                </th>
                <th className="pb-3 font-semibold">
                  <button
                    type="button"
                    onClick={() => toggle("win")}
                    className="hover:text-stone-200 transition-colors focus:outline-none focus:ring-white/20 rounded"
                  >
                    Win % {sort.key === "win" ? (sort.dir === "asc" ? "↑" : "↓") : ""}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.opponent}
                  className="border-b border-stone-800/80 hover:bg-stone-900/50 transition-colors"
                >
                  <td className="py-3 pr-4 text-stone-200 font-medium">{row.opponent}</td>
                  <td className="py-3 pr-4 text-stone-400 tabular-nums">{row.games}</td>
                  <td className="py-3 align-middle">
                    <div className="flex items-center gap-3">
                      <span className="tabular-nums text-stone-100 w-14 shrink-0">
                        {row.win.toFixed(1)}%
                      </span>
                      <div className="flex-1 min-w-[4rem] h-2 rounded-full bg-stone-800 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-200"
                          style={{
                            width: `${Math.min(100, Math.max(0, row.win))}%`,
                            background: accent,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
