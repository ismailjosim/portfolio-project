import { NextResponse } from 'next/server';

import Blog from '../../../../models/Blog';
import BlogComment from '../../../../models/BlogComment';
import { parseMongooseError } from '../../../../lib/parseMongooseError';
import { connectDB } from '../../../../lib/mongodb';
import { deleteCloudinaryImage } from '../../../../lib/cloudinary';
import { publishDueScheduledBlogs } from '../../../../lib/publish-scheduled-blogs';
import { isDashboardAuthenticated } from '@/src/lib/dashboard-auth';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();

    // Auto-publish scheduled blogs that have reached their scheduled time
    try {
      await publishDueScheduledBlogs();
    } catch (publishErr) {
      console.error('[GET /api/blogs/:slug] Failed to auto-publish scheduled blogs:', publishErr);
    }

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim();
    const blog = await Blog.findOne({ slug: cleanSlug }).populate(
      'related',
      'title slug category coverImage views likesCount'
    );

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Fetch comments for this blog (spam-flagged ones stay hidden)
    const comments = await BlogComment.find({
      blogId: blog._id,
      status: 'visible',
    })
      .select('-__v')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      ...blog.toObject(),
      comments: comments || [],
    });
  } catch (err: unknown) {
    console.error('[GET /api/blogs/:slug]', err);
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    if (!(await isDashboardAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { slug } = await params;
    const body = await req.json();

    if (!body) {
      return NextResponse.json({ error: 'No payload' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim();
    const existingBlog = await Blog.findOne({ slug: cleanSlug });
    if (!existingBlog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // If a new cover image is being set and it's different from the old one, delete the old image
    if (body.coverImage && existingBlog.coverImage && body.coverImage !== existingBlog.coverImage) {
      try {
        await deleteCloudinaryImage(existingBlog.coverImage);
      } catch (error) {
        console.error('Failed to delete old image:', error);
      }
    }

    // Stamp the publish date only on the transition into `published`
    const isGoingLive = body.status === 'published' && existingBlog.status !== 'published';

    const updated = await Blog.findOneAndUpdate(
      { slug: cleanSlug },
      { ...body, updatedAt: new Date(), ...(isGoingLive && { publishedAt: new Date() }) },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err: unknown) {
    const errors = parseMongooseError(err);
    if (errors) {
      return NextResponse.json({ errors }, { status: 422 });
    }
    console.error('[PATCH /api/blogs/:slug]', err);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    if (!(await isDashboardAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { slug } = await params;

    const cleanSlug = slug.toLowerCase().trim();
    const blog = await Blog.findOne({ slug: cleanSlug });
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Delete the cover image from Cloudinary if it exists
    if (blog.coverImage) {
      try {
        await deleteCloudinaryImage(blog.coverImage);
      } catch (error) {
        console.error('Failed to delete cover image:', error);
      }
    }

    const deleted = await Blog.findOneAndDelete({ slug: cleanSlug });
    if (!deleted) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (err: unknown) {
    console.error('[DELETE /api/blogs/:slug]', err);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
