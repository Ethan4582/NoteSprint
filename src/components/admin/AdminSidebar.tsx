"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { adminLogout } from "@/src/lib/admin-api";
import {
  BarChart3,
  HelpCircle,
  FileText,
  LogOut,
  ArrowUpRight,
  Zap,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const savedCol = localStorage.getItem("ns_admin_sidebar_collapsed");
      if (savedCol !== null) setCollapsed(savedCol === "true");
    } catch {}
  }, []);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem("ns_admin_sidebar_collapsed", String(next));
    } catch {}
  };

  if (pathname === "/admin/login") return null;

  const handleLogout = () => {
    adminLogout();
    router.push("/admin/login");
  };

  const navItems = [
    { href: "/admin", label: "Analytics & Telemetry", icon: BarChart3, exact: true },
    { href: "/admin/questions", label: "Questions Manager", icon: HelpCircle, exact: false },
    { href: "/admin/articles", label: "Article Manager", icon: FileText, exact: false },
  ];

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col shrink-0 border-r border-[var(--border)] bg-white h-screen sticky top-0 p-5 justify-between select-none z-20 transition-all duration-300",
        collapsed ? "w-16 items-center px-2.5 py-5" : "w-60"
      )}
    >
      {/* Top Brand & Navigation */}
      <div className="space-y-5 w-full">
        <div className={cn("flex items-center justify-between", collapsed ? "flex-col gap-3" : "px-1")}>
          <Link href="/" className="flex items-center gap-2.5 min-w-0" aria-label="NoteSprint Home">
            <Image
              src="/logo.png"
              alt="NoteSprint Logo"
              width={28}
              height={28}
              className="w-7 h-7 rounded-md object-cover border border-[var(--border)] shadow-xs shrink-0"
            />
            {!collapsed && (
              <span className="text-sm font-bold tracking-tight text-[var(--text-primary)] truncate">
                NoteSprint
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={toggleCollapse}
            className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1.5 w-full pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold transition-all",
                  collapsed && "justify-center px-0",
                  active
                    ? "bg-[var(--accent-subtle)] text-[var(--accent)] font-bold shadow-2xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    active ? "text-[var(--accent)] stroke-[2.5]" : "text-[var(--text-muted)]"
                  )}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}

          <Link
            href="/library"
            target="_blank"
            title={collapsed ? "Live Website" : undefined}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-all",
              collapsed && "justify-center px-0"
            )}
          >
            <Zap className="w-4 h-4 text-[var(--accent)] shrink-0" />
            {!collapsed && (
              <span className="flex items-center justify-between flex-1 truncate">
                <span>Live Website</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 ml-1" />
              </span>
            )}
          </Link>
        </nav>
      </div>

      {/* Bottom Footer: Sign Out */}
      <div className="pt-3 border-t border-[var(--border)] w-full">
        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? "Sign Out" : undefined}
          className={cn(
            "w-full flex items-center gap-2.5 py-2 px-3 rounded-md text-xs font-semibold text-[var(--text-secondary)] hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
