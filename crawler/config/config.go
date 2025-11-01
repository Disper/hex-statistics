package config

import (
	"github.com/chromedp/chromedp"
	"time"
)

const WaitSecondsForArmyToLoad = 4 * time.Second
const HeadlessMode = true

func Configure(headless bool) []chromedp.ExecAllocatorOption {
	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.Flag("headless", headless),
	)
	return opts
}

func ConfigureMultipleDepthsSearch() []chromedp.QueryOption {
	return []chromedp.QueryOption{
		chromedp.BySearch,
		// Without below the nodes are not fully populated
		chromedp.Populate(3, true, chromedp.PopulateWait(WaitSecondsForArmyToLoad)),
	}
}
