"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "@/src/components/ThemeToggle";
import { Sparkles, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col relative overflow-hidden font-sans">
      {/* Loading Bar */}
      {loading && (
        <div className="absolute top-0 left-0 w-full h-1 z-50 shadow-inset-cavity bg-[var(--bg-subtle)]">
          <div className="h-full bg-[var(--accent)] animate-[loading_1s_ease-in-out_infinite] shadow-[0_0_8px_rgba(255,69,0,0.6)]" />
        </div>
      )}
      
      {/* Header */}
      <header className="flex justify-end p-6 z-10 relative">
        <div className="bg-raised shadow-raised-crisp p-2 rounded-2xl border border-[var(--border-strong)]">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10 relative mt-[-5vh]">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-subtle)] shadow-inset-cavity border border-[var(--border-inner)] mb-8">
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent)] drop-shadow-md" />
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[var(--text-secondary)] drop-shadow-md">Curated for Developers</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[var(--text-primary)] mb-6 max-w-[800px] leading-tight drop-shadow-lg">
          Master Tech Concepts <br className="hidden sm:block" /> 
          <span className="text-[var(--accent)] drop-shadow-[0_0_10px_rgba(255,69,0,0.3)]">At Lightning Speed</span>
        </h1>
        
        <p className="text-base sm:text-xl font-medium text-[var(--text-secondary)] max-w-[600px] mb-12 leading-relaxed drop-shadow-md">
          Your personal study companion. Use active recall to memorize programming languages, system design, and more.
        </p>
        
        <button
          onClick={handleStart}
          className="px-8 py-4 bg-raised shadow-raised-crisp border border-[var(--border-strong)] text-[var(--accent)] text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:text-[var(--accent-hover)] transition-all flex items-center justify-center gap-3 active:scale-95 w-full sm:w-auto drop-shadow-[0_0_8px_rgba(255,69,0,0.4)]"
        >
          <span>Start Practicing</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </main>

      {/* Footer Section */}
      <footer className="w-full p-6 text-center z-10 relative border-t border-[var(--border-outer)] bg-[var(--bg-subtle)] shadow-inset-cavity">
        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] drop-shadow-md">
          &copy; {new Date().getFullYear()} Note Sprints. All rights reserved.
        </p>
      </footer>

      <style jsx global>{`
        @keyframes loading {
          0% { width: 0; left: 0; }
          50% { width: 70%; left: 15%; }
          100% { width: 0; left: 100%; }
        }
      `}</style>
    </div>
  );
}
