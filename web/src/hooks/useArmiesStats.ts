import { useEffect, useState } from "react";
import type { ArmiesStatsPayload } from "../types";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; data: ArmiesStatsPayload };

function getEmbeddedData(): ArmiesStatsPayload | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { DATA?: ArmiesStatsPayload };
  return w.DATA ?? null;
}

export function useArmiesStats(): State {
  const [state, setState] = useState<State>(() => {
    const embedded = getEmbeddedData();
    return embedded ? { status: "ok", data: embedded } : { status: "loading" };
  });

  useEffect(() => {
    const embedded = getEmbeddedData();
    if (embedded) return;

    let cancelled = false;
    const url = `${import.meta.env.BASE_URL}armiesStats.json`;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<ArmiesStatsPayload>;
      })
      .then((data) => {
        if (!cancelled) setState({ status: "ok", data });
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setState({
            status: "error",
            message: e instanceof Error ? e.message : "Failed to load data",
          });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
