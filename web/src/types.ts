export type ArmyDetails = {
  armyGamesCount: number;
  armyWinPercentage: number;
};

export type ArmyStats = {
  StatsVsOtherArmiesMap: Record<string, ArmyDetails>;
};

export type ArmiesStatsPayload = {
  ArmiesStatsMap: Record<string, ArmyStats>;
  created?: string;
};
