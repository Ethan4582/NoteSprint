import process from "node:process";
import { NextResponse } from "next/server";
import { getTopTopics, getDbStats } from "@/src/db";
import type { AnalyticsData, TimeRange, TopTopic } from "@/src/components/admin/analytics/types";

export const dynamic = "force-dynamic";

function getCfCredentials() {
  const token = (typeof process !== "undefined" && process.env?.CLOUDFLARE_API_TOKEN) || "";
  const accountId = (typeof process !== "undefined" && process.env?.CLOUDFLARE_ACCOUNT_ID) || "39c549d629e751c6bd6195081b2a88b8";
  const zoneId = (typeof process !== "undefined" && process.env?.CLOUDFLARE_ZONE_ID) || "dc062fee89a9757eb58f4e1791805bff";
  const scriptName = "notesprint";
  const hostname = "notes.aash7.xyz";
  return { token, accountId, zoneId, scriptName, hostname };
}

// 5-minute in-process cache
interface CacheEntry {
  data: AnalyticsData;
  expiresAt: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000;

function getCacheKey(range: TimeRange, start?: string | null, end?: string | null) {
  return `${range}|${start ?? ""}|${end ?? ""}`;
}

interface WorkerInvocation {
  dimensions: {
    datetime: string;
    status: string;
  };
  sum: {
    requests: number;
    errors: number;
    subrequests: number;
    cpuTimeUs: number;
  };
}

interface AdaptiveGroup {
  dimensions: {
    clientCountryName: string;
    userAgentBrowser: string;
    clientDeviceType: string;
    clientRequestPath: string;
  };
  count: number;
}

interface CfGraphQLResponse {
  viewer?: {
    accounts?: Array<{
      workersInvocationsAdaptive?: WorkerInvocation[];
    }>;
    zones?: Array<{
      httpRequestsAdaptiveGroups?: AdaptiveGroup[];
    }>;
  };
}

const ICON_MAP: Record<string, string> = {
  interview_ai: "/icon/python.png",
  interview_backend: "/icon/nodejs.png",
  interview_frontend: "/icon/react_.svg",
  interview_hr: "/icon/oops.png",
  nodejs: "/icon/nodejs.png",
  express: "/icon/express.png",
  mongodb: "/icon/mongodb.png",
  postgresql: "/icon/postgresql.png",
  react: "/icon/react_.svg",
  nextjs: "/icon/nextjs.svg",
  typescript: "/icon/typescript.webp",
  javascript: "/icon/javascript.png",
  python: "/icon/python.png",
  redis: "/icon/redis.png",
  lld: "/icon/lld.png",
  hld: "/icon/hld.png",
  sql: "/icon/sql.png",
  docker: "/icon/docker.png",
  operating_systeam: "/icon/operating_systeam.png",
  computer_network: "/icon/computer_network.png",
  database_management: "/icon/database_management.png",
  oops: "/icon/oops.png",
};

const COUNTRY_NAMES: Record<string, string> = {
  US: "United States", IN: "India", GB: "United Kingdom", DE: "Germany",
  CA: "Canada", AU: "Australia", FR: "France", JP: "Japan", SG: "Singapore",
  NL: "Netherlands", SE: "Sweden", BR: "Brazil", KR: "South Korea",
  PK: "Pakistan", TR: "Turkey", NG: "Nigeria", ID: "Indonesia",
  HK: "Hong Kong", ZA: "South Africa", RU: "Russia", IT: "Italy",
  ES: "Spain", MX: "Mexico", MA: "Morocco", SA: "Saudi Arabia",
};

function getCountryFlag(code: string): string {
  if (!code || code.length !== 2) return "🌐";
  try {
    const codePoints = code
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return "🌐";
  }
}

async function queryCloudflareRealData(startDateIso: string, endDateIso: string, since23hIso: string) {
  const { token, accountId, zoneId, scriptName, hostname } = getCfCredentials();
  if (!token) return { invocations: [], adaptiveGroups: [] };

  const query = `
    query {
      viewer {
        accounts(filter: { accountTag: "${accountId}" }) {
          workersInvocationsAdaptive(
            limit: 1000,
            filter: {
              scriptName: "${scriptName}",
              datetime_geq: "${startDateIso}",
              datetime_leq: "${endDateIso}"
            },
            orderBy: [datetime_ASC]
          ) {
            dimensions { datetime status }
            sum { requests errors subrequests cpuTimeUs }
          }
        }
        zones(filter: { zoneTag: "${zoneId}" }) {
          httpRequestsAdaptiveGroups(
            limit: 100,
            filter: {
              clientRequestHTTPHost: "${hostname}",
              datetime_geq: "${since23hIso}"
            }
          ) {
            dimensions {
              clientCountryName
              userAgentBrowser
              clientDeviceType
              clientRequestPath
            }
            count
          }
        }
      }
    }
  `;

  try {
    const res = await fetch("https://api.cloudflare.com/client/v4/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      console.error("Cloudflare GraphQL HTTP error:", res.status);
      return { invocations: [], adaptiveGroups: [] };
    }

    const json = (await res.json()) as { data?: CfGraphQLResponse; errors?: Array<{ message: string }> };
    if (json.errors?.length) {
      console.error("Cloudflare GraphQL errors:", json.errors);
    }

    const invocations = json.data?.viewer?.accounts?.[0]?.workersInvocationsAdaptive ?? [];
    const adaptiveGroups = json.data?.viewer?.zones?.[0]?.httpRequestsAdaptiveGroups ?? [];
    return { invocations, adaptiveGroups };
  } catch (err) {
    console.error("Cloudflare GraphQL fetch error:", err);
    return { invocations: [], adaptiveGroups: [] };
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const range = (searchParams.get("range") || "7D") as TimeRange;
  const customStart = searchParams.get("start");
  const customEnd = searchParams.get("end");

  // Serve cached data if valid
  const cacheKey = getCacheKey(range, customStart, customEnd);
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.data);
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

  // Fetch D1 Database stats
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
  } catch (err) {
    console.error("D1 stats query error:", err);
  }

