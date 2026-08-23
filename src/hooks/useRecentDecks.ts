"use client";

import { useEffect, useState, useCallback } from "react";

const KEY = "ns_recent_decks";

export function useRecentDecks() {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, []);

  const push = useCallback((topic: string) => {
    try {
      const raw = localStorage.getItem(KEY);
      const arr: string[] = raw ? JSON.parse(raw) : [];
      const next = [topic, ...arr.filter((t) => t !== topic)].slice(0, 6);
      localStorage.setItem(KEY, JSON.stringify(next));
      localStorage.setItem("ns_recent_ts", String(Date.now()));
      setRecent(next);
    } catch {}
  }, []);

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
      setRecent([]);
    } catch {}
  }, []);

  return { recent, push, clear, refresh: () => {
    try { const raw = localStorage.getItem(KEY); if (raw) setRecent(JSON.parse(raw)); } catch {}
  }};
}
