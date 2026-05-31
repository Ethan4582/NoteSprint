"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Home, LayoutList, Play } from "lucide-react";
import { DATA, getQuestions } from "@/src/lib/data";
import BottomNav from "@/src/components/BottomNav";
import ThemeToggle from "@/src/components/ThemeToggle";
import TopicCard from "@/src/components/dashboard/TopicCard";

import DashboardHeader from "@/src/components/dashboard/DashboardHeader";
import DashboardSearch from "@/src/components/dashboard/DashboardSearch";
import TopicGrid from "@/src/components/dashboard/TopicGrid";
import SessionConfigModal from "@/src/components/dashboard/SessionConfigModal";
import SystemDesignReadView from "@/src/components/read/SystemDesignReadView";
import SystemDesignDocCard from "@/src/components/read/SystemDesignDocCard";
import { getMarkdownFiles, MarkdownMeta } from "@/src/lib/markdown";

export default function Dashboard() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [systemDocs, setSystemDocs] = useState<MarkdownMeta[]>([]);

  const CATEGORY_MAP: Record<string, string[]> = {
    "Frontend": ["react", "nextjs", "typescript", "redux", "javascript", "playwright_", "testing"],
    "Backend": ["nodejs", "express", "mongodb", "postgresql", "aws_", "azure_", "drizzle_", "fastapi_", "graphql_", "grpc_", "hono_", "langchain_", "langgraph_", "prisma", "python", "redis", "socketio_", "websocket_"],
    "Fundamentals": ["operating_systeam", "computer_network", "c++", "database_management", "oops", "sql"],
    "System Design": ["lld", "hld"]
  };

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getMarkdownFiles("lld"),
      getMarkdownFiles("hld")
    ]).then(([lld, hld]) => {
      if (isMounted) {
        setSystemDocs([
          ...lld.map(d => ({ ...d, type: "lld" as const })),
          ...hld.map(d => ({ ...d, type: "hld" as const }))
        ]);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const getFilteredTopics = () => {
    let topics = Object.keys(DATA)
      .filter(topic => !topic.startsWith("interview_"))
      .map(topic => ({ topic }));
    
    if (activeTab !== "ALL") {
      const categoryTopics = CATEGORY_MAP[activeTab] || [];
      topics = topics.filter(t => categoryTopics.includes(t.topic));
    }

    if (search) {
      topics = topics.filter(t => 
        t.topic.toLowerCase().includes(search.toLowerCase())
      );
    }

    return topics.filter(t => getQuestions([], t.topic).length > 0);
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]);
  };

  const totalSelectedQuestions = selectedTopics.reduce((acc, topic) => {
    return acc + getQuestions([], topic).length;
  }, 0);

  const tabs = ["ALL", "Frontend", "Backend", "Fundamentals", "System Design"];

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col pb-32 font-sans overflow-x-hidden relative">
      <main className="max-w-[1600px] mx-auto w-full p-4 sm:p-10 space-y-8 sm:space-y-10">
        <DashboardHeader />
        
        <DashboardSearch 
          search={search} 
          setSearch={setSearch} 
          tabs={tabs} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        {activeTab === "System Design" ? (
          <SystemDesignReadView search={search} />
        ) : (
          <div className="space-y-8">
            <TopicGrid 
              topics={getFilteredTopics()} 
              selectedTopics={selectedTopics}
              onToggleTopic={toggleTopic}
            />
            {search && systemDocs.filter(doc => {
              const lowerSearch = search.toLowerCase();
              const titleMatch = doc.title.toLowerCase().includes(lowerSearch);
              const tagMatch = doc.tags?.some(tag => tag.toLowerCase().includes(lowerSearch));
              return titleMatch || tagMatch;
            }).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-[var(--text-muted)] uppercase tracking-widest px-1">
                  System Design Matches
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {systemDocs.filter(doc => {
                    const lowerSearch = search.toLowerCase();
                    const titleMatch = doc.title.toLowerCase().includes(lowerSearch);
                    const tagMatch = doc.tags?.some(tag => tag.toLowerCase().includes(lowerSearch));
                    return titleMatch || tagMatch;
                  }).map((doc, index) => (
                    <SystemDesignDocCard 
                      key={doc.slug} 
                      doc={doc} 
                      index={index} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

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

      <BottomNav />
    </div>
  );
}
