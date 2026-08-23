import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function LandingFooter() {
  return (
    <>
      {/* Final Invitation Banner */}
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
              href="/library"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[10px] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-[var(--accent)]/20 active:scale-95 transition-all"
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
              className="w-5 h-5 rounded-[4px] object-cover border border-[var(--border)] shadow-xs"
            />
            <span className="font-bold text-[var(--text-primary)]">NoteSprint</span>
            <span>· Crafted for lifelong engineering curiosity.</span>
          </div>
          <div>
            <span>© {new Date().getFullYear()} NoteSprint · Light Mode Design</span>
          </div>
        </div>
      </footer>
    </>
  );
}
