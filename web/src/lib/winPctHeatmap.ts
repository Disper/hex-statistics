/**
 * Background + text for win % cells in the pool calculator.
 * Neutral 46–54%: no background (empty string).
 * Top tier green: LawnGreen (#7CFC00). Bottom tier red: candy apple (#FF0800).
 */
export function winPctHeatmapClass(pct: number): string {
  if (pct >= 70) return "rounded px-2 bg-[#7CFC00] text-stone-900";
  if (pct > 60 && pct < 70) return "rounded px-2 bg-green-600/40 text-stone-100";
  if (pct > 54 && pct <= 60) return "rounded px-2 bg-emerald-900/50 text-stone-200";
  if (pct >= 46 && pct <= 54) return "";
  if (pct >= 40 && pct < 46) return "rounded px-2 bg-red-950/55 text-stone-200";
  if (pct > 30 && pct < 40) return "rounded px-2 bg-red-700/40 text-stone-100";
  return "rounded px-2 bg-[#FF0800] text-white";
}
