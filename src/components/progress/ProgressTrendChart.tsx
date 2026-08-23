"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";

interface ProgressTrendChartProps {
  trendData: { session: string; accuracy: number; count: number; date: string }[];
}

export default function ProgressTrendChart({ trendData }: ProgressTrendChartProps) {
  if (trendData.length < 2) {
    return (
      <Card className="rounded-[12px] border border-[var(--border)] bg-white shadow-2xs p-6 text-center">
        <div className="max-w-md mx-auto space-y-2">
          <div className="w-10 h-10 rounded-[10px] bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center mx-auto text-[var(--accent)]">
            <TrendingUp size={18} />
          </div>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Score Trend Trajectory</h3>
          <p className="text-xs text-[var(--text-muted)]">
            Complete at least 2 sessions to unlock your accuracy trajectory and performance trends.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-[12px] border border-[var(--border)] bg-white shadow-2xs hover:border-[var(--border-strong)] transition-all">
      <CardHeader className="p-4 sm:p-5 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <TrendingUp size={16} className="text-[var(--accent)]" />
              <span>Session Score Trend</span>
            </CardTitle>
            <CardDescription className="text-xs text-[var(--text-muted)] mt-0.5">
              Accuracy rate (%) across your latest completed drills
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 pt-4">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
              <XAxis
                dataKey="date"
                stroke="var(--text-muted)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--text-muted)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                unit="%"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-2.5 rounded-[8px] bg-white border border-[var(--border-strong)] shadow-md text-xs space-y-1">
                        <p className="font-bold text-[var(--text-primary)]">{data.date}</p>
                        <p className="text-[var(--accent)] font-semibold">
                          Accuracy: {data.accuracy}%
                        </p>
                        <p className="text-[var(--text-muted)] text-[10px]">
                          {data.count} cards reviewed
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="accuracy"
                stroke="var(--accent)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#scoreGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
