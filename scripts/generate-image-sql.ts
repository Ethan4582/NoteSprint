import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const R2_PUBLIC_URL = (process.env.R2_PUBLC_URL || "https://pub-b534e22f723c443c85a87484a6c795cc.r2.dev").replace(/\/$/, "");

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

function generateCleanSql() {
  const publicDir = path.join(process.cwd(), "public");
  const assetsDir = path.join(publicDir, "assets");
  const iconDir = path.join(publicDir, "icon");

  const files = [...getAllFiles(assetsDir), ...getAllFiles(iconDir)];
  const imageFiles = files.filter((f) => /\.(png|jpe?g|webp)$/i.test(f));

  const statements: string[] = [];

  for (const filePath of imageFiles) {
    const relativeToPublic = path.relative(publicDir, filePath).replace(/\\/g, "/");
    const parsed = path.parse(relativeToPublic);
    const r2Key = path.posix.join(parsed.dir, `${parsed.name}.webp`);
    const publicUrl = `${R2_PUBLIC_URL}/${r2Key}`;

    const path1 = relativeToPublic;
    const path2 = `/${relativeToPublic}`;
    const path3 = `${parsed.dir}/${parsed.name}.webp`;
    const path4 = `/${parsed.dir}/${parsed.name}.webp`;

    statements.push(
      `UPDATE questions SET image_url = '${escapeSql(publicUrl)}' WHERE image_url = '${escapeSql(path1)}' OR image_url = '${escapeSql(path2)}' OR image_url = '${escapeSql(path3)}' OR image_url = '${escapeSql(path4)}';`
    );
  }

  const outDir = path.join(process.cwd(), "drizzle");
  const sqlFile = path.join(outDir, "update-image-urls.sql");
  fs.writeFileSync(sqlFile, statements.join("\n"), "utf-8");
  console.log(`Generated clean SQL with ${statements.length} updates at: ${sqlFile}`);
}

generateCleanSql();
