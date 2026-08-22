const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || "";
const apiToken = process.env.CLOUDFLARE_API_TOKEN || "";
const databaseId = "e867079a-d387-4c77-9304-4210a3f60fd4";

export async function queryD1<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
      signal: controller.signal,
    });

    const json = await res.json();
    if (!json.success || !json.result || !json.result[0]) {
      throw new Error(json.errors?.[0]?.message || "D1 Query failed");
    }

    return (json.result[0].results || []) as T[];
  } finally {
    clearTimeout(timeout);
  }
}
