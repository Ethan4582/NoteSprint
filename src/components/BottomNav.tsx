"use client";

import { useRouter, usePathname } from "next/navigation";
import { LayoutGrid, Sparkles, BookOpen, Bookmark, Activity } from "lucide-react";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: "Library", path: "/library", altPath: "/dashboard", icon: LayoutGrid },
    { label: "Interview", path: "/interview", icon: Sparkles },
    { label: "Design", path: "/system-design/articles", altPath: "/system-design", icon: BookOpen },
    { label: "Progress", path: "/progress", icon: Activity },
    { label: "Saved", path: "/bookmarks", icon: Bookmark },
  ];

  return (
    <div className="fixed bottom-3 left-0 right-0 z-50 flex justify-center px-4 md:hidden pointer-events-none">
      <nav
        aria-label="Mobile Navigation"
        className="pointer-events-auto flex items-center gap-1 p-1 rounded-[12px] bg-white/95 backdrop-blur-xl border border-[var(--border)] shadow-[0_4px_20px_rgba(0,0,0,0.08)] max-w-sm w-full"
      >
        {navItems.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.altPath && pathname === item.altPath) ||
            (item.path === "/progress" && pathname.startsWith("/progress")) ||
            (item.path === "/bookmarks" && pathname.startsWith("/bookmarks")) ||
            (item.path === "/system-design/articles" && pathname.startsWith("/system-design"));
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              aria-current={isActive ? "page" : undefined}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-[10px] transition-all duration-150 ${
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
