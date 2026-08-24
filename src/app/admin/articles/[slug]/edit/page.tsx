import ArticleEditClient from "./ArticleEditClient";

export const runtime = "edge";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ArticleEditClient slug={slug} />;
}
