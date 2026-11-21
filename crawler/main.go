package main

import (
	"HexStatistics/crawler/config"
	"context"
	"encoding/json"
	"fmt"
	"github.com/chromedp/chromedp"
	"log"
	"os"
	"strconv"
	"strings"
	"time"
)

const Url = `https://gf4ef464823eff3-db7tl3g.adb.eu-frankfurt-1.oraclecloudapps.com/ords/r/workspace_demo/tournamentapp/armywrmatrix1`
const PickArmyCurrentlySelected = "//*[@id=\"P66_ARMY\"]"

var armiesList = []string{"Beasts", "Borgo", "Dancer", "Death Breath", "Desert Tribes", "Doomsday Machine", "Hegemony", "Iron Gang", "Mephisto", "Merchants Guild", "Missisipi", "Moloch", "Neojungle", "New York", "Outpost", "Partisans", "Pirates", "Sand Runners", "Sharrash", "Smart", "Steel Police", "Troglodytes", "Uranopolis", "Vegas", "Wiremen", "Purifiers"}

//var armiesList = []string{"New York", "Sand Runners"}

func main() {
	b := &browser{}
	defer b.close()
	if v := os.Getenv("ARMIES"); v != "" {
		armiesList = strings.Split(v, ",")
	}
	armiesStats := config.ArmiesStats{}
	armiesStats.ArmiesStatsMap = make(map[string]config.ArmyStats)

	total := len(armiesList)
	for i, army := range armiesList {
		log.Printf("Crawling army %d/%d: %s", i+1, total, army)
		res := SelectArmy(b, army, &armiesStats)
		log.Printf("[%d/%d] %s", i+1, total, strings.TrimSpace(res))
	}

	loc, err := time.LoadLocation("Europe/Warsaw")
	if err != nil {
		loc = time.UTC
	}
	armiesStats.Created = time.Now().In(loc).Format("2006-01-02 15:04:05 MST")
	armiesStatsByte, err := json.Marshal(armiesStats)
	if err != nil {
		return
	}

	fmt.Println(string(armiesStatsByte))
	os.WriteFile("armiesStats.json", armiesStatsByte, 0644)
}

// readTableJS returns the report rows once the table shown on the page really
// belongs to the army passed in, or null while the report is still refreshing.
// After the army is picked, APEX refreshes the report via AJAX; until that
// finishes the page still shows the previous (default: Borgo) table.
// An army's table never contains a row for itself, while a stale table
// always contains a row for the newly selected army, so that is how a
// finished refresh is detected.
const readTableJS = `((army) => {
  const sel = document.getElementById('P66_ARMY');
  if (!sel || sel.value !== army) return null;
  if (document.querySelector('.u-Processing, .a-IRR-region .is-processing')) return null;
  const rows = [...document.querySelectorAll('table.a-IRR-table tr')]
    .map(tr => [...tr.querySelectorAll('td')].map(td => td.innerText.trim()))
    .filter(c => c.length >= 3 && c[0] !== '');
  if (rows.length < 5) return null;
  if (rows.some(c => c[0] === army)) return null;
  return rows;
})(%s)`

const debugStateJS = `JSON.stringify({
  army: (document.getElementById('P66_ARMY') || {}).value,
  processing: document.querySelectorAll('.u-Processing, .a-IRR-region .is-processing').length,
  rows: [...document.querySelectorAll('table.a-IRR-table tr')].slice(1, 4)
    .map(tr => tr.innerText.replace(/\\s+/g, ' ').trim())
})`

const setArmyJS = `apex.item('P66_ARMY').setValue(%[1]s, %[1]s), true`
const retriggerJS = `apex.event.trigger('#P66_ARMY', 'change'), true`

// reportKicks is how many times per attempt we wait for the report refresh
// (re-triggering the change event between waits).
const reportKicks = 3

const maxAttempts = 3

// browser owns a Chrome instance and transparently starts a new one if the
// previous instance died (its context got cancelled).
type browser struct {
	ctx    context.Context
	cancel func()
}

