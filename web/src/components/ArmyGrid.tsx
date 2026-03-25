import { getArmyAccent } from "../data/armyAccents";

type Props = {
  armyNames: string[];
  onSelect: (name: string) => void;
};

export function ArmyGrid({ armyNames, onSelect }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {armyNames.map((name) => {
        const accent = getArmyAccent(name);
        return (
          <button
            key={name}
            type="button"
            onClick={() => onSelect(name)}
            className="group text-left panel-elevated transition-all duration-200 hover:border-stone-500 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <div className="h-1.5" style={{ background: accent }} aria-hidden />
            <div className="p-5">
              <h2
                className="text-xl font-bold tracking-tight"
                style={{ color: accent }}
              >
                {name}
              </h2>
              <p className="mt-2 text-stone-500 text-sm leading-relaxed">
                View win rate vs every other army in the matrix
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
