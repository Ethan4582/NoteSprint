"use client";

import { useEffect, useState } from "react";
import AnalyticsHeader from "@/src/components/admin/analytics/AnalyticsHeader";
import AnalyticsKpiCards from "@/src/components/admin/analytics/AnalyticsKpiCards";
import VisitorsComparisonChart from "@/src/components/admin/analytics/VisitorsComparisonChart";
import StudyActivityChart from "@/src/components/admin/analytics/StudyActivityChart";
import TopTopicsChart from "@/src/components/admin/analytics/TopTopicsChart";
import VisitorsByCountry from "@/src/components/admin/analytics/VisitorsByCountry";
import DevicePlatformChart from "@/src/components/admin/analytics/DevicePlatformChart";
import PeakHoursChart from "@/src/components/admin/analytics/PeakHoursChart";
import type { AnalyticsData, TimeRange } from "@/src/components/admin/analytics/types";

export default function AdminAnalyticsPage() {
  const [activeRange, setActiveRange] = useState<TimeRange>("7D");
  const [customRange, setCustomRange] = useState<{ start: string; end: string } | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({ range: activeRange });
    if (activeRange === "custom" && customRange) {
      params.set("start", customRange.start);
      params.set("end", customRange.end);
    }

    fetch(`/api/admin/analytics?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json() as Promise<AnalyticsData>;
      })
      .then((data: AnalyticsData) => {
        if (data && data.kpis) {
          setAnalyticsData(data);
        }
      })
      .catch((err) => console.error("Error fetching analytics:", err));
  }, [activeRange, customRange]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Range Filters */}
      <AnalyticsHeader
        activeRange={activeRange}
        onSelectRange={(range) => setActiveRange(range)}
        onSelectCustomRange={(start, end) => setCustomRange({ start, end })}
      />

      {analyticsData && (
        <div className="space-y-6">
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
