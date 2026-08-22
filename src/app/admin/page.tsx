"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminStats } from "@/src/lib/admin-api";
import { Button } from "@/src/components/ui/button";
import { HelpCircle, FileText, FolderKanban, Plus, ArrowRight } from "lucide-react";

import AnalyticsHeader from "@/src/components/admin/analytics/AnalyticsHeader";
import AnalyticsKpiCards from "@/src/components/admin/analytics/AnalyticsKpiCards";
import VisitorsComparisonChart from "@/src/components/admin/analytics/VisitorsComparisonChart";
import StudyActivityChart from "@/src/components/admin/analytics/StudyActivityChart";
import TopTopicsChart from "@/src/components/admin/analytics/TopTopicsChart";
import VisitorsByCountry from "@/src/components/admin/analytics/VisitorsByCountry";
import DevicePlatformChart from "@/src/components/admin/analytics/DevicePlatformChart";
import PeakHoursChart from "@/src/components/admin/analytics/PeakHoursChart";
import type { AnalyticsData, TimeRange } from "@/src/components/admin/analytics/types";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<{
    totalTopics: number;
    totalQuestions: number;
    totalArticles: number;
  }>({
    totalTopics: 0,
    totalQuestions: 0,
    totalArticles: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const [activeRange, setActiveRange] = useState<TimeRange>("7D");
  const [customRange, setCustomRange] = useState<{ start: string; end: string } | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    getAdminStats()
      .then((data) => setStats(data))
      .catch((err) => console.error("Failed to load admin stats:", err))
      .finally(() => setStatsLoading(false));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams({ range: activeRange });
    if (activeRange === "custom" && customRange) {
      params.set("start", customRange.start);
      params.set("end", customRange.end);
    }

    fetch(`/api/admin/analytics?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data: AnalyticsData) => {
        if (data && data.kpis) {
          setAnalyticsData(data);
        }
      })
      .catch((err) => console.error("Error fetching analytics:", err));
  }, [activeRange, customRange]);

  const overviewMetricCards = [
    {
      title: "Total Questions",
      count: stats.totalQuestions,
      description: "Active recall flashcards across all topics",
      icon: HelpCircle,
      href: "/admin/questions",
    },
    {
      title: "Topics & Subjects",
      count: stats.totalTopics,
      description: "Categories including Backend, Frontend, CS",
      icon: FolderKanban,
      href: "/admin/questions",
    },
    {
      title: "Articles & Designs",
      count: stats.totalArticles,
      description: "System Design, HLD and LLD guides",
      icon: FileText,
      href: "/admin/articles",
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
            Admin Overview
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Manage your questions, articles, and monitor live platform performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/questions/new">
            <Button size="sm" className="h-9 px-4 rounded-xl font-bold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-sm">
              <Plus className="h-4 w-4 mr-1.5" /> Add Question
            </Button>
          </Link>
          <Link href="/admin/articles/new">
            <Button size="sm" variant="outline" className="h-9 px-4 rounded-xl font-bold border-[var(--border-strong)] bg-raised text-[var(--text-primary)]">
              <Plus className="h-4 w-4 mr-1.5" /> Add Article
            </Button>
          </Link>
        </div>
      </div>

      {/* 3 Overview Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {overviewMetricCards.map((card, idx) => {
          const Icon = card.icon;
          const formattedIdx = String(idx + 1).padStart(3, "0");
          return (
            <Link key={card.title} href={card.href}>
              <div className="rounded-2xl border border-[var(--border-strong)] bg-raised p-5 shadow-raised-crisp flex flex-col justify-between cursor-pointer group h-full space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    {card.title}
                  </span>
                  <div className="p-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--accent)] transition-all">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div>
                  <div className="text-3xl font-black tracking-tight text-[var(--text-primary)] font-mono">
                    {statsLoading ? "..." : card.count}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-1">
                    {card.description}
                  </p>
                </div>

                <div className="flex items-center text-xs font-bold text-[var(--accent)] pt-2 border-t border-[var(--border)] group-hover:translate-x-0.5 transition-transform">
                  <span>Manage collection</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Analytics Section Integrated Directly Below */}
      {analyticsData && (
        <div className="space-y-6 pt-2">
          {/* Header & Range Filters */}
          <AnalyticsHeader
            activeRange={activeRange}
            onSelectRange={(range) => setActiveRange(range)}
            onSelectCustomRange={(start, end) => setCustomRange({ start, end })}
          />

          {/* 4 Top KPI Cards */}
          <AnalyticsKpiCards kpis={analyticsData.kpis} />

          {/* Full-Width Multi-Metric Independent Checkbox Graph */}
          <VisitorsComparisonChart data={analyticsData.trendData} />

          {/* Row 2: Study Activity & Top Topics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <StudyActivityChart data={analyticsData.studyActivity} />
            <TopTopicsChart topics={analyticsData.topTopics} />
          </div>

          {/* Row 3: Visitors by Country (with Flags), Device & Platform, Study Peak Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <VisitorsByCountry countries={analyticsData.topCountries} />
            <DevicePlatformChart devices={analyticsData.devices} />
            <PeakHoursChart peakHours={analyticsData.peakHours} />
          </div>
        </div>
      )}
    </div>
  );
}
