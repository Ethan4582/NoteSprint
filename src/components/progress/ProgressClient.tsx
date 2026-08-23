"use client";

import { useState } from "react";
import DashboardSidebar from "@/src/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/src/components/dashboard/DashboardHeader";
import DashboardSearch from "@/src/components/dashboard/DashboardSearch";
import BottomNav from "@/src/components/BottomNav";
import { useUserProgress } from "@/src/hooks/useUserProgress";
import ProgressStatsOverview from "./ProgressStatsOverview";
import ProgressTrendChart from "./ProgressTrendChart";
import TopicPerformanceGrid from "./TopicPerformanceGrid";
import SessionHistoryList from "./SessionHistoryList";

export default function ProgressClient() {
  const { history, stats, isLoaded, resetAll } = useUserProgress();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");

  const tabs = ["ALL", "Topics", "History"];

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex font-sans">
      {/* Desktop Left Sidebar */}
      <DashboardSidebar activeTab="My Progress" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-28">
        <main className="flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-6">
          {/* Header with Greeting & Search */}
          <DashboardHeader search={search} setSearch={setSearch} />

          {/* Section Filter Pills */}
          <DashboardSearch tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

          {!isLoaded ? (
            <div className="py-20 text-center text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
              Loading Progress Data...
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overview Metrics Cards */}
              <ProgressStatsOverview stats={stats} />

              {/* Progress Trend Chart (Show when in ALL or History tab) */}
              {(activeTab === "ALL" || activeTab === "History") && !search && (
                <ProgressTrendChart trendData={stats.recentTrend} />
              )}

              {/* Topic Breakdown Section */}
              {(activeTab === "ALL" || activeTab === "Topics") && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Topic Performance ({stats.topicStats.length})
                    </span>
                  </div>
                  <TopicPerformanceGrid topics={stats.topicStats} searchQuery={search} />
                </div>
              )}

              {/* Session History Feed */}
              {(activeTab === "ALL" || activeTab === "History") && (
                <SessionHistoryList
                  history={history}
                  searchQuery={search}
                  onClearHistory={resetAll}
                />
              )}
            </div>
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
