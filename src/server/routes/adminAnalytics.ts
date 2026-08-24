import { Hono } from "hono";
import { getTopTopics, getDbStats } from "@/src/db";
import type { AnalyticsData, TimeRange, TopTopic } from "@/src/components/admin/analytics/types";
import {
  cache,
  CACHE_TTL_MS,
  queryCloudflareRealData,
  COUNTRY_NAMES,
  getCountryFlag,
  ICON_MAP,
} from "./analyticsHelpers";

const adminAnalyticsRoute = new Hono();

adminAnalyticsRoute.get("/", async (c) => {
  const range = (c.req.query("range") || "7D") as TimeRange;
  const customStart = c.req.query("start");
  const customEnd = c.req.query("end");

  const cacheKey = `${range}|${customStart ?? ""}|${customEnd ?? ""}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return c.json(cached.data);
  }

  const now = new Date();
  let startDate: Date = new Date(now);
  let endDate: Date = new Date(now);

  if (range === "1H") startDate = new Date(now.getTime() - 60 * 60 * 1000);
  else if (range === "24H") startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  else if (range === "7D") startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  else if (range === "30D") startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  else if (range === "90D") startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  else if (range === "custom" && customStart) {
    startDate = new Date(customStart);
    if (customEnd) endDate = new Date(customEnd);
  } else {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  const since23h = new Date(now.getTime() - 23 * 60 * 60 * 1000).toISOString();
  const { invocations, adaptiveGroups } = await queryCloudflareRealData(
    startDate.toISOString(),
    endDate.toISOString(),
    since23h
  );

  let dbTopics: Array<{ slug: string; name: string; q_count: number }> = [];
  let totalTopics = 0;
  let totalQuestions = 0;
  let totalArticles = 0;
  try {
    const [topT, stats] = await Promise.all([getTopTopics(7), getDbStats()]);
    if (topT?.length) dbTopics = topT;
    if (stats) {
      totalTopics = stats.totalTopics;
      totalQuestions = stats.totalQuestions;
      totalArticles = stats.totalArticles;
    }
  } catch {}

  const totalRequests = invocations.reduce((s, item) => s + (item.sum?.requests ?? 0), 0);
  const totalErrors = invocations.reduce((s, item) => s + (item.sum?.errors ?? 0), 0);

  let realArticleReadsCount = 0;
  for (const group of adaptiveGroups) {
    const path = group.dimensions.clientRequestPath || "";
    if (path.startsWith("/system-design") || path.startsWith("/articles") || path.startsWith("/api/articles")) {
      realArticleReadsCount += group.count;
    }
  }

  const trendData = [];
  const studyActivity = [];
  const isHourly = range === "1H" || range === "24H";

  if (isHourly) {
    const pointCount = range === "1H" ? 12 : 24;
    const stepMs = range === "1H" ? 5 * 60 * 1000 : 60 * 60 * 1000;

    for (let i = 0; i < pointCount; i++) {
      const bucketStart = new Date(now.getTime() - (pointCount - 1 - i) * stepMs);
      const label = range === "1H"
        ? `${bucketStart.getHours().toString().padStart(2, "0")}:${bucketStart.getMinutes().toString().padStart(2, "0")}`
        : `${bucketStart.getHours().toString().padStart(2, "0")}:00`;

      let bucketReqs = 0;
      for (const inv of invocations) {
        const invTime = new Date(inv.dimensions.datetime).getTime();
        if (invTime >= bucketStart.getTime() && invTime < bucketStart.getTime() + stepMs) {
          bucketReqs += inv.sum?.requests ?? 0;
        }
      }

      trendData.push({
        date: label,
        visitors: bucketReqs,
        pageviews: bucketReqs,
        sessions: bucketReqs,
        avgTime: bucketReqs > 0 ? 1.5 : 0,
      });

      studyActivity.push({
        date: label,
        flashcardSessions: bucketReqs,
        articleReads: realArticleReadsCount > 0 && bucketReqs > 0 ? Math.min(bucketReqs, realArticleReadsCount) : 0,
      });
    }
  } else {
    const dayCount = range === "7D" ? 7 : range === "30D" ? 30 : range === "90D" ? 90 : 14;

    for (let i = dayCount - 1; i >= 0; i--) {
      const d = new Date(endDate);
      d.setDate(endDate.getDate() - i);
      const dayStr = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      let dayReqs = 0;
      for (const inv of invocations) {
        if (inv.dimensions.datetime.startsWith(dayStr)) {
          dayReqs += inv.sum?.requests ?? 0;
        }
      }

      trendData.push({
        date: label,
        visitors: dayReqs,
        pageviews: dayReqs,
        sessions: dayReqs,
        avgTime: dayReqs > 0 ? 2.5 : 0,
      });

      studyActivity.push({
        date: label,
        flashcardSessions: dayReqs,
        articleReads: 0,
      });
    }
  }

  const countryCountMap = new Map<string, number>();
  let totalCountryCount = 0;

  for (const group of adaptiveGroups) {
    const c = group.dimensions.clientCountryName;
    if (c && c !== "Unknown" && c !== "XX") {
      countryCountMap.set(c, (countryCountMap.get(c) ?? 0) + group.count);
      totalCountryCount += group.count;
    }
  }

  const topCountries = [...countryCountMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([code, count]) => ({
      code,
      name: COUNTRY_NAMES[code] ?? code,
      flag: getCountryFlag(code),
      visitors: count,
      percentage: totalCountryCount > 0 ? Math.round((count / totalCountryCount) * 100) : 0,
    }));

  let desktopCount = 0;
  let mobileCount = 0;
  let tabletCount = 0;

  for (const group of adaptiveGroups) {
    const device = (group.dimensions.clientDeviceType || "").toLowerCase();
    if (device === "mobile") mobileCount += group.count;
    else if (device === "tablet") tabletCount += group.count;
    else desktopCount += group.count;
  }

  const totalDeviceReqs = desktopCount + mobileCount + tabletCount || 1;
  const devices = [
    { name: "Desktop", value: Math.round((desktopCount / totalDeviceReqs) * 100), fill: "var(--accent)" },
    { name: "Mobile Devices", value: Math.round((mobileCount / totalDeviceReqs) * 100), fill: "var(--text-secondary)" },
    { name: "Tablets", value: Math.round((tabletCount / totalDeviceReqs) * 100), fill: "var(--border-strong)" },
  ];

  const hourlyBuckets = new Array(12).fill(0);
  for (const inv of invocations) {
    const hr = new Date(inv.dimensions.datetime).getUTCHours();
    hourlyBuckets[Math.floor(hr / 2)] += inv.sum?.requests ?? 0;
  }
  const peakHours = hourlyBuckets.map((activity, i) => ({
    hour: `${(i * 2).toString().padStart(2, "0")}:00`,
    activity,
  }));

  const sumQuestions = totalQuestions || dbTopics.reduce((s, t) => s + (t.q_count || 0), 1);
  const topTopics: TopTopic[] = dbTopics.map((t) => ({
    slug: t.slug,
    name: t.name || t.slug.replace(/_/g, " "),
    iconPath: ICON_MAP[t.slug] || "/icon/nodejs.png",
    visitors: t.q_count,
    percentage: Math.min(100, Math.round((t.q_count / sumQuestions) * 100)),
  }));

  const daysSpan = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)));
  const avgDaily = Math.round(totalRequests / daysSpan);

  const kpis = [
    {
      title: "Requests",
      value: totalRequests.toLocaleString(),
      change: totalErrors > 0 ? `${totalErrors} errors` : "100% success",
      changeType: "increase" as const,
      iconName: "users" as const,
      tooltip: "Real invocations served by NoteSprint Cloudflare Worker",
    },
    {
      title: "Worker Traffic",
      value: `${totalRequests.toLocaleString()} hits`,
      change: "Cloudflare Edge",
      changeType: "increase" as const,
      iconName: "eye" as const,
      tooltip: "Direct edge traffic recorded on notes.aash7.xyz",
    },
    {
      title: "Content & Library",
      value: `${totalQuestions.toLocaleString()} Qs`,
      change: `${totalTopics} Topics · ${totalArticles} Articles`,
      changeType: "increase" as const,
      iconName: "book" as const,
      tooltip: `${totalQuestions} questions across ${totalTopics} topics and ${totalArticles} articles in D1`,
    },
    {
      title: "Avg Daily Hits",
      value: avgDaily.toLocaleString(),
      change: `over ${daysSpan} day${daysSpan === 1 ? "" : "s"}`,
      changeType: "increase" as const,
      iconName: "clock" as const,
      tooltip: `Average daily worker invocations over the last ${daysSpan} days`,
    },
  ];

  const responseData: AnalyticsData = {
    timeRange: range,
    kpis,
    trendData,
    studyActivity,
    topCountries,
    topTopics,
    devices,
    peakHours,
  };

  cache.set(cacheKey, { data: responseData, expiresAt: Date.now() + CACHE_TTL_MS });
  return c.json(responseData);
});

export default adminAnalyticsRoute;
