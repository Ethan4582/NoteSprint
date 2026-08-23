export default function LandingJourney() {
  return (
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
        <div className="p-6 sm:p-8 rounded-[12px] bg-white border border-[var(--border)] shadow-sm space-y-4">
          <div className="w-8 h-8 rounded-[8px] bg-[var(--accent)] text-white font-bold text-xs flex items-center justify-center shadow-xs">
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
        <div className="p-6 sm:p-8 rounded-[12px] bg-white border border-[var(--border)] shadow-sm space-y-4">
          <div className="w-8 h-8 rounded-[8px] bg-[var(--text-primary)] text-white font-bold text-xs flex items-center justify-center shadow-xs">
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
        <div className="p-6 sm:p-8 rounded-[12px] bg-white border border-[var(--border)] shadow-sm space-y-4">
          <div className="w-8 h-8 rounded-[8px] bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/30 font-bold text-xs flex items-center justify-center">
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
  );
}
