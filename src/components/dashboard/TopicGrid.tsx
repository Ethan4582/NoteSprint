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
    .map(({ topic, qCount }) => ({
      topic,
      qCount: typeof qCount === "number" ? qCount : getQuestions([], topic).length,
    }))
    .sort((a, b) => b.qCount - a.qCount);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-black tracking-widest text-[var(--text-primary)] opacity-60 uppercase">Discovery topics</h2>
        <div className="h-px flex-1 bg-[var(--border)] ml-6 opacity-30"></div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
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
