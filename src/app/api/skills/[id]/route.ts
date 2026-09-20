import { NextResponse } from 'next/server';
import { parseMongooseError } from '../../../../lib/parseMongooseError';
import { connectDB } from '../../../../lib/mongodb';
import Skill from '@/src/models/Skill';
import { Types } from 'mongoose';
import { deleteCloudinaryImage } from '../../../../lib/cloudinary';

// Get single skill
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid skill ID' }, { status: 400 });
    }

    const skill = await Skill.findById(id);

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    return NextResponse.json(skill);
  } catch (err: unknown) {
    console.error('[GET /api/skills/:id]', err);
    return NextResponse.json({ error: 'Failed to fetch skill' }, { status: 500 });
  }
}

// Update skill
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid skill ID' }, { status: 400 });
    }

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: 'No payload' }, { status: 400 });
    }

    const existingSkill = await Skill.findById(id);
    if (!existingSkill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    // If icon is changing and old icon was in Cloudinary, delete old image from Cloudinary
    if (
      body.icon !== undefined &&
      existingSkill.icon &&
      body.icon !== existingSkill.icon &&
      existingSkill.icon.includes('cloudinary.com')
    ) {
      try {
        await deleteCloudinaryImage(existingSkill.icon);
      } catch (err) {
        console.error('Failed to delete old skill icon from Cloudinary:', err);
      }
    }

    const skill = await Skill.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(skill);
  } catch (err: unknown) {
    const errors = parseMongooseError(err);

    if (errors) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    console.error('[PATCH /api/skills/:id]', err);

    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
  }
}

// Delete skill
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid skill ID' }, { status: 400 });
    }

    const skill = await Skill.findById(id);

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    // Delete custom icon from Cloudinary if applicable
    if (skill.icon && skill.icon.includes('cloudinary.com')) {
      try {
        await deleteCloudinaryImage(skill.icon);
      } catch (err) {
        console.error('Failed to delete skill icon from Cloudinary:', err);
      }
    }

    await Skill.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Skill deleted' });
  } catch (err: unknown) {
    console.error('[DELETE /api/skills/:id]', err);

    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}
