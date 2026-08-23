"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/src/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/src/components/ui/dropdown-menu";
import { LineChart as LineChartIcon, ChevronDown, Check } from "lucide-react";
import type { VisitorTrendPoint } from "./types";
import { cn } from "@/src/lib/utils";

const chartConfig = {
  visitors: {
    label: "Unique Visitors",
    color: "var(--accent)",
  },
  pageviews: {
    label: "Pageviews",
    color: "#a855f7",
  },
  sessions: {
    label: "Study Sessions",
    color: "#10b981",
  },
} satisfies ChartConfig;

export default function VisitorsComparisonChart({
  data,
}: {
  data: VisitorTrendPoint[];
}) {
  const [selectedMetrics, setSelectedMetrics] = useState<{
    visitors: boolean;
    pageviews: boolean;
    sessions: boolean;
  }>({
    visitors: true,
    pageviews: true,
    sessions: false,
  });

  const toggleMetric = (key: keyof typeof selectedMetrics) => {
    setSelectedMetrics((prev) => {
      const activeCount = Object.values(prev).filter(Boolean).length;
      // Prevent unselecting all metrics
      if (prev[key] && activeCount === 1) return prev;
      return { ...prev, [key]: !prev[key] };
    });
  };

  const activeLabels = [
    selectedMetrics.visitors && "Visitors",
    selectedMetrics.pageviews && "Pageviews",
    selectedMetrics.sessions && "Sessions",
  ].filter(Boolean).join(" & ");

  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-5 shadow-sm space-y-4">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-md bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
            <LineChartIcon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-tight text-[var(--text-primary)]">
              Visitors Over Time & Growth
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Interactive trend metrics across selected timeframe
            </p>
          </div>
        </div>

        {/* Multi-Metric Selection Dropdown with Checkboxes */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-8 px-3 rounded-md border border-[var(--border-strong)] bg-[var(--bg-subtle)] text-xs font-bold text-[var(--text-primary)] flex items-center justify-between gap-2 transition-all self-start sm:self-auto shadow-sm"
            >
              <span>{activeLabels || "Select Metrics"}</span>
              <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 p-1.5 bg-[var(--bg-surface)] border border-[var(--border-strong)] shadow-xl rounded-md">
            <DropdownMenuLabel className="text-[11px] font-bold text-[var(--text-muted)] px-2 py-1 uppercase tracking-wider">
              Toggle Displayed Metrics
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[var(--border)] my-1" />
            
            <DropdownMenuCheckboxItem
              checked={selectedMetrics.visitors}
              onCheckedChange={() => toggleMetric("visitors")}
              className="text-xs font-semibold cursor-pointer py-1.5 focus:bg-[var(--bg-subtle)] focus:text-[var(--text-primary)] rounded"
            >
              Unique Visitors
            </DropdownMenuCheckboxItem>

            <DropdownMenuCheckboxItem
              checked={selectedMetrics.pageviews}
              onCheckedChange={() => toggleMetric("pageviews")}
              className="text-xs font-semibold cursor-pointer py-1.5 focus:bg-[var(--bg-subtle)] focus:text-[var(--text-primary)] rounded"
            >
              Pageviews
            </DropdownMenuCheckboxItem>

            <DropdownMenuCheckboxItem
              checked={selectedMetrics.sessions}
              onCheckedChange={() => toggleMetric("sessions")}
              className="text-xs font-semibold cursor-pointer py-1.5 focus:bg-[var(--bg-subtle)] focus:text-[var(--text-primary)] rounded"
            >
              Study Sessions
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Chart Canvas */}
      <ChartContainer config={chartConfig} className="h-64 sm:h-72 w-full">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gradientVisitors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="gradientPageviews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="gradientSessions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val)}
          />

          <ChartTooltip content={<ChartTooltipContent />} />

          {selectedMetrics.pageviews && (
            <Area
              type="monotone"
              dataKey="pageviews"
              stroke="#a855f7"
              strokeWidth={2.5}
              fill="url(#gradientPageviews)"
              dot={{ r: 3.5, fill: "#a855f7" }}
              activeDot={{ r: 5.5 }}
            />
          )}

          {selectedMetrics.sessions && (
            <Area
              type="monotone"
              dataKey="sessions"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#gradientSessions)"
              dot={{ r: 3.5, fill: "#10b981" }}
              activeDot={{ r: 5.5 }}
            />
          )}

          {selectedMetrics.visitors && (
            <Area
              type="monotone"
              dataKey="visitors"
              stroke="var(--accent)"
              strokeWidth={2.5}
              fill="url(#gradientVisitors)"
              dot={{ r: 3.5, fill: "var(--accent)" }}
              activeDot={{ r: 6 }}
            />
          )}
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
