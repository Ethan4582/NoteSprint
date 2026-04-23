"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface FinishedViewProps {
  stats: {
    total: number;
    correct: number;
    incorrect: number;
    accuracy: number;
  };
}

export default function FinishedView({ stats }: FinishedViewProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[400px] bg-[var(--bg-surface)] border border-[var(--border)] rounded-[12px] p-6 shadow-sm text-center space-y-6"
      >
        <div className="space-y-2">
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Session Complete</h1>
          <div className="text-4xl font-bold text-[var(--accent)]">{stats.accuracy}%</div>
          <div className="w-full h-2 bg-[var(--bg-subtle)] rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-[var(--accent)] transition-all duration-500 rounded-full"
              style={{ width: `${stats.accuracy}%` }}
            />
          </div>
          <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mt-2">Accuracy</p>
        </div>

        <div className="grid grid-cols-3 gap-4 py-4 border-y border-[var(--border)]">
          <div>
            <div className="text-base font-semibold">{stats.total}</div>
            <div className="text-[10px] text-[var(--text-muted)] uppercase">Total</div>
          </div>
          <div>
            <div className="text-base font-semibold text-[var(--success)]">{stats.correct}</div>
            <div className="text-[10px] text-[var(--text-muted)] uppercase">Correct</div>
          </div>
          <div>
            <div className="text-base font-semibold text-[var(--error)]">{stats.incorrect}</div>
            <div className="text-[10px] text-[var(--text-muted)] uppercase">Wrong</div>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full h-10 bg-[var(--accent)] text-white text-sm font-semibold rounded-[8px] hover:bg-[var(--accent-hover)] transition-all shadow-sm"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full h-10 bg-[var(--bg-subtle)] text-[var(--text-primary)] text-sm font-semibold rounded-[8px] hover:bg-[var(--border)] transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
