"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/src/components/ui/chart";
import { BookOpen } from "lucide-react";
import type { StudyActivityPoint } from "./types";

const chartConfig = {
  flashcardSessions: {
    label: "Flashcard Sessions",
    color: "var(--accent)",
  },
  articleReads: {
    label: "System Design Reads",
    color: "#a855f7",
  },
} satisfies ChartConfig;

export default function StudyActivityChart({
  data,
}: {
  data: StudyActivityPoint[];
}) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-5 shadow-sm space-y-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-md bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-tight text-[var(--text-primary)]">
              Study Sessions vs. Article Reads
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Practice drills vs. System design deep-dives
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-xs bg-[var(--accent)]" />
            <span className="text-[var(--text-secondary)]">Flashcards</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-xs bg-[#a855f7]" />
            <span className="text-[var(--text-secondary)]">System Design</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Canvas */}
      <ChartContainer config={chartConfig} className="h-64 w-full">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
          <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
          <Bar dataKey="flashcardSessions" fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={20} />
          <Bar dataKey="articleReads" fill="#a855f7" radius={[4, 4, 0, 0]} maxBarSize={20} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
