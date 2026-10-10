import { NextResponse } from 'next/server';
import { parseMongooseError } from '@/src/lib/parseMongooseError';
import { connectDB } from '@/src/lib/mongodb';
import Skill from '@/src/models/Skill';
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

    const category = searchParams.get('category');
    const proficiency = searchParams.get('proficiency');
    const search = searchParams.get('search') ?? searchParams.get('searchTerm');
    const isPublished = searchParams.get('isPublished');
    const sortBy = searchParams.get('sortBy') ?? 'order';
    const sortOrder = searchParams.get('orderBy') === 'asc' ? 1 : -1;

    const sortOptions: Record<string, Record<string, 1 | -1>> = {
      name: { name: sortOrder, category: 1 },
      proficiency: { proficiency: sortOrder, category: 1, name: 1 },
      category: { category: sortOrder, name: 1 },
      yearsOfExperience: { yearsOfExperience: sortOrder, name: 1 },
      isPublished: { isPublished: sortOrder, category: 1, name: 1 },
      createdAt: { createdAt: sortOrder },
      order: { order: sortOrder, category: 1, name: 1 },
    };

    const sort = sortOptions[sortBy] ?? sortOptions.order;

    const filter: Record<string, unknown> = {};

    if (category) filter.category = category;
    if (proficiency) filter.proficiency = proficiency;
    if (isPublished !== null && isPublished !== undefined && isPublished !== '') {
      filter.isPublished = isPublished === 'true';
    }

    if (search) {
      const safeSearch = escapeRegex(search.trim());
      filter.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { category: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    const [skills, total] = await Promise.all([
      Skill.find(filter)
        .select('-__v')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Skill.countDocuments(filter),
    ]);

    return NextResponse.json({
      skills,
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
    console.error('[GET /api/skills]', err);

    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!(await isDashboardAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();

    // Get max order for the category or start at 0
    const maxOrder = await Skill.findOne({ category: body.category })
      .sort({ order: -1 })
      .select('order');

    const skill = await Skill.create({
      ...body,
      order: body.order ?? (maxOrder?.order ?? 0) + 1,
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (err: unknown) {
    const errors = parseMongooseError(err);

    if (errors) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    console.error('[POST /api/skills]', err);

    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}
