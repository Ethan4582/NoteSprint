"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  LayoutGrid,
  Sparkles,
  Bookmark,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import SearchCommandDialog from "@/src/components/search/SearchCommandDialog";

interface DashboardSidebarProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export default function DashboardSidebar({ activeTab, onSelectTab }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    try {
      const savedCol = localStorage.getItem("ns_sidebar_collapsed");
      if (savedCol !== null) setCollapsed(savedCol === "true");
    } catch {}
  }, []);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem("ns_sidebar_collapsed", String(next));
    } catch {}
  };

  const navItems = [
    {
      label: "Library",
      href: "/library",
      icon: LayoutGrid,
      isActive:
        (pathname === "/library" || pathname === "/dashboard") &&
        (!activeTab || activeTab === "ALL"),
      onClick: () => onSelectTab && onSelectTab("ALL"),
    },
    {
      label: "Interview Sessions",
      href: "/interview",
      icon: Sparkles,
      isActive: pathname === "/interview",
    },
    {
      label: "System Design",
      href: "/system-design/articles",
      icon: BookOpen,
      isActive: pathname.startsWith("/system-design"),
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
    <>
      <aside
        className={cn(
          "hidden md:flex flex-col shrink-0 border-r border-[var(--border)] bg-white h-screen sticky top-0 p-4 justify-between select-none z-20 transition-all duration-300",
          collapsed ? "w-16 items-center px-2" : "w-60"
        )}
      >
        {/* Top Brand & Collapse Toggle */}
        <div className="space-y-4 w-full">
          <div className={cn("flex items-center justify-between", collapsed ? "flex-col gap-3" : "px-2 py-1")}>
            <Link href="/" className="flex items-center gap-2.5 min-w-0" aria-label="NoteSprint Home">
              <Image
                src="/logo.png"
                alt="NoteSprint Logo"
                width={28}
                height={28}
                className="w-7 h-7 rounded-[8px] object-cover border border-[var(--border)] shadow-xs shrink-0"
              />
              {!collapsed && (
                <div className="min-w-0">
                  <div className="text-[10px] font-black tracking-wider uppercase text-[var(--accent)] leading-tight">
                    NOTE SPRINTS
                  </div>
                  <div className="text-sm font-bold tracking-tight text-[var(--text-primary)] leading-none mt-0.5 truncate">
                    Flashcards
                  </div>
                </div>
              )}
            </Link>

            <button
              type="button"
              onClick={toggleCollapse}
              className="p-1.5 rounded-[8px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </button>
          </div>

          {/* Quick Search Button */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className={cn(
              "w-full flex items-center gap-2.5 p-2 rounded-[10px] bg-[var(--bg-subtle)] border border-[var(--border)] text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-all",
              collapsed ? "justify-center px-0" : "px-3"
            )}
            title="Search (⌘K)"
          >
            <Search size={14} className="shrink-0 text-[var(--text-muted)]" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left font-medium truncate">Search topics...</span>
                <kbd className="text-[10px] font-mono px-1.5 py-0.2 rounded-[4px] bg-white border border-[var(--border)] text-[var(--text-muted)]">
                  ⌘K
                </kbd>
              </>
            )}
          </button>

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
                    "flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-xs font-semibold transition-all",
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

        {/* Bottom Footer: Creator Link */}
        <div className="pt-3 border-t border-[var(--border)] w-full">
          <div className={cn("flex items-center", collapsed ? "justify-center" : "px-1")}>
            <a
              href="https://twitter.com/Ethan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[11px] font-bold text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors group"
              title="Creator on Twitter"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="w-3.5 h-3.5 fill-current text-[var(--text-muted)] group-hover:text-[var(--accent)] shrink-0"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              {!collapsed && <span>Built by Ethan</span>}
            </a>
          </div>
        </div>
      </aside>

      {/* Global Search Dialog Triggered by ⌘K */}
      <SearchCommandDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
