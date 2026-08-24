import QuestionEditClient from "./QuestionEditClient";

export function generateStaticParams() {
  return [];
}

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  return <QuestionEditClient id={isNaN(numId) ? 1 : numId} />;
}
