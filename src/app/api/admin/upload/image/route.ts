import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export const dynamic = "force-dynamic";

const R2_BUCKET = "quiz-app-images";
const R2_PUBLIC_URL = (process.env.R2_PUBLC_URL || "https://pub-b534e22f723c443c85a87484a6c795cc.r2.dev").replace(/\/$/, "");

function getS3Client(): S3Client | null {
  if (
    process.env.CLOUDFLARE_R2_ENDPOINT &&
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
  ) {
    return new S3Client({
      region: "auto",
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
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
      url: `${R2_PUBLIC_URL}/${key}`,
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
