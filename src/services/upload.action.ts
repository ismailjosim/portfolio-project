/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import cloudinary, { deleteCloudinaryImage } from '../lib/cloudinary';
import { isDashboardAuthenticated } from '../lib/dashboard-auth';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function uploadImage(formData: FormData, customFolder: string = 'blog_covers') {
  try {
    if (!(await isDashboardAuthenticated())) {
      return { success: false, message: 'Unauthorized' };
    }

    const file = formData.get('image') as File | null;

    if (!file || !(file instanceof File)) {
      return { success: false, message: 'No file provided' };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return { success: false, message: 'File size exceeds maximum limit of 10MB' };
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return {
        success: false,
        message: 'Only image files (JPEG, PNG, WebP, GIF, SVG) are allowed',
      };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const folder = (formData.get('folder') as string) || customFolder;

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
          if (error || !result) reject(error);
          else resolve(result as any);
        });
        stream.end(buffer);
      }
    );

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('uploadImage error:', error);
    return { success: false, message: 'Upload failed' };
  }
}

export async function deleteImageAction(imageUrl: string) {
  try {
    if (!(await isDashboardAuthenticated())) {
      return { success: false, message: 'Unauthorized' };
    }

    if (!imageUrl || typeof imageUrl !== 'string') {
      return { success: false, message: 'No URL provided' };
    }

    if (!imageUrl.includes('cloudinary.com')) {
      return { success: false, message: 'Invalid Cloudinary image URL' };
    }

    await deleteCloudinaryImage(imageUrl);
    return { success: true, message: 'Image deleted from Cloudinary' };
  } catch (error) {
    console.error('deleteImageAction error:', error);
    return { success: false, message: 'Failed to delete image' };
  }
}
