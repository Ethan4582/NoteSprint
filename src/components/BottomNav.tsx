"use client";

import { useRouter, usePathname } from "next/navigation";
import { Compass, Layers, Bookmark } from "lucide-react";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: "Home", path: "/dashboard", altPath: "/", icon: Compass },
    { label: "Practice", path: "/interview", altPath: "/practice", icon: Layers },
    { label: "Saved", path: "/bookmarks", icon: Bookmark },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 md:hidden pointer-events-none">
      <nav
        aria-label="Mobile Navigation"
        className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-xl bg-white/90 backdrop-blur-xl border border-[var(--border)] shadow-[0_8px_30px_rgba(28,25,23,0.08)] max-w-sm w-full"
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
              className={`flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[var(--text-primary)] text-white shadow-sm font-semibold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
              }`}
            >
              <Icon className={`w-[18px] h-[18px] ${isActive ? "text-white stroke-[2.5]" : "stroke-[2]"}`} />
              <span className={`text-[11px] mt-0.5 tracking-tight ${isActive ? "font-bold text-white" : "font-medium text-[var(--text-secondary)]"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
