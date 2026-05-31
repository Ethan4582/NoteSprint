"use client";

import { ArrowLeft } from "lucide-react";
import ThemeToggle from "@/src/components/ThemeToggle";
import { useRouter } from "next/navigation";

export default function PracticeHeader() {
  const router = useRouter();
  
  return (
    <header className="sticky top-0 z-40 bg-raised shadow-raised-crisp border-b border-[var(--border-outer)] px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 bg-raised shadow-raised-crisp border border-[var(--border-strong)] rounded-xl hover:text-[var(--accent)] active:scale-95 transition-all">
          <ArrowLeft className="w-5 h-5 drop-shadow-md" />
        </button>
        <div>
          <h1 className="text-sm sm:text-lg font-black uppercase tracking-widest text-[var(--text-primary)] drop-shadow-md">Practice</h1>
          <p className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-tighter hidden sm:block drop-shadow-[0_0_5px_rgba(255,69,0,0.3)]">Configure your session</p>
        </div>
      </div>
      <div className="bg-raised shadow-raised-crisp p-1.5 sm:p-2 rounded-xl border border-[var(--border-strong)]">
        <ThemeToggle />
      </div>
    </header>
  );
}
