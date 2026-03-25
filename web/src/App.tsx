import { useState } from "react";
import { useArmiesStats } from "./hooks/useArmiesStats";
import { AppNav } from "./components/AppNav";
import { ArmyGrid } from "./components/ArmyGrid";
import { ArmyStatsView } from "./components/ArmyStatsView";
import { PoolCalculatorView } from "./components/PoolCalculatorView";
import { getArmyAccent } from "./data/armyAccents";

type HomeTab = "matrix" | "pool";

export default function App() {
  const state = useArmiesStats();
  const [selectedArmy, setSelectedArmy] = useState<string | null>(null);
  const [homeTab, setHomeTab] = useState<HomeTab>("matrix");

  if (state.status === "loading") {
    return (
      <div className="min-h-screen">
        <header className="sticky top-0 z-20 border-b border-stone-800 bg-stone-950/90 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 py-3 text-sm text-stone-500">Hex statistics</div>
        </header>
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="panel-elevated p-8 text-stone-400 text-sm">Loading statistics…</div>
        </div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-16">
        <div className="panel-elevated p-8">
          <h1 className="text-lg font-semibold text-stone-200">Could not load data</h1>
          <p className="mt-2 text-stone-400 text-sm leading-relaxed">{state.message}</p>
          <p className="mt-4 text-stone-500 text-sm">
            Run <code className="text-stone-300 bg-stone-900 px-1.5 py-0.5 rounded">npm run sync-stats</code>{" "}
            from the <code className="text-stone-300 bg-stone-900 px-1.5 py-0.5 rounded">web</code> folder
            after generating <code className="text-stone-300 bg-stone-900 px-1.5 py-0.5 rounded">armiesStats.json</code>.
          </p>
        </div>
      </div>
    );
  }

  const { data } = state;
  const armyNames = Object.keys(data.ArmiesStatsMap).sort((a, b) => a.localeCompare(b));
  const selectedStats = selectedArmy ? data.ArmiesStatsMap[selectedArmy] : null;

  return (
    <div className="min-h-screen">
      <AppNav
        currentArmy={selectedArmy}
        accentColor={selectedArmy ? getArmyAccent(selectedArmy) : undefined}
        homeMode={selectedArmy ? undefined : homeTab}
        onHome={() => setSelectedArmy(null)}
      />

      {selectedArmy && selectedStats ? (
        <ArmyStatsView
          armyName={selectedArmy}
          stats={selectedStats}
          created={data.created}
          onBack={() => setSelectedArmy(null)}
        />
      ) : (
        <main className="max-w-4xl mx-auto px-4 py-10 pb-16">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-100">
              Army statistics
            </h1>
            <p className="mt-3 text-stone-400 text-sm leading-relaxed max-w-2xl">
              Head-to-head win rates from the tournament army matrix — browse the full matrix or
              aggregate pools like the classic{" "}
              <a
                href="https://disper.github.io/stats/index.html"
                className="text-stone-300 underline decoration-stone-600 hover:decoration-stone-400 transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                disper.github.io
              </a>{" "}
              tool.
            </p>
            {data.created ? (
              <p className="mt-2 text-stone-500 text-xs">Last updated: {data.created}</p>
            ) : null}
          </div>

          <div
            className="flex p-1 mb-8 rounded-xl border border-stone-700 bg-stone-900/60 gap-1"
            role="tablist"
            aria-label="Statistics mode"
          >
            <button
              type="button"
              role="tab"
              aria-selected={homeTab === "matrix"}
              onClick={() => setHomeTab("matrix")}
              className={[
                "flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-white/20",
                homeTab === "matrix"
                  ? "bg-stone-800 text-stone-100 shadow-sm border border-stone-600"
                  : "text-stone-500 hover:text-stone-300 border border-transparent",
              ].join(" ")}
            >
              Browse matrix
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={homeTab === "pool"}
              onClick={() => setHomeTab("pool")}
              className={[
                "flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-white/20",
                homeTab === "pool"
                  ? "bg-stone-800 text-stone-100 shadow-sm border border-stone-600"
                  : "text-stone-500 hover:text-stone-300 border border-transparent",
              ].join(" ")}
            >
              Pool calculator
            </button>
          </div>

          {homeTab === "matrix" ? (
            <ArmyGrid armyNames={armyNames} onSelect={setSelectedArmy} />
          ) : (
            <PoolCalculatorView data={data} armyNames={armyNames} />
          )}
        </main>
      )}
    </div>
  );
}
