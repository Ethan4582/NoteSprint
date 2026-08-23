"use client";

import { useState } from "react";
import { getQuestions } from "@/src/lib/data";
import TopicCard from "./TopicCard";
import { ArrowUpDown } from "lucide-react";

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
  const [sortBy, setSortBy] = useState<"most" | "fewest" | "az">("most");

  const sortedTopics = [...topics]
    .map(({ topic, qCount }) => ({
      topic,
      qCount: typeof qCount === "number" ? qCount : getQuestions([], topic).length,
    }))
    .sort((a, b) => {
      if (sortBy === "most") return b.qCount - a.qCount;
      if (sortBy === "fewest") return a.qCount - b.qCount;
      if (sortBy === "az") return a.topic.localeCompare(b.topic);
      return 0;
    });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Available Decks
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-[6px] bg-white border border-[var(--border)] text-[var(--text-secondary)] font-mono font-semibold">
            {sortedTopics.length} topics
          </span>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown size={12} className="text-[var(--text-muted)]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "most" | "fewest" | "az")}
            className="text-xs font-semibold bg-white border border-[var(--border)] rounded-[8px] px-2 py-1 text-[var(--text-secondary)] outline-none shadow-2xs cursor-pointer hover:border-[var(--border-strong)]"
          >
            <option value="most">Most Cards</option>
            <option value="fewest">Fewest Cards</option>
            <option value="az">A — Z</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
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
