import crypto from 'crypto';
import { connectDB } from '../lib/mongodb';
import NewsletterSubscriber from '../models/NewsletterSubscriber';
import BlockedEmail, { IBlockedEmail } from '../models/BlockedEmail';
import NewsletterTemplate from '../models/NewsletterTemplate';
import {
  Subscriber,
  Stats,
  SubscriberStatus,
  NewsletterTemplateItem,
} from '../types/newsletter.interface';

export interface ListSubscribersParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  orderBy?: string;
}

export interface ListTemplatesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  orderBy?: string;
}

export interface ListTemplatesResult {
  templates: NewsletterTemplateItem[];
  total: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ListSubscribersResult {
  subscribers: Subscriber[];
  stats: Stats;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const SORTABLE_FIELDS = new Set(['email', 'name', 'status', 'subscribedAt', 'createdAt']);

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export async function listSubscribersForAdmin(
  params: ListSubscribersParams = {}
): Promise<ListSubscribersResult> {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 10));

  try {
    await connectDB();

    // 1. Fetch blocked emails
    const blockedList = await BlockedEmail.find().lean<IBlockedEmail[]>();
    const blockedMap = new Map<string, IBlockedEmail>(
      blockedList.map((b) => [b.email.toLowerCase(), b])
    );
    const blockedEmails = Array.from(blockedMap.keys());

    // 2. Ensure any blocked emails are also in subscribers table for unified management
    if (blockedList.length > 0) {
      const existing = await NewsletterSubscriber.find({ email: { $in: blockedEmails } })
        .select('email')
        .lean();
      const existingSet = new Set(existing.map((s) => s.email.toLowerCase()));
      const missing = blockedList.filter((b) => !existingSet.has(b.email.toLowerCase()));

      if (missing.length > 0) {
        for (const b of missing) {
          try {
            await NewsletterSubscriber.create({
              email: b.email.toLowerCase(),
              name: 'Blocked Address',
              isActive: false,
              subscribedAt: b.createdAt || new Date(),
              unsubscribedAt: b.createdAt || new Date(),
              unsubscribeToken: crypto.randomBytes(32).toString('hex'),
            });
          } catch {
            // Ignore race condition duplicate key errors
          }
        }
      }
    }

    // 3. Compute stats
    const [totalActive, totalInactive, totalCountAll, blockedCount, templateCount] =
      await Promise.all([
        NewsletterSubscriber.countDocuments({
          isActive: true,
          isVerified: { $ne: false },
          email: { $nin: blockedEmails },
        }),
        NewsletterSubscriber.countDocuments({
          isActive: false,
          email: { $nin: blockedEmails },
        }),
        NewsletterSubscriber.countDocuments(),
        BlockedEmail.countDocuments(),
        NewsletterTemplate.countDocuments(),
      ]);

    const stats: Stats = {
      totalActive,
      totalInactive,
      total: totalCountAll,
      blockedCount,
      templateCount,
    };

    // 4. Construct search & filter query
    const filter: Record<string, unknown> = {};

    if (params.search?.trim()) {
      const term = escapeRegex(params.search.trim());
      filter.$or = [
        { email: { $regex: term, $options: 'i' } },
        { name: { $regex: term, $options: 'i' } },
      ];
    }

    if (params.status === 'active') {
      filter.isActive = true;
      filter.isVerified = { $ne: false };
      if (blockedEmails.length > 0) {
        filter.email = { $nin: blockedEmails };
      }
    } else if (params.status === 'inactive') {
      filter.isActive = false;
      if (blockedEmails.length > 0) {
        filter.email = { $nin: blockedEmails };
      }
    } else if (params.status === 'pending') {
      filter.isVerified = false;
      if (blockedEmails.length > 0) {
        filter.email = { $nin: blockedEmails };
      }
    } else if (params.status === 'blocked') {
      filter.email = { $in: blockedEmails };
    }

    // 5. Sorting
    let sortField = 'createdAt';
    if (params.sortBy && SORTABLE_FIELDS.has(params.sortBy)) {
      sortField = params.sortBy === 'status' ? 'isActive' : params.sortBy;
    }
    const sortOrder = params.orderBy === 'asc' ? 1 : -1;

    // 6. Fetch paginated records
    const [rows, totalFiltered] = await Promise.all([
      NewsletterSubscriber.find(filter)
        .select('-unsubscribeToken -__v')
        .sort({ [sortField]: sortOrder, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      NewsletterSubscriber.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalFiltered / limit) || 1;

    const subscribers: Subscriber[] = rows.map((row) => {
      const emailLower = row.email.toLowerCase();
      const isBlocked = blockedMap.has(emailLower);
      const blockedInfo = blockedMap.get(emailLower);

      let status: SubscriberStatus = 'inactive';
      if (isBlocked) {
        status = 'blocked';
      } else if (row.isActive && row.isVerified !== false) {
        status = 'active';
      } else if (row.isVerified === false && row.verificationToken) {
        status = 'pending';
      }

      return {
        _id: String(row._id),
        email: row.email,
        name: row.name || undefined,
        isActive: Boolean(row.isActive),
        isVerified: row.isVerified !== false,
        subscribedAt: row.subscribedAt
          ? new Date(row.subscribedAt).toISOString()
          : new Date(row.createdAt).toISOString(),
        unsubscribedAt: row.unsubscribedAt ? new Date(row.unsubscribedAt).toISOString() : undefined,
        createdAt: new Date(row.createdAt).toISOString(),
        status,
        isBlocked,
        blockReason: blockedInfo?.reason,
        blockedAt: blockedInfo?.createdAt
          ? new Date(blockedInfo.createdAt).toISOString()
          : undefined,
      };
    });

    return {
      subscribers,
      stats,
      pagination: {
        total: totalFiltered,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error('[listSubscribersForAdmin]', error);
    return {
      subscribers: [],
      stats: { totalActive: 0, totalInactive: 0, total: 0, blockedCount: 0, templateCount: 0 },
      pagination: {
        total: 0,
        page,
        limit,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
}

export async function listTemplatesForAdmin(
  params: ListTemplatesParams = {}
): Promise<ListTemplatesResult> {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 10));

  try {
    await connectDB();

    const filter: Record<string, unknown> = {};
    if (params.search?.trim()) {
      const term = escapeRegex(params.search.trim());
      filter.$or = [
        { subject: { $regex: term, $options: 'i' } },
        { content: { $regex: term, $options: 'i' } },
      ];
    }

    const sortField =
      params.sortBy && ['subject', 'recipientCount', 'sentAt', 'createdAt'].includes(params.sortBy)
        ? params.sortBy
        : 'sentAt';
    const sortOrder = params.orderBy === 'asc' ? 1 : -1;

    const [rows, total] = await Promise.all([
      NewsletterTemplate.find(filter)
        .sort({ [sortField]: sortOrder, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      NewsletterTemplate.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    const templates: NewsletterTemplateItem[] = rows.map((row) => ({
      _id: String(row._id),
      subject: row.subject,
      content: row.content,
      html: row.html,
      recipientCount: row.recipientCount || 0,
      sentAt: row.sentAt
        ? new Date(row.sentAt).toISOString()
        : new Date(row.createdAt).toISOString(),
      createdAt: new Date(row.createdAt).toISOString(),
      updatedAt: new Date(row.updatedAt).toISOString(),
    }));

    return {
      templates,
      total,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error('[listTemplatesForAdmin]', error);
    return {
      templates: [],
      total: 0,
      pagination: {
        total: 0,
        page,
        limit,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
}

export async function deleteTemplateForAdmin(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    await connectDB();
    const deleted = await NewsletterTemplate.findByIdAndDelete(id);
    if (!deleted) {
      return { success: false, message: 'Template not found.' };
    }
    return { success: true, message: 'Template deleted successfully.' };
  } catch (error) {
    console.error('[deleteTemplateForAdmin]', error);
    return { success: false, message: 'Failed to delete template.' };
  }
}
