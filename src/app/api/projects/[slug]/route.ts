import { NextResponse } from 'next/server';
import { parseMongooseError } from '../../../../lib/parseMongooseError';
import { connectDB } from '../../../../lib/mongodb';
import { deleteCloudinaryImage } from '../../../../lib/cloudinary';
import Project from '@/src/models/project.model';
import { isDashboardAuthenticated } from '@/src/lib/dashboard-auth';

// get single project
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim();
    const project = await Project.findOne({ slug: cleanSlug });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (err: unknown) {
    console.error('[GET /api/projects/:slug]', err);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
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
    const existingProject = await Project.findOne({ slug: cleanSlug });

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Cleanup old main image if updated
    if (body.image && existingProject.image && body.image !== existingProject.image) {
      try {
        await deleteCloudinaryImage(existingProject.image);
      } catch (error) {
        console.error('Failed to delete old image:', error);
      }
    }

    // Cleanup demoImages if they were removed or replaced
    if (body.demoImages && existingProject.demoImages) {
      const imagesToRemove = existingProject.demoImages.filter(
        (img: string) => !body.demoImages.includes(img)
      );
      for (const imgUrl of imagesToRemove) {
        try {
          await deleteCloudinaryImage(imgUrl);
        } catch (error) {
          console.error('Failed to delete old demo image:', error);
        }
      }
    }

    const updated = await Project.findOneAndUpdate(
      { slug: cleanSlug },
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updated);
  } catch (err: unknown) {
    const errors = parseMongooseError(err);
    if (errors) {
      return NextResponse.json({ errors }, { status: 422 });
    }
    console.error('[PATCH /api/projects/:slug]', err);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
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
    const project = await Project.findOne({ slug: cleanSlug });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Delete main image
    if (project.image) {
      try {
        await deleteCloudinaryImage(project.image);
      } catch (error) {
        console.error('Failed to delete main image:', error);
      }
    }

    // Delete all demo images
    if (project.demoImages && project.demoImages.length > 0) {
      for (const imgUrl of project.demoImages) {
        try {
          await deleteCloudinaryImage(imgUrl);
        } catch (error) {
          console.error('Failed to delete demo image:', error);
        }
      }
    }

    await Project.findOneAndDelete({ slug: cleanSlug });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (err: unknown) {
    console.error('[DELETE /api/projects/:slug]', err);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
