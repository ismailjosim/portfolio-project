/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { StatsCard } from './StatsCard';
import { BlogInsightsCard } from './BlogInsightsCard';
import { SkillsInsightsCard } from './SkillsInsightsCard';
import { ProjectsOverviewCard } from './ProjectsOverviewCard';
import { RecentBlogsCard } from './RecentBlogsCard';
import { NewsletterInsightsCard } from './NewsletterInsightsCard';

import {
  BookOpen,
  FolderOpen,
  Zap,
  Eye,
  Plus,
  ExternalLink,
  Layers,
  FileCode2,
  Mail,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

interface DashboardData {
  totalBlogs: number;
  totalProjects: number;
  totalSkills: number;
  blogMetrics: {
    totalBlogs: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    averageViews: number;
  };
  skillsMetrics: {
    totalSkills: number;
    skillsByCategory: Record<string, number>;
    proficiencyBreakdown: Record<string, number>;
  };
  newsletterMetrics?: {
    totalEmailsSent: number;
    totalSubscribers: number;
    activeSubscribers: number;
    broadcastsSent: number;
    verificationsSent: number;
    welcomeSent: number;
    contactMessagesSent: number;
  };
  recentBlogs: any[];
  projects: any[];
  skills: any[];
}

interface DashboardOverviewProps {
  data: DashboardData;
}

export const DashboardOverview = ({ data }: DashboardOverviewProps) => {
  const totalInteractions = data.blogMetrics.totalLikes + data.blogMetrics.totalComments;
  const totalEmailsSent = data.newsletterMetrics?.totalEmailsSent ?? 0;
  const totalSubscribers = data.newsletterMetrics?.totalSubscribers ?? 0;
  const activeSubscribers = data.newsletterMetrics?.activeSubscribers ?? 0;

  return (
    <div className="space-y-6 pb-8">
      {/* ── Welcome Banner & Quick Actions ── */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-linear-to-r from-card/90 via-primary/5 to-card/90 backdrop-blur-2xl p-5 sm:p-6 shadow-xl dark:border-slate-800/80 dark:bg-[#0A1124]/90">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-500 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Portfolio Live
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">Admin Command Center</span>
              <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
              <Link
                href="/"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
              >
                <span>View Public Site</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back, <span className="text-primary">Md. Jasim</span> 👋
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Here is your portfolio performance snapshot. You have{' '}
              <strong className="text-foreground">{data.totalBlogs} articles</strong>,{' '}
              <strong className="text-foreground">{data.totalProjects} projects</strong>,{' '}
              <strong className="text-foreground">{data.totalSkills} technical skills</strong>, and{' '}
              <strong className="text-foreground">{totalEmailsSent} emails delivered</strong>.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <Button asChild size="sm" className="gap-1.5 font-medium shadow-md shadow-primary/20">
              <Link href="/dashboard/blog">
                <Plus className="h-3.5 w-3.5" />
                <span>New Blog</span>
              </Link>
            </Button>

            <Button asChild size="sm" variant="secondary" className="gap-1.5 font-medium">
              <Link href="/dashboard/projects">
                <Layers className="h-3.5 w-3.5" />
                <span>New Project</span>
              </Link>
            </Button>

            <Button asChild size="sm" variant="outline" className="gap-1.5 font-medium">
              <Link href="/dashboard/newsletter">
                <Mail className="h-3.5 w-3.5" />
                <span>Newsletter</span>
              </Link>
            </Button>

            <Button asChild size="sm" variant="outline" className="gap-1.5 font-medium">
              <Link href="/dashboard/skills">
                <FileCode2 className="h-3.5 w-3.5" />
                <span>Add Skill</span>
              </Link>
            </Button>

            <Button
              asChild
              size="sm"
              variant="ghost"
              className="gap-1.5 font-medium text-muted-foreground hover:text-foreground sm:hidden"
            >
              <Link href="/" target="_blank" rel="noreferrer">
                <span>View Public Site</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Key KPI Bento Stats ── */}
      <div className="grid gap-3.5 sm:gap-4 grid-cols-2 md:grid-cols-3 2xl:grid-cols-6">
        <StatsCard
          icon={BookOpen}
          label="Total Articles"
          value={data.totalBlogs}
          description="Active & published posts"
          badge="Blog Hub"
          href="/dashboard/blog"
        />

        <StatsCard
          icon={FolderOpen}
          label="Showcase Projects"
          value={data.totalProjects}
          description={`${data.projects.filter((p) => p.featured).length} spotlighted on homepage`}
          badge="Engineering"
          href="/dashboard/projects"
        />

        <StatsCard
          icon={Zap}
          label="Technical Skills"
          value={data.totalSkills}
          description={`Across ${Object.keys(data.skillsMetrics.skillsByCategory).length} categories`}
          badge="Arsenal"
          href="/dashboard/skills"
        />

        <StatsCard
          icon={Eye}
          label="Total Readership"
          value={formatNumber(data.blogMetrics.totalViews)}
          description={`${totalInteractions} total interactions`}
          badge="Engagement"
        />

        <StatsCard
          icon={Mail}
          label="Emails Delivered"
          value={formatNumber(totalEmailsSent)}
          description="Broadcast & system sends"
          badge="Outreach"
          href="/dashboard/newsletter"
        />

        <StatsCard
          icon={Users}
          label="Subscribers"
          value={formatNumber(totalSubscribers)}
          description={`${activeSubscribers} verified & active`}
          badge="Audience"
          href="/dashboard/newsletter"
        />
      </div>

      {/* ── Content & Articles Showcase Row ── */}
      <div className="grid gap-6 lg:grid-cols-3 items-stretch">
        <div className="lg:col-span-2 flex flex-col">
          <BlogInsightsCard metrics={data.blogMetrics} />
        </div>
        <div className="flex flex-col">
          <RecentBlogsCard blogs={data.recentBlogs} totalBlogs={data.totalBlogs} />
        </div>
      </div>

      {/* ── Email Outreach & Newsletter Engine Row ── */}
      {data.newsletterMetrics && (
        <div className="grid gap-6">
          <NewsletterInsightsCard metrics={data.newsletterMetrics} />
        </div>
      )}

      {/* ── Engineering & Skills Matrix Row ── */}
      <div className="grid gap-6 lg:grid-cols-3 items-stretch">
        <div className="lg:col-span-2 flex flex-col">
          <SkillsInsightsCard metrics={data.skillsMetrics} skills={data.skills} />
        </div>
        <div className="flex flex-col">
          <ProjectsOverviewCard projects={data.projects} totalProjects={data.totalProjects} />
        </div>
      </div>
    </div>
  );
};

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
