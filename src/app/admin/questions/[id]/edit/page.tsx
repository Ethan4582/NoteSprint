import QuestionEditClient from "@/src/app/admin/questions/[id]/edit/QuestionEditClient";

export const runtime = "edge";

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <QuestionEditClient id={parseInt(id, 10)} />;
}
