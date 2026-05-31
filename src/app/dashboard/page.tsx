import DashboardClient from "@/src/components/dashboard/DashboardClient";
import { getMarkdownFiles } from "@/src/lib/markdown";

export default async function DashboardPage() {
  const lld = await getMarkdownFiles("lld");
  const hld = await getMarkdownFiles("hld");
  
  const systemDocs = [
    ...lld.map(d => ({ ...d, type: "lld" as const })),
    ...hld.map(d => ({ ...d, type: "hld" as const }))
  ];

  return <DashboardClient systemDocs={systemDocs} />;
}
