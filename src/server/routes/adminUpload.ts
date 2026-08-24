import { Hono } from "hono";
import { getRequestContext } from "@cloudflare/next-on-pages";

const adminUploadRoute = new Hono();

interface R2BucketBinding {
  put: (key: string, value: ArrayBuffer | Uint8Array, options?: { httpMetadata?: { contentType?: string } }) => Promise<unknown>;
  delete: (key: string) => Promise<unknown>;
}

function getR2PublicUrl(): string {
  try {
    const ctx = getRequestContext();
    const env = ctx?.env as { R2_PUBLIC_URL?: string } | undefined;
    if (env?.R2_PUBLIC_URL) {
      return env.R2_PUBLIC_URL.replace(/\/$/, "");
    }
  } catch {}
  const url =
    (typeof process !== "undefined" && (process.env?.R2_PUBLIC_URL || process.env?.R2_PUBLC_URL)) ||
    "https://pub-b534e22f723c443c85a87484a6c795cc.r2.dev";
  return url.replace(/\/$/, "");
}

function getR2BucketBinding(): R2BucketBinding | null {
  try {
    const ctx = getRequestContext();
    const env = ctx?.env as { IMAGES?: R2BucketBinding } | undefined;
    if (env?.IMAGES) {
      return env.IMAGES;
    }
  } catch {}
  return null;
}

adminUploadRoute.post("/image", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const extMatch = file.name.match(/\.([a-zA-Z0-9]+)$/);
    const ext = extMatch ? extMatch[1].toLowerCase() : "png";
    const cleanBaseName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
    const key = `uploads/${Date.now()}-${cleanBaseName}.${ext}`;
    const contentType = file.type || `image/${ext === "jpg" ? "jpeg" : ext}`;

    const r2Binding = getR2BucketBinding();
    if (r2Binding) {
      await r2Binding.put(key, arrayBuffer, {
        httpMetadata: { contentType },
      });
      return c.json({
        url: `${getR2PublicUrl()}/${key}`,
        key,
      });
    }

    return c.json({
      url: `${getR2PublicUrl()}/${key}`,
      key,
    });
  } catch (err) {
    return c.json({ error: (err as Error).message }, 500);
  }
});

adminUploadRoute.delete("/image", async (c) => {
  try {
    let key = c.req.query("key") || "";
    const url = c.req.query("url") || "";

    if (!key && url) {
      if (url.includes("/uploads/")) {
        const parts = url.split("/uploads/");
        key = `uploads/${parts[parts.length - 1]}`;
      } else {
        key = url.replace(/^https?:\/\/[^/]+\//, "");
      }
    }

    if (!key) {
      return c.json({ error: "No image key or URL provided" }, 400);
    }

    const r2Binding = getR2BucketBinding();
    if (r2Binding) {
      await r2Binding.delete(key);
    }

    return c.json({ success: true, key });
  } catch (err) {
    return c.json({ error: (err as Error).message }, 500);
  }
});

export default adminUploadRoute;
