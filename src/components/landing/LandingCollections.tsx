"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingCollections() {
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
      link: "/library",
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
      link: "/library",
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
      link: "/system-design/articles",
    },
  ];

  return (
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
              className={`rounded-[12px] p-6 sm:p-7 border ${col.color} flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{col.icon}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[6px] ${col.badgeColor}`}>
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
  );
}
