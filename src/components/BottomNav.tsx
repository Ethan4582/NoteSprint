"use client";

import { useRouter, usePathname } from "next/navigation";
import { LayoutGrid, Sparkles, Bookmark } from "lucide-react";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: "Practice", path: "/practice", altPath: "/interview", icon: Sparkles },
    { label: "Saved", path: "/bookmarks", icon: Bookmark },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 md:hidden pointer-events-none">
      <nav
        aria-label="Mobile Navigation"
        className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-[12px] bg-white/95 backdrop-blur-xl border border-[var(--border)] shadow-[0_4px_20px_rgba(0,0,0,0.06)] max-w-xs w-full"
      >
        {navItems.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.altPath && pathname === item.altPath) ||
            (item.path === "/bookmarks" && pathname.startsWith("/bookmarks"));
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              aria-current={isActive ? "page" : undefined}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-[10px] transition-all duration-200 ${
                isActive
                  ? "bg-[var(--accent)] text-white shadow-xs font-bold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white stroke-[2.5]" : "stroke-[2]"}`} />
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? "font-bold text-white" : "font-medium text-[var(--text-secondary)]"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
