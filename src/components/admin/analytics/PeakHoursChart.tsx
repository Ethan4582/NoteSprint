"use client";

import {
  Bar,
  BarChart,
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
import { Clock } from "lucide-react";
import type { PeakHourData } from "./types";

const chartConfig = {
  activity: {
    label: "Hourly Requests",
    color: "var(--accent)",
  },
} satisfies ChartConfig;

export default function PeakHoursChart({
  peakHours,
}: {
  peakHours: PeakHourData[];
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-strong)] bg-raised p-5 shadow-raised-crisp space-y-4 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-tight text-[var(--text-primary)]">
              Activity Peak Hours (UTC)
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Hourly request distribution pattern
            </p>
          </div>
        </div>
      </div>

      {/* 24h Bar Chart */}
      <div className="flex-1 flex items-center w-full min-h-[180px]">
        <ChartContainer config={chartConfig} className="h-44 sm:h-52 w-full">
          <BarChart data={peakHours} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              tick={{ fill: "var(--text-muted)", fontSize: 10 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              tick={{ fill: "var(--text-muted)", fontSize: 10 }}
              tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val)}
            />
            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
            <Bar dataKey="activity" fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={18} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
