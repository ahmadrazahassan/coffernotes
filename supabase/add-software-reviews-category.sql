-- =============================================
-- Add "Software Reviews" category for comparison/review content
-- Run this in your Supabase SQL Editor
-- =============================================

INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Software Reviews', 'software-reviews', 'Head-to-head comparisons, in-depth product reviews, and buyer guides for Sage, Xero, QuickBooks, and other UK accounting software.', 7)
ON CONFLICT (slug) DO NOTHING;
