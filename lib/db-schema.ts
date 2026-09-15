import { pgTable, uuid, text, timestamp, boolean, integer, numeric, jsonb, index } from "drizzle-orm/pg-core";

export const ownerUsers = pgTable("owner_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const ownerSessions = pgTable("owner_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => ownerUsers.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("owner_sessions_expiry_idx").on(table.expiresAt)]);

export const works = pgTable("works", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url").notNull(),
  cloudinaryPublicId: text("cloudinary_public_id").notNull().unique(),
  cloudinaryAssetId: text("cloudinary_asset_id"),
  altText: text("alt_text").notNull(),
  caption: text("caption"),
  category: text("category"),
  orientation: text("orientation").notNull().default("square"),
  aspectRatio: numeric("aspect_ratio"),
  cameraSpec: text("camera_spec"),
  location: text("location"),
  hardware: text("hardware"),
  featured: boolean("featured").notNull().default(false),
  hero: boolean("hero").notNull().default(false),
  heroOrder: integer("hero_order").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
  status: text("status").notNull().default("draft"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdBy: uuid("created_by").notNull().references(() => ownerUsers.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("works_status_order_idx").on(table.status, table.featured, table.sortOrder, table.createdAt)]);

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  brandName: text("brand_name").notNull(),
  alias: text("alias").notNull(),
  photographerName: text("photographer_name").notNull(),
  bio: text("bio").notNull(),
  contactEmail: text("contact_email").notNull(),
  profilePictureUrl: text("profile_picture_url"),
  heroPhotoUrl: text("hero_photo_url"),
  socialLinks: jsonb("social_links").$type<Array<{ platform: string; handle: string; url: string }>>().notNull().default([]),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const analyticsEvents = pgTable("analytics_events", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  eventName: text("event_name").notNull(),
  target: text("target"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("analytics_events_created_at_idx").on(table.createdAt),
  index("analytics_events_name_idx").on(table.eventName, table.createdAt),
]);

export const inquiries = pgTable("inquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("unread"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("inquiries_created_at_idx").on(table.createdAt),
]);

export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  subtitle: text("subtitle").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category"),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("services_sort_published_idx").on(table.published, table.sortOrder),
]);

