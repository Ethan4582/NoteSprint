export interface Question {
  id: number;
  question: string;
  answer?: string;
  image?: string;
  image2?: string;
  imageUrl?: string | null;
  code?: string;
  topic?: string;
  topicId?: number;
  topicSlug?: string;
  topicName?: string;
  subject?: string;
  category?: string;
  sourceFile?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export const DATA: Record<string, any> = {};

export function getQuestions(_subject: string | string[], _topic: string | string[]): Question[] {
  return [];
}
