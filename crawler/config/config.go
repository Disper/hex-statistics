package config

import (
	"os"
	"time"

	"github.com/chromedp/chromedp"
)

const WaitSecondsForArmyToLoad = 4 * time.Second
const HeadlessMode = true

func Configure(headless bool) []chromedp.ExecAllocatorOption {
	opts := append([]chromedp.ExecAllocatorOption{}, chromedp.DefaultExecAllocatorOptions[:]...)
	if p := os.Getenv("CHROMEDP_EXEC_PATH"); p != "" {
		opts = append(opts, chromedp.ExecPath(p))
	}
	opts = append(opts, chromedp.Flag("headless", headless))
	// GitHub Actions / Docker: Chrome cannot use the SUID sandbox; /dev/shm is small.
	if os.Getenv("GITHUB_ACTIONS") == "true" {
		opts = append(opts,
			chromedp.Flag("no-sandbox", true),
			chromedp.Flag("disable-setuid-sandbox", true),
			chromedp.Flag("disable-dev-shm-usage", true),
		)
	}
	return opts
}

func ConfigureMultipleDepthsSearch() []chromedp.QueryOption {
	return []chromedp.QueryOption{
		chromedp.BySearch,
		// Without below the nodes are not fully populated
		chromedp.Populate(3, true, chromedp.PopulateWait(WaitSecondsForArmyToLoad)),
	}
}
