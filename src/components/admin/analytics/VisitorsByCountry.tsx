"use client";

import { Globe } from "lucide-react";
import type { CountryVisitor } from "./types";

export default function VisitorsByCountry({
  countries,
}: {
  countries: CountryVisitor[];
}) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-5 shadow-sm space-y-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <Globe className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-tight text-[var(--text-primary)]">
              Visitors by Country
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Geographic breakdown from edge telemetry
            </p>
          </div>
        </div>
      </div>

      {/* Country Progress List */}
      <div className="space-y-3.5 py-1">
        {countries.map((country) => (
          <div key={country.code} className="space-y-1.5 group">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base select-none" role="img" aria-label={country.name}>
                  {country.flag}
                </span>
                <span className="font-bold text-[var(--text-primary)] truncate">
                  {country.name}
                </span>
              </div>
              <span className="font-mono font-bold text-[var(--text-secondary)] group-hover:text-emerald-500 transition-colors">
                {country.visitors.toLocaleString()}
              </span>
            </div>

            <div className="h-2 w-full rounded-xs bg-[var(--bg-subtle)] overflow-hidden border border-[var(--border)]">
              <div
                className="h-full rounded-xs bg-emerald-500 transition-all duration-500 group-hover:brightness-110"
                style={{ width: `${country.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
