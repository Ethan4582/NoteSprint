import { Terminal, Clock, Cpu } from "lucide-react";

export default function LandingFeatures() {
  return (
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
          <div className="p-7 sm:p-8 rounded-[12px] bg-[var(--bg-base)] border border-[var(--border)] space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Always Have Your Stack With You
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Your growing library of 1,200+ cards lives directly in your browser, ready for quiet morning coffee sessions or quick commute drills.
              </p>
            </div>
            <div className="p-4 rounded-[10px] bg-white border border-[var(--border)] flex items-center gap-3 shadow-xs">
              <div className="p-2 rounded-[8px] bg-blue-50 text-blue-600">
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
          <div className="p-7 sm:p-8 rounded-[12px] bg-[var(--bg-base)] border border-[var(--border)] space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Your Own Distraction-Free Space
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Enjoy a warm, clean light interface with no popups, no ads, and zero account clutter — just pure engineering knowledge.
              </p>
            </div>
            <div className="p-4 rounded-[10px] bg-white border border-[var(--border)] flex items-center justify-between shadow-xs text-xs font-semibold">
              <span className="text-[var(--text-secondary)]">Typography & Rhythm</span>
              <span className="text-[var(--accent)] font-mono font-bold">100% Warm Light Mode</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-7 sm:p-8 rounded-[12px] bg-[var(--bg-base)] border border-[var(--border)] space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Build a Daily Recall Ritual
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Track completed sessions, set custom question counts, and enjoy steady progress without artificial pressure.
              </p>
            </div>
            <div className="p-4 rounded-[10px] bg-white border border-[var(--border)] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-amber-500" />
                <span className="text-xs font-bold text-[var(--text-primary)]">Daily Session Goal</span>
              </div>
              <span className="text-xs font-mono font-extrabold text-[var(--accent)]">5-10 min</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-7 sm:p-8 rounded-[12px] bg-[var(--bg-base)] border border-[var(--border)] space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                System Design Deep Dives
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Go beyond trivia with comprehensive technical articles breaking down real-world distributed architectures.
              </p>
            </div>
            <div className="p-4 rounded-[10px] bg-white border border-[var(--border)] flex items-center gap-3 shadow-xs">
              <div className="p-2 rounded-[8px] bg-purple-50 text-purple-600">
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
  );
}
