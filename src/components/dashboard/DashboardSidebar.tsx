"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  LayoutGrid,
  Sparkles,
  Bookmark,
  Zap,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

interface DashboardSidebarProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export default function DashboardSidebar({ activeTab, onSelectTab }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      label: "Library",
      href: "/dashboard",
      icon: LayoutGrid,
      isActive: pathname === "/dashboard" && (!activeTab || activeTab === "ALL"),
      onClick: () => onSelectTab && onSelectTab("ALL"),
    },
    {
      label: "Practice Roadmaps",
      href: "/practice",
      icon: Sparkles,
      isActive: pathname === "/practice",
    },
    {
      label: "Interview Sessions",
      href: "/interview",
      icon: Zap,
      isActive: pathname === "/interview",
    },
    {
      label: "System Design",
      href: "/system-design/articles",
      icon: BookOpen,
      isActive: pathname.startsWith("/system-design") || activeTab === "System Design",
      onClick: () => onSelectTab && onSelectTab("System Design"),
    },
    {
      label: "Saved Bookmarks",
      href: "/bookmarks",
      icon: Bookmark,
      isActive: pathname === "/bookmarks",
    },
  ];

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col shrink-0 border-r border-[var(--border)] bg-white h-screen sticky top-0 p-4 justify-between select-none z-20 transition-all duration-300",
        collapsed ? "w-16 items-center" : "w-60"
      )}
    >
      {/* Top Brand & Collapse Toggle */}
      <div className="space-y-6 w-full">
        <div className={cn("flex items-center justify-between", collapsed ? "flex-col gap-3" : "px-2 py-1")}>
          <Link href="/" className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white font-extrabold text-xs shadow-xs p-1 shrink-0">
              <img src="/logo.png" alt="NoteSprint" className="w-full h-full object-contain" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-[10px] font-black tracking-wider uppercase text-[var(--accent)]">
                  NOTE SPRINTS
                </div>
                <div className="text-sm font-extrabold tracking-tight text-[var(--text-primary)] leading-none mt-0.5 truncate">
                  Flashcards
                </div>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1 w-full pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={item.onClick}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                  collapsed && "justify-center px-0",
                  item.isActive
                    ? "bg-[var(--accent-subtle)] text-[var(--accent)] font-bold shadow-2xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    item.isActive ? "text-[var(--accent)] stroke-[2.5]" : "text-[var(--text-muted)]"
                  )}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Info */}
      <div className="pt-4 border-t border-[var(--border)] w-full">
        {!collapsed ? (
          <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Offline Ready</span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
              Progress stays saved on your device.
            </p>
          </div>
        ) : (
          <div className="flex justify-center" title="Offline Ready">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          </div>
        )}
      </div>
    </aside>
  );
}
