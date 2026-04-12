-- =============================================
-- Banners / ad slots — run after supabase/schema.sql
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

CREATE INDEX idx_banners_slot_active
  ON banners (slot_key, priority DESC, updated_at DESC)
  WHERE enabled = true;

CREATE TRIGGER banners_updated_at
  BEFORE UPDATE ON banners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Public (anon): only active banners within schedule
CREATE POLICY "Public read active banners"
  ON banners FOR SELECT
  TO anon
  USING (
    enabled
    AND (starts_at IS NULL OR starts_at <= now())
    AND (ends_at IS NULL OR ends_at >= now())
  );

-- Authenticated (admin): full read (including disabled / scheduled)
CREATE POLICY "Authenticated read all banners"
  ON banners FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated insert banners"
  ON banners FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated update banners"
  ON banners FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated delete banners"
  ON banners FOR DELETE
  TO authenticated
  USING (true);
