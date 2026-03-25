/** Neuroshima Hex–style faction accents for titles, CTAs, and win-rate bars. */
export const ARMY_ACCENTS: Record<string, string> = {
  Beasts: "#a16207",
  Borgo: "#b91c1c",
  Dancer: "#db2777",
  "Death Breath": "#6b21a8",
  "Desert Tribes": "#ca8a04",
  "Doomsday Machine": "#c2410c",
  Hegemony: "#2563eb",
  "Iron Gang": "#64748b",
  Mephisto: "#7e22ce",
  "Merchants Guild": "#d97706",
  Missisipi: "#15803d",
  Moloch: "#dc2626",
  Neojungle: "#16a34a",
  "New York": "#1d4ed8",
  Outpost: "#a8a29e",
  Partisans: "#4d7c0f",
  Pirates: "#0d9488",
  "Sand Runners": "#eab308",
  Sharrash: "#65a30d",
  Smart: "#0891b2",
  "Steel Police": "#1e40af",
  Troglodytes: "#92400e",
  Uranopolis: "#84cc16",
  Vegas: "#f59e0b",
  Wiremen: "#14b8a6",
};

export function getArmyAccent(name: string): string {
  return ARMY_ACCENTS[name] ?? "#78716c";
}
