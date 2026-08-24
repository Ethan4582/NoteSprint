"use client";

import { useParams } from "next/navigation";
import QuestionEditClient from "@/src/app/admin/questions/[id]/edit/QuestionEditClient";

export default function EditQuestionPage() {
  const params = useParams();
  const idStr = (params?.id as string) || "1";
  const id = parseInt(idStr, 10);
  return <QuestionEditClient id={isNaN(id) ? 1 : id} />;
}
