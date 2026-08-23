"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, BookOpen } from "lucide-react";

export default function LandingHero() {
  const [activeHeroCard, setActiveHeroCard] = useState<number>(0);

  const heroDecks = [
    {
      title: "JavaScript Closures & Event Loop",
      category: "Frontend",
      count: "24 cards",
      question: "How does the microtask queue differ from the macrotask queue in Node.js & V8?",
      snippet: "Promise callbacks and process.nextTick execute before setTimeout or setInterval callbacks in each tick.",
    },
    {
      title: "Distributed Cache Invalidation",
      category: "System Design",
      count: "18 cards",
      question: "What is the difference between Write-Through and Cache-Aside (Lazy Loading)?",
      snippet: "In Cache-Aside, the application is responsible for reading and writing from storage and cache separately.",
    },
    {
      title: "PostgreSQL B-Tree Indexing",
      category: "Databases",
      count: "32 cards",
      question: "When does Postgres choose a Sequential Scan over a B-Tree Index Scan?",
      snippet: "When the query touches a large percentage of table pages, sequential I/O is faster than random index lookups.",
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 sm:pb-20 text-center space-y-8">
      {/* Category Pill */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[8px] bg-white border border-[var(--border)] shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
        <span className="text-xs font-bold tracking-wide text-[var(--text-secondary)]">
          Curated Dev Practice & Active Recall
        </span>
      </div>

      {/* Editorial Headline */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-normal font-serif tracking-tight leading-[1.08] text-[var(--text-primary)] max-w-4xl mx-auto">
        Your cozy corner <br className="hidden sm:inline" />
        <span className="italic font-serif">for tech mastery</span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed font-normal">
        Find your next technical topic, practice active recall with handcrafted flashcard decks, and master complex system design in a space made for developers.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/library"
          className="w-full sm:w-auto px-8 py-3.5 rounded-[10px] bg-[var(--text-primary)] hover:bg-black text-white text-sm font-bold tracking-wide transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
        >
          <span>Start Practice Session</span>
          <ArrowRight size={16} />
        </Link>
        <Link
          href="/system-design/articles"
          className="w-full sm:w-auto px-6 py-3.5 rounded-[10px] bg-white hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border)] text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2"
        >
          <BookOpen size={16} className="text-[var(--text-muted)]" />
          <span>Read System Design</span>
        </Link>
      </div>

      {/* Interactive Deck Preview Container */}
      <div className="pt-8 sm:pt-12 max-w-xl mx-auto">
        <div className="relative p-6 sm:p-8 rounded-[12px] bg-white border border-[var(--border)] shadow-[0_16px_40px_rgba(0,0,0,0.06)] text-left space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--accent)]">
                {heroDecks[activeHeroCard].category}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-[6px] bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border)]">
                {heroDecks[activeHeroCard].count}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {heroDecks.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveHeroCard(i)}
                  className={`w-2.5 h-2.5 rounded-[3px] transition-all ${
                    activeHeroCard === i ? "bg-[var(--accent)] w-6" : "bg-[var(--border-strong)]"
                  }`}
                  aria-label={`Show card deck ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3 py-2">
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] leading-snug">
              {heroDecks[activeHeroCard].question}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-subtle)] p-3.5 rounded-[8px] border border-[var(--border)]">
              💡 <span className="font-medium">{heroDecks[activeHeroCard].snippet}</span>
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-[var(--text-muted)] font-medium">
              Tap to flip · Spaced recall ready
            </span>
            <Link
              href="/library"
              className="text-xs font-bold text-[var(--accent)] hover:underline flex items-center gap-1"
            >
              <span>Practice this deck</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Counter Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 max-w-3xl mx-auto border-t border-[var(--border)]">
        <div className="space-y-1">
          <div className="text-3xl sm:text-4xl font-normal font-serif text-[var(--text-primary)]">
            1,200<span className="text-[var(--accent)]">+</span>
          </div>
          <p className="text-xs font-medium text-[var(--text-muted)]">Active recall cards & answers</p>
        </div>
        <div className="space-y-1">
          <div className="text-3xl sm:text-4xl font-normal font-serif text-[var(--text-primary)]">
            38<span className="text-[var(--accent)]">+</span>
          </div>
          <p className="text-xs font-medium text-[var(--text-muted)]">Curated tech categories & roadmaps</p>
        </div>
        <div className="space-y-1">
          <div className="text-3xl sm:text-4xl font-normal font-serif text-[var(--text-primary)]">
            100<span className="text-[var(--accent)]">%</span>
          </div>
          <p className="text-xs font-medium text-[var(--text-muted)]">Free, private & offline storage</p>
        </div>
      </div>
    </section>
  );
}
