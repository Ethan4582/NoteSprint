"use client";

import { useState, useEffect, useCallback } from "react";
import {
  SessionRecord,
  OverallProgressStats,
  getSessionHistory,
  saveSessionProgress,
  clearSessionHistory,
  computeProgressStats,
} from "@/src/lib/progress";

export function useUserProgress() {
  const [history, setHistory] = useState<SessionRecord[]>([]);
  const [stats, setStats] = useState<OverallProgressStats>(() => computeProgressStats([]));
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(() => {
    const list = getSessionHistory();
    setHistory(list);
    setStats(computeProgressStats(list));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const recordSession = useCallback(
    (data: Omit<SessionRecord, "id" | "date" | "timestamp">) => {
      saveSessionProgress(data);
      refresh();
    },
    [refresh]
  );

  const resetAll = useCallback(() => {
    clearSessionHistory();
    refresh();
  }, [refresh]);

  return {
    history,
    stats,
    isLoaded,
    recordSession,
    resetAll,
    refresh,
  };
}
