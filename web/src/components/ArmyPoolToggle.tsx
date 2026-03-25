import { getArmyAccent } from "../data/armyAccents";

type Props = {
  label: string;
  armyNames: string[];
  selected: Set<string>;
  onToggle: (name: string) => void;
  onSelectAll: () => void;
  onClear: () => void;
};

export function ArmyPoolToggle({
  label,
  armyNames,
  selected,
  onToggle,
  onSelectAll,
  onClear,
}: Props) {
  return (
    <div className="panel-elevated">
      <div className="h-1.5 bg-stone-600" aria-hidden />
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-stone-200">{label}</h2>
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              onClick={onSelectAll}
              className="text-stone-500 hover:text-stone-300 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 rounded px-1"
            >
              Select all
            </button>
            <span className="text-stone-700">·</span>
            <button
              type="button"
              onClick={onClear}
              className="text-stone-500 hover:text-stone-300 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 rounded px-1"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {armyNames.map((name) => {
            const on = selected.has(name);
            const accent = getArmyAccent(name);
            return (
              <button
                key={name}
                type="button"
                onClick={() => onToggle(name)}
                className={[
                  "px-2.5 py-1 rounded border text-sm font-medium transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-white/20",
                  on
                    ? "border-2 bg-stone-800 text-stone-100 shadow-sm"
                    : "border border-stone-600 bg-stone-900/50 text-stone-400 hover:border-stone-500 hover:text-stone-300",
                ].join(" ")}
                style={on ? { borderColor: accent } : undefined}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
