import { getMarkdownFiles } from "@/src/lib/markdown";
import ArticleEditClient from "@/src/app/admin/articles/[slug]/edit/ArticleEditClient";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const lld = await getMarkdownFiles("lld");
  const hld = await getMarkdownFiles("hld");
  const all = [...lld, ...hld].map((a) => ({ slug: a.slug }));
  return all.length > 0 ? all : [{ slug: "music-leaderboard-system-design" }];
}

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ArticleEditClient slug={slug} />;
}
