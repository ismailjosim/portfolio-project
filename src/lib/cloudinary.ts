import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Deletes an image from Cloudinary using its URL
 * Extracts the public ID from the Cloudinary URL and deletes it
 * @param imageUrl - The full Cloudinary image URL
 * @returns void
 */
export async function deleteCloudinaryImage(imageUrl: string): Promise<void> {
  try {
    if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.includes('cloudinary.com')) {
      return;
    }

    // Strip query parameters
    const cleanUrl = imageUrl.split('?')[0];

    // Extract public ID from Cloudinary URL
    // Supports:
    // https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
    // https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}.{format}
    const regex = /(?:image\/upload\/)(?:v\d+\/)?(.*?)(?:\.[a-zA-Z0-9]+)?$/i;
    const match = cleanUrl.match(regex);

    let publicId: string | null = null;

    if (match && match[1]) {
      publicId = match[1];
    } else {
      const fallbackRegex = /\/v\d+\/(.*?)(?:\.[a-zA-Z0-9]+)?$/i;
      const fallbackMatch = cleanUrl.match(fallbackRegex);
      if (fallbackMatch && fallbackMatch[1]) {
        publicId = fallbackMatch[1];
      }
    }

    if (!publicId) {
      console.warn(`Could not extract public ID from URL: ${imageUrl}`);
      return;
    }

    await cloudinary.uploader.destroy(publicId);

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Cloudinary] Successfully deleted asset: ${publicId}`);
    }
  } catch (error) {
    console.error('Error deleting Cloudinary image:', error);
    // Do not crash the caller on cloudinary delete failure
  }
}

export default cloudinary;
