"use client";

import { useRouter } from "next/navigation";
import { Monitor, Database, Cpu, FolderOpen } from "lucide-react";

interface TopicCardProps {
  subject: string;
  topic: string;
  qCount: number;
}

export default function TopicCard({ subject, topic, qCount }: TopicCardProps) {
  const router = useRouter();

  const getIcon = (subject: string) => {
    if (subject.includes("frontend"))
      return <Monitor className="w-6 h-6 text-blue-500" />;
    if (subject.includes("backend"))
      return <Database className="w-6 h-6 text-orange-500" />;
    if (subject.includes("cs fundamentals"))
      return <Cpu className="w-6 h-6 text-purple-500" />;
    return <FolderOpen className="w-6 h-6 text-green-500" />;
  };

  return (
    <button
      onClick={() => router.push(`/practice?subject=${subject}&topic=${topic}`)}
      className="bg-[var(--bg-surface)] p-4 rounded-[12px] shadow-sm flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all active:scale-95 border border-[var(--border)]"
    >
      <div className="w-12 h-12 rounded-[8px] bg-[var(--bg-subtle)] flex items-center justify-center">
        {getIcon(subject)}
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-[var(--text-primary)] capitalize text-sm">
          {topic}
        </h3>
        <p className="text-[11px] text-[var(--text-muted)] font-medium mt-0.5">
          {qCount} Cards
        </p>
      </div>
    </button>
  );
}
