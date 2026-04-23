"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { DATA } from "@/src/lib/data";
import ThemeToggle from "@/src/components/ThemeToggle";

export default function Dashboard() {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState<string>("All");

  const subjects = ["All", ...Object.keys(DATA)];

  const getFilteredTopics = () => {
    if (selectedSubject === "All") {
      return Object.entries(DATA).flatMap(([subject, topics]) => 
        Object.keys(topics).map(topic => ({ subject, topic }))
      );
    }
    return Object.keys(DATA[selectedSubject]).map(topic => ({ 
      subject: selectedSubject, 
      topic 
    }));
  };

  const handleTopicSelect = (subject: string, topic: string) => {
    router.push(`/config?subject=${subject}&topic=${topic}`);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col">
      <header className="sticky top-0 z-10 h-14 bg-[var(--bg-surface)] border-b border-[var(--border)] flex items-center justify-between px-6 shadow-xs">
        <div className="flex items-center gap-4">
           <button 
             onClick={() => router.push("/")}
             className="p-1.5 hover:bg-[var(--bg-subtle)] rounded-[6px] transition-colors"
           >
             <ArrowLeft className="w-5 h-5" />
           </button>
           <h1 className="text-lg font-bold tracking-tight">Explore Subjects</h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="max-w-[800px] mx-auto w-full p-6 sm:p-10 space-y-12">
        {/* Subject Chips */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Select Category</h3>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide py-1">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`h-9 px-5 text-sm font-semibold rounded-[6px] whitespace-nowrap transition-all border ${
                  selectedSubject === subject
                    ? "bg-[var(--text-primary)] text-[var(--bg-surface)] border-[var(--text-primary)]"
                    : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {subject.charAt(0).toUpperCase() + subject.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Topic List */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Available Topics</h3>
          <div className="bg-[var(--bg-surface)] rounded-[8px] border border-[var(--border)] overflow-hidden shadow-sm">
            {getFilteredTopics().map(({ subject, topic }, index) => {
              const topicData = DATA[subject][topic];
              const qCount = Object.values(topicData).reduce((acc: number, cur: any) => acc + (Array.isArray(cur) ? cur.length : 0), 0);
              
              return (
                <button
                  key={`${subject}-${topic}`}
                  onClick={() => handleTopicSelect(subject, topic)}
                  className={`w-full py-5 px-6 flex items-center justify-between hover:bg-[var(--bg-subtle)] transition-all text-left group ${
                    index !== getFilteredTopics().length - 1 ? "border-b border-[var(--border)]" : ""
                  }`}
                >
                  <div className="flex flex-col gap-1">
                     <span className="text-base font-bold text-[var(--text-primary)] capitalize group-hover:text-[var(--accent)] transition-colors">
                       {topic}
                     </span>
                     <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wide">
                       {subject} • {qCount} Questions
                     </span>
                  </div>
                  <div className="w-8 h-8 flex items-center justify-center rounded-[6px] bg-[var(--bg-subtle)] group-hover:bg-[var(--accent)] group-hover:text-white transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
