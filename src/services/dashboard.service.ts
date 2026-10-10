import { connectDB } from '../lib/mongodb';
import BlogModel from '../models/Blog';
import ProjectModel from '../models/project.model';
import SkillModel from '../models/Skill';
import SentEmailLog from '../models/SentEmailLog';
import NewsletterSubscriber from '../models/NewsletterSubscriber';

/* =========================
   Types
========================= */

export interface Blog {
  _id?: string;
  title?: string;
  views?: number;
  likesCount?: number;
  commentsCount?: number;
  createdAt?: string;
}

export interface Project {
  _id?: string;
  title?: string;
  createdAt?: string;
}

export interface Skill {
  _id?: string;
  name?: string;
  category?: string;
  proficiency?: 'beginner' | 'intermediate' | 'advanced';
}

export interface NewsletterMetrics {
  totalEmailsSent: number;
  totalSubscribers: number;
  activeSubscribers: number;
  broadcastsSent: number;
  verificationsSent: number;
  welcomeSent: number;
  contactMessagesSent: number;
}

export interface DashboardStats {
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
  newsletterMetrics: NewsletterMetrics;
  recentBlogs: Blog[];
  projects: Project[];
  skills: Skill[];
}

/* =========================
   Service
========================= */

export async function getDashboardData(): Promise<DashboardStats> {
  try {
    await connectDB();

    const [
      totalBlogs,
      totalProjects,
      totalSkills,
      blogStatsAggregate,
      recentBlogsDocs,
      recentProjectsDocs,
      skillsDocs,
      totalSentLogCount,
      broadcastCount,
      verificationCount,
      welcomeCount,
      contactCount,
      totalSubs,
      activeSubs,
    ] = await Promise.all([
      BlogModel.countDocuments(),
      ProjectModel.countDocuments(),
      SkillModel.countDocuments(),
      BlogModel.aggregate([
        {
          $group: {
            _id: null,
            totalViews: { $sum: '$views' },
            totalLikes: { $sum: '$likesCount' },
            totalComments: { $sum: '$commentsCount' },
          },
        },
      ]),
      BlogModel.find()
        .sort({ createdAt: -1 })
        .limit(4)
        .select('title views likesCount commentsCount createdAt')
        .lean(),
      ProjectModel.find().sort({ createdAt: -1 }).limit(3).select('title createdAt').lean(),
      SkillModel.find().select('name category proficiency').lean(),
      SentEmailLog.countDocuments({ status: 'sent' }).catch(() => 0),
      SentEmailLog.countDocuments({ type: 'newsletter', status: 'sent' }).catch(() => 0),
      SentEmailLog.countDocuments({ type: 'verification', status: 'sent' }).catch(() => 0),
      SentEmailLog.countDocuments({ type: 'welcome', status: 'sent' }).catch(() => 0),
      SentEmailLog.countDocuments({ type: 'contact', status: 'sent' }).catch(() => 0),
      NewsletterSubscriber.countDocuments().catch(() => 0),
      NewsletterSubscriber.countDocuments({ isActive: true, isVerified: true }).catch(() => 0),
    ]);

    const stats = blogStatsAggregate[0] || { totalViews: 0, totalLikes: 0, totalComments: 0 };
    const totalViews = stats.totalViews || 0;
    const totalLikes = stats.totalLikes || 0;
    const totalComments = stats.totalComments || 0;
    const averageViews = totalBlogs > 0 ? totalViews / totalBlogs : 0;

    const skillsByCategory: Record<string, number> = {};
    const proficiencyBreakdown: Record<string, number> = {};

    for (const skill of skillsDocs) {
      const category = skill.category ?? 'Uncategorized';
      skillsByCategory[category] = (skillsByCategory[category] ?? 0) + 1;

      const proficiency = (skill.proficiency as string) ?? 'intermediate';
      proficiencyBreakdown[proficiency] = (proficiencyBreakdown[proficiency] ?? 0) + 1;
    }

    return {
      totalBlogs,
      totalProjects,
      totalSkills,
      blogMetrics: {
        totalBlogs,
        totalViews,
        totalLikes,
        totalComments,
        averageViews,
      },
      skillsMetrics: {
        totalSkills,
        skillsByCategory,
        proficiencyBreakdown,
      },
      newsletterMetrics: {
        totalEmailsSent: totalSentLogCount,
        totalSubscribers: totalSubs,
        activeSubscribers: activeSubs,
        broadcastsSent: broadcastCount,
        verificationsSent: verificationCount,
        welcomeSent: welcomeCount,
        contactMessagesSent: contactCount,
      },
      recentBlogs: recentBlogsDocs.map((b) => ({
        _id: String(b._id),
        title: b.title,
        views: b.views,
        likesCount: b.likesCount,
        commentsCount: b.commentsCount,
        createdAt: b.createdAt ? new Date(b.createdAt).toISOString() : undefined,
      })),
      projects: recentProjectsDocs.map((p) => ({
        _id: String(p._id),
        title: p.title,
        createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : undefined,
      })),
      skills: skillsDocs.slice(0, 12).map((s) => ({
        _id: String(s._id),
        name: s.name,
        category: s.category,
        proficiency: s.proficiency as Skill['proficiency'],
      })),
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);

    return {
      totalBlogs: 0,
      totalProjects: 0,
      totalSkills: 0,
      blogMetrics: {
        totalBlogs: 0,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        averageViews: 0,
      },
      skillsMetrics: {
        totalSkills: 0,
        skillsByCategory: {},
        proficiencyBreakdown: {},
      },
      newsletterMetrics: {
        totalEmailsSent: 0,
        totalSubscribers: 0,
        activeSubscribers: 0,
        broadcastsSent: 0,
        verificationsSent: 0,
        welcomeSent: 0,
        contactMessagesSent: 0,
      },
      recentBlogs: [],
      projects: [],
      skills: [],
    };
  }
}
