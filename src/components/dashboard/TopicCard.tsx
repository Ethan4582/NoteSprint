"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getTechIcon } from "./TechIcons";
import SessionConfigModal from "./SessionConfigModal";

interface TopicCardProps {
  subject?: string;
  topic: string;
  qCount: number;
  basePath?: string;
  isSelected?: boolean;
  onToggle?: () => void;
}

export default function TopicCard({
  topic,
  qCount,
  basePath = "/library",
  isSelected,
  onToggle,
}: TopicCardProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStart = () => {
    try {
      const k = "ns_recent_decks";
      const raw = localStorage.getItem(k);
      const arr: string[] = raw ? JSON.parse(raw) : [];
      const next = [topic, ...arr.filter((t) => t !== topic)].slice(0, 6);
      localStorage.setItem(k, JSON.stringify(next));
      localStorage.setItem("ns_recent_ts", String(Date.now()));
    } catch {}

    if (onToggle) {
      onToggle();
      return;
    }
    if (basePath === "/preview") router.push(`/preview/${topic}`);
    else setIsModalOpen(true);
  };

  const cleanTopic = topic.startsWith("interview_") ? topic.replace("interview_", "") : topic;
  const formattedTopic = cleanTopic.replace(/_/g, " ");
  const capitalizedTopic = formattedTopic.charAt(0).toUpperCase() + formattedTopic.slice(1).toLowerCase();

  return (
    <>
      <button
        onClick={handleStart}
        aria-pressed={isSelected ? "true" : "false"}
        className={`group relative flex items-center gap-2.5 p-2.5 bg-white rounded-[11px] border text-left w-full transition-all duration-150 ${
          isSelected
            ? "border-[var(--accent)] bg-[var(--accent-subtle)] shadow-xs ring-1 ring-[var(--accent)]/30"
            : "border-[var(--border)] shadow-2xs hover:border-[var(--border-strong)] hover:shadow-xs"
        }`}
      >
        {/* Clean Tech Icon without square wrapper / boundary */}
        <div className="w-8 h-8 flex items-center justify-center shrink-0">
          <span className="scale-[0.85]">{getTechIcon(topic)}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-xs font-bold leading-tight tracking-tight truncate ${
              isSelected ? "text-[var(--accent)]" : "text-[var(--text-primary)]"
            }`}
          >
            {capitalizedTopic}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] font-medium text-[var(--text-muted)] font-mono">
              {qCount} cards
            </span>
            {isSelected && (
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-[4px] bg-[var(--accent)] text-white">
                Selected
              </span>
            )}
          </div>
        </div>
      </button>

      {!onToggle && (
        <SessionConfigModal
          topic={topic}
          totalAvailable={qCount}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
