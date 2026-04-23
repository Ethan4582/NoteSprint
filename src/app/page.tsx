"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "@/src/components/ThemeToggle";

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col p-4 sm:p-8">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-[2px] z-50">
          <div className="h-full bg-[var(--accent)] animate-[loading_1s_ease-in-out_infinite]" />
        </div>
      )}
      
      <header className="flex justify-end mb-32">
        <ThemeToggle />
      </header>

      <main className="max-w-[720px] mx-auto w-full flex flex-col items-start gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
          PrepFlash
        </h1>
        <p className="text-base text-[var(--text-muted)] max-w-xs">
          Study smarter with active recall. 
          A minimalist tool for mastering technical concepts.
        </p>
        
        <button
          onClick={handleStart}
          className="mt-8 px-6 h-10 bg-[var(--accent)] text-white font-medium rounded-[6px] hover:bg-[var(--accent-hover)] transition-all flex items-center gap-2 group"
        >
          Get Started 
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
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
