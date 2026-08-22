"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "notesprint_bookmarks";
const EVENT_NAME = "notesprint_bookmarks_change";

export function getBookmarkedIds(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
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

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setBookmarks(getBookmarkedIds());
    setIsLoaded(true);

    const handleSync = () => {
      setBookmarks(getBookmarkedIds());
    };

    window.addEventListener(EVENT_NAME, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(EVENT_NAME, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const toggle = useCallback((id: number) => {
    return toggleBookmarkId(id);
  }, []);

  const isBookmarked = useCallback(
    (id: number) => bookmarks.includes(id),
    [bookmarks]
  );

  return { bookmarks, isBookmarked, toggle, isLoaded };
}
