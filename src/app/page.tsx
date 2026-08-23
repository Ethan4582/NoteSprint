"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles, ArrowRight, Layers, Clock3, Bookmark } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => router.push("/dashboard"), 600);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col font-sans overflow-x-clip">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-[3px] z-50 bg-[var(--bg-subtle)] overflow-hidden">
          <div className="h-full w-[45%] bg-[var(--accent)] animate-[slide_1s_ease_infinite]" />
        </div>
      )}

      {/* Header — minimal, matches dashboard header rhythm */}
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-[var(--bg-base)]/80 border-b border-[var(--border)]">
        <div className="max-w-[1120px] mx-auto w-full px-4 sm:px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="NoteSprint" className="w-9 h-9 rounded-xl object-cover shadow-sm border border-[var(--border)]" />
            <span className="text-[15px] font-extrabold tracking-tight text-[var(--text-primary)]">
              Note<span className="text-[var(--accent)]">Sprint</span>
            </span>
            <span className="hidden sm:inline-flex text-[10px] font-black tracking-[0.18em] uppercase px-2 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-secondary)]">
              Dev mastery
            </span>
          </div>
          <button
            onClick={handleStart}
            className="hidden sm:inline-flex items-center gap-2 text-xs font-bold tracking-wide px-4 py-2 rounded-full bg-white border border-[var(--border)] shadow-sm text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-subtle)] transition-colors"
          >
            Open decks <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* Hero — split editorial, mobile-first stack */}
      <main className="flex-1 flex flex-col">
        <section className="max-w-[1120px] mx-auto w-full px-4 sm:px-6 pt-8 sm:pt-12 pb-8 sm:pb-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 sm:gap-10 items-center">
          {/* Copy */}
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[var(--border)] shadow-sm">
              <span className="p-1 rounded-full bg-[var(--accent-soft)] border border-[var(--accent-border)] text-[var(--accent)]">
                <Sparkles size={12} />
              </span>
              <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--text-secondary)]">
                Curated for developers
              </span>
              <span className="hidden sm:inline text-[11px] text-[var(--text-faint)]">• Active recall • System design • Decks</span>
            </div>

            <h1 className="mt-5 text-[34px] sm:text-[48px] font-black tracking-[-0.03em] leading-[0.95] text-[var(--text-primary)]">
              Master tech
              <br />
              concepts <span className="text-[var(--accent)]">at lightning speed</span>
            </h1>

            <p className="mt-4 text-[16px] sm:text-[18px] leading-relaxed text-[var(--text-secondary)] max-w-[52ch]">
              Your personal study companion. Flip through handcrafted decks, revisit with spaced recall,
              and keep sharp for interviews — offline, no accounts needed.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleStart}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[var(--text-primary)] text-white text-sm font-bold tracking-wide shadow-[0_8px_24px_rgba(28,25,23,0.14)] hover:translate-y-[-1px] active:translate-y-[0px] transition-all"
              >
                Start practicing <ArrowRight size={16} />
              </button>
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-[var(--border)] shadow-sm">
                  <Layers size={14} className="text-[var(--text-secondary)]" /> 1200+ cards
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-[var(--border)] shadow-sm">
                  <Clock3 size={14} className="text-[var(--text-secondary)]" /> 5-min sessions
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-[var(--border)] shadow-sm">
                  <Bookmark size={14} className="text-[var(--text-secondary)]" /> Saves stay local
                </span>
              </div>
            </div>

            <p className="mt-3 text-[11px] font-medium tracking-wide text-[var(--text-faint)]">
              Works offline · Progress stored on device · No sign-up
            </p>
          </div>

          {/* Deck stack — Tier A CSS art, no fake phone chrome */}
          <div className="relative lg:pl-6">
            <div className="relative mx-auto w-full max-w-[380px] aspect-[4/3.2] sm:aspect-[4/3] lg:aspect-[4/3.4]">
              {/* soft backdrop blob like refs */}
              <div className="absolute -inset-6 sm:-inset-8 -z-10 rounded-[32px] bg-[var(--bg-subtle)] border border-[var(--border)] opacity-60" />
              <div className="absolute -top-3 -right-3 w-20 h-20 rounded-2xl bg-[var(--card-yellow)] border border-[var(--card-yellow-border)] hidden sm:block" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-2xl bg-[var(--card-green)] border border-[var(--card-green-border)] hidden sm:block" />

              {/* back card */}
              <div className="absolute left-[8%] right-[10%] top-[10%] bottom-[14%] rounded-[20px] bg-[var(--card-purple)] border border-[var(--card-purple-border)] shadow-[var(--shadow-soft)] rotate-[-4deg]" >
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-widest uppercase text-[var(--text-muted)]">System design</span>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-white border border-[var(--border)]">HLD</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 h-2 rounded-full bg-white/80 border border-black/5" />
              </div>
              {/* middle card */}
              <div className="absolute left-[4%] right-[6%] top-[6%] bottom-[10%] rounded-[22px] bg-[var(--card-blue)] border border-[var(--card-blue-border)] shadow-[var(--shadow-card)] rotate-[2deg]">
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-white border border-[var(--border)] flex items-center justify-center text-xs">✦</span>
                  <span className="text-[11px] font-bold tracking-wide text-[var(--text-secondary)]">React • 42 cards</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                  <span className="h-6 flex-1 rounded-full bg-white border border-[var(--border)]" />
                  <span className="h-6 w-20 rounded-full bg-[var(--accent)] border border-[var(--accent)]" />
                </div>
              </div>
              {/* front card — main */}
              <div className="absolute inset-[0%] rounded-[24px] bg-white border border-[var(--border-strong)] shadow-[var(--shadow-raised)] p-4 sm:p-5 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black tracking-[0.14em] uppercase text-[var(--accent)]">Today&apos;s deck</span>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[var(--accent-soft)] border border-[var(--accent-border)] text-[var(--accent)]">12 min</span>
                </div>
                <h3 className="mt-3 text-[18px] font-extrabold tracking-tight leading-tight text-[var(--text-primary)]">
                  JavaScript <span className="font-semibold text-[var(--text-secondary)]">— closures & event loop</span>
                </h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[var(--card-yellow)] border border-[var(--card-yellow-border)]">Interview</span>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border)]">Frontend</span>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border)]">20 cards</span>
                </div>
                <div className="mt-auto pt-4 flex items-center gap-3">
                  <div className="flex -space-x-1.5">
                    <span className="w-7 h-7 rounded-full bg-[var(--card-green)] border-2 border-white grid place-items-center text-[11px]">◆</span>
                    <span className="w-7 h-7 rounded-full bg-[var(--card-blue)] border-2 border-white grid place-items-center text-[11px]">●</span>
                    <span className="w-7 h-7 rounded-full bg-[var(--card-pink)] border-2 border-white grid place-items-center text-[11px]">✶</span>
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">+ on this device</span>
                  <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-[var(--text-primary)] text-white">
                    Continue <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-5 flex items-center justify-center gap-2 text-[11px] text-[var(--text-muted)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" /> Recently viewed syncs locally
            </div>
          </div>
        </section>

        {/* Value strip */}
        <section className="border-y border-[var(--border)] bg-white/70 backdrop-blur">
          <div className="max-w-[1120px] mx-auto w-full px-4 sm:px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-[var(--card-yellow)] border border-[var(--card-yellow-border)] grid place-items-center">◐</span>
              <span className="text-[var(--text-secondary)]"><b className="font-bold text-[var(--text-primary)]">Warm, distraction-free</b> — paper texture, soft cards</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-[var(--card-green)] border border-[var(--card-green-border)] grid place-items-center">◎</span>
              <span className="text-[var(--text-secondary)]"><b className="font-bold text-[var(--text-primary)]">Mobile-first</b> — bottom deck switcher, thumb-friendly</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-[var(--card-blue)] border border-[var(--card-blue-border)] grid place-items-center">⬡</span>
              <span className="text-[var(--text-secondary)]"><b className="font-bold text-[var(--text-primary)]">Premium everywhere</b> — web or phone, same system</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-[var(--border)] bg-[var(--bg-surface)]">
        <div className="max-w-[1120px] mx-auto w-full px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] tracking-wide text-[var(--text-muted)]">
          <span>© {new Date().getFullYear()} NoteSprint · Study offline, own your progress.</span>
          <span className="opacity-70">Light-mode only · No dark mode</span>
        </div>
      </footer>

      <style>{`@keyframes slide { 0% { transform: translateX(-100%); } 50% { transform: translateX(180%); } 100% { transform: translateX(180%); } }`}</style>
    </div>
  );
}
