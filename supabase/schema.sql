-- =============================================
-- Coffer Notes — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- Tables
-- =============================================

CREATE TABLE categories (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  sort_order    INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE articles (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title             TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  excerpt           TEXT,
  content           TEXT NOT NULL,
  thumbnail_url     TEXT,
  author_name       TEXT DEFAULT 'Editorial Team',
  author_avatar     TEXT,
  status            TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured          BOOLEAN DEFAULT false,
  read_time         INT,
  meta_title        TEXT,
  meta_description  TEXT,
  published_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE tags (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  slug        TEXT NOT NULL UNIQUE
);

CREATE TABLE article_tags (
  article_id  UUID REFERENCES articles(id) ON DELETE CASCADE,
  tag_id      UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

CREATE TABLE article_categories (
  article_id  UUID REFERENCES articles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, category_id)
);

CREATE TABLE subscribers (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email       TEXT NOT NULL UNIQUE,
  subscribed  BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- Indexes (optimise common query patterns)
-- =============================================

-- Articles: filter by status + sort by published_at (homepage, category pages, RSS, sitemap)
CREATE INDEX idx_articles_status_published ON articles (status, published_at DESC);

-- Articles: filter by status + sort by published_at (homepage, category pages, RSS, sitemap)
CREATE INDEX idx_articles_status_published ON articles (status, published_at DESC);

-- Articles: featured queries (hero section)
CREATE INDEX idx_articles_featured ON articles (featured, status, published_at DESC);

-- Articles: slug lookup (article detail page)
CREATE INDEX idx_articles_slug ON articles (slug);

-- Categories: slug lookup (category page)
CREATE INDEX idx_categories_slug ON categories (slug);

-- Categories: sort order (admin sidebar, selects)
CREATE INDEX idx_categories_sort ON categories (sort_order);

-- Tags: slug lookup (tag upsert logic)
CREATE INDEX idx_tags_slug ON tags (slug);

-- Subscribers: ordering (admin subscribers page)
CREATE INDEX idx_subscribers_created ON subscribers (created_at DESC);

-- =============================================
-- Auto-update trigger for articles.updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================
-- Seed categories
-- =============================================

INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Accounting', 'accounting', 'Bookkeeping fundamentals, cloud software, bank reconciliation, digital records, and keeping your books clean.', 1),
  ('Getting Paid', 'getting-paid', 'How to invoice properly, collect faster, and fix the mistakes that keep your money stuck with clients.', 2),
  ('Payroll', 'payroll', 'PAYE setup, RTI filing, pension auto-enrolment, wage calculations, and avoiding HMRC payroll fines.', 3),
  ('People & Leave', 'people-leave', 'Employee leave, absence tracking, statutory pay, HR compliance, and managing people without a full HR team.', 4),
  ('Numbers & Insights', 'numbers-insights', 'Profit and loss, cash flow reports, financial dashboards, and understanding what your numbers mean.', 5),
  ('Tax & MTD', 'tax-mtd', 'VAT returns, Making Tax Digital, Self Assessment, quarterly updates, and UK tax deadlines that matter.', 6);

-- =============================================
-- Row Level Security
-- =============================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- ---- Categories ----
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin full access to categories"
  ON categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ---- Articles ----
-- Anon users can only see published articles
CREATE POLICY "Public can view published articles"
  ON articles FOR SELECT
  TO anon
  USING (status = 'published');

-- Authenticated users see all articles (including drafts)
CREATE POLICY "Authenticated can view all articles"
  ON articles FOR SELECT
  TO authenticated
  USING (true);

-- Admin full write access
CREATE POLICY "Admin full write access to articles"
  ON articles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can update articles"
  ON articles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can delete articles"
  ON articles FOR DELETE
  TO authenticated
  USING (true);

-- ---- Tags ----
CREATE POLICY "Public can view tags"
  ON tags FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin full access to tags"
  ON tags FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ---- Article Tags ----
CREATE POLICY "Public can view article_tags"
  ON article_tags FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin full access to article_tags"
  ON article_tags FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ---- Article Categories ----
CREATE POLICY "Public can view article_categories"
  ON article_categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin full access to article_categories"
  ON article_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ---- Subscribers ----
-- Allow anon users to subscribe (INSERT only)
CREATE POLICY "Public can subscribe"
  ON subscribers FOR INSERT
  TO anon
  WITH CHECK (true);

-- Admin full access to subscribers
CREATE POLICY "Admin full access to subscribers"
  ON subscribers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================
-- Storage: article-images bucket
-- =============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view images (public bucket)
CREATE POLICY "Public can view article images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'article-images');

-- Only authenticated users can upload images
CREATE POLICY "Authenticated users can upload article images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'article-images');

-- Authenticated users can update their uploads
CREATE POLICY "Authenticated users can update article images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'article-images')
  WITH CHECK (bucket_id = 'article-images');

-- Authenticated users can delete images
CREATE POLICY "Authenticated users can delete article images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'article-images');

-- =============================================
-- Admin User Setup
-- =============================================

-- Create the admin user (quadcore0022@gmail.com / Allahis001@)
DO $$
DECLARE
  admin_uid UUID := gen_random_uuid();
  admin_email TEXT := 'quadcore0022@gmail.com';
  -- Use crypt() to hash the password properly for Supabase Auth
  admin_pass TEXT := crypt('Allahis001@', gen_salt('bf'));
BEGIN
  -- Only insert if the user doesn't already exist
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = admin_email) THEN
    -- Insert into auth.users 
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      admin_uid,
      'authenticated',
      'authenticated',
      admin_email,
      admin_pass,
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"is_admin":true}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    -- Insert into auth.identities
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    )
    VALUES (
      gen_random_uuid(),
      admin_uid,
      format('{"sub":"%s","email":"%s"}', admin_uid::text, admin_email)::jsonb,
      'email',
      admin_email,
      now(),
      now(),
      now()
    );
  END IF;
END $$;

