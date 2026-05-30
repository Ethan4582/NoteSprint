"use client";

import { useState, useEffect } from "react";
import { getMarkdownFiles, MarkdownMeta } from "@/src/lib/markdown";
import { ChevronRight, FileText, Clock, BarChart, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import TopicCard from "@/src/components/dashboard/TopicCard";
import { getQuestions } from "@/src/lib/data";
import SessionConfigModal from "@/src/components/dashboard/SessionConfigModal";

export default function SystemDesignReadView() {
  const [activeTab, setActiveTab] = useState<"HLD" | "LLD" | "Quiz">("HLD");
  const [docs, setDocs] = useState<MarkdownMeta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  // For Quiz Multi-select
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]);
  };

  const totalSelectedQuestions = selectedTopics.reduce((acc, topic) => {
    return acc + getQuestions([], topic).length;
  }, 0);

  useEffect(() => {
    if (activeTab === "Quiz") return;
    
    let isMounted = true;
    setIsLoading(true);
    
    getMarkdownFiles(activeTab.toLowerCase() as "lld" | "hld")
      .then((data) => {
        if (isMounted) {
          setDocs(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, [activeTab]);

  return (
    <div className="w-full space-y-6">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-4 overflow-x-auto scrollbar-hide">
        {["HLD", "LLD", "Quiz"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "HLD" | "LLD" | "Quiz")}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab
                ? "bg-[var(--text-primary)] text-[var(--bg-base)] shadow-md"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === "Quiz" ? (
          <div className="relative pb-24">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <TopicCard
                subject="System Design"
                topic="hld"
                qCount={getQuestions([], "hld").length}
                basePath="/practice"
                isSelected={selectedTopics.includes("hld")}
                onToggle={() => toggleTopic("hld")}
              />
              <TopicCard
                subject="System Design"
                topic="lld"
                qCount={getQuestions([], "lld").length}
                basePath="/practice"
                isSelected={selectedTopics.includes("lld")}
                onToggle={() => toggleTopic("lld")}
              />
            </div>
            
            {selectedTopics.length > 0 && (
              <div className="fixed bottom-24 left-0 right-0 flex justify-center z-40 pointer-events-none px-4">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="pointer-events-auto bg-[var(--accent)] text-white px-6 py-3 rounded-full shadow-lg shadow-[var(--accent)]/30 font-bold tracking-widest uppercase text-xs flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                >
                  <Play size={14} fill="currentColor" />
                  Configure Session ({selectedTopics.length})
                </button>
              </div>
            )}

            <SessionConfigModal 
              topic={selectedTopics.join(",")}
              totalAvailable={totalSelectedQuestions}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {isLoading ? (
              <div className="p-8 text-center text-[var(--text-muted)] animate-pulse">
                Loading documents...
              </div>
            ) : docs.length === 0 ? (
              <div className="p-8 text-center border border-[var(--border)] border-dashed rounded-2xl text-[var(--text-muted)]">
                No documents found for {activeTab}.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {docs.map((doc, index) => (
                  <button
                    key={doc.slug}
                    onClick={() => router.push(`/system-design/${activeTab.toLowerCase()}/${doc.slug}`)}
                    className="group relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-5 sm:p-6 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl hover:border-[var(--accent)] transition-all duration-300 text-left shadow-sm hover:shadow-md active:scale-[0.99] overflow-hidden"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500 hidden sm:flex">
                      <span className="text-xs font-bold text-[var(--text-secondary)]">{index + 1}</span>
                    </div>

                    <div className="flex-1 space-y-2 min-w-0 pr-8">
                      <h3 className="text-lg font-bold text-[var(--text-primary)] leading-tight tracking-tight truncate">
                        {doc.title}
                      </h3>
                      
                      <div className="flex items-center gap-4 pt-1">
                        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                          <Clock size={14} className="opacity-60" />
                          <span className="text-[11px] font-bold tracking-wider uppercase">{doc.readingTime} min read</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                          <BarChart size={14} className="opacity-60" />
                          <span className={`text-[11px] font-bold tracking-wider uppercase ${
                            doc.difficulty === 'Easy' ? 'text-green-500' :
                            doc.difficulty === 'Medium' ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                            {doc.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent)]/20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                      <ChevronRight size={16} className="text-[var(--accent)]" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
