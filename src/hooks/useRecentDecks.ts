"use client";

import { useSyncExternalStore, useCallback } from "react";

const KEY = "ns_recent_decks";
const EVENT_NAME = "notesprint_recent_decks_change";

const emptyArray: string[] = [];

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}

let cachedRaw: string | null = null;
let cachedSnapshot: string[] = emptyArray;

function getSnapshot(): string[] {
  if (typeof window === "undefined") return emptyArray;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === cachedRaw) return cachedSnapshot;
    cachedRaw = raw;
    cachedSnapshot = raw ? (JSON.parse(raw) as string[]) : emptyArray;
    return cachedSnapshot;
  } catch {
    return emptyArray;
  }
}

function getServerSnapshot(): string[] {
  return emptyArray;
}

export function useRecentDecks() {
  const recent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const push = useCallback((topic: string) => {
    try {
      const current = getSnapshot();
      const next = [topic, ...current.filter((t) => t !== topic)].slice(0, 6);
      localStorage.setItem(KEY, JSON.stringify(next));
      localStorage.setItem("ns_recent_ts", String(Date.now()));
      window.dispatchEvent(new Event(EVENT_NAME));
    } catch {}
  }, []);

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
      window.dispatchEvent(new Event(EVENT_NAME));
    } catch {}
  }, []);

  return { recent, push, clear, refresh: () => {} };
}
