import { updateQuestion } from "@/src/db";

export async function saveQuestionToSource(
  _topicSlug: string,
  id: number,
  newQuestion: string,
  newAnswer: string,
  imageUrl?: string | null
): Promise<boolean> {
  try {
    await updateQuestion(id, {
      question: newQuestion,
      answer: newAnswer,
      ...(imageUrl !== undefined ? { imageUrl } : {}),
    });
    return true;
  } catch (err) {
    console.error("Failed to update question in D1:", err);
    return false;
  }
}
