"use client";

import { useSyncExternalStore, useCallback, useMemo } from "react";
import {
  SessionRecord,
  OverallProgressStats,
  PROGRESS_EVENT_NAME,
  saveSessionProgress,
  clearSessionHistory,
  computeProgressStats,
} from "@/src/lib/progress";

const emptyArray: SessionRecord[] = [];

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(PROGRESS_EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(PROGRESS_EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}

let cachedHistoryRaw: string | null = null;
let cachedHistorySnapshot: SessionRecord[] = emptyArray;

function getSnapshot(): SessionRecord[] {
  if (typeof window === "undefined") return emptyArray;
  try {
    const raw = localStorage.getItem("ns_user_progress_history");
    if (raw === cachedHistoryRaw) return cachedHistorySnapshot;
    cachedHistoryRaw = raw;
    cachedHistorySnapshot = raw ? (JSON.parse(raw) as SessionRecord[]) : emptyArray;
    return cachedHistorySnapshot;
  } catch {
    return emptyArray;
  }
}

function getServerSnapshot(): SessionRecord[] {
  return emptyArray;
}

export function useUserProgress() {
  const history = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const stats: OverallProgressStats = useMemo(() => computeProgressStats(history), [history]);

  const recordSession = useCallback(
    (data: Omit<SessionRecord, "id" | "date" | "timestamp">) => {
      saveSessionProgress(data);
    },
    []
  );

  const resetAll = useCallback(() => {
    clearSessionHistory();
  }, []);

  return {
    history,
    stats,
    isLoaded: true,
    recordSession,
    resetAll,
    refresh: () => {},
  };
}
