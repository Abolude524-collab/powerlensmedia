CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS owner_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS owner_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES owner_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  cloudinary_public_id TEXT NOT NULL UNIQUE,
  cloudinary_asset_id TEXT,
  alt_text TEXT NOT NULL,
  caption TEXT,
  category TEXT,
  orientation TEXT NOT NULL DEFAULT 'square' CHECK (orientation IN ('portrait', 'landscape', 'square')),
  aspect_ratio NUMERIC,
  camera_spec TEXT,
  location TEXT,
  hardware TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  hero BOOLEAN NOT NULL DEFAULT FALSE,
  hero_order INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES owner_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS works_status_order_idx ON works (status, featured DESC, sort_order, created_at DESC);
CREATE INDEX IF NOT EXISTS owner_sessions_expiry_idx ON owner_sessions (expires_at);

CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  brand_name TEXT NOT NULL,
  alias TEXT NOT NULL,
  photographer_name TEXT NOT NULL,
  bio TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  profile_picture_url TEXT,
  hero_photo_url TEXT,
  social_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_name TEXT NOT NULL CHECK (event_name IN ('gallery_open', 'contact_click', 'whatsapp_click', 'social_click')),
  target TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx ON analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_name_idx ON analytics_events (event_name, created_at DESC);
