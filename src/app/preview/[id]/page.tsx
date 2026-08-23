import PreviewClient from "./PreviewClient";

export const revalidate = 3600;

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PreviewClient id={id} />;
}
