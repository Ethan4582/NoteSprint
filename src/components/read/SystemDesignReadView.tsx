"use client";

import { useState, useEffect } from "react";
import { getMarkdownFiles, MarkdownMeta } from "@/src/lib/markdown";
import { ChevronRight, Clock, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import TopicCard from "@/src/components/dashboard/TopicCard";
import { getQuestions } from "@/src/lib/data";
import SessionConfigModal from "@/src/components/dashboard/SessionConfigModal";
import SystemDesignDocCard from "@/src/components/read/SystemDesignDocCard";

interface SystemDesignReadViewProps {
  search?: string;
}

export default function SystemDesignReadView({ search = "" }: SystemDesignReadViewProps) {
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

  const filteredDocs = docs.filter(doc => {
    if (!search) return true;
    const lowerSearch = search.toLowerCase();
    const titleMatch = doc.title.toLowerCase().includes(lowerSearch);
    const tagMatch = doc.tags?.some(tag => tag.toLowerCase().includes(lowerSearch));
    return titleMatch || tagMatch;
  });

  return (
    <div className="w-full space-y-6">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-outer)] pb-4 overflow-x-auto scrollbar-hide">
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
            ) : filteredDocs.length === 0 ? (
              <div className="p-8 text-center border border-[var(--border-strong)] border-dashed rounded-2xl text-[var(--text-muted)]">
                No documents found for {activeTab}.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredDocs.map((doc, index) => (
                  <SystemDesignDocCard 
                    key={doc.slug} 
                    doc={doc} 
                    index={index} 
                    type={activeTab.toLowerCase() as "lld" | "hld"} 
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
