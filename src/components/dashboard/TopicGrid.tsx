"use client";

import { getQuestions } from "@/src/lib/data";
import TopicCard from "./TopicCard";

interface TopicGridProps {
  topics: { topic: string; qCount?: number }[];
  basePath?: string;
  selectedTopics?: string[];
  onToggleTopic?: (topic: string) => void;
}

export default function TopicGrid({
  topics,
  basePath,
  selectedTopics = [],
  onToggleTopic,
}: TopicGridProps) {
  const sortedTopics = topics
    .map(({ topic, qCount }) => ({
      topic,
      qCount: typeof qCount === "number" ? qCount : getQuestions([], topic).length,
    }))
    .sort((a, b) => b.qCount - a.qCount);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
          Available Decks
        </h2>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-white border border-[var(--border)] text-[var(--text-secondary)] font-mono font-bold">
          {sortedTopics.length} topics
        </span>
        <div className="h-px flex-1 bg-[var(--border)] hidden sm:block" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
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
