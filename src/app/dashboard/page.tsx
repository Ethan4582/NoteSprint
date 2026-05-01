"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Home, LayoutList } from "lucide-react";
import { DATA, getQuestions } from "@/src/lib/data";
import BottomNav from "@/src/components/BottomNav";
import ThemeToggle from "@/src/components/ThemeToggle";
import TopicCard from "@/src/components/dashboard/TopicCard";

export default function Dashboard() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const getFilteredTopics = () => {
    let topics = Object.keys(DATA).map(topic => ({ topic }));
    
    if (search) {
      topics = topics.filter(t => 
        t.topic.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter out empty topics and format for rendering
    return topics.filter(t => {
      const qCount = getQuestions([], t.topic).length;
      return qCount > 0;
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col pb-32 font-sans overflow-x-hidden">
      <main className="max-w-[1100px] mx-auto w-full p-4 sm:p-10 space-y-6 sm:space-y-12 mt-2 sm:mt-6">
        {/* Header Section */}
        <div className="flex flex-row justify-between items-start gap-4 sm:gap-6">
          <div className="flex items-center gap-4">
            <img src="/logo.png" className="w-10 h-10 sm:w-14 sm:h-14 drop-shadow-md rounded-lg" alt="Logo" />
            <div className="space-y-0.5 sm:space-y-1">
              <p className="text-[10px] sm:text-xs font-bold text-[var(--accent)] uppercase tracking-[0.3em]">Note Sprints</p>
              <h1 className="text-2xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight">
                Master the Stack
              </h1>
            </div>
          </div>
          <div className="bg-[var(--bg-surface)] p-1.5 sm:p-2 rounded-[12px] shadow-sm border border-[var(--border)] shrink-0">
            <ThemeToggle />
          </div>
        </div>

        {/* Search Bar - Modern Style */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 sm:left-5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search topics..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 sm:h-16 pl-11 sm:pl-14 pr-4 sm:pr-6 bg-[var(--bg-surface)] border-2 border-[var(--border)] rounded-[12px] sm:rounded-[16px] text-[var(--text-primary)] font-semibold text-base sm:text-lg focus:border-[var(--accent)] outline-none transition-all shadow-md placeholder:text-[var(--text-muted)] placeholder:font-normal"
          />
        </div>

        {/* Discover Grid - Expanded */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[var(--text-primary)] opacity-60">Discover Topics</h2>
            <div className="h-px flex-1 bg-[var(--border)] ml-4 sm:ml-6 opacity-40"></div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
            {getFilteredTopics().map(({ topic }) => {
              const qCount = getQuestions([], topic).length;
              
              return (
                <TopicCard
                  key={topic}
                  subject=""
                  topic={topic}
                  qCount={qCount}
                />
              );
            })}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
