/*
  # Project Annihilation Tracking Tables

  1. New Tables
    - `migration_requests` - Track white-glove migration requests
    - `creative_scores` - Store fraud and performance predictions
    - `ab_tests` - Manage A/B test campaigns
    - `competitor_analysis` - Track competitive intelligence
  
  2. Profile Extensions
    - Add acquisition source tracking to profiles
  
  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

-- Add acquisition tracking to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'acquisition_source'
  ) THEN
    ALTER TABLE profiles ADD COLUMN acquisition_source text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'competitor_source'
  ) THEN
    ALTER TABLE profiles ADD COLUMN competitor_source text;
  END IF;
END $$;

-- Migration requests table
CREATE TABLE IF NOT EXISTS migration_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  current_tool text NOT NULL,
  monthly_spend text,
  pain_points text[],
  urgency text,
  team_size text,
  calendly_preference text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE migration_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own migration requests"
  ON migration_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create migration requests"
  ON migration_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Creative scores table
CREATE TABLE IF NOT EXISTS creative_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  creative_id uuid NOT NULL,
  prescore numeric NOT NULL CHECK (prescore BETWEEN 0 AND 1),
  fraud_score numeric NOT NULL CHECK (fraud_score BETWEEN 0 AND 1),
  platform text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE creative_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own creative scores"
  ON creative_scores
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create creative scores"
  ON creative_scores
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- A/B tests table
CREATE TABLE IF NOT EXISTS ab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  campaign_id uuid NOT NULL,
  variant_a uuid NOT NULL,
  variant_b uuid NOT NULL,
  promoted uuid,
  sig_level numeric DEFAULT 0.95,
  status text DEFAULT 'running',
  decided_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own ab tests"
  ON ab_tests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own ab tests"
  ON ab_tests
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Competitor analysis table
CREATE TABLE IF NOT EXISTS competitor_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  competitor text NOT NULL,
  analysis_type text NOT NULL,
  data jsonb NOT NULL,
  insights text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE competitor_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own competitor analysis"
  ON competitor_analysis
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create competitor analysis"
  ON competitor_analysis
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);