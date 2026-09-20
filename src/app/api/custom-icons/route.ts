import { NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import CustomIcon from '@/src/models/CustomIcon';
import Skill from '@/src/models/Skill';
import { deleteCloudinaryImage } from '@/src/lib/cloudinary';

// GET all custom icons (from CustomIcon collection + any existing custom skill icons)
export async function GET() {
  try {
    await connectDB();

    const savedIcons = await CustomIcon.find().sort({ createdAt: -1 }).lean();

    // Also look for any skills that use custom URLs as icons, so existing ones appear
    const skillsWithUrls = await Skill.find({
      icon: { $regex: /^(https?:\/\/|\/|data:)/i },
    })
      .select('name icon category')
      .lean();

    // Combine uniquely by URL
    const urlMap = new Map<string, { _id?: string; name: string; url: string; category: string }>();

    // Add skills with custom URLs first
    for (const skill of skillsWithUrls) {
      if (skill.icon) {
        urlMap.set(skill.icon, {
          _id: skill._id ? String(skill._id) : undefined,
          name: skill.name,
          url: skill.icon,
          category: skill.category || 'frontend',
        });
      }
    }

    // Overlay saved custom icons (giving them priority)
    for (const item of savedIcons) {
      urlMap.set(item.url, {
        _id: String(item._id),
        name: item.name,
        url: item.url,
        category: item.category || 'frontend',
      });
    }

    const customIcons = Array.from(urlMap.values());

    return NextResponse.json({ success: true, icons: customIcons });
  } catch (error) {
    console.error('[GET /api/custom-icons]', error);
    return NextResponse.json({ error: 'Failed to fetch custom icons' }, { status: 500 });
  }
}

// POST save a new custom icon
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { name, url, category } = body;

    if (!name || !url) {
      return NextResponse.json({ error: 'Name and URL are required' }, { status: 400 });
    }

    const cleanName = String(name).trim();
    const cleanUrl = String(url).trim();
    const cleanCategory = category ? String(category).trim() : 'frontend';

    // Upsert by URL
    const icon = await CustomIcon.findOneAndUpdate(
      { url: cleanUrl },
      { name: cleanName, url: cleanUrl, category: cleanCategory },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, icon });
  } catch (error) {
    console.error('[POST /api/custom-icons]', error);
    return NextResponse.json({ error: 'Failed to save custom icon' }, { status: 500 });
  }
}

// DELETE a custom icon and remove its Cloudinary asset
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const url = searchParams.get('url');

    let iconToDelete = null;

    if (id) {
      iconToDelete = await CustomIcon.findById(id);
    } else if (url) {
      iconToDelete = await CustomIcon.findOne({ url });
    }

    const targetUrl = url || iconToDelete?.url;

    // Delete image from Cloudinary if it is a Cloudinary URL
    if (targetUrl && targetUrl.includes('cloudinary.com')) {
      try {
        await deleteCloudinaryImage(targetUrl);
      } catch (cloudErr) {
        console.error('Failed to delete icon image from Cloudinary:', cloudErr);
      }
    }

    // Delete from DB if found by id or url
    if (iconToDelete) {
      await CustomIcon.findByIdAndDelete(iconToDelete._id);
    } else if (url) {
      await CustomIcon.deleteMany({ url });
    }

    return NextResponse.json({ success: true, message: 'Icon removed' });
  } catch (error) {
    console.error('[DELETE /api/custom-icons]', error);
    return NextResponse.json({ error: 'Failed to delete custom icon' }, { status: 500 });
  }
}