func (b *browser) get() (context.Context, error) {
	if b.ctx != nil && b.ctx.Err() == nil {
		return b.ctx, nil
	}
	if b.ctx != nil {
		log.Print("browser context is gone, starting a new browser")
	}
	b.close()
	actx, cancelAlloc := chromedp.NewExecAllocator(context.Background(), config.Configure(config.HeadlessMode)...)
	ctx, cancelCtx := chromedp.NewContext(actx, chromedp.WithLogf(log.Printf))
	b.ctx, b.cancel = ctx, func() { cancelCtx(); cancelAlloc() }
	// Start the browser on this long-lived context; otherwise the first
	// per-attempt timeout context would own (and kill) the browser.
	if err := chromedp.Run(ctx); err != nil {
		return nil, fmt.Errorf("start browser: %w", err)
	}
	return ctx, nil
}

func (b *browser) close() {
	if b.cancel != nil {
		b.cancel()
	}
}

func SelectArmy(b *browser, armyName string, armiesStats *config.ArmiesStats) string {
	var lastErr error
	for attempt := 1; attempt <= maxAttempts; attempt++ {
		ctx, err := b.get()
		if err != nil {
			lastErr = err
			log.Printf("army %s: attempt %d/%d failed: %v", armyName, attempt, maxAttempts, err)
			continue
		}
		res, err := selectArmyOnce(ctx, armyName, armiesStats)
		if err == nil {
			return res
		}
		lastErr = err
		log.Printf("army %s: attempt %d/%d failed: %v", armyName, attempt, maxAttempts, err)
	}
	log.Fatalf("army %s: giving up after %d attempts: %v", armyName, maxAttempts, lastErr)
	return ""
}

func selectArmyOnce(parent context.Context, armyName string, armiesStats *config.ArmiesStats) (string, error) {
	ctx, cancel := context.WithTimeout(parent, config.ArmyTimeout)
	defer cancel()

	var current string
	if err := chromedp.Run(ctx,
		chromedp.Navigate(Url),
		chromedp.WaitVisible(PickArmyCurrentlySelected),
		chromedp.Value(PickArmyCurrentlySelected, &current),
	); err != nil {
		return "", fmt.Errorf("load page: %w", err)
	}

	argJSON, _ := json.Marshal(armyName)
	if current != armyName {
		// Set the item through the APEX JS API: it fires the change event that
		// refreshes the report, without depending on the popup LOV UI.
		var ignored any
		if err := chromedp.Run(ctx, chromedp.Evaluate(fmt.Sprintf(setArmyJS, argJSON), &ignored)); err != nil {
			return "", fmt.Errorf("set army: %w", err)
		}
	}

	var rows [][]string
	var pollErr error
	for kick := 0; kick < reportKicks; kick++ {
		if kick > 0 {
			// The change event occasionally does not refresh the report; fire it again.
			log.Printf("army %s: report not refreshed after %s, re-triggering change", armyName, config.ReportTimeout)
			var ignored any
			if err := chromedp.Run(ctx, chromedp.Evaluate(retriggerJS, &ignored)); err != nil {
				return "", fmt.Errorf("re-trigger change: %w", err)
			}
		}
		pollErr = chromedp.Run(ctx,
			chromedp.Poll(fmt.Sprintf(readTableJS, argJSON), &rows,
				chromedp.WithPollingInterval(500*time.Millisecond),
				chromedp.WithPollingTimeout(config.ReportTimeout)))
		if pollErr == nil {
			break
		}
	}
	if pollErr != nil {
		var state string
		_ = chromedp.Run(parent, chromedp.Evaluate(debugStateJS, &state))
		return "", fmt.Errorf("wait for %s report: %w (page state: %s)", armyName, pollErr, state)
	}

	armyStats := config.ArmyStats{StatsVsOtherArmiesMap: make(map[string]config.ArmyDetails)}
	for _, c := range rows {
		gamesCount, err := strconv.Atoi(c[1])
		if err != nil {
			return "", fmt.Errorf("bad games count %q for %s vs %s", c[1], armyName, c[0])
		}
		winPct, err := strconv.ParseFloat(c[2], 64)
		if err != nil {
			return "", fmt.Errorf("bad win %% %q for %s vs %s", c[2], armyName, c[0])
		}
		armyStats.StatsVsOtherArmiesMap[c[0]] = config.ArmyDetails{
			ArmyGamesCount:    gamesCount,
			ArmyWinPercentage: winPct,
		}
	}
	log.Print(armyStats)
	armiesStats.ArmiesStatsMap[armyName] = armyStats
	return armyName, nil
}
