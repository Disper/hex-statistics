package main

import (
	"HexStatistics/crawler/config"
	"context"
	"encoding/json"
	"fmt"
	"github.com/chromedp/cdproto/cdp"
	"github.com/chromedp/chromedp"
	"log"
	"os"
	"strconv"
	"strings"
	"time"
)

const Url = `https://gf4ef464823eff3-db7tl3g.adb.eu-frankfurt-1.oraclecloudapps.com/ords/r/workspace_demo/tournamentapp/armywrmatrix1`
const PickArmyCurrentlySelected = "//*[@id=\"P66_ARMY\"]"
const PickArmyInput = `//*[@id="PopupLov_66_P66_ARMY_dlg"]/div[1]/input`

var armiesList = []string{"Beasts", "Borgo", "Dancer", "Death Breath", "Desert Tribes", "Doomsday Machine", "Hegemony", "Iron Gang", "Mephisto", "Merchants Guild", "Missisipi", "Moloch", "Neojungle", "New York", "Outpost", "Partisans", "Pirates", "Sand Runners", "Sharrash", "Smart", "Steel Police", "Troglodytes", "Uranopolis", "Vegas"}

//var armiesList = []string{"New York", "Sand Runners"}

func main() {
	opts := config.Configure(config.HeadlessMode)

	ctx2, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	defer cancel()
	ctx, cancel := chromedp.NewContext(ctx2, chromedp.WithLogf(log.Printf))
	armiesStats := config.ArmiesStats{}
	armiesStats.ArmiesStatsMap = make(map[string]config.ArmyStats)

	for _, army := range armiesList {
		res := SelectArmy(ctx, army, &armiesStats)
		log.Println(strings.TrimSpace(res))
	}

	armiesStats.Created = time.Now().Format(time.DateTime)
	armiesStatsByte, err := json.Marshal(armiesStats)
	if err != nil {
		return
	}

	fmt.Println(string(armiesStatsByte))
	os.WriteFile("armiesStats.json", armiesStatsByte, 0644)
}

func SelectArmy(ctx context.Context, armyName string, armiesStats *config.ArmiesStats) string {
	var res string
	var nodes []*cdp.Node

	err := chromedp.Run(ctx,
		chromedp.Navigate(Url),
		chromedp.Click(PickArmyCurrentlySelected, chromedp.NodeVisible),
		chromedp.Sleep(config.WaitSecondsForArmyToLoad), //  1/2 waits needed for the army to load
		chromedp.SendKeys(PickArmyInput, armyName),
		chromedp.Sleep(config.WaitSecondsForArmyToLoad), //  1/2 waits needed for the army to load
		chromedp.Click(fmt.Sprintf("//*[@data-id=\"%s\"]", armyName)),
		chromedp.Sleep(config.WaitSecondsForArmyToLoad), //  1/2 waits needed for the army to load
		chromedp.Value(PickArmyCurrentlySelected, &res),
		chromedp.Nodes("table tr", &nodes, config.ConfigureMultipleDepthsSearch()...),
		chromedp.ActionFunc(func(ctx context.Context) error {
			armyStats := config.ArmyStats{}
			armyStats.StatsVsOtherArmiesMap = make(map[string]config.ArmyDetails)

			for _, node := range nodes {
				armyName := node.Children[0].Children[0].NodeValue
				if armyName != "" {

					armyGamesCount, _ := strconv.Atoi(node.Children[1].Children[0].NodeValue)
					armyWinPercentage, _ := strconv.ParseFloat(node.Children[2].Children[0].NodeValue, 64)

					currentArmy := config.ArmyDetails{
						//ArmyName:          armyName,
						ArmyGamesCount:    armyGamesCount,
						ArmyWinPercentage: armyWinPercentage,
					}

					armyStats.StatsVsOtherArmiesMap[armyName] = currentArmy
				}
			}

			// TODO: fix panic. Can it be related to the new army?
			log.Print(armyStats)
			armiesStats.ArmiesStatsMap[armyName] = armyStats

			return nil
		}),
		//chromedp.Sleep(config.WaitSecondsForArmyToLoad), //  2/2 wait needed for the army to load
	)
	if err != nil {
		log.Fatal(err)
	}
	return res
}
