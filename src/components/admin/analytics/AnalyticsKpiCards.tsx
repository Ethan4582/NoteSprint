"use client";

import { Users, Eye, BookOpen, Clock, ArrowUpRight, Info } from "lucide-react";
import type { AnalyticsKpi } from "./types";
import { cn } from "@/src/lib/utils";

const ICON_MAP = {
  users: { icon: Users, bg: "bg-blue-500/10 text-blue-500", border: "border-blue-500/20" },
  eye: { icon: Eye, bg: "bg-purple-500/10 text-purple-500", border: "border-purple-500/20" },
  book: { icon: BookOpen, bg: "bg-emerald-500/10 text-emerald-500", border: "border-emerald-500/20" },
  clock: { icon: Clock, bg: "bg-amber-500/10 text-amber-500", border: "border-amber-500/20" },
};

function isPercentageChange(change: string) {
  return /^[+-]?\d+(\.\d+)?%/.test(change.trim());
}

export default function AnalyticsKpiCards({ kpis }: { kpis: AnalyticsKpi[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {kpis.map((kpi) => {
        const iconConfig = ICON_MAP[kpi.iconName] || ICON_MAP.users;
        const Icon = iconConfig.icon;
        const isPercent = isPercentageChange(kpi.change);
        const isNoData = kpi.change === "No data";

        return (
          <div
            key={kpi.title}
            className="rounded-2xl border border-[var(--border-strong)] bg-raised p-5 shadow-raised-crisp flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("p-2.5 rounded-xl border flex items-center justify-center", iconConfig.bg, iconConfig.border)}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold text-[var(--text-secondary)]">
                  {kpi.title}
                </span>
              </div>
              <button
                type="button"
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                title={kpi.tooltip}
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)] font-mono">
                {kpi.value}
              </div>
              {isNoData ? (
                <div className="mt-1 text-xs font-semibold text-[var(--text-muted)]">
                  No data for period
                </div>
              ) : isPercent ? (
                <div className={cn("flex items-center gap-1 mt-1 text-xs font-semibold", kpi.changeType === "increase" ? "text-emerald-500" : "text-red-400")}>
                  <ArrowUpRight className={cn("h-3.5 w-3.5", kpi.changeType === "decrease" && "rotate-180")} />
                  <span>{kpi.change}</span>
                </div>
              ) : (
                <div className="mt-1 text-xs font-medium text-[var(--text-muted)]">
                  {kpi.change}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
