"use client";

import { getQuestions } from "@/src/lib/data";
import TopicCard from "./TopicCard";

interface TopicGridProps {
  topics: { topic: string; qCount?: number }[];
  basePath?: string;
  selectedTopics?: string[];
  onToggleTopic?: (topic: string) => void;
}

export default function TopicGrid({ topics, basePath, selectedTopics = [], onToggleTopic }: TopicGridProps) {
  const sortedTopics = topics
    .map(({ topic, qCount }) => ({ topic, qCount: typeof qCount === "number" ? qCount : getQuestions([], topic).length }))
    .sort((a, b) => b.qCount - a.qCount);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h2 className="text-[11px] font-black tracking-[0.14em] uppercase text-[var(--text-muted)]">Discovery decks</h2>
        <span className="text-[11px] px-2 py-1 rounded-full bg-white border border-[var(--border)] text-[var(--text-secondary)] font-semibold">
          {sortedTopics.length} topics
        </span>
        <div className="h-px flex-1 bg-[var(--border)] opacity-60 hidden sm:block" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-3.5">
        {sortedTopics.map(({ topic, qCount }) => (
          <TopicCard
            key={topic}
            subject=""
            topic={topic}
            qCount={qCount}
            basePath={basePath}
            isSelected={selectedTopics.includes(topic)}
            onToggle={onToggleTopic ? () => onToggleTopic(topic) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
