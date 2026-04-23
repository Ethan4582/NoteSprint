"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Home, LayoutList } from "lucide-react";
import { DATA } from "@/src/lib/data";
import TopicCard from "@/src/components/dashboard/TopicCard";

export default function Dashboard() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const getFilteredTopics = () => {
    let topics = Object.entries(DATA).flatMap(([subject, topicsObj]) => 
      Object.keys(topicsObj).map(topic => ({ subject, topic }))
    );
    if (search) {
      topics = topics.filter(t => 
        t.topic.toLowerCase().includes(search.toLowerCase()) || 
        t.subject.toLowerCase().includes(search.toLowerCase())
      );
    }
    return topics;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col pb-24 font-sans">
      <main className="max-w-[600px] mx-auto w-full p-6 space-y-8 mt-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-[var(--text-secondary)] font-medium">Welcome back,</p>
            <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">Developer</h1>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            D
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-[var(--text-muted)]" />
          </div>
          <input 
            type="text" 
            placeholder="Search a topic or subject..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 pl-12 pr-4 bg-[var(--bg-subtle)] border-none rounded-full text-[var(--text-primary)] font-medium focus:ring-2 focus:ring-[var(--accent)] outline-none"
          />
        </div>

        {/* Discover Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">Discover Topics</h2>
          <div className="grid grid-cols-2 gap-4">
            {getFilteredTopics().map(({ subject, topic }) => {
              const topicData = DATA[subject][topic];
              const qCount = Object.values(topicData).reduce((acc: number, cur: any) => 
                acc + (Array.isArray(cur) ? cur.length : 0), 0
              );
              
              return (
                <TopicCard
                  key={`${subject}-${topic}`}
                  subject={subject}
                  topic={topic}
                  qCount={qCount}
                />
              );
            })}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-[var(--bg-surface)] border-t border-[var(--border)] pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-[600px] mx-auto flex justify-evenly items-center px-4 h-16">
          <button 
            onClick={() => router.push("/dashboard")} 
            className="flex flex-col items-center gap-1 text-[var(--accent)] flex-1"
          >
            <div className="w-8 h-8 rounded-[8px] bg-[var(--accent-subtle)] flex items-center justify-center">
              <Home className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold">Home</span>
          </button>
          
          <button 
            onClick={() => router.push("/practice")} 
            className="flex flex-col items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex-1"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <LayoutList className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold">Practice</span>
          </button>
        </div>
      </div>
    </div>
  );
}
