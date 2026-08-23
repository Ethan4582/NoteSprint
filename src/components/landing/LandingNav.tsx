"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function LandingNav() {
  return (
    <header className="sticky top-4 z-50 flex justify-center px-4">
      <nav
        aria-label="Main Navigation"
        className="flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-2.5 rounded-[12px] bg-white/85 backdrop-blur-xl border border-[var(--border)] shadow-[0_4px_20px_rgba(0,0,0,0.06)] max-w-4xl w-full"
      >
        {/* Brand */}
        <Link href="/" className="flex items-center shrink-0" aria-label="NoteSprint Home">
          <Image
            src="/logo.png"
            alt="NoteSprint Logo"
            width={28}
            height={28}
            className="w-7 h-7 rounded-[8px] object-cover border border-[var(--border)] shadow-xs"
          />
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-[var(--text-secondary)]">
          <Link href="/library" className="hover:text-[var(--text-primary)] transition-colors">
            Library
          </Link>
          <Link href="/interview" className="hover:text-[var(--text-primary)] transition-colors">
            Interview Drills
          </Link>
          <Link
            href="/system-design/articles"
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
            href="/library"
            className="px-4 py-1.5 rounded-[8px] bg-[var(--text-primary)] hover:bg-black text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>Explore Decks</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </nav>
    </header>
  );
}
