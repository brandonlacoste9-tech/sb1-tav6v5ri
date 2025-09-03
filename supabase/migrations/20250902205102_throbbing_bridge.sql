/*
  # Create Blog Posts Table for CMS

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text, post title)
      - `slug` (text, unique URL slug)
      - `subtitle` (text, post subtitle)
      - `content` (text, full post content)
      - `excerpt` (text, post summary)
      - `author` (text, post author)
      - `publish_date` (timestamptz, when to publish)
      - `read_time` (text, estimated read time)
      - `status` (text, enum: draft, published, scheduled, archived)
      - `category` (text, enum: autopsy, case-study, comparison, strategy, tutorial)
      - `tags` (text array, post tags)
      - `featured_image` (text, image URL)
      - `seo_title` (text, SEO optimized title)
      - `seo_description` (text, SEO meta description)
      - `view_count` (integer, page views)
      - `share_count` (integer, social shares)
      - `engagement_score` (numeric, engagement metrics)
      - `conversion_rate` (numeric, conversion percentage)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `blog_posts` table
    - Add policy for authenticated users to read published posts
    - Add policy for service role to manage all posts

  3. Indexes
    - Index on slug for fast URL lookups
    - Index on status for filtering
    - Index on category for filtering
    - Index on publish_date for chronological ordering
    - Check constraints for valid enums
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  subtitle text,
  content text NOT NULL,
  excerpt text,
  author text DEFAULT 'AdGen AI Research Team',
  publish_date timestamptz DEFAULT now(),
  read_time text,
  status text DEFAULT 'draft',
  category text DEFAULT 'strategy',
  tags text[] DEFAULT '{}',
  featured_image text,
  seo_title text,
  seo_description text,
  view_count integer DEFAULT 0,
  share_count integer DEFAULT 0,
  engagement_score numeric DEFAULT 0,
  conversion_rate numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies only if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'blog_posts' 
    AND policyname = 'Published posts are viewable by everyone'
  ) THEN
    CREATE POLICY "Published posts are viewable by everyone"
      ON blog_posts
      FOR SELECT
      TO authenticated, anon
      USING (status = 'published');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'blog_posts' 
    AND policyname = 'Service role can manage all posts'
  ) THEN
    CREATE POLICY "Service role can manage all posts"
      ON blog_posts
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_publish_date ON blog_posts(publish_date);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING gin(tags);

-- Add constraints if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'blog_posts' 
    AND constraint_name = 'blog_posts_status_check'
  ) THEN
    ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_status_check 
      CHECK (status IN ('draft', 'published', 'scheduled', 'archived'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'blog_posts' 
    AND constraint_name = 'blog_posts_category_check'
  ) THEN
    ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_category_check 
      CHECK (category IN ('autopsy', 'case-study', 'comparison', 'strategy', 'tutorial'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'blog_posts' 
    AND constraint_name = 'blog_posts_engagement_score_check'
  ) THEN
    ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_engagement_score_check 
      CHECK (engagement_score >= 0 AND engagement_score <= 100);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'blog_posts' 
    AND constraint_name = 'blog_posts_conversion_rate_check'
  ) THEN
    ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_conversion_rate_check 
      CHECK (conversion_rate >= 0 AND conversion_rate <= 100);
  END IF;
END $$;