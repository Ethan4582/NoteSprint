"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminLogout } from "@/src/lib/admin-api";
import { BarChart3, HelpCircle, FileText, LogOut, ArrowUpRight, Zap } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === "/admin/login") return null;

  const handleLogout = () => { adminLogout(); router.push("/admin/login"); };

  const navItems = [
    { href: "/admin", label: "Analytics & Telemetry", shortLabel: "Analytics", icon: BarChart3, exact: true },
    { href: "/admin/questions", label: "Questions Manager", shortLabel: "Questions", icon: HelpCircle, exact: false },
    { href: "/admin/articles", label: "Article Manager", shortLabel: "Articles", icon: FileText, exact: false },
  ];

  return (
    <aside className="hidden md:flex flex-col w-[264px] shrink-0 border-r border-[var(--border)] bg-white h-screen sticky top-0 p-5 justify-between select-none">
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[var(--text-primary)] flex items-center justify-center text-white font-black text-sm shadow-sm">N</div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold tracking-tight text-[var(--text-primary)]">NoteSprint</span>
                <span className="text-[9px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded-md bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border)]">Admin</span>
              </div>
              <p className="text-[11px] font-medium text-[var(--text-muted)]">Control Console</p>
            </div>
          </Link>
        </div>

        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)] px-3">Core Modules</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-bold transition-colors",
                    active ? "bg-[var(--text-primary)] text-white shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                  )}
                >
                  <Icon className={cn("w-4 h-4", active ? "text-white" : "text-[var(--text-muted)]")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-1">
          <Link href="/library" target="_blank" className="flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] border border-transparent hover:border-[var(--border)] transition-colors">
            <span className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-amber-500" /> Live Website</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </Link>
        </div>
      </div>

      <div className="pt-4 border-t border-[var(--border)] space-y-3">
        <div className="flex items-center justify-between px-3 py-2 rounded-md bg-[var(--bg-subtle)] border border-[var(--border)] text-[11px]">
          <span className="flex items-center gap-2 font-semibold text-[var(--text-secondary)]"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Edge Worker</span>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">v1.0 D1</span>
        </div>
        <button type="button" onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md border border-[var(--border)] hover:bg-[var(--error-subtle)] hover:border-rose-200 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--error)] transition-colors">
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
