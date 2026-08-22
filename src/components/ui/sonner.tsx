"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-raised group-[.toaster]:text-[var(--text-primary)] group-[.toaster]:border-[var(--border-strong)] group-[.toaster]:shadow-raised-crisp group-[.toaster]:rounded-2xl text-xs font-semibold",
          description: "group-[.toast]:text-[var(--text-secondary)]",
          actionButton:
            "group-[.toast]:bg-[var(--accent)] group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-[var(--bg-subtle)] group-[.toast]:text-[var(--text-secondary)]",
        },
      }}
    />
  );
}

export { toast } from "sonner";
