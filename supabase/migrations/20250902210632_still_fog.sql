/*
  # Analytics and Tracking Tables

  1. New Tables
    - `analytics_events`
      - `id` (uuid, primary key)
      - `session_id` (text)
      - `user_id` (uuid, nullable)
      - `event` (text)
      - `properties` (jsonb)
      - `url` (text)
      - `referrer` (text, nullable)
      - `user_agent` (text)
      - `ip_address` (text, nullable)
      - `created_at` (timestamptz, default now)
    
    - `comparison_views`
      - `id` (uuid, primary key)
      - `session_id` (text)
      - `user_id` (uuid, nullable)
      - `competitor_name` (text)
      - `view_duration` (integer, seconds)
      - `scroll_depth` (integer, percentage)
      - `cta_clicked` (boolean, default false)
      - `conversion_type` (text, nullable)
      - `referrer` (text, nullable)
      - `created_at` (timestamptz, default now)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Add policies for service role to manage all data

  3. Indexes
    - Index on session_id for fast session queries
    - Index on user_id for user analytics
    - Index on event for event type filtering
    - Index on competitor_name for comparison analytics
    - Index on created_at for time-based queries
*/

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id uuid,
  event text NOT NULL,
  properties jsonb NOT NULL DEFAULT '{}',
  url text NOT NULL,
  referrer text,
  user_agent text NOT NULL,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Comparison Views Table
CREATE TABLE IF NOT EXISTS comparison_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id uuid,
  competitor_name text NOT NULL,
  view_duration integer DEFAULT 0,
  scroll_depth integer DEFAULT 0,
  cta_clicked boolean DEFAULT false,
  conversion_type text,
  referrer text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparison_views ENABLE ROW LEVEL SECURITY;

-- Policies for analytics_events
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'analytics_events' 
    AND policyname = 'Users can view their own analytics'
  ) THEN
    CREATE POLICY "Users can view their own analytics"
      ON analytics_events
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'analytics_events' 
    AND policyname = 'Service role can manage all analytics'
  ) THEN
    CREATE POLICY "Service role can manage all analytics"
      ON analytics_events
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Policies for comparison_views
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'comparison_views' 
    AND policyname = 'Users can view their own comparison data'
  ) THEN
    CREATE POLICY "Users can view their own comparison data"
      ON comparison_views
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'comparison_views' 
    AND policyname = 'Service role can manage all comparison data'
  ) THEN
    CREATE POLICY "Service role can manage all comparison data"
      ON comparison_views
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event ON analytics_events(event);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);

CREATE INDEX IF NOT EXISTS idx_comparison_views_session_id ON comparison_views(session_id);
CREATE INDEX IF NOT EXISTS idx_comparison_views_user_id ON comparison_views(user_id);
CREATE INDEX IF NOT EXISTS idx_comparison_views_competitor ON comparison_views(competitor_name);
CREATE INDEX IF NOT EXISTS idx_comparison_views_created_at ON comparison_views(created_at);

-- Check constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'comparison_views_scroll_depth_check'
  ) THEN
    ALTER TABLE comparison_views ADD CONSTRAINT comparison_views_scroll_depth_check 
      CHECK (scroll_depth >= 0 AND scroll_depth <= 100);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'comparison_views_conversion_type_check'
  ) THEN
    ALTER TABLE comparison_views ADD CONSTRAINT comparison_views_conversion_type_check 
      CHECK (conversion_type IN ('signup', 'migration', 'demo', 'purchase'));
  END IF;
END $$;