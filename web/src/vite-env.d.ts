/// <reference types="vite/client" />

import type { ArmiesStatsPayload } from "./types";

declare global {
  interface Window {
    /** Injected by public/data.js on GitHub Pages. */
    DATA?: ArmiesStatsPayload;
  }
}

export {};
