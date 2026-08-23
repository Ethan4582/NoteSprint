"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Laptop } from "lucide-react";
import type { DeviceData } from "./types";

export default function DevicePlatformChart({
  devices,
}: {
  devices: DeviceData[];
}) {
  const COLORS = ["var(--accent)", "var(--text-secondary)", "var(--border-strong)"];

  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-5 shadow-sm space-y-4 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-md bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
            <Laptop className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-tight text-[var(--text-primary)]">
              Device & Platform
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Hardware split across clients
            </p>
          </div>
        </div>
      </div>

      {/* Donut Chart with Centered Total */}
      <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-6 py-3 px-2">
        <div className="relative h-48 w-48 sm:h-52 sm:w-52 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={devices}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {devices.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-black text-[var(--text-primary)] font-mono">100%</span>
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3.5 w-full sm:max-w-[210px] flex-1">
          {devices.map((device, idx) => (
            <div key={device.name} className="flex items-center justify-between text-xs pb-1.5 border-b border-[var(--border)]/60 last:border-0">
              <div className="flex items-center gap-2.5">
                <div
                  className="h-3 w-3 rounded-xs shrink-0"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="font-bold text-[var(--text-primary)]">
                  {device.name}
                </span>
              </div>
              <span className="font-mono font-bold text-sm text-[var(--text-primary)]">
                {device.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
