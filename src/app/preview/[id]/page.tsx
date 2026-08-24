import PreviewClient from "./PreviewClient";

export const runtime = "edge";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PreviewClient id={id} />;
}
