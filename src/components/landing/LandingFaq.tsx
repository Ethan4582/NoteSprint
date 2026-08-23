"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function LandingFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

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

  return (
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
              className="rounded-[10px] bg-white border border-[var(--border)] shadow-xs transition-all overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-serif text-base sm:text-lg font-normal text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
              >
                <span>{faq.q}</span>
                <div className="w-6 h-6 rounded-[6px] bg-[var(--bg-subtle)] flex items-center justify-center shrink-0 text-[var(--text-secondary)]">
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
  );
}
