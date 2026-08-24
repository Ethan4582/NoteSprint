import type { AnalyticsData } from "@/src/components/admin/analytics/types";

export function getCfCredentials() {
  const token = (typeof process !== "undefined" && process.env?.CLOUDFLARE_API_TOKEN) || "";
  const accountId = (typeof process !== "undefined" && process.env?.CLOUDFLARE_ACCOUNT_ID) || "39c549d629e751c6bd6195081b2a88b8";
  const zoneId = (typeof process !== "undefined" && process.env?.CLOUDFLARE_ZONE_ID) || "dc062fee89a9757eb58f4e1791805bff";
  const scriptName = "notesprint";
  const hostname = "notes.aash7.xyz";
  return { token, accountId, zoneId, scriptName, hostname };
}

export interface CacheEntry {
  data: AnalyticsData;
  expiresAt: number;
}
export const cache = new Map<string, CacheEntry>();
export const CACHE_TTL_MS = 5 * 60 * 1000;

export interface WorkerInvocation {
  dimensions: { datetime: string; status: string };
  sum: { requests: number; errors: number; subrequests: number; cpuTimeUs: number };
}

export interface AdaptiveGroup {
  dimensions: {
    clientCountryName: string;
    userAgentBrowser: string;
    clientDeviceType: string;
    clientRequestPath: string;
  };
  count: number;
}

export interface CfGraphQLResponse {
  viewer?: {
    accounts?: Array<{ workersInvocationsAdaptive?: WorkerInvocation[] }>;
    zones?: Array<{ httpRequestsAdaptiveGroups?: AdaptiveGroup[] }>;
  };
}

export const ICON_MAP: Record<string, string> = {
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

export const COUNTRY_NAMES: Record<string, string> = {
  US: "United States", IN: "India", GB: "United Kingdom", DE: "Germany",
  CA: "Canada", AU: "Australia", FR: "France", JP: "Japan", SG: "Singapore",
  NL: "Netherlands", SE: "Sweden", BR: "Brazil", KR: "South Korea",
  PK: "Pakistan", TR: "Turkey", NG: "Nigeria", ID: "Indonesia",
  HK: "Hong Kong", ZA: "South Africa", RU: "Russia", IT: "Italy",
  ES: "Spain", MX: "Mexico", MA: "Morocco", SA: "Saudi Arabia",
};

export function getCountryFlag(code: string): string {
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

export async function queryCloudflareRealData(startDateIso: string, endDateIso: string, since23hIso: string) {
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
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) return { invocations: [], adaptiveGroups: [] };
    const json = (await res.json()) as { data?: CfGraphQLResponse };
    const invocations = json.data?.viewer?.accounts?.[0]?.workersInvocationsAdaptive ?? [];
    const adaptiveGroups = json.data?.viewer?.zones?.[0]?.httpRequestsAdaptiveGroups ?? [];
    return { invocations, adaptiveGroups };
  } catch {
    return { invocations: [], adaptiveGroups: [] };
  }
}
