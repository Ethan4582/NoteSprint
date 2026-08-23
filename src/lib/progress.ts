export interface SessionRecord {
  id: string;
  date: string;
  timestamp: number;
  mode: "flashcard" | "interview" | "notes";
  topics: string[];
  totalQuestions: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  timeSpentSeconds?: number;
}

export interface TopicStats {
  topic: string;
  name: string;
  isInterview: boolean;
  sessionsCount: number;
  cardsReviewed: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  lastPracticed: number;
}

export interface OverallProgressStats {
  totalSessions: number;
  flashcardSessions: number;
  interviewSessions: number;
  totalCardsReviewed: number;
  totalCorrect: number;
  totalIncorrect: number;
  overallAccuracy: number;
  topicStats: TopicStats[];
  recentTrend: { session: string; accuracy: number; count: number; date: string }[];
}

const STORAGE_KEY = "ns_user_progress_history";

export function getSessionHistory(): SessionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSessionProgress(
  data: Omit<SessionRecord, "id" | "date" | "timestamp">
): SessionRecord {
  const newRecord: SessionRecord = {
    ...data,
    id: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    date: new Date().toISOString(),
    timestamp: Date.now(),
  };

  if (typeof window !== "undefined") {
    try {
      const history = getSessionHistory();
      const updated = [newRecord, ...history].slice(0, 100);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }

  return newRecord;
}

export function clearSessionHistory(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }
}

export function computeProgressStats(history: SessionRecord[]): OverallProgressStats {
  const totalSessions = history.length;
  let flashcardSessions = 0;
  let interviewSessions = 0;
  let totalCardsReviewed = 0;
  let totalCorrect = 0;
  let totalIncorrect = 0;

  const topicMap: Record<string, {
    sessionsCount: number;
    cardsReviewed: number;
    correct: number;
    incorrect: number;
    lastPracticed: number;
    isInterview: boolean;
  }> = {};

  history.forEach((sess) => {
    if (sess.mode === "interview" || sess.topics.some((t) => t.startsWith("interview_"))) {
      interviewSessions += 1;
    } else {
      flashcardSessions += 1;
    }

    const answered = sess.correct + sess.incorrect;
    totalCardsReviewed += answered > 0 ? answered : sess.totalQuestions;
    totalCorrect += sess.correct;
    totalIncorrect += sess.incorrect;

    // Attribute to each topic involved in this session
    sess.topics.forEach((t) => {
      const topicSlug = t.trim();
      if (!topicSlug) return;
      if (!topicMap[topicSlug]) {
        topicMap[topicSlug] = {
          sessionsCount: 0,
          cardsReviewed: 0,
          correct: 0,
          incorrect: 0,
          lastPracticed: 0,
          isInterview: topicSlug.startsWith("interview_") || sess.mode === "interview",
        };
      }

      topicMap[topicSlug].sessionsCount += 1;
      topicMap[topicSlug].cardsReviewed += answered > 0 ? answered : sess.totalQuestions;
      topicMap[topicSlug].correct += sess.correct;
      topicMap[topicSlug].incorrect += sess.incorrect;
      if (sess.timestamp > topicMap[topicSlug].lastPracticed) {
        topicMap[topicSlug].lastPracticed = sess.timestamp;
      }
    });
  });

  const totalAnswered = totalCorrect + totalIncorrect;
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const topicStats: TopicStats[] = Object.entries(topicMap).map(([topic, data]) => {
    const topicAnswered = data.correct + data.incorrect;
    const accuracy = topicAnswered > 0 ? Math.round((data.correct / topicAnswered) * 100) : 0;
    const cleanName = topic.replace(/^interview_/, "").replace(/_/g, " ");
    const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

    return {
      topic,
      name: formattedName,
      isInterview: data.isInterview,
      sessionsCount: data.sessionsCount,
      cardsReviewed: data.cardsReviewed,
      correct: data.correct,
      incorrect: data.incorrect,
      accuracy,
      lastPracticed: data.lastPracticed,
    };
  }).sort((a, b) => b.lastPracticed - a.lastPracticed);

  // Chronological trend for chart (take last 10 sessions, reversed to be chronological)
  const recentTrend = [...history]
    .slice(0, 10)
    .reverse()
    .map((sess, idx) => ({
      session: `#${idx + 1}`,
      accuracy: sess.accuracy,
      count: sess.totalQuestions,
      date: new Date(sess.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }));

  return {
    totalSessions,
    flashcardSessions,
    interviewSessions,
    totalCardsReviewed,
    totalCorrect,
    totalIncorrect,
    overallAccuracy,
    topicStats,
    recentTrend,
  };
}
