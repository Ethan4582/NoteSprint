"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminLogout } from "@/src/lib/admin-api";
import { BarChart3, HelpCircle, FileText, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";

export default function AdminMobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === "/admin/login") return null;
  const handleLogout = () => { adminLogout(); router.push("/admin/login"); };

  const navItems = [
    { href: "/admin", label: "Analytics", icon: BarChart3, exact: true },
    { href: "/admin/questions", label: "Questions", icon: HelpCircle, exact: false },
    { href: "/admin/articles", label: "Articles", icon: FileText, exact: false },
  ];
  const currentNav = navItems.find((item) => (item.exact ? pathname === item.href : pathname.startsWith(item.href))) || navItems[0];
  const CurrentIcon = currentNav.icon;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-white/90 backdrop-blur-xl md:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[var(--text-primary)] flex items-center justify-center text-white font-bold text-xs">N</div>
            <span className="text-sm font-extrabold tracking-tight text-[var(--text-primary)]">Note<span className="text-[var(--accent)]">Sprint</span></span>
            <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded-md bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-secondary)]">Admin</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] text-xs font-bold text-[var(--text-primary)] shadow-sm">
                <CurrentIcon className="w-3.5 h-3.5 text-[var(--text-secondary)]" /> <span>{currentNav.label}</span> <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)] ml-0.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-md bg-white border border-[var(--border)] shadow-[var(--shadow-floating)]">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className={cn("flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded w-full", active ? "bg-[var(--text-primary)] text-white" : "text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]")}>
                      <Icon className="h-4 w-4" /> <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator className="my-1 bg-[var(--border)]" />
              <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded">
                <LogOut className="h-4 w-4" /> <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center px-4 md:hidden pointer-events-none">
        <nav aria-label="Admin Navigation" className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-xl bg-white/95 backdrop-blur-xl border border-[var(--border)] shadow-[0_8px_30px_rgba(28,25,23,0.08)] max-w-xs w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={cn("flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-lg transition-colors", active ? "bg-[var(--text-primary)] text-white font-semibold" : "text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]")}>
                <Icon className={cn("w-4 h-4", active ? "text-white stroke-[2.5]" : "stroke-[2]")} />
                <span className={cn("text-[10px] mt-0.5 tracking-tight", active ? "font-bold text-white" : "font-medium")}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
