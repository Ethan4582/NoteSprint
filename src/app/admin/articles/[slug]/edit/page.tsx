import ArticleEditClient from "@/src/app/admin/articles/[slug]/edit/ArticleEditClient";

export const runtime = "edge";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ArticleEditClient slug={slug} />;
}
