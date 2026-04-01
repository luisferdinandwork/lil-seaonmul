// lib/cloudinary-upload.ts
import cloudinary from '@/lib/cloudinary';

export type UploadResult = {
  url: string;
  publicId: string;
  width: number;
  height: number;
};

export async function uploadToCloudinary(
  file: Buffer | string,
  folder: string,
  publicId?: string,
): Promise<UploadResult> {
  const input = Buffer.isBuffer(file)
    ? `data:image/webp;base64,${file.toString('base64')}`
    : file;

  const result = await cloudinary.uploader.upload(input, {
    folder,
    public_id: publicId,
    overwrite: !!publicId,
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  });

  return {
    url:      result.secure_url,
    publicId: result.public_id,
    width:    result.width,
    height:   result.height,
  };
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export const CLOUDINARY_FOLDERS = {
  heroSlides:     'lil-seonmul/hero-slides',
  gallery:        'lil-seonmul/gallery',
  shopCategories: 'lil-seonmul/shop-categories',
} as const;