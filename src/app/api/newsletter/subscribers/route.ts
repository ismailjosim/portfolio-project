import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import NewsletterSubscriber from '../../../../models/NewsletterSubscriber';

// GET /api/newsletter/subscribers — admin: list all subscribers
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? 20)));
    const status = searchParams.get('status'); // 'active' | 'inactive'

    const filter: Record<string, unknown> = {};
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;

    const [subscribers, total] = await Promise.all([
      NewsletterSubscriber.find(filter)
        .select('-unsubscribeToken -__v')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      NewsletterSubscriber.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      subscribers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('[GET /api/newsletter/subscribers]', err);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch subscribers.' },
      { status: 500 }
    );
  }
}
