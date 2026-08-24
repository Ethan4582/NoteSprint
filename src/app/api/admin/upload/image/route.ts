import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const R2_BUCKET = "quiz-app-images";

function getR2PublicUrl(): string {
  try {
    const ctx = getRequestContext();
    if ((ctx?.env as any)?.R2_PUBLIC_URL) {
      return (ctx.env as any).R2_PUBLIC_URL.replace(/\/$/, "");
    }
  } catch {}
  const url = (typeof process !== "undefined" && (process.env?.R2_PUBLIC_URL || process.env?.R2_PUBLC_URL)) || "https://pub-b534e22f723c443c85a87484a6c795cc.r2.dev";
  return url.replace(/\/$/, "");
}

function getR2BucketBinding(): any {
  try {
    const ctx = getRequestContext();
    if ((ctx?.env as any)?.IMAGES) {
      return (ctx.env as any).IMAGES;
    }
  } catch {}
  return null;
}

function getS3Client(): S3Client | null {
  const endpoint = typeof process !== "undefined" ? process.env?.CLOUDFLARE_R2_ENDPOINT : undefined;
  const accessKeyId = typeof process !== "undefined" ? process.env?.CLOUDFLARE_R2_ACCESS_KEY_ID : undefined;
  const secretAccessKey = typeof process !== "undefined" ? process.env?.CLOUDFLARE_R2_SECRET_ACCESS_KEY : undefined;

  if (endpoint && accessKeyId && secretAccessKey) {
    return new S3Client({
      region: "auto",
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const extMatch = file.name.match(/\.([a-zA-Z0-9]+)$/);
    const ext = extMatch ? extMatch[1].toLowerCase() : "png";
    const cleanBaseName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
    const key = `uploads/${Date.now()}-${cleanBaseName}.${ext}`;
    const contentType = file.type || `image/${ext === "jpg" ? "jpeg" : ext}`;

    const r2Binding = getR2BucketBinding();
    if (r2Binding) {
      await r2Binding.put(key, buffer, {
        httpMetadata: { contentType },
      });
      return NextResponse.json({
        url: `${getR2PublicUrl()}/${key}`,
        key,
      });
    }

    const s3 = getS3Client();
    if (!s3) {
      return NextResponse.json({ error: "R2 Storage not configured" }, { status: 500 });
    }

    await s3.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    );

    return NextResponse.json({
      url: `${getR2PublicUrl()}/${key}`,
      key,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let key = searchParams.get("key") || "";
    const url = searchParams.get("url") || "";

    if (!key && url) {
      if (url.includes("/uploads/")) {
        const parts = url.split("/uploads/");
        key = `uploads/${parts[parts.length - 1]}`;
      } else {
        key = url.replace(/^https?:\/\/[^/]+\//, "");
      }
    }

    if (!key) {
      return NextResponse.json({ error: "No image key or URL provided" }, { status: 400 });
    }

    const r2Binding = getR2BucketBinding();
    if (r2Binding) {
      await r2Binding.delete(key);
      return NextResponse.json({ success: true, key });
    }

    const s3 = getS3Client();
    if (s3) {
      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: R2_BUCKET,
            Key: key,
          })
        );
      } catch (err) {
        console.error("R2 deletion error:", err);
      }
    }

    return NextResponse.json({ success: true, key });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
