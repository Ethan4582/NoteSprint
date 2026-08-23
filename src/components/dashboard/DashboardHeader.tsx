"use client";

export default function DashboardHeader() {
  return (
    <div className="flex flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <img
          src="/logo.png"
          alt="NoteSprint"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-md object-cover border border-[var(--border)] shadow-xs shrink-0"
        />
        <div className="space-y-0.5 min-w-0">
          <p className="text-[11px] font-extrabold tracking-wider uppercase text-[var(--accent)]">
            Active Recall Library
          </p>
          <h1 className="text-2xl sm:text-3xl font-normal font-serif tracking-tight text-[var(--text-primary)]">
            Master the Stack
          </h1>
          <p className="hidden sm:block text-xs text-[var(--text-secondary)]">
            Tap any deck to start a drill — or select multiple to mix a custom session.
          </p>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <span className="text-xs px-3.5 py-1.5 rounded-md bg-white border border-[var(--border)] shadow-xs text-[var(--text-secondary)] font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1.5 align-middle animate-pulse" />
          Offline Ready
        </span>
      </div>
    </div>
  );
}
