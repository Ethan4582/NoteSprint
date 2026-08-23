"use client";

import { useState } from "react";
import { MarkdownMeta } from "@/src/lib/markdown";
import { Play } from "lucide-react";
import { getQuestions } from "@/src/lib/data";
import TopicCard from "@/src/components/dashboard/TopicCard";
import SessionConfigModal from "@/src/components/dashboard/SessionConfigModal";
import SystemDesignDocCard from "@/src/components/read/SystemDesignDocCard";

interface SystemDesignReadViewProps {
  search?: string;
  systemDocs: MarkdownMeta[];
}

export default function SystemDesignReadView({ search = "", systemDocs }: SystemDesignReadViewProps) {
  const [activeTab, setActiveTab] = useState<"HLD" | "LLD" | "Quiz">("HLD");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleTopic = (topic: string) => setSelectedTopics((prev) => (prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]));
  const totalSelectedQuestions = selectedTopics.reduce((acc, topic) => acc + getQuestions([], topic).length, 0);
  const docs = systemDocs.filter((d) => d.type === activeTab.toLowerCase());
  const filteredDocs = docs.filter((doc) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return doc.title.toLowerCase().includes(s) || doc.tags?.some((tag) => tag.toLowerCase().includes(s));
  });

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center gap-1.5 p-1 rounded-full bg-white border border-[var(--border)] shadow-sm w-fit max-w-full overflow-x-auto scrollbar-hide">
        {(["HLD", "LLD", "Quiz"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-colors ${activeTab === tab ? "bg-[var(--text-primary)] text-white shadow-sm" : "text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "Quiz" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <TopicCard subject="System Design" topic="hld" qCount={getQuestions([], "hld").length} basePath="/practice" isSelected={selectedTopics.includes("hld")} onToggle={() => toggleTopic("hld")} />
              <TopicCard subject="System Design" topic="lld" qCount={getQuestions([], "lld").length} basePath="/practice" isSelected={selectedTopics.includes("lld")} onToggle={() => toggleTopic("lld")} />
            </div>
            {selectedTopics.length > 0 && (
              <div className="fixed bottom-[84px] sm:bottom-6 left-0 right-0 flex justify-center z-40 pointer-events-none px-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="pointer-events-auto inline-flex items-center gap-2 bg-[var(--text-primary)] text-white px-5 py-3 rounded-full shadow-[0_12px_32px_rgba(28,25,23,0.2)] font-bold text-xs tracking-wide"
                >
                  <Play size={14} fill="currentColor" /> Configure session ({selectedTopics.length})
                </button>
              </div>
            )}
            <SessionConfigModal topic={selectedTopics.join(",")} totalAvailable={totalSelectedQuestions} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDocs.length === 0 ? (
              <div className="p-8 text-center border border-dashed rounded-[18px] border-[var(--border-strong)] text-sm text-[var(--text-muted)] bg-white">No documents for {activeTab}.</div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredDocs.map((doc, index) => (
                  <SystemDesignDocCard key={doc.slug} doc={doc} index={index} type={activeTab.toLowerCase() as "lld" | "hld"} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
