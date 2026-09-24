import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import NewsletterSubscriber from '../../../../models/NewsletterSubscriber';
import BlockedEmail from '../../../../models/BlockedEmail';

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

// DELETE /api/newsletter/subscribers?id=xxx or ?email=xxx — admin: delete subscriber
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');

    if (!id && !email) {
      return NextResponse.json(
        { success: false, message: 'Subscriber ID or email is required.' },
        { status: 400 }
      );
    }

    const query = id ? { _id: id } : { email: email?.toLowerCase() };
    const deleted = await NewsletterSubscriber.findOneAndDelete(query);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Subscriber not found.' },
        { status: 404 }
      );
    }

    // Also remove from BlockedEmail if present
    await BlockedEmail.deleteOne({ email: deleted.email.toLowerCase() });

    return NextResponse.json({
      success: true,
      message: `Subscriber ${deleted.email} deleted successfully.`,
    });
  } catch (err) {
    console.error('[DELETE /api/newsletter/subscribers]', err);
    return NextResponse.json(
      { success: false, message: 'Failed to delete subscriber.' },
      { status: 500 }
    );
  }
}

// PATCH /api/newsletter/subscribers — admin: update subscriber status
export async function PATCH(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, email, isActive } = body;

    if (!id && !email) {
      return NextResponse.json(
        { success: false, message: 'Subscriber ID or email is required.' },
        { status: 400 }
      );
    }

    const query = id ? { _id: id } : { email: email?.toLowerCase() };
    const updateData: Record<string, unknown> = {};

    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive;
      if (!isActive) {
        updateData.unsubscribedAt = new Date();
      } else {
        updateData.unsubscribedAt = null;
        // If reactivating, make sure it's unblocked
        if (email) {
          await BlockedEmail.deleteOne({ email: email.toLowerCase() });
        }
      }
    }

    const updated = await NewsletterSubscriber.findOneAndUpdate(query, updateData, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Subscriber not found.' },
        { status: 404 }
      );
    }

    // If reactivating and query was by id, also ensure BlockedEmail is cleared
    if (typeof isActive === 'boolean' && isActive) {
      await BlockedEmail.deleteOne({ email: updated.email.toLowerCase() });
    }

    return NextResponse.json({
      success: true,
      message: `Subscriber marked as ${updated.isActive ? 'active' : 'inactive'}.`,
      data: updated,
    });
  } catch (err) {
    console.error('[PATCH /api/newsletter/subscribers]', err);
    return NextResponse.json(
      { success: false, message: 'Failed to update subscriber.' },
      { status: 500 }
    );
  }
}