  // Calculate real metrics from workersInvocationsAdaptive
  const totalRequests = invocations.reduce((s, item) => s + (item.sum?.requests ?? 0), 0);
  const totalErrors = invocations.reduce((s, item) => s + (item.sum?.errors ?? 0), 0);

  // Calculate real path counts for article reads vs flashcard drills from edge adaptive telemetry
  let realArticleReadsCount = 0;
  let realFlashcardDrillsCount = 0;

  for (const group of adaptiveGroups) {
    const path = group.dimensions.clientRequestPath || "";
    if (path.startsWith("/system-design") || path.startsWith("/articles") || path.startsWith("/api/articles")) {
      realArticleReadsCount += group.count;
    } else {
      realFlashcardDrillsCount += group.count;
    }
  }

  // Time-series Trend Data construction
  const trendData = [];
  const studyActivity = [];
  const isHourly = range === "1H" || range === "24H";

  if (isHourly) {
    const pointCount = range === "1H" ? 12 : 24;
    const stepMs = range === "1H" ? 5 * 60 * 1000 : 60 * 60 * 1000;

    for (let i = 0; i < pointCount; i++) {
      const bucketStart = new Date(now.getTime() - (pointCount - 1 - i) * stepMs);
      const bucketEnd = new Date(bucketStart.getTime() + stepMs);
      const label = range === "1H"
        ? `${bucketStart.getHours().toString().padStart(2, "0")}:${bucketStart.getMinutes().toString().padStart(2, "0")}`
        : `${bucketStart.getHours().toString().padStart(2, "0")}:00`;

      let bucketReqs = 0;
      for (const inv of invocations) {
        const invTime = new Date(inv.dimensions.datetime).getTime();
        if (invTime >= bucketStart.getTime() && invTime < bucketEnd.getTime()) {
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

  // Country breakdown from real notes.aash7.xyz telemetry
  const countryCountMap = new Map<string, number>();
  let totalCountryCount = 0;

  for (const group of adaptiveGroups) {
    const c = group.dimensions.clientCountryName;
    if (c && c !== "Unknown" && c !== "XX") {
      countryCountMap.set(c, (countryCountMap.get(c) ?? 0) + group.count);
      totalCountryCount += group.count;
    }
  }

  const sortedCountries = [...countryCountMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topCountries = sortedCountries.map(([code, count]) => ({
    code,
    name: COUNTRY_NAMES[code] ?? code,
    flag: getCountryFlag(code),
    visitors: count,
    percentage: totalCountryCount > 0 ? Math.round((count / totalCountryCount) * 100) : 0,
  }));

  // Device breakdown from real Cloudflare clientDeviceType
  let desktopCount = 0;
  let mobileCount = 0;
  let tabletCount = 0;

  for (const group of adaptiveGroups) {
    const device = (group.dimensions.clientDeviceType || "").toLowerCase();
    if (device === "mobile") {
      mobileCount += group.count;
    } else if (device === "tablet") {
      tabletCount += group.count;
    } else {
      desktopCount += group.count;
    }
  }

  const totalDeviceReqs = desktopCount + mobileCount + tabletCount || 1;
  const devices = [
    { name: "Desktop", value: Math.round((desktopCount / totalDeviceReqs) * 100), fill: "var(--accent)" },
    { name: "Mobile Devices", value: Math.round((mobileCount / totalDeviceReqs) * 100), fill: "var(--text-secondary)" },
    { name: "Tablets", value: Math.round((tabletCount / totalDeviceReqs) * 100), fill: "var(--border-strong)" },
  ];
  const deviceSum = devices.reduce((s, d) => s + d.value, 0);
  if (deviceSum > 0 && deviceSum !== 100) {
    devices[0].value += 100 - deviceSum;
  }

  // Peak hours from worker invocation timestamps (UTC)
  const hourlyBuckets = new Array(12).fill(0);
  for (const inv of invocations) {
    const hr = new Date(inv.dimensions.datetime).getUTCHours();
    const bucket = Math.floor(hr / 2);
    hourlyBuckets[bucket] += inv.sum?.requests ?? 0;
  }
  const peakHours = hourlyBuckets.map((activity, i) => ({
    hour: `${(i * 2).toString().padStart(2, "0")}:00`,
    activity,
  }));

  // Top topics from D1
  const sumQuestions = totalQuestions || dbTopics.reduce((s, t) => s + (t.q_count || 0), 1);
  const topTopics: TopTopic[] = dbTopics.map((t) => ({
    slug: t.slug,
    name: t.name || t.slug.replace(/_/g, " "),
    iconPath: ICON_MAP[t.slug] || "/icon/nodejs.png",
    visitors: t.q_count,
    percentage: Math.min(100, Math.round((t.q_count / sumQuestions) * 100)),
  }));

  // KPI metrics
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
  return NextResponse.json(responseData);
}
