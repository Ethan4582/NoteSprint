import QuestionEditClient from "@/src/app/admin/questions/[id]/edit/QuestionEditClient";

export const dynamic = "force-static";

export function generateStaticParams() {
  const ids: { id: string }[] = [];
  for (let i = 1; i <= 250; i++) {
    ids.push({ id: String(i) });
  }
  return ids;
}

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <QuestionEditClient id={parseInt(id, 10)} />;
}
