import { getArmyAccent } from "../data/armyAccents";
import { armyHqUrl, getArmyCardMeta } from "../data/armyCardMeta";

type Props = {
  armyNames: string[];
  onSelect: (name: string) => void;
};

/** Mirrors NeuroshimaHexRandomizer `ArmyCard` (App.tsx): gradient panel, accent strip, title, description, HQ image. */
export function ArmyGrid({ armyNames, onSelect }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {armyNames.map((name) => {
        const accent = getArmyAccent(name);
        const meta = getArmyCardMeta(name);
        const hq = armyHqUrl(name);

        return (
          <button
            key={name}
            type="button"
            onClick={() => onSelect(name)}
            className="text-left rounded-2xl border border-stone-700 overflow-hidden transition-all duration-200 hover:border-stone-500 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/20 group"
            style={{
              background: "linear-gradient(135deg, #1c1917 0%, #292524 100%)",
            }}
          >
            <div className="h-1.5 w-full" style={{ background: accent }} aria-hidden />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2
                    className="text-xl font-bold tracking-tight group-hover:brightness-110 transition-all"
                    style={{ color: accent }}
                  >
                    {name}
                  </h2>
                  <p className="text-stone-400 text-sm mt-1 leading-relaxed line-clamp-3">
                    {meta.description}
                  </p>
                </div>
                {hq ? (
                  <img
                    src={hq}
                    alt={`${name} HQ`}
                    className="shrink-0 w-20 h-20 object-contain"
                  />
                ) : null}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
