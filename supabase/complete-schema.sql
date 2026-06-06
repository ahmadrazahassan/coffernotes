-- =============================================
-- COMPLETE SUPABASE SCHEMA (Accounting Software Pilot)
-- Run this in your Supabase SQL Editor
-- Includes all core tables, banners, and redirect links.
-- (Storage buckets omitted as Cloudinary will be used for images)
-- =============================================

-- =============================================
-- Core Tables
-- =============================================

CREATE TABLE categories (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
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
  thumbnail_url     TEXT, -- Will store Cloudinary URLs
  author_name       TEXT DEFAULT 'Editorial Team',
  author_avatar     TEXT, -- Will store Cloudinary URLs
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
-- Banners / Ad Slots
-- =============================================

CREATE TABLE banners (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_key      TEXT NOT NULL,
  name          TEXT NOT NULL,
  html          TEXT NOT NULL,
  embed_mode    TEXT NOT NULL DEFAULT 'iframe' CHECK (embed_mode IN ('iframe', 'inline')),
  enabled       BOOLEAN NOT NULL DEFAULT true,
  priority      INT NOT NULL DEFAULT 0,
  starts_at     TIMESTAMPTZ,
  ends_at       TIMESTAMPTZ,
  target_paths  TEXT[],
  exclude_paths TEXT[],
  device        TEXT NOT NULL DEFAULT 'all' CHECK (device IN ('all', 'desktop', 'mobile')),
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- Redirect Links & Click Tracking
-- =============================================

CREATE TABLE redirect_links (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,          
  destination  TEXT NOT NULL,                 
  label        TEXT,                          
  nofollow     BOOLEAN DEFAULT true,
  sponsored    BOOLEAN DEFAULT true,
  click_count  BIGINT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE redirect_clicks (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id       UUID REFERENCES redirect_links(id) ON DELETE CASCADE,
  clicked_at    TIMESTAMPTZ DEFAULT now(),
  referrer_path TEXT,            
  user_agent    TEXT,
  ip_hash       TEXT             
);

-- =============================================
-- Indexes
-- =============================================

CREATE INDEX idx_articles_status_published ON articles (status, published_at DESC);
CREATE INDEX idx_articles_featured ON articles (featured, status, published_at DESC);
CREATE INDEX idx_articles_slug ON articles (slug);
CREATE INDEX idx_categories_slug ON categories (slug);
CREATE INDEX idx_categories_sort ON categories (sort_order);
CREATE INDEX idx_tags_slug ON tags (slug);
CREATE INDEX idx_subscribers_created ON subscribers (created_at DESC);

CREATE INDEX idx_banners_slot_active ON banners (slot_key, priority DESC, updated_at DESC) WHERE enabled = true;

CREATE INDEX idx_redirect_links_slug ON redirect_links (slug);
CREATE INDEX idx_redirect_clicks_link ON redirect_clicks (link_id, clicked_at DESC);

-- =============================================
-- Auto-update Triggers
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER banners_updated_at BEFORE UPDATE ON banners FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER redirect_links_updated_at BEFORE UPDATE ON redirect_links FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- Atomic click-count increment (RPC function)
-- =============================================

CREATE OR REPLACE FUNCTION increment_click_count(link_slug TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE redirect_links
  SET click_count = click_count + 1
  WHERE slug = link_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Seed Data
-- =============================================

INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Accounting', 'accounting', 'Bookkeeping fundamentals, cloud software, bank reconciliation, digital records, and keeping your books clean.', 1),
  ('Getting Paid', 'getting-paid', 'How to invoice properly, collect faster, and fix the mistakes that keep your money stuck with clients.', 2),
  ('Comparisons', 'comparisons', 'Head-to-head comparisons, in-depth product reviews, and buyer guides for Sage, Xero, QuickBooks, and other UK accounting software.', 3),
  ('Payroll', 'payroll', 'PAYE setup, RTI filing, pension auto-enrolment, wage calculations, and avoiding HMRC payroll fines.', 4),
  ('People & Leave', 'people-leave', 'Employee leave, absence tracking, statutory pay, HR compliance, and managing people without a full HR team.', 5),
  ('Numbers & Insights', 'numbers-insights', 'Profit and loss, cash flow reports, financial dashboards, and understanding what your numbers mean.', 6),
  ('Tax & MTD', 'tax-mtd', 'VAT returns, Making Tax Digital, Self Assessment, quarterly updates, and UK tax deadlines that matter.', 7)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE redirect_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE redirect_clicks ENABLE ROW LEVEL SECURITY;

-- Categories
CREATE POLICY "Public can view categories" ON categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin full access to categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Articles
CREATE POLICY "Public can view published articles" ON articles FOR SELECT TO anon USING (status = 'published');
CREATE POLICY "Authenticated can view all articles" ON articles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin full write access to articles" ON articles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update articles" ON articles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can delete articles" ON articles FOR DELETE TO authenticated USING (true);

-- Tags
CREATE POLICY "Public can view tags" ON tags FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin full access to tags" ON tags FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Article Tags & Categories
CREATE POLICY "Public can view article_tags" ON article_tags FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin full access to article_tags" ON article_tags FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public can view article_categories" ON article_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin full access to article_categories" ON article_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Subscribers
CREATE POLICY "Public can subscribe" ON subscribers FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Admin full access to subscribers" ON subscribers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Banners
CREATE POLICY "Public read active banners" ON banners FOR SELECT TO anon USING (enabled AND (starts_at IS NULL OR starts_at <= now()) AND (ends_at IS NULL OR ends_at >= now()));
CREATE POLICY "Authenticated read all banners" ON banners FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert banners" ON banners FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update banners" ON banners FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated delete banners" ON banners FOR DELETE TO authenticated USING (true);

-- Redirect Links & Clicks
CREATE POLICY "Public can read redirect_links" ON redirect_links FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin full access to redirect_links" ON redirect_links FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can insert redirect_clicks" ON redirect_clicks FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admin can read redirect_clicks" ON redirect_clicks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can delete redirect_clicks" ON redirect_clicks FOR DELETE TO authenticated USING (true);

-- =============================================
-- Admin User Setup
-- =============================================

-- Add Admin Email to Supabase Auth
-- Note: It is generally safer to invite the user through the Supabase Dashboard -> Authentication -> Invite User
-- But you can force insert an identity if needed (Replace 'your-secure-password' if inserting manually via SQL, though Supabase dashboard is highly recommended for proper hashing):
--
-- INSERT INTO auth.users (id, email, raw_user_meta_data)
-- VALUES (gen_random_uuid(), 'sanyakhanna010a@gmail.com', '{"role":"admin"}');
