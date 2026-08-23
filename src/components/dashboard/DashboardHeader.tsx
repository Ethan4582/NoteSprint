"use client";

export default function DashboardHeader() {
  return (
    <div className="flex flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <img src="/logo.png" alt="NoteSprint" className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-[var(--border)] shadow-sm shrink-0" />
        <div className="space-y-0.5 min-w-0">
          <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-[var(--accent)]">NoteSprint</p>
          <h1 className="text-[18px] sm:text-[24px] font-black tracking-tight leading-none text-[var(--text-primary)]">
            Master the stack
          </h1>
          <p className="hidden sm:block text-xs text-[var(--text-secondary)] -mt-0.5">Tap a deck to configure — or mix a session</p>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <span className="text-xs px-3 py-2 rounded-full bg-white border border-[var(--border)] shadow-sm text-[var(--text-secondary)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mr-1.5 align-middle" />
          On device
        </span>
      </div>
    </div>
  );
}
