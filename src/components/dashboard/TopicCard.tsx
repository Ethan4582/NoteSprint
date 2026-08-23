"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getTechIcon } from "./TechIcons";
import SessionConfigModal from "./SessionConfigModal";

interface TopicCardProps {
  subject: string;
  topic: string;
  qCount: number;
  basePath?: string;
  isSelected?: boolean;
  onToggle?: () => void;
}

const tintFor = (topic: string) => {
  const h = [...topic].reduce((a, c) => a + c.charCodeAt(0), 0);
  const tints: Array<{ bg: string; bd: string; dot: string }> = [
    { bg: "var(--card-yellow)", bd: "var(--card-yellow-border)", dot: "var(--card-yellow-icon)" },
    { bg: "var(--card-green)", bd: "var(--card-green-border)", dot: "var(--card-green-icon)" },
    { bg: "var(--card-blue)", bd: "var(--card-blue-border)", dot: "var(--card-blue-icon)" },
    { bg: "var(--card-purple)", bd: "var(--card-purple-border)", dot: "var(--card-purple-icon)" },
    { bg: "var(--card-pink)", bd: "var(--card-pink-border)", dot: "var(--card-pink-icon)" },
    { bg: "var(--card-peach)", bd: "var(--card-peach-border)", dot: "var(--text-secondary)" },
  ];
  return tints[h % tints.length];
};

export default function TopicCard({ topic, qCount, basePath = "/practice", isSelected, onToggle }: TopicCardProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStart = () => {
    // local-only recent — no backend
    try {
      const k = "ns_recent_decks";
      const raw = localStorage.getItem(k);
      const arr: string[] = raw ? JSON.parse(raw) : [];
      const next = [topic, ...arr.filter((t) => t !== topic)].slice(0, 6);
      localStorage.setItem(k, JSON.stringify(next));
      localStorage.setItem("ns_recent_ts", String(Date.now()));
    } catch {}
    if (onToggle) { onToggle(); return; }
    if (basePath === "/preview") router.push(`/preview/${topic}`);
    else setIsModalOpen(true);
  };

  const cleanTopic = topic.startsWith("interview_") ? topic.replace("interview_", "") : topic;
  const formattedTopic = cleanTopic.replace(/_/g, " ");
  const capitalizedTopic = formattedTopic.charAt(0).toUpperCase() + formattedTopic.slice(1).toLowerCase();
  const tint = tintFor(topic);

  return (
    <>
      <button
        onClick={handleStart}
        aria-pressed={isSelected ? "true" : "false"}
        className={`group relative flex items-center gap-3 p-3 bg-white rounded-lg border text-left w-full overflow-hidden transition-all duration-200 ${
          isSelected
            ? "border-[var(--accent)] shadow-[var(--shadow-card)] ring-1 ring-[var(--accent)]/20"
            : "border-[var(--border)] shadow-sm hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-soft)]"
        }`}
      >
        {/* folder-tab hint */}
        <span
          className="absolute -top-px left-4 h-[6px] w-10 rounded-b-sm border-x border-b hidden sm:block"
          style={{ background: tint.bg, borderColor: tint.bd }}
        />

        <div
          className="w-11 h-11 rounded-md flex items-center justify-center shrink-0 border"
          style={{ background: tint.bg, borderColor: tint.bd }}
        >
          <span className="scale-[0.9]">{getTechIcon(topic)}</span>
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <h3 className={`text-[13px] font-bold leading-tight tracking-tight truncate ${isSelected ? "text-[var(--accent)]" : "text-[var(--text-primary)]"}`}>
            {capitalizedTopic}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: tint.dot }} />
              {qCount} cards
            </span>
            {isSelected && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[var(--accent-soft)] border border-[var(--accent-border)] text-[var(--accent)]">Selected</span>}
          </div>
        </div>

        <span
          className={`hidden sm:grid place-items-center w-7 h-7 rounded-md border shrink-0 transition-colors ${
            isSelected ? "bg-[var(--accent)] border-[var(--accent)] text-white" : "bg-[var(--bg-subtle)] border-[var(--border)] text-[var(--text-muted)] group-hover:bg-white"
          }`}
        >
          <span className="text-[13px] leading-none">{isSelected ? "✓" : "+"}</span>
        </span>
      </button>

      {!onToggle && (
        <SessionConfigModal topic={topic} totalAvailable={qCount} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
