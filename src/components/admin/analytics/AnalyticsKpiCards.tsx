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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
      {kpis.map((kpi) => {
        const iconConfig = ICON_MAP[kpi.iconName] || ICON_MAP.users;
        const Icon = iconConfig.icon;
        const isPercent = isPercentageChange(kpi.change);
        const isNoData = kpi.change === "No data";

        return (
          <div
            key={kpi.title}
            className="rounded-2xl lg:rounded-xl border border-[var(--border-strong)] bg-raised p-3.5 lg:px-4 lg:py-3 shadow-raised-crisp flex flex-col lg:flex-row lg:items-center justify-between space-y-2.5 lg:space-y-0 lg:gap-3 group transition-all"
          >
            {/* Mobile Top Header / Desktop Left Group */}
            <div className="flex items-center justify-between lg:justify-start gap-1.5 lg:gap-3 min-w-0">
              <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                <div className={cn("p-1.5 sm:p-2 rounded-xl lg:rounded-lg border shrink-0 flex items-center justify-center", iconConfig.bg, iconConfig.border)}>
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] lg:text-[var(--text-muted)] truncate block">
                    {kpi.title}
                  </span>
                  {/* Desktop Inline Value & Change */}
                  <div className="hidden lg:flex items-baseline gap-2 mt-0.5">
                    <span className="text-lg lg:text-xl font-black tracking-tight text-[var(--text-primary)] font-mono">
                      {kpi.value}
                    </span>
                    {!isNoData && (
                      isPercent ? (
                        <span className={cn("inline-flex items-center gap-0.5 text-[11px] font-semibold truncate", kpi.changeType === "increase" ? "text-emerald-500" : "text-red-400")}>
                          <ArrowUpRight className={cn("h-3 w-3", kpi.changeType === "decrease" && "rotate-180")} />
                          {kpi.change}
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-[var(--text-secondary)] truncate">
                          {kpi.change}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Info Button */}
              <button
                type="button"
                className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shrink-0 p-0.5"
                title={kpi.tooltip}
              >
                <Info className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </button>
            </div>

            {/* Mobile Bottom Value & Change */}
            <div className="lg:hidden">
              <div className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)] font-mono truncate">
                {kpi.value}
              </div>
              {!isNoData && (
                isPercent ? (
                  <div className={cn("flex items-center gap-0.5 mt-0.5 text-[10px] sm:text-xs font-semibold truncate", kpi.changeType === "increase" ? "text-emerald-500" : "text-red-400")}>
                    <ArrowUpRight className={cn("h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0", kpi.changeType === "decrease" && "rotate-180")} />
                    <span className="truncate">{kpi.change}</span>
                  </div>
                ) : (
                  <div className="mt-0.5 text-[10px] sm:text-xs font-medium text-[var(--text-muted)] truncate">
                    {kpi.change}
                  </div>
                )
              )}
              {isNoData && (
                <div className="mt-0.5 text-[10px] sm:text-xs font-medium text-[var(--text-muted)] truncate">
                  No data
                </div>
              )}
            </div>

            {/* Desktop Info Button */}
            <button
              type="button"
              className="hidden lg:block text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shrink-0 p-1"
              title={kpi.tooltip}
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
