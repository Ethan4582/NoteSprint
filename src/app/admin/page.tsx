"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminStats } from "@/src/lib/admin-api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { HelpCircle, FileText, FolderKanban, Plus, ExternalLink, Database, HardDrive, Sparkles } from "lucide-react";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<{
    totalTopics: number;
    totalQuestions: number;
    totalArticles: number;
  }>({
    totalTopics: 0,
    totalQuestions: 0,
    totalArticles: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((data) => setStats(data))
      .catch((err) => console.error("Failed to load admin stats:", err))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      title: "Total Questions",
      count: stats.totalQuestions,
      description: "Active recall flashcards across all topics",
      icon: HelpCircle,
      href: "/admin/questions",
      color: "text-[var(--accent)]",
      bg: "bg-[var(--accent)]/10",
    },
    {
      title: "Topics & Subjects",
      count: stats.totalTopics,
      description: "Categories including Backend, Frontend, CS",
      icon: FolderKanban,
      href: "/admin/questions",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Articles & Designs",
      count: stats.totalArticles,
      description: "System Design, HLD and LLD guides",
      icon: FileText,
      href: "/admin/articles",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
            Admin Overview
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Manage your Cloudflare D1 database questions, articles, and R2 images.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/questions">
            <Button size="sm" className="text-xs">
              <Plus className="h-4 w-4 mr-1" /> Add Question
            </Button>
          </Link>
          <Link href="/admin/articles">
            <Button size="sm" variant="secondary" className="text-xs">
              <Plus className="h-4 w-4 mr-1" /> Add Article
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href}>
              <Card className="hover:border-[var(--accent)]/50 transition-all cursor-pointer h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2 rounded-xl ${card.bg} ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
                    {loading ? "..." : card.count}
                  </div>
                  <CardDescription className="text-xs mt-1">
                    {card.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-[var(--accent)]" />
              <CardTitle className="text-base font-bold">Cloudflare D1 Database</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Managed SQLite database with Drizzle ORM
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">Database Name:</span>
              <span className="font-mono font-bold">notes-db</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">Binding:</span>
              <span className="font-mono font-bold">env.DB</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[var(--text-secondary)]">Status:</span>
              <span className="text-emerald-500 font-bold flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Connected & Active
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-[var(--accent)]" />
              <CardTitle className="text-base font-bold">Cloudflare R2 Storage</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Object storage for optimized WebP assets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">Bucket Name:</span>
              <span className="font-mono font-bold">quiz-app-images</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">Format:</span>
              <span className="font-mono font-bold">WebP (q=80)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[var(--text-secondary)]">Public Access:</span>
              <span className="text-emerald-500 font-bold flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Enabled
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-4">
        <Link href="/dashboard" target="_blank">
          <Button variant="outline" size="sm" className="text-xs">
            Open Public App <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
