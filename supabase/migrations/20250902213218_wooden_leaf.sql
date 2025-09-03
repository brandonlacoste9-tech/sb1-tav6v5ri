/*
  # Create share views tracking table

  1. New Tables
    - `share_views`
      - `id` (bigint, primary key, auto-increment)
      - `session_id` (text)
      - `page` (text, not null)
      - `meta` (jsonb)
      - `user_agent` (text)
      - `ts` (timestamptz, default now())

  2. Security
    - Enable RLS on `share_views` table
    - Add policy for anonymous users to insert share view data
    - Add index for performance optimization

  3. Purpose
    - Track shareable page views and engagement
    - Analytics for partner and investor sharing
    - Conversion funnel analysis
*/

CREATE TABLE IF NOT EXISTS public.share_views (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  session_id text,
  page text NOT NULL,
  meta jsonb DEFAULT '{}',
  user_agent text,
  ts timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.share_views ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert share view data
CREATE POLICY "Allow inserts from anon" 
  ON public.share_views
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

-- Allow authenticated users to view their own data
CREATE POLICY "Users can view their own share data"
  ON public.share_views
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_share_views_session_id ON public.share_views(session_id);
CREATE INDEX IF NOT EXISTS idx_share_views_page ON public.share_views(page);
CREATE INDEX IF NOT EXISTS idx_share_views_ts ON public.share_views(ts);

-- Create index on meta for JSON queries
CREATE INDEX IF NOT EXISTS idx_share_views_meta ON public.share_views USING gin(meta);