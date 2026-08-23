"use client";

import { useState } from "react";
import { TrendingUp, Calendar as CalendarIcon, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import type { TimeRange } from "./types";
import { cn } from "@/src/lib/utils";

const RANGES: { id: TimeRange; label: string }[] = [
  { id: "1H", label: "1H" },
  { id: "24H", label: "24H" },
  { id: "7D", label: "7D" },
  { id: "30D", label: "30D" },
  { id: "90D", label: "90D" },
];

export default function AnalyticsHeader({
  activeRange,
  onSelectRange,
  onSelectCustomRange,
}: {
  activeRange: TimeRange;
  onSelectRange: (range: TimeRange) => void;
  onSelectCustomRange?: (start: string, end: string) => void;
}) {
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const handleApplyCustom = () => {
    setIsCustomOpen(false);
    onSelectRange("custom");
    if (onSelectCustomRange) {
      onSelectCustomRange(startDate, endDate);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-md bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/20 shadow-xs">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-normal font-serif tracking-tight text-[var(--text-primary)]">
            Analytics & Telemetry
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-medium">
            Real-time Cloudflare edge metrics & learner activity.
          </p>
        </div>
      </div>

      {/* Range Pills Filter */}
      <div className="flex items-center gap-1.5 p-1 rounded-md bg-white border border-[var(--border)] shadow-xs self-start sm:self-auto overflow-x-auto max-w-full">
        {RANGES.map((range) => {
          const isActive = activeRange === range.id;
          return (
            <button
              key={range.id}
              type="button"
              onClick={() => onSelectRange(range.id)}
              className={cn(
                "px-3.5 py-1.5 rounded text-xs font-bold transition-all shrink-0",
                isActive
                  ? "bg-[var(--text-primary)] text-white shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
              )}
            >
              {range.label}
            </button>
          );
        })}

        {/* Custom Range Popover */}
        <Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-bold transition-all shrink-0 cursor-pointer",
                activeRange === "custom"
                  ? "bg-[var(--text-primary)] text-white shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
              )}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>Custom</span>
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 p-4 bg-white border border-[var(--border)] shadow-2xl rounded-md space-y-3.5">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[var(--text-primary)]">Custom Date Horizon</h4>
              <p className="text-[11px] text-[var(--text-muted)]">Select timeframe range</p>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[var(--text-secondary)] block mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] text-xs text-[var(--text-primary)] font-mono outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--text-secondary)] block mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] text-xs text-[var(--text-primary)] font-mono outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleApplyCustom}
              className="w-full py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold text-xs rounded-md flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Check className="h-3.5 w-3.5" />
              Apply Range
            </button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
