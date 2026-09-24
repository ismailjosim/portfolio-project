/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import cloudinary, { deleteCloudinaryImage } from '../lib/cloudinary';

export async function uploadImage(formData: FormData, customFolder: string = 'blog_covers') {
  try {
    const file = formData.get('image') as File;

    if (!file) return { success: false, message: 'No file provided' };

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
    if (!imageUrl) return { success: false, message: 'No URL provided' };
    await deleteCloudinaryImage(imageUrl);
    return { success: true, message: 'Image deleted from Cloudinary' };
  } catch (error) {
    console.error('deleteImageAction error:', error);
    return { success: false, message: 'Failed to delete image' };
  }
}
