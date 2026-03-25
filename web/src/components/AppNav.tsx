type Props = {
  currentArmy?: string | null;
  /** Breadcrumb current segment — army accent per design spec */
  accentColor?: string;
  /** When on home, which section is active */
  homeMode?: "matrix" | "pool";
  onHome: () => void;
};

export function AppNav({ currentArmy, accentColor, homeMode, onHome }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-stone-800 bg-stone-950/90 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-2 text-sm flex-wrap">
        <button
          type="button"
          onClick={onHome}
          className="text-stone-500 hover:text-stone-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 rounded px-1 -mx-1"
        >
          Hex statistics
        </button>
        {currentArmy ? (
          <>
            <span className="text-stone-600" aria-hidden>
              /
            </span>
            <span className="font-medium truncate min-w-0">
              <span className="text-stone-500">Armies</span>
              <span className="text-stone-600 mx-1">/</span>
              <span style={{ color: accentColor ?? "#a8a29e" }}>{currentArmy}</span>
            </span>
          </>
        ) : homeMode === "pool" ? (
          <>
            <span className="text-stone-600" aria-hidden>
              /
            </span>
            <span className="font-medium text-stone-300">Pool calculator</span>
          </>
        ) : null}
      </div>
    </header>
  );
}
