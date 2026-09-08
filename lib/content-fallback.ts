import { PhotoItem, SiteSettings } from "./content-types";

export const FALLBACK_PHOTOS: PhotoItem[] = [
  {
    _id: "photo-1",
    title: "Marina Shadows",
    slug: "marina-shadows",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCCgxSazzYzk8u8LO_8k4nIb9APNckoCyPnJWy1bmtA7YozmyOmnEiwsW5nBQCas4GRckxUOJMYGzdvh-H5Bmo2r_oS_XrcV5-4JX3d2jKqgh0H_IfTGkn_tq7qc1ixGLLOZQhg7G8qbu3yhdRQNQblCeUgawMHhj7h42GEBiLE_c62-fhBqhLNonHjeCdmAT101vTE24hcvKcuiUbvgUegfDKvZ2BXAYZJEv3reYK5EH0s13UurTmlTg",
    altText: "High contrast dramatic monochrome photograph of bustling Balogun market Lagos",
    caption: "Elongated morning shadows slanting across textured cobblestones, deep obsidian blacks, sharp highlights on moving pedestrian silhouettes.",
    featured: true,
    orientation: "portrait",
    category: "Street",
    cameraSpec: "24mm • ƒ/1.78 • 1/1250s • ISO 64",
    location: "Lagos Island, Nigeria",
    hardware: "iPhone 15 Pro Max",
    aspectRatio: 0.75,
  },
];

export const FALLBACK_SETTINGS: SiteSettings = {
  brandName: "POWER LENS",
  alias: "@gpoweredward",
  photographerName: "Edwards Godspower",
  bio: "Edwards Godspower is a documentary and fine-art mobile photographer obsessed with natural contrast, raw street rhythm, and unscripted human emotion.",
  contactEmail: "powerlensmedia@gmail.com",
  profilePictureUrl: FALLBACK_PHOTOS[0].imageUrl,
  heroPhotoUrl: FALLBACK_PHOTOS[0].imageUrl,
  socialLinks: [
    { platform: "Instagram", handle: "@gpoweredward", url: "https://www.instagram.com/gpoweredward?utm_source=qr&stkn=cmRxMmNhd3VrY2J4" },
    { platform: "Email Inquiries", handle: "powerlensmedia@gmail.com", url: "mailto:powerlensmedia@gmail.com" },
    {
      platform: "WhatsApp",
      handle: "+234 704 058 4105",
      url: "https://wa.me/2347040584105?text=Hi%20Godspower%2C%20I%20found%20your%20contact%20through%20your%20portfolio%20website%20and%20would%20love%20to%20discuss%20a%20photography%20project.",
    },
    { platform: "Facebook", handle: "Edwards Godspower", url: "https://www.facebook.com/profile.php?id=61571600835845" },
  ],
};
