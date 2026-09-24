import { NextResponse } from 'next/server';
import slugify from 'slugify';

import Blog from '../../../models/Blog';
import { parseMongooseError } from '../../../lib/parseMongooseError';
import { connectDB } from '../../../lib/mongodb';
import { publishDueScheduledBlogs } from '../../../lib/publish-scheduled-blogs';

// GET /api/blogs
// Supports: ?page=1&limit=10&category=nextjs&tag=react&search=hello
export async function GET(req: Request) {
  try {
    await connectDB();

    // Auto-publish scheduled blogs that have reached their scheduled time
    try {
      await publishDueScheduledBlogs();
    } catch (publishErr) {
      console.error('[GET /api/blogs] Failed to auto-publish scheduled blogs:', publishErr);
    }

    const { searchParams } = new URL(req.url);

    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') ?? 10)));

    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search') ?? searchParams.get('searchTerm');
    const sortBy = searchParams.get('sortBy') ?? 'createdAt';
    const sortOrder = searchParams.get('orderBy') === 'asc' ? 1 : -1;

    const sortOptions: Record<string, Record<string, 1 | -1>> = {
      title: { title: sortOrder, createdAt: -1 },
      category: { category: sortOrder, title: 1 },
      engagement: {
        views: sortOrder,
        likesCount: sortOrder,
        commentsCount: sortOrder,
        createdAt: -1,
      },
      views: { views: sortOrder, likesCount: sortOrder, commentsCount: sortOrder, createdAt: -1 },
      likesCount: { likesCount: sortOrder, views: sortOrder, createdAt: -1 },
      commentsCount: { commentsCount: sortOrder, views: sortOrder, createdAt: -1 },
      createdAt: { createdAt: sortOrder },
      publishedAt: { publishedAt: sortOrder, createdAt: -1 },
      status: { status: sortOrder, createdAt: -1 },
    };

    // Default stays `createdAt` here: the dashboard table is a work queue, so the
    // admin wants newest-authored first. Only the public list orders by publishedAt.
    const sort = sortOptions[sortBy] ?? sortOptions.createdAt;

    const filter: Record<string, unknown> = {};

    if (category) filter.category = category;
    if (tag) filter.tags = tag;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .select('-__v')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('related', 'title slug')
        .lean(),

      Blog.countDocuments(filter),
    ]);

    return NextResponse.json({
      blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    console.error('[GET /api/blogs]', err);

    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

// POST /api/blogs
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    // Generate slug from title if not provided
    let slug =
      body.slug ||
      slugify(body.title || '', {
        lower: true,
        strict: true,
        trim: true,
      });

    // Ensure unique slug
    const existing = await Blog.findOne({ slug });

    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    body.slug = slug;

    // A blog created directly as `published` goes live now, so stamp its publish date.
    if (body.status === 'published' && !body.publishedAt) {
      body.publishedAt = new Date();
    }

    const blog = await Blog.create(body);

    return NextResponse.json(blog, { status: 201 });
  } catch (err: unknown) {
    const errors = parseMongooseError(err);

    if (errors) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    console.error('[POST /api/blogs]', err);

    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}
