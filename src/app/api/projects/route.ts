import { NextResponse } from 'next/server';
import slugify from 'slugify';

import { parseMongooseError } from '@/src/lib/parseMongooseError';
import { connectDB } from '@/src/lib/mongodb';
import Project from '@/src/models/project.model';
import { isDashboardAuthenticated } from '@/src/lib/dashboard-auth';

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') ?? 10)));

    const type = searchParams.get('type');
    const technology = searchParams.get('technology');
    const search = searchParams.get('search') ?? searchParams.get('searchTerm');
    const featured = searchParams.get('featured');
    const sortBy = searchParams.get('sortBy') ?? 'order';
    const sortOrder = searchParams.get('orderBy') === 'asc' ? 1 : -1;

    const sortOptions: Record<string, Record<string, 1 | -1>> = {
      title: { title: sortOrder, createdAt: -1 },
      featured: { featured: sortOrder, order: 1, createdAt: -1 },
      isPublished: { isPublished: sortOrder, order: 1, createdAt: -1 },
      createdAt: { createdAt: sortOrder },
      order: { order: sortOrder, createdAt: -1 },
    };

    const sort = sortOptions[sortBy] ?? sortOptions.order;

    const filter: Record<string, unknown> = {};

    if (type) filter.type = type;
    if (technology) filter.technologies = technology;
    if (featured === 'true') filter.featured = true;

    if (search) {
      const safeSearch = escapeRegex(search.trim());
      filter.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { title: { $regex: safeSearch, $options: 'i' } },
        { subtitle: { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .select('-__v')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Project.countDocuments(filter),
    ]);

    return NextResponse.json({
      projects,
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
    console.error('[GET /api/projects]', err);

    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!(await isDashboardAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();

    let slug =
      body.slug ||
      slugify(body.name || body.title || '', {
        lower: true,
        strict: true,
        trim: true,
      });

    const existing = await Project.findOne({ slug });

    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    body.slug = slug;

    const project = await Project.create(body);

    return NextResponse.json(project, { status: 201 });
  } catch (err: unknown) {
    const errors = parseMongooseError(err);

    if (errors) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    console.error('[POST /api/projects]', err);

    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
