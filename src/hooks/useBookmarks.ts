"use client";

import { useSyncExternalStore, useCallback } from "react";

const STORAGE_KEY = "notesprint_bookmarks";
const EVENT_NAME = "notesprint_bookmarks_change";

const emptyArray: number[] = [];

export function getBookmarkedIds(): number[] {
  if (typeof window === "undefined") return emptyArray;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as number[]) : emptyArray;
  } catch {
    return emptyArray;
  }
}

export function toggleBookmarkId(id: number): boolean {
  if (typeof window === "undefined" || !id) return false;
  try {
    const current = getBookmarkedIds();
    const isBookmarked = current.includes(id);
    const updated = isBookmarked ? current.filter((x) => x !== id) : [...current, id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(EVENT_NAME));
    return !isBookmarked;
  } catch {
    return false;
  }
}

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
let cachedSnapshot: number[] = emptyArray;

function getSnapshot(): number[] {
  if (typeof window === "undefined") return emptyArray;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedSnapshot;
    cachedRaw = raw;
    cachedSnapshot = raw ? (JSON.parse(raw) as number[]) : emptyArray;
    return cachedSnapshot;
  } catch {
    return emptyArray;
  }
}

function getServerSnapshot(): number[] {
  return emptyArray;
}

export function useBookmarks() {
  const bookmarks = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback((id: number) => {
    return toggleBookmarkId(id);
  }, []);

  const isBookmarked = useCallback(
    (id: number) => bookmarks.includes(id),
    [bookmarks]
  );

  return { bookmarks, isBookmarked, toggle, isLoaded: true };
}
