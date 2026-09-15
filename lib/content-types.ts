export interface PhotoItem {
  _id: string;
  title: string;
  slug?: string;
  imageUrl: string;
  altText: string;
  caption?: string;
  featured?: boolean;
  hero?: boolean;
  heroOrder?: number;
  orientation: "portrait" | "landscape" | "square";
  category?: string;
  aspectRatio?: number;
  blurDataURL?: string;
  cameraSpec?: string;
  location?: string;
  hardware?: string;
}

export interface SiteSettings {
  brandName: string;
  alias: string;
  photographerName: string;
  bio: string;
  contactEmail: string;
  profilePictureUrl?: string;
  heroPhotoUrl?: string;
  socialLinks: Array<{
    platform: string;
    handle: string;
    url: string;
  }>;
}

export interface ServiceItem {
  _id: string;
  title: string;
  slug?: string;
  subtitle: string;
  imageUrl: string;
  category?: string;
  sortOrder?: number;
  published?: boolean;
}

