import { NextResponse } from 'next/server';
import {
  listTemplatesForAdmin,
  deleteTemplateForAdmin,
} from '@/src/services/newsletter-management';
import { connectDB } from '@/src/lib/mongodb';
import NewsletterTemplate from '@/src/models/NewsletterTemplate';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 10;
    const search = searchParams.get('search') || undefined;
    const sortBy = searchParams.get('sortBy') || undefined;
    const orderBy = searchParams.get('orderBy') || undefined;

    const result = await listTemplatesForAdmin({ page, limit, search, sortBy, orderBy });
    return NextResponse.json({ success: true, ...result });
  } catch (err: unknown) {
    console.error('[GET /api/newsletter/templates]', err);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch newsletter templates.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Template ID is required.' },
        { status: 400 }
      );
    }

    const result = await deleteTemplateForAdmin(id);
    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error('[DELETE /api/newsletter/templates]', err);
    return NextResponse.json(
      { success: false, message: 'Failed to delete template.' },
      { status: 500 }
    );
  }
}

// POST endpoint to manually create a template if needed
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { subject, content, html, recipientCount } = body;

    if (!subject?.trim() || !content?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Subject and content are required.' },
        { status: 400 }
      );
    }

    const template = await NewsletterTemplate.create({
      subject: subject.trim(),
      content: content.trim(),
      html: html || undefined,
      recipientCount: recipientCount || 0,
      sentAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Template saved successfully.',
      template,
    });
  } catch (err: unknown) {
    console.error('[POST /api/newsletter/templates]', err);
    return NextResponse.json(
      { success: false, message: 'Failed to create template.' },
      { status: 500 }
    );
  }
}
