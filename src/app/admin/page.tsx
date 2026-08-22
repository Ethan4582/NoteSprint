"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminStats } from "@/src/lib/admin-api";
import { Button } from "@/src/components/ui/button";
import { HelpCircle, FileText, FolderKanban, Plus, ExternalLink, Database, HardDrive, Sparkles, ArrowRight } from "lucide-react";

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

  const metricCards = [
    {
      title: "Total Questions",
      count: stats.totalQuestions,
      description: "Active recall flashcards across all topics",
      icon: HelpCircle,
      href: "/admin/questions",
    },
    {
      title: "Topics & Subjects",
      count: stats.totalTopics,
      description: "Categories including Backend, Frontend, CS",
      icon: FolderKanban,
      href: "/admin/questions",
    },
    {
      title: "Articles & Designs",
      count: stats.totalArticles,
      description: "System Design, HLD and LLD guides",
      icon: FileText,
      href: "/admin/articles",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
            Admin Overview
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Manage your Cloudflare D1 database questions, articles, and R2 images.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/questions/new">
            <Button size="sm" className="h-9 px-4 rounded-xl font-bold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-sm">
              <Plus className="h-4 w-4 mr-1.5" /> Add Question
            </Button>
          </Link>
          <Link href="/admin/articles/new">
            <Button size="sm" variant="outline" className="h-9 px-4 rounded-xl font-bold border-[var(--border-strong)] bg-raised text-[var(--text-primary)]">
              <Plus className="h-4 w-4 mr-1.5" /> Add Article
            </Button>
          </Link>
        </div>
      </div>

      {/* 3-Column Compact Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          const formattedIdx = String(idx + 1).padStart(3, "0");
          return (
            <Link key={card.title} href={card.href}>
              <div className="rounded-2xl border border-[var(--border-strong)] bg-raised p-5 shadow-raised-crisp flex flex-col justify-between hover:border-[var(--accent)]/40 transition-all cursor-pointer group h-full space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-[var(--text-muted)]">
                      {formattedIdx}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] ml-1">
                      {card.title}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] group-hover:border-[var(--accent)]/30 text-[var(--accent)] transition-all">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div>
                  <div className="text-3xl font-black tracking-tight text-[var(--text-primary)] font-mono">
                    {loading ? "..." : card.count}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-1">
                    {card.description}
                  </p>
                </div>

                <div className="flex items-center text-xs font-bold text-[var(--accent)] pt-2 border-t border-[var(--border)] group-hover:translate-x-0.5 transition-transform">
                  <span>Manage collection</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Cloudflare Infrastructure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[var(--border-strong)] bg-raised p-5 shadow-raised-crisp space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-[var(--accent)]" />
              <span className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">
                Cloudflare D1 Database
              </span>
            </div>
            <span className="text-emerald-500 text-[11px] font-bold flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Connected
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">Database Name</span>
              <span className="font-mono font-bold text-[var(--text-primary)]">notes-db</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">Binding</span>
              <span className="font-mono font-bold text-[var(--text-primary)]">env.DB</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[var(--text-secondary)]">Driver</span>
              <span className="font-mono font-bold text-[var(--text-primary)]">Drizzle ORM (Remote D1)</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border-strong)] bg-raised p-5 shadow-raised-crisp space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-[var(--accent)]" />
              <span className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">
                Cloudflare R2 Storage
              </span>
            </div>
            <span className="text-emerald-500 text-[11px] font-bold flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Active
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">Bucket Name</span>
              <span className="font-mono font-bold text-[var(--text-primary)]">quiz-app-images</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">Image Pipeline</span>
              <span className="font-mono font-bold text-[var(--text-primary)]">Sharp WebP (q=80)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[var(--text-secondary)]">Public Access</span>
              <span className="font-mono font-bold text-[var(--text-primary)]">R2 CDN Custom Domain</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Link href="/dashboard" target="_blank">
          <Button variant="outline" size="sm" className="h-8 text-xs font-bold rounded-xl border-[var(--border-strong)] bg-raised">
            Open Public App <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
