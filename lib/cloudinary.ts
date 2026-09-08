import { v2 as cloudinary } from "cloudinary";
import { FALLBACK_PHOTOS, FALLBACK_SETTINGS } from "./content-fallback";
import { PhotoItem, SiteSettings } from "./content-types";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const galleryTag = process.env.CLOUDINARY_GALLERY_TAG || "power-lens-gallery";
const galleryPrefix = process.env.CLOUDINARY_GALLERY_PREFIX;

if (cloudName && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export function getDeliveryUrl(publicId: string, format?: string) {
  const extension = format ? `.${format}` : "";
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${publicId}${extension}`;
}

function isConfigured() {
  return Boolean(cloudName && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

function customContext(context: unknown): Record<string, string> {
  if (!context || typeof context !== "object") return {};
  const custom = (context as { custom?: unknown }).custom;
  if (!custom || typeof custom !== "object") return {};
  return Object.fromEntries(
    Object.entries(custom).map(([key, value]) => [key, String(value)])
  );
}

interface CloudinaryResource {
  asset_id?: string;
  public_id: string;
  format?: string;
  width?: number;
  height?: number;
  tags?: string[];
  context?: unknown;
  eager?: Array<{ secure_url?: string }>;
}

function toPhoto(resource: CloudinaryResource): PhotoItem {
  const context = customContext(resource.context);
  const aspectRatio = resource.width && resource.height ? resource.width / resource.height : undefined;
  const orientation = context.orientation || (aspectRatio && aspectRatio > 1.1 ? "landscape" : aspectRatio && aspectRatio < 0.9 ? "portrait" : "square");

  return {
    _id: resource.asset_id || resource.public_id,
    title: context.title || resource.public_id.split("/").pop() || "Untitled frame",
    slug: context.slug || resource.public_id.replaceAll("/", "-").toLowerCase(),
    imageUrl: getDeliveryUrl(resource.public_id, resource.format),
    altText: context.altText || context.alt || context.title || "Power Lens photograph",
    caption: context.caption,
    featured: context.featured === "true" || resource.tags?.includes("featured"),
    orientation: orientation as PhotoItem["orientation"],
    category: context.category,
    aspectRatio,
    blurDataURL: resource.eager?.[0]?.secure_url,
    cameraSpec: context.cameraSpec,
    location: context.location,
    hardware: context.hardware,
  };
}

export function createGalleryUploadSignature(timestamp: number) {
  if (!isConfigured() || !cloudName || !process.env.CLOUDINARY_API_KEY) {
    throw new Error("Cloudinary is not configured");
  }
  const folder = process.env.CLOUDINARY_GALLERY_PREFIX || "power-lens";
  const tags = process.env.CLOUDINARY_GALLERY_TAG || "power-lens-gallery";
  const params = { folder, tags, timestamp };
  return {
    cloudName,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder,
    tags,
    signature: cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET || ""),
  };
}

export function createProfileUploadSignature(timestamp: number) {
  if (!isConfigured() || !cloudName || !process.env.CLOUDINARY_API_KEY) throw new Error("Cloudinary is not configured");
  const folder = `${process.env.CLOUDINARY_GALLERY_PREFIX || "power-lens"}/profile`;
  const tags = "power-lens-profile";
  const params = { folder, tags, timestamp };
  return { cloudName, apiKey: process.env.CLOUDINARY_API_KEY, folder, tags, signature: cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET || "") };
}

export async function getCloudinaryContent(): Promise<{ photos: PhotoItem[]; settings: SiteSettings }> {
  if (!isConfigured()) return { photos: FALLBACK_PHOTOS, settings: FALLBACK_SETTINGS };

  try {
    const resources = await cloudinary.api.resources({
      type: "upload",
      prefix: galleryPrefix,
      tags: true,
      context: true,
      max_results: 500,
    });
    const photos = resources.resources
      .filter((resource: CloudinaryResource) => resource.tags?.includes(galleryTag))
      .map(toPhoto)
      .sort((first: PhotoItem, second: PhotoItem) => Number(Boolean(second.featured)) - Number(Boolean(first.featured)));
    const settings = parseSettings();
    return { photos: photos.length ? photos : FALLBACK_PHOTOS, settings };
  } catch (error) {
    console.warn("Cloudinary content warning (using fallback dataset):", error);
    return { photos: FALLBACK_PHOTOS, settings: parseSettings() };
  }
}

function parseSettings(): SiteSettings {
  const raw = process.env.CLOUDINARY_SITE_SETTINGS_JSON;
  if (!raw) return FALLBACK_SETTINGS;
  try {
    return { ...FALLBACK_SETTINGS, ...JSON.parse(raw) };
  } catch {
    console.warn("CLOUDINARY_SITE_SETTINGS_JSON is not valid JSON; using fallback settings.");
    return FALLBACK_SETTINGS;
  }
}
