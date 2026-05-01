"use client";

import { LayoutGrid, Filter, Check, Trash2 } from "lucide-react";
import { getQuestions } from "@/src/lib/data";
import { getTechIcon } from "@/src/components/dashboard/TechIcons";

interface TopicSelectorProps {
  filteredTopics: string[];
  selectedTopics: string[];
  toggleTopic: (topic: string) => void;
  setSelectedTopics: (topics: string[]) => void;
  filterQuery: string;
  setFilterQuery: (val: string) => void;
}

export default function TopicSelector({
  filteredTopics,
  selectedTopics,
  toggleTopic,
  setSelectedTopics,
  filterQuery,
  setFilterQuery,
}: TopicSelectorProps) {
  return (
    <div className="lg:col-span-7 xl:col-span-8 2xl:col-span-9 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-black text-[var(--text-primary)] flex items-center gap-3">
            <LayoutGrid className="w-5 h-5 text-[var(--accent)]" />
            Topics
          </h2>
          <span className="px-3 py-1 bg-[var(--accent-subtle)] text-[var(--accent)] text-[11px] font-black rounded-full border border-[var(--accent)]/10">
            {selectedTopics.length} selected
          </span>
        </div>
        
        <div className="relative group">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
          <input 
            type="text" 
            placeholder="Filter topics..."
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[var(--bg-surface)] border-2 border-[var(--border)] rounded-[12px] text-sm font-semibold focus:border-[var(--accent)] outline-none w-full sm:w-72 shadow-sm transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-3.5 pb-12">
        {filteredTopics.map((topic) => {
          const isSelected = selectedTopics.includes(topic);
          const qCount = getQuestions([], topic).length;
          const formattedTopic = topic.replace(/_/g, ' ');
          const capitalizedTopic = formattedTopic.charAt(0).toUpperCase() + formattedTopic.slice(1).toLowerCase();
          
          return (
            <button
              key={topic}
              onClick={() => toggleTopic(topic)}
              className={`relative flex items-center p-3 sm:p-3.5 rounded-[14px] border-2 transition-all duration-300 text-left h-full ${
                isSelected 
                  ? "bg-[var(--bg-surface)] border-[var(--accent)] shadow-md translate-y-[-2px]" 
                  : "bg-[var(--bg-surface)] border-[var(--border)] hover:border-[var(--text-muted)] shadow-sm"
              } gap-3 sm:gap-3.5 group`}
            >
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] sm:rounded-[12px] flex items-center justify-center shrink-0 transition-colors ${isSelected ? "bg-[var(--accent-subtle)]" : "bg-[var(--bg-subtle)]"}`}>
                <div className="scale-75 sm:scale-90 group-hover:scale-105 transition-transform">
                  {getTechIcon(topic)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] sm:text-[13px] font-bold text-[var(--text-primary)] leading-tight break-words">
                  {capitalizedTopic}
                </h4>
                <p className="text-[8px] sm:text-[9px] font-bold text-[var(--text-muted)] tracking-widest uppercase mt-0.5">
                  {qCount} cards
                </p>
              </div>
              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-md z-10 border-2 border-[var(--bg-base)]">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedTopics.length > 0 && (
        <button 
          onClick={() => setSelectedTopics([])}
          className="flex items-center gap-2 text-[10px] font-black text-[var(--error)] uppercase tracking-widest hover:opacity-80 transition-all px-4 py-2 rounded-full border border-[var(--error)]/20 hover:bg-[var(--error)]/5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Selection
        </button>
      )}
    </div>
  );
}
