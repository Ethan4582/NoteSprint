"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import ThemeToggle from "@/src/components/ThemeToggle";
import { adminLogout } from "@/src/lib/admin-api";
import { LayoutDashboard, HelpCircle, FileText, LogOut } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return null;

  const handleLogout = () => {
    adminLogout();
    router.push("/admin/login");
  };

  const navItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/questions", label: "Questions", icon: HelpCircle },
    { href: "/admin/articles", label: "Articles", icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--bg-surface)]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-base font-black tracking-tight text-[var(--text-primary)]">
              Note<span className="text-[var(--accent)]">Sprint</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
              Admin
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors",
                    active
                      ? "bg-[var(--bg-subtle)] text-[var(--accent)] border border-[var(--border)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs font-bold text-[var(--error)] hover:text-[var(--error)] hover:bg-rose-500/10">
            <LogOut className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
