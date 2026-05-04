"use client";

import { useState } from "react";
import { DATA, getQuestions } from "@/src/lib/data";
import BottomNav from "@/src/components/BottomNav";
import DashboardHeader from "@/src/components/dashboard/DashboardHeader";
import DashboardSearch from "@/src/components/dashboard/DashboardSearch";
import TopicGrid from "@/src/components/dashboard/TopicGrid";
import { BookOpen } from "lucide-react";

export default function ReadPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");

  const CATEGORY_MAP: Record<string, string[]> = {
    "Frontend": ["react", "nextjs", "typescript", "redux", "javascript", "playwright_", "testing"],
    "Backend": ["nodejs", "express", "mongodb", "postgresql", "aws_", "azure_", "drizzle_", "fastapi_", "graphql_", "grpc_", "hono_", "langchain_", "langgraph_", "prisma", "python", "redis", "socketio_", "websocket_"],
    "Fundamentals": ["operating_systeam", "computer_network", "c++", "database_management", "oops", "sql"],
    "System Design": ["lld", "hld"]
  };

  const getFilteredTopics = () => {
    let topics = Object.keys(DATA).map(topic => ({ topic }));
    
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

  const tabs = ["ALL", "Frontend", "Backend", "Fundamentals", "System Design"];

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col pb-32 font-sans overflow-x-hidden">
      <main className="max-w-[1600px] mx-auto w-full p-4 sm:p-10 space-y-8 sm:space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-[var(--accent-subtle)] w-fit rounded-full border border-[var(--accent)]/20">
              <BookOpen size={12} className="text-[var(--accent)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent)]">Reading Mode</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-primary)]">
              Browse & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[#8B5CF6]">Read</span>
            </h1>
            <p className="text-[var(--text-muted)] text-sm font-medium max-w-md">
              Select a topic to preview all questions and answers in a clean, blog-style format.
            </p>
          </div>
        </div>
        
        <DashboardSearch 
          search={search} 
          setSearch={setSearch} 
          tabs={tabs} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        <TopicGrid topics={getFilteredTopics()} basePath="/preview" />
      </main>

      <BottomNav />
    </div>
  );
}
