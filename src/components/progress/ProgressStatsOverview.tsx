"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { OverallProgressStats } from "@/src/lib/progress";
import { Sparkles, Layers, Target, CheckCircle2 } from "lucide-react";

interface ProgressStatsOverviewProps {
  stats: OverallProgressStats;
}

export default function ProgressStatsOverview({ stats }: ProgressStatsOverviewProps) {
  const cards = [
    {
      title: "Total Sessions",
      value: stats.totalSessions,
      subtitle: `${stats.flashcardSessions} Flashcard · ${stats.interviewSessions} Interview`,
      icon: Layers,
      highlightColor: "text-[var(--accent)]",
    },
    {
      title: "Overall Accuracy",
      value: stats.totalSessions > 0 ? `${stats.overallAccuracy}%` : "—",
      subtitle:
        stats.overallAccuracy >= 80
          ? "Mastery tier performance"
          : stats.overallAccuracy >= 60
          ? "Steady recall & retention"
          : "Keep practicing daily",
      icon: Target,
      highlightColor: "text-emerald-600",
    },
    {
      title: "Cards Reviewed",
      value: stats.totalCardsReviewed,
      subtitle: `${stats.totalCorrect} correct · ${stats.totalIncorrect} to revisit`,
      icon: CheckCircle2,
      highlightColor: "text-blue-600",
    },
    {
      title: "Topics Practiced",
      value: stats.topicStats.length,
      subtitle: "Unique knowledge domains",
      icon: Sparkles,
      highlightColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            className="rounded-[12px] border border-[var(--border)] bg-white shadow-2xs hover:border-[var(--border-strong)] hover:shadow-xs transition-all"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
              <CardTitle className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                {card.title}
              </CardTitle>
              <div className="p-1.5 rounded-[8px] bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
                <Icon size={14} className={card.highlightColor} />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                {card.value}
              </div>
              <p className="text-xs font-medium text-[var(--text-muted)] mt-1 truncate">
                {card.subtitle}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
