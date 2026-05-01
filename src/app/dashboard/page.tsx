"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Home, LayoutList } from "lucide-react";
import { DATA, getQuestions } from "@/src/lib/data";
import BottomNav from "@/src/components/BottomNav";
import ThemeToggle from "@/src/components/ThemeToggle";
import TopicCard from "@/src/components/dashboard/TopicCard";

import DashboardHeader from "@/src/components/dashboard/DashboardHeader";
import DashboardSearch from "@/src/components/dashboard/DashboardSearch";
import TopicGrid from "@/src/components/dashboard/TopicGrid";

export default function Dashboard() {
  const router = useRouter();
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
        <DashboardHeader />
        
        <DashboardSearch 
          search={search} 
          setSearch={setSearch} 
          tabs={tabs} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        <TopicGrid topics={getFilteredTopics()} />
      </main>

      <BottomNav />
    </div>
  );
}
