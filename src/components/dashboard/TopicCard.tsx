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

export default function TopicCard({ subject, topic, qCount, basePath = "/practice", isSelected, onToggle }: TopicCardProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStart = () => {
    if (onToggle) {
      onToggle();
      return;
    }
    if (basePath === "/preview") {
      router.push(`/preview/${topic}`);
    } else {
      setIsModalOpen(true);
    }
  };

  const formattedTopic = topic.replace(/_/g, ' ');
  const capitalizedTopic = formattedTopic.charAt(0).toUpperCase() + formattedTopic.slice(1).toLowerCase();

  return (
    <>
      <button
        onClick={handleStart}
        className={`group relative flex items-center p-2.5 sm:p-2.5 bg-raised rounded-[12px] sm:rounded-[14px] transition-all duration-300 text-left active:scale-[0.98] overflow-hidden gap-4 sm:gap-3 w-full border border-[var(--border)] ${
          isSelected ? "shadow-raised ring-1 ring-[var(--accent)]" : "shadow-raised-crisp"
        }`}
      >
        <div className={`w-10 h-10 sm:w-10 sm:h-10 rounded-[10px] bg-raised flex items-center justify-center group-hover:scale-105 transition-transform duration-500 shrink-0 border border-[var(--border-strong)] ${
          isSelected ? "shadow-inset-cavity" : "shadow-raised"
        }`}>
          <div className="scale-75 sm:scale-75">
            {getTechIcon(topic)}
          </div>
        </div>

        <div className="flex-1 space-y-0 min-w-0 pr-1">
          <h3 className={`text-[12px] sm:text-[13px] font-bold leading-tight tracking-tight truncate ${isSelected ? "text-[var(--accent)] drop-shadow-[0_0_8px_rgba(255,69,0,0.4)]" : "text-[var(--text-primary)]"}`}>
            {capitalizedTopic}
          </h3>
          <div className="flex items-center gap-1 opacity-60">
            <span className="text-[9px] sm:text-[9px] font-black text-[var(--text-secondary)]">
              {qCount}
            </span>
            <span className="text-[8px] sm:text-[8px] font-bold text-[var(--text-muted)] tracking-widest">
              cards
            </span>
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
