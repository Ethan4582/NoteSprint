"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "@/src/components/ThemeToggle";
import { adminLogout } from "@/src/lib/admin-api";
import { HelpCircle, FileText, LineChart, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/src/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return null;

  const handleLogout = () => {
    adminLogout();
    router.push("/admin/login");
  };

  const navItems = [
    { href: "/admin", label: "Analytics", icon: LineChart },
    { href: "/admin/questions", label: "Questions", icon: HelpCircle },
    { href: "/admin/articles", label: "Articles", icon: FileText },
  ];

  const currentNav =
    navItems.find((item) =>
      item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
    ) || navItems[0];
  const CurrentIcon = currentNav.icon;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--bg-base)]/85 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <span className="text-base font-black tracking-tight text-[var(--text-primary)]">
              Note<span className="text-[var(--accent)]">Sprint</span>
            </span>
            <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-md bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/25">
              Admin
            </span>
          </Link>

          {/* Desktop Nav Items Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] shadow-inset-cavity">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all",
                    active
                      ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-raised-crisp border border-[var(--border-strong)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]/50"
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5", active ? "text-[var(--accent)]" : "text-[var(--text-muted)]")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {/* Mobile Section Switcher & Logout Dropdown */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all shadow-sm active:scale-95"
                >
                  <span>{currentNav.label}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)] ml-0.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-strong)] shadow-lg">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);

                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors w-full",
                          active
                            ? "bg-[var(--accent)]/10 text-[var(--accent)] font-bold"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuSeparator className="my-1 bg-[var(--border)]" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Divider & Logout */}
          <div className="h-5 w-px bg-[var(--border)] mx-0.5 hidden md:block" />

          <button
            type="button"
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] hover:bg-rose-500/10 hover:border-rose-500/30 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--error)] transition-all shadow-sm active:scale-95"
            title="Logout from admin dashboard"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
