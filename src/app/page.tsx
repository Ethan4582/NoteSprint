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
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--accent)]/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#8B5CF6]/10 blur-[100px] rounded-full pointer-events-none" />

      {loading && (
        <div className="absolute top-0 left-0 w-full h-[3px] z-50">
          <div className="h-full bg-[var(--accent)] animate-[loading_1s_ease-in-out_infinite]" />
        </div>
      )}
      
      <header className="flex justify-end p-6 z-10 relative">
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10 relative mt-[-10vh]">
        <div className="mb-8 relative group">
          <div className="absolute inset-0 bg-[var(--accent)] blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity" />
          <img src="/logo.png" className="w-20 h-20 relative z-10 drop-shadow-2xl" alt="Note Sprints Logo" />
        </div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-[var(--bg-surface)] text-[var(--text-secondary)] text-[11px] font-semibold tracking-widest shadow-sm mb-6 border border-[var(--border)] uppercase">
          <Sparkles className="w-3 h-3 text-[var(--accent)]" />
          <span>Curated for Developers</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-5 max-w-[600px] leading-tight">
          Master Tech Concepts <br className="hidden sm:block" /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[#8B5CF6]">At Lightning Speed</span>
        </h1>
        
        <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-[500px] mb-10 leading-relaxed">
          Your personal study companion. Use active recall to memorize programming languages, system design, and more.
        </p>
        
        <button
          onClick={handleStart}
          className="px-6 py-3 bg-[var(--accent)] text-white text-sm font-semibold rounded-[8px] hover:bg-[var(--accent-hover)] transition-all flex items-center gap-2 active:scale-95 shadow-sm"
        >
          Start Practicing
          <ArrowRight className="w-4 h-4" />
        </button>
      </main>

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
