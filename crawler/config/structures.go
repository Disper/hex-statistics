package config

type ArmiesStats struct {
	ArmiesStatsMap map[string]ArmyStats `json:"ArmiesStatsMap"`
	Created        string               `json:"created,omitempty"`
}

type ArmyStats struct {
	StatsVsOtherArmiesMap map[string]ArmyDetails `json:"StatsVsOtherArmiesMap"`
}

type ArmyDetails struct {
	ArmyGamesCount    int     `json:"armyGamesCount"`
	ArmyWinPercentage float64 `json:"armyWinPercentage"`
}

// =========
type AveragedArmyStats struct {
	CurrentArmy           string                         `json:"CurrentArmy"`
	StatsVsOtherArmiesMap map[string]AveragedArmyDetails `json:"StatsVsOtherArmiesMap"`
}

type AveragedArmyDetails struct {
	TimesCounted      int     `json:"timesCounted"`
	ArmyWinPercentage float64 `json:"armyWinPercentage"`
}
