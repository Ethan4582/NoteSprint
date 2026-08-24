"use client";

import { useParams } from "next/navigation";
import ArticleEditClient from "@/src/app/admin/articles/[slug]/edit/ArticleEditClient";

export default function EditArticlePage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";
  return <ArticleEditClient slug={slug} />;
}
