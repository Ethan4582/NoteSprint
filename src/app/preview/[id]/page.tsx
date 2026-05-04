import { DATA } from "@/src/lib/data";
import PreviewClient from "./PreviewClient";

export function generateStaticParams() {
  return Object.keys(DATA).map((id) => ({
    id: id,
  }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PreviewClient id={id} />;
}
