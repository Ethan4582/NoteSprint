"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  Plus,
  Minus,
  Layers,
  BookOpen,
  Bookmark,
  Clock,
  Compass,
  Cpu,
  Database,
  Terminal,
  Zap,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeHeroCard, setActiveHeroCard] = useState<number>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const collections = [
    {
      title: "Core Fundamentals",
      icon: "💎",
      tag: "Computer Science",
      color: "bg-[#FEF9EE] border-[#FDE68A]",
      badgeColor: "bg-[#FEF3C7] text-[#92400E]",
      description:
        "Solidify your understanding of Operating Systems, Computer Networks, DBMS, and Object-Oriented Programming principles.",
      cardCount: "135 Cards",
      link: "/dashboard",
    },
    {
      title: "Backend & Systems",
      icon: "⚔️",
      tag: "Production Stack",
      color: "bg-[#F2F9F4] border-[#BBF7D0]",
      badgeColor: "bg-[#DCFCE7] text-[#166534]",
      description:
        "Master Node.js, Express, PostgreSQL, Redis, Docker, and distributed backend architecture through active recall drills.",
      cardCount: "210 Cards",
      link: "/dashboard",
    },
    {
      title: "System Design HLD & LLD",
      icon: "📖",
      tag: "Architecture",
      color: "bg-[#F8F4FF] border-[#DDD6FE]",
      badgeColor: "bg-[#F3E8FF] text-[#6B21A8]",
      description:
        "Unpack high-scale distributed systems, real-time leaderboard architectures, schema designs, and design patterns.",
      cardCount: "80+ Cards",
      link: "/system-design/articles/music-leaderboard-system-design",
    },
  ];

  const faqs = [
    {
      q: "What is NoteSprint?",
      a: "NoteSprint is a developer study companion and active recall platform. It helps software engineers master computer science fundamentals, backend frameworks, frontend architectures, and system design through curated flashcards and deep-dive technical guides.",
    },
    {
      q: "Do I need to create an account or log in?",
      a: "No account or login required! All your saved bookmarks, session histories, and topic progress stay securely stored inside your browser's local cache. It is 100% private, instant, and works offline.",
    },
    {
      q: "Can I bookmark difficult questions for targeted revision?",
      a: "Yes! Click the bookmark icon on any question across flashcards or reading previews to save it. You can review and launch targeted practice drills exclusively on your saved bookmarks anytime from the Saved tab.",
    },
    {
      q: "What technical topics and languages are covered?",
      a: "NoteSprint includes 38+ engineering roadmaps covering React, Next.js, Node.js, TypeScript, Python, C++, SQL, Database Management, Computer Networks, Operating Systems, Low Level Design (LLD), and High Level System Design (HLD).",
    },
    {
      q: "Is NoteSprint free to use?",
      a: "Yes, NoteSprint is completely free for developers, students, and engineers preparing for technical interviews or sharpening their stack.",
    },
  ];

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
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-sans selection:bg-[var(--accent)] selection:text-white overflow-x-clip">
      {/* 1. Floating Pill Top Navigation (N5 Archetype) */}
      <header className="sticky top-4 z-50 flex justify-center px-4">
        <nav
          aria-label="Main Navigation"
          className="flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-2.5 rounded-xl bg-white/85 backdrop-blur-xl border border-[var(--border)] shadow-[0_8px_30px_rgb(0,0,0,0.06)] max-w-4xl w-full"
        >
          {/* Brand */}
          <Link href="/" className="flex items-center shrink-0" aria-label="NoteSprint Home">
            <Image
              src="/logo.png"
              alt="NoteSprint Logo"
              width={28}
              height={28}
              className="w-7 h-7 rounded-md object-cover border border-[var(--border)] shadow-xs"
            />
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-[var(--text-secondary)]">
            <Link href="/dashboard" className="hover:text-[var(--text-primary)] transition-colors">
              Library
            </Link>
            <Link href="/interview" className="hover:text-[var(--text-primary)] transition-colors">
              Practice Decks
            </Link>
            <Link
              href="/system-design/articles/music-leaderboard-system-design"
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              System Design
            </Link>
            <Link href="/bookmarks" className="hover:text-[var(--text-primary)] transition-colors">
              Saved
            </Link>
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="px-4 py-1.5 rounded-md bg-[var(--text-primary)] hover:bg-black text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Explore Decks</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </nav>
      </header>

      {/* 2. Hero Section — Editorial Elegance & Interactive Deck */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 sm:pb-20 text-center space-y-8">
        {/* Subtle Category Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-white border border-[var(--border)] shadow-xs">
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

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-[var(--text-primary)] hover:bg-black text-white text-sm font-bold tracking-wide transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Start Practice Session</span>
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/system-design/articles/music-leaderboard-system-design"
            className="w-full sm:w-auto px-6 py-3.5 rounded-md bg-white hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border)] text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <BookOpen size={16} className="text-[var(--text-muted)]" />
            <span>Read System Design</span>
          </Link>
        </div>

        {/* Interactive Deck Preview Container */}
        <div className="pt-8 sm:pt-12 max-w-xl mx-auto">
          <div className="relative p-6 sm:p-8 rounded-xl bg-white border border-[var(--border)] shadow-[0_16px_40px_rgb(0,0,0,0.06)] text-left space-y-4">
            {/* Top Deck Tabs */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--accent)]">
                  {heroDecks[activeHeroCard].category}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border)]">
                  {heroDecks[activeHeroCard].count}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {heroDecks.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveHeroCard(i)}
                    className={`w-2.5 h-2.5 rounded-xs transition-all ${
                      activeHeroCard === i ? "bg-[var(--accent)] w-6" : "bg-[var(--border-strong)]"
                    }`}
                    aria-label={`Show card deck ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Main Question & Flip Preview */}
            <div className="space-y-3 py-2">
              <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] leading-snug">
                {heroDecks[activeHeroCard].question}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-subtle)] p-3.5 rounded-md border border-[var(--border)]">
                💡 <span className="font-medium">{heroDecks[activeHeroCard].snippet}</span>
              </p>
            </div>

            {/* Card Footer Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[var(--text-muted)] font-medium">
                Tap to flip · Spaced recall ready
              </span>
              <Link
                href="/dashboard"
                className="text-xs font-bold text-[var(--accent)] hover:underline flex items-center gap-1"
              >
                <span>Practice this deck</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* Minimalist Divider Ornament */}
        <div className="flex items-center justify-center gap-3 pt-12 pb-4 text-[var(--text-muted)] opacity-60">
          <span>—</span>
          <span className="text-xs">✦</span>
          <span className="text-xs font-serif">❖</span>
          <span className="text-xs">✦</span>
          <span>—</span>
        </div>

        {/* Mission Statement */}
        <p className="text-xl sm:text-2xl font-normal font-serif text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
          Build mindful study habits, discover architecture stories, and retain deep engineering concepts in one place. Whether seasoned or new, NoteSprint keeps your curiosity connected.
        </p>

        {/* 3 Stats Highlight Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 max-w-3xl mx-auto border-t border-[var(--border)]">
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

      {/* 3. Curated Collections Section (Inspired by Image 2) */}
      <section className="py-16 sm:py-24 bg-white border-y border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12 text-center">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal font-serif tracking-tight text-[var(--text-primary)]">
              Curated Collections
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-xl mx-auto">
              Hand-picked themes to match your tech stack, spark your curiosity, and guide your next interview prep.
            </p>
          </div>

          {/* Collections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {collections.map((col, idx) => (
              <div
                key={idx}
                className={`rounded-xl p-6 sm:p-7 border ${col.color} flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{col.icon}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${col.badgeColor}`}>
                      {col.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">
                      {col.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                      {col.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-black/5">
                  <span className="text-xs font-bold text-[var(--text-muted)] font-mono">
                    {col.cardCount}
                  </span>
                  <Link
                    href={col.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                  >
                    <span>Explore</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. "Your journey begins here" 3-Step Flow (Inspired by Image 4) */}
      <section className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6 space-y-12 text-center">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal font-serif tracking-tight text-[var(--text-primary)]">
            Your journey begins here
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-lg mx-auto">
            Flip cards, find weak spots, and make technical review your favorite daily ritual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Step 1 */}
          <div className="p-6 sm:p-8 rounded-xl bg-white border border-[var(--border)] shadow-sm space-y-4">
            <div className="w-8 h-8 rounded-md bg-[var(--accent)] text-white font-bold text-xs flex items-center justify-center shadow-xs">
              1
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Explore & pick your topic
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Browse 38+ programming languages, backend frameworks, databases, and system design roadmaps.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 sm:p-8 rounded-xl bg-white border border-[var(--border)] shadow-sm space-y-4">
            <div className="w-8 h-8 rounded-md bg-[var(--text-primary)] text-white font-bold text-xs flex items-center justify-center shadow-xs">
              2
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Active recall drills
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Test your recall on conceptual interview questions with instant flip reveals and timed session modes.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 sm:p-8 rounded-xl bg-white border border-[var(--border)] shadow-sm space-y-4">
            <div className="w-8 h-8 rounded-md bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/30 font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Save & master weak spots
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Bookmark tricky questions to automatically compile customized decks for rapid pre-interview revision.
            </p>
          </div>
        </div>
      </section>

      {/* 5. "Designed to Make Learning Feel Magical" 2x2 Bento (Inspired by Image 3) */}
      <section className="py-16 sm:py-24 bg-white border-y border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12 text-center">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal font-serif tracking-tight text-[var(--text-primary)]">
              Designed to Make Learning Feel Magical
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-xl mx-auto">
              From crisp typography to instant local bookmarks — every detail is crafted to keep you focused and immersed in your engineering journey.
            </p>
          </div>

          {/* 2x2 Feature Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Card 1 */}
            <div className="p-7 sm:p-8 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  Always Have Your Stack With You
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Your growing library of 1,200+ cards lives directly in your browser, ready for quiet morning coffee sessions or quick commute drills.
                </p>
              </div>
              <div className="p-4 rounded-md bg-white border border-[var(--border)] flex items-center gap-3 shadow-xs">
                <div className="p-2 rounded-md bg-blue-50 text-blue-600">
                  <Terminal size={18} />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-[var(--text-primary)] block truncate">
                    Node.js & Async I/O Core
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">57 questions available</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-7 sm:p-8 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  Your Own Distraction-Free Space
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Enjoy a warm, clean light interface with no popups, no ads, and zero account clutter — just pure engineering knowledge.
                </p>
              </div>
              <div className="p-4 rounded-md bg-white border border-[var(--border)] flex items-center justify-between shadow-xs text-xs font-semibold">
                <span className="text-[var(--text-secondary)]">Typography & Rhythm</span>
                <span className="text-[var(--accent)] font-mono font-bold">100% Warm Light Mode</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-7 sm:p-8 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  Build a Daily Recall Ritual
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Track completed sessions, set custom question counts, and enjoy steady progress without artificial pressure.
                </p>
              </div>
              <div className="p-4 rounded-md bg-white border border-[var(--border)] flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-amber-500" />
                  <span className="text-xs font-bold text-[var(--text-primary)]">Daily Session Goal</span>
                </div>
                <span className="text-xs font-mono font-extrabold text-[var(--accent)]">5-10 min</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-7 sm:p-8 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  System Design Deep Dives
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Go beyond trivia with comprehensive technical articles breaking down real-world distributed architectures.
                </p>
              </div>
              <div className="p-4 rounded-md bg-white border border-[var(--border)] flex items-center gap-3 shadow-xs">
                <div className="p-2 rounded-md bg-purple-50 text-purple-600">
                  <Cpu size={18} />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-[var(--text-primary)] block truncate">
                    Music Leaderboard System Architecture
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">Redis Sorted Sets · DynamoDB · 12 min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. "Curious minds welcome" FAQ Accordion (Inspired by Image 1) */}
      <section className="py-16 sm:py-24 max-w-3xl mx-auto px-4 sm:px-6 space-y-10 text-center">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal font-serif tracking-tight text-[var(--text-primary)]">
            Curious minds welcome
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-md mx-auto">
            Get to know how NoteSprint works, what makes it special, and how to make the most of your study rituals.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-lg bg-white border border-[var(--border)] shadow-xs transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-serif text-base sm:text-lg font-normal text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                >
                  <span>{faq.q}</span>
                  <div className="w-6 h-6 rounded-md bg-[var(--bg-subtle)] flex items-center justify-center shrink-0 text-[var(--text-secondary)]">
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border)] pt-3 font-sans font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Final Invitation Banner & Minimal Footer */}
      <section className="py-16 sm:py-20 bg-white border-t border-[var(--border)] text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-normal font-serif tracking-tight text-[var(--text-primary)]">
            Ready to master your tech stack?
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md mx-auto">
            Start a quick 5-minute drill right now. No sign up or setup required.
          </p>
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-md bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-[var(--accent)]/20 active:scale-95 transition-all"
            >
              <span>Explore Library</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--bg-base)] py-8 text-center text-[11px] text-[var(--text-muted)] font-medium">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="NoteSprint Logo"
              width={20}
              height={20}
              className="w-5 h-5 rounded-md object-cover border border-[var(--border)] shadow-xs"
            />
            <span className="font-bold text-[var(--text-primary)]">NoteSprint</span>
            <span>· Crafted for lifelong engineering curiosity.</span>
          </div>
          <div>
            <span>© {new Date().getFullYear()} NoteSprint · Light Mode Design</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
