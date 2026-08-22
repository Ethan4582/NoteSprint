import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import sharp from "sharp";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

dotenv.config();

const R2_BUCKET_NAME = "quiz-app-images";
const R2_PUBLIC_URL = (process.env.R2_PUBLC_URL || "https://pub-b534e22f723c443c85a87484a6c795cc.r2.dev").replace(/\/$/, "");

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "",
  },
});

function getAllFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

async function migrateImages() {
  const publicDir = path.join(process.cwd(), "public");
  const assetsDir = path.join(publicDir, "assets");
  const iconDir = path.join(publicDir, "icon");

  const files = [...getAllFiles(assetsDir), ...getAllFiles(iconDir)];
  const imageFiles = files.filter((f) => /\.(png|jpe?g|webp)$/i.test(f));

  console.log(`Found ${imageFiles.length} images to process and upload to R2...`);

  const urlMapping: Record<string, string> = {};
  let uploadedCount = 0;

  for (const filePath of imageFiles) {
    const relativeToPublic = path.relative(publicDir, filePath).replace(/\\/g, "/");
    const parsed = path.parse(relativeToPublic);
    const r2Key = path.posix.join(parsed.dir, `${parsed.name}.webp`);
    const publicUrl = `${R2_PUBLIC_URL}/${r2Key}`;

    urlMapping[relativeToPublic] = publicUrl;
    urlMapping[`/${relativeToPublic}`] = publicUrl;

    const fileBuffer = fs.readFileSync(filePath);
    let webpBuffer: Buffer;

    if (filePath.endsWith(".webp")) {
      webpBuffer = fileBuffer;
    } else {
      webpBuffer = await sharp(fileBuffer).webp({ quality: 80 }).toBuffer();
    }

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: r2Key,
          Body: webpBuffer,
          ContentType: "image/webp",
        })
      );
      uploadedCount++;
      console.log(`Uploaded [${uploadedCount}/${imageFiles.length}]: ${r2Key} -> ${publicUrl}`);
    } catch (err) {
      console.error(`Failed to upload ${r2Key}:`, err);
    }
  }

  const statements: string[] = [];

  for (const [oldPath, newUrl] of Object.entries(urlMapping)) {
    statements.push(
      `UPDATE questions SET image_url = '${escapeSql(newUrl)}' WHERE image_url = '${escapeSql(oldPath)}' OR image_url LIKE '%${escapeSql(oldPath)}%';`
    );
  }

  const outDir = path.join(process.cwd(), "drizzle");
  const sqlFile = path.join(outDir, "update-image-urls.sql");
  fs.writeFileSync(sqlFile, statements.join("\n"), "utf-8");

  console.log(`Successfully converted and uploaded ${uploadedCount} images to R2!`);
  console.log(`Generated image URL update script at: ${sqlFile}`);
}

migrateImages();
