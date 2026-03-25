/**
 * Faction accent colors — aligned with NeuroshimaHexRandomizer
 * (`src/data/armies/*.ts` `accentColor` on each army).
 */
export const ARMY_ACCENTS: Record<string, string> = {
  Beasts: "#97672b",
  Borgo: "#4a657f",
  Dancer: "#7d6d60",
  "Death Breath": "#8d5131",
  "Desert Tribes": "#76552e",
  "Doomsday Machine": "#5a645f",
  Hegemony: "#9d882c",
  "Iron Gang": "#959512",
  Mephisto: "#854d38",
  "Merchants Guild": "#9d8a2b",
  Missisipi: "#706a41",
  Moloch: "#a93e29",
  Neojungle: "#437232",
  "New York": "#56647d",
  Outpost: "#63982a",
  Partisans: "#5a333d",
  Pirates: "#177d88",
  "Sand Runners": "#95501d",
  Sharrash: "#497762",
  Smart: "#575b5d",
  "Steel Police": "#7b4767",
  Troglodytes: "#597b8b",
  Uranopolis: "#596155",
  Vegas: "#935d3f",
  Wiremen: "#8a526d",
};

export function getArmyAccent(name: string): string {
  return ARMY_ACCENTS[name] ?? "#78716c";
}
