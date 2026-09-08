import { v2 as cloudinary } from "cloudinary";

export async function deleteGalleryAsset(publicId: string) {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) return;
  await cloudinary.uploader.destroy(publicId, { invalidate: true, resource_type: "image" });
}