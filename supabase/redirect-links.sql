-- =============================================
-- Finlytic — Redirect Links & Click Tracking
-- Run this in your Supabase SQL Editor
-- =============================================

-- Redirect links: maps short slugs to affiliate/external URLs
CREATE TABLE redirect_links (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,          -- e.g. "sage-accounting"
  destination  TEXT NOT NULL,                 -- actual affiliate URL
  label        TEXT,                          -- human-readable name for admin UI
  nofollow     BOOLEAN DEFAULT true,
  sponsored    BOOLEAN DEFAULT true,
  click_count  BIGINT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_redirect_links_slug ON redirect_links (slug);

-- Auto-update trigger (reuses existing function from schema.sql)
CREATE TRIGGER redirect_links_updated_at
  BEFORE UPDATE ON redirect_links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Click analytics: one row per click for detailed reporting
CREATE TABLE redirect_clicks (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id       UUID REFERENCES redirect_links(id) ON DELETE CASCADE,
  clicked_at    TIMESTAMPTZ DEFAULT now(),
  referrer_path TEXT,            -- which article page they clicked from
  user_agent    TEXT,
  ip_hash       TEXT             -- SHA-256 hashed IP for privacy compliance
);

CREATE INDEX idx_redirect_clicks_link ON redirect_clicks (link_id, clicked_at DESC);

-- =============================================
-- Row Level Security
-- =============================================

ALTER TABLE redirect_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE redirect_clicks ENABLE ROW LEVEL SECURITY;

-- redirect_links: public read (needed for the /go/[slug] route handler)
CREATE POLICY "Public can read redirect_links"
  ON redirect_links FOR SELECT
  TO anon, authenticated
  USING (true);

-- redirect_links: admin full write access
CREATE POLICY "Admin full access to redirect_links"
  ON redirect_links FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- redirect_clicks: anyone can insert (click tracking from the route handler)
CREATE POLICY "Anyone can insert redirect_clicks"
  ON redirect_clicks FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- redirect_clicks: only admins can read click analytics
CREATE POLICY "Admin can read redirect_clicks"
  ON redirect_clicks FOR SELECT
  TO authenticated
  USING (true);

-- redirect_clicks: admin can delete old analytics
CREATE POLICY "Admin can delete redirect_clicks"
  ON redirect_clicks FOR DELETE
  TO authenticated
  USING (true);

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
