import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { publishDueScheduledBlogs } from '../../../../lib/publish-scheduled-blogs';
import { isDashboardAuthenticated } from '@/src/lib/dashboard-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers.get('authorization');
    const isCronAuthorized = cronSecret && authHeader === `Bearer ${cronSecret}`;
    const isAdmin = await isDashboardAuthenticated();

    if (cronSecret && !isCronAuthorized && !isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const result = await publishDueScheduledBlogs();

    return NextResponse.json({
      message: 'Successfully checked and published scheduled blogs',
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error('[CRON /api/cron/publish-blogs]', err);
    return NextResponse.json({ error: 'Failed to run publish task' }, { status: 500 });
  }
}
