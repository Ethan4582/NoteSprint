"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute("data-theme") as "light" | "dark";
    setTheme(currentTheme || "light");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 hover:bg-[var(--bg-subtle)] rounded-[6px] transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="w-[18px] h-[18px] text-[var(--text-secondary)]" />
      ) : (
        <Sun className="w-[18px] h-[18px] text-[var(--text-secondary)]" />
      )}
    </button>
  );
}
