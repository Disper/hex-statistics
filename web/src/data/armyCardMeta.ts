/**
 * Card copy and HQ art filenames (public/) — aligned with NeuroshimaHexRandomizer army data.
 */
export type ArmyCardMeta = {
  /** Path under `public/`, e.g. armies-hq/beasts.png */
  hqFile: string;
  description: string;
};

export const ARMY_CARD_META: Record<string, ArmyCardMeta> = {
  Beasts: {
    hqFile: "armies-hq/beasts.png",
    description:
      "Feral mutants and monstrous creatures that roam the wasteland. Beasts overwhelm enemies with raw numbers and relentless aggression — fast, hard-hitting Hive units backed by a surprisingly large Battle token pool.",
  },
  Borgo: {
    hqFile: "armies-hq/borgo.png",
    description:
      "A savage mutant gang led by the towering Super-mutant. Borgo floods the board with cheap, aggressive fighters and overwhelms enemies through sheer numbers, backed by the highest Battle token count in the game.",
  },
  Dancer: {
    hqFile: "armies-hq/dancer.png",
    description:
      "Three board Objects (Blue, Red, Yellow) replace a normal HQ. The army has the highest instant count in the game — huge stacks of Action, Battle, Push Back, and Move. Strengths: durable units and Healing; Objects can hurt the enemy outside Battle. Weakness: only three units — you lose when any Object is destroyed (see NeuroshimaHex.pl / Dancer).",
  },
  "Death Breath": {
    hqFile: "armies-hq/death-breath.png",
    description:
      "A zombie horde that spreads infection across the board. Death Breath fields Infected, Grippers, and Zombies, backed by Reappearance and Castling with the Opponent tokens to recycle units. Eight Battle tokens make it one of the most combat-heavy armies.",
  },
  "Desert Tribes": {
    hqFile: "armies-hq/desert-tribes.jpg",
    description:
      "Tribal warriors of the wasteland who blend stealth, ranged combat, and shamanic support. Desert People field Coyotes, Archers, Young Warriors, and Shamans — a versatile mix of scouts and fighters backed by Mirage tokens.",
  },
  "Doomsday Machine": {
    hqFile: "armies-hq/doomsday-machine.png",
    description:
      "An autonomous war machine that deploys Shooter units — Alpha, Gamma, Delta, Omega — and Gauss Cannons. Doomsday Machine has five Medics, the most in the game, and relies on Fire Positions and Traps for area control.",
  },
  Hegemony: {
    hqFile: "armies-hq/hegemony.png",
    description:
      "A ruthless criminal empire that controls the wasteland through fear and firepower. Hegemony combines cheap, abundant Gangers with elite specialists and powerful support modules to dominate the mid-game.",
  },
  "Iron Gang": {
    hqFile: "armies-hq/iron-gang.png",
    description:
      "A biker gang that rules the roads with brute force and mobility. Iron Gang fields Lumberjacks, Mountains, and Bikers, backed by the unique Order token — the most versatile instant in the game, with nine copies.",
  },
  Mephisto: {
    hqFile: "armies-hq/mephisto.png",
    description:
      "A colossal bio-mechanical demon assembled from interchangeable body parts. Mephisto's tiles are its own limbs and organs — each one a combat piece that snaps onto the growing creature on the board.",
  },
  "Merchants Guild": {
    hqFile: "armies-hq/merchants-guild.jpg",
    description:
      "A wealthy trading faction that buys victory. Merchants Guild fields Paid Snipers, Black Market, Bomber Chris, and Welders — backed by Commanders, Bosses, and the unique Gamble mechanic for high-risk, high-reward plays.",
  },
  Missisipi: {
    hqFile: "armies-hq/missisipi.png",
    description:
      "A toxic wasteland faction that thrives in polluted swamps and poisoned waters. Mississippi relies on stealth, poison, and area denial — Shadows, Poisoners, and Boilers control the board while Mutants and Guardians hold the line.",
  },
  Moloch: {
    hqFile: "armies-hq/moloch.png",
    description:
      "A mechano-electronic entity spanning several states. After 30 years it is larger and more powerful than ever, sending machine armies across the wasteland. Strong and durable, but slow and with few Battle tokens.",
  },
  Neojungle: {
    hqFile: "armies-hq/neojungle.png",
    description:
      "A mutated jungle that has reclaimed the wasteland. Neojungle fights with monstrous creatures, poison, and living terrain — Rippers, Poisoners, and Tree Walls control the board while Symbionts and Roots provide support.",
  },
  "New York": {
    hqFile: "armies-hq/new-york.png",
    description:
      "A hardened urban militia defending the ruins of the Big Apple. New York fields a mix of cops, snipers, and street fighters — strong ranged firepower backed by versatile modules and Mine tokens for area control.",
  },
  Outpost: {
    hqFile: "armies-hq/outpost.png",
    description:
      "A disciplined human military unit holding the line against all threats. Outpost has the most Move tokens in the game, letting it reposition constantly, and fields highly versatile Commandos that excel in any situation.",
  },
  Partisans: {
    hqFile: "armies-hq/partisans.jpg",
    description:
      "Resistance fighters who strike from the shadows. Partisans combine Tactics and Withdrawal tokens for flexibility, Cyborg Charlie and Provocateurs for board control, and a mix of specialists — Bunker Manager, Sleeper Agent, Dr. Assistant.",
  },
  Pirates: {
    hqFile: "armies-hq/pirates.jpg",
    description:
      "Ruthless river raiders who control the waterways of the wasteland. Pirates are a nimble, aggressive army with strong ranged firepower and tricks that move both their own units and enemy pieces across the board.",
  },
  "Sand Runners": {
    hqFile: "armies-hq/sand-runners.png",
    description:
      "A desert tribe surviving in the wasteland. Sand Runners rely on Sandstorm tokens for area control, Field Medics for healing, and a mix of veterans and specialists — Optymist, Vulture, and Secateur hold the line.",
  },
  Sharrash: {
    hqFile: "armies-hq/sharrash.png",
    description:
      "A chaotic underground faction of mutants, rats, and beasts. Sharrash floods the board with cheap units and explosives — Mortars, Demolition Charges, and Plague tokens create havoc while Mutants and Rats swarm the enemy.",
  },
  Smart: {
    hqFile: "armies-hq/smart.png",
    description:
      "An AI-controlled army of robots, cyborgs, and bio-droids. Smart combines heavy firepower — Gauss Cannons, MK3 Golems, Rippers — with Terror tokens and strong module support. Few instants, but devastating when they strike.",
  },
  "Steel Police": {
    hqFile: "armies-hq/steel-police.png",
    description:
      "The brutal law enforcement arm of a crumbling empire. Heavily armed with riot control units, judges, and wardogs, Steel Police excels at aggressive close-quarters combat backed by a deep module bench.",
  },
  Troglodytes: {
    hqFile: "armies-hq/troglodytes.png",
    description:
      "Cave-dwelling mutants adapted to cold and darkness. Troglodytes field Bears, Archers, Ice Monkeys, and the unique Satiety system — markers placed when Cannibalizing that grow stronger as the battle progresses.",
  },
  Uranopolis: {
    hqFile: "armies-hq/uranopolis.png",
    description:
      "A technologically advanced city-state whose citizens wield powerful generators and cutting-edge weaponry. Uranopolis units are fragile but pack devastating firepower, supported by a powerful array of modules.",
  },
  Vegas: {
    hqFile: "armies-hq/vegas.png",
    description:
      "A casino-run city-state where mercenaries and bodyguards enforce the house rules. Vegas excels at repositioning — Rotation, Castling, and Push tokens let it shuffle the board, while Agitators and Shooters apply pressure.",
  },
  Wiremen: {
    hqFile: "armies-hq/wiremen.jpg",
    description:
      "A community of rebels living inside Moloch itself — rogue cyborgs, escaped mutants, researchers and survivors. They fight using stolen Machine resources and cutting-edge cybernetics, blurring the line between friend and foe.",
  },
};

const FALLBACK_DESCRIPTION =
  "View head-to-head tournament win rates and game counts for this army in the matrix.";

export function getArmyCardMeta(name: string): ArmyCardMeta {
  return (
    ARMY_CARD_META[name] ?? {
      hqFile: "",
      description: FALLBACK_DESCRIPTION,
    }
  );
}

export function armyHqUrl(name: string): string | undefined {
  const { hqFile } = getArmyCardMeta(name);
  if (!hqFile) return undefined;
  return `${import.meta.env.BASE_URL}${hqFile}`;
}
