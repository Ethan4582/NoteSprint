import MarkdownReaderClient from "./MarkdownReaderClient";

export const runtime = "edge";

export default async function MarkdownReaderPage({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}) {
  const { type, slug } = await params;
  return <MarkdownReaderClient type={type} slug={slug} />;
}
