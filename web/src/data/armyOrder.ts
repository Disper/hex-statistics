/**
 * Display order matches NeuroshimaHexRandomizer `src/data/armies/index.ts` `armies`
 * (Outpost/Borgo/Hegemony/Moloch first, then release order per neuroshimahex.pl).
 * Keys match `armiesStats.json` / `ARMY_ACCENTS`.
 */
export const ARMY_DISPLAY_ORDER: readonly string[] = [
  "Outpost",
  "Borgo",
  "Hegemony",
  "Moloch",
  "Steel Police",
  "Dancer",
  "New York",
  "Neojungle",
  "Sharrash",
  "Mephisto",
  "Doomsday Machine",
  "Missisipi",
  "Vegas",
  "Smart",
  "Uranopolis",
  "Death Breath",
  "Iron Gang",
  "Sand Runners",
  "Troglodytes",
  "Beasts",
  "Pirates",
  "Merchants Guild",
  "Partisans",
  "Desert Tribes",
  "Wiremen",
];

const ORDER_INDEX = new Map(ARMY_DISPLAY_ORDER.map((name, i) => [name, i]));

export function compareArmiesByDisplayOrder(a: string, b: string): number {
  const ia = ORDER_INDEX.get(a);
  const ib = ORDER_INDEX.get(b);
  if (ia !== undefined && ib !== undefined) return ia - ib;
  if (ia !== undefined) return -1;
  if (ib !== undefined) return 1;
  return a.localeCompare(b);
}

/** Sorts known armies in randomizer order; unknown names sort after, alphabetically. */
export function sortArmiesByDisplayOrder(names: string[]): string[] {
  return [...names].sort(compareArmiesByDisplayOrder);
}
