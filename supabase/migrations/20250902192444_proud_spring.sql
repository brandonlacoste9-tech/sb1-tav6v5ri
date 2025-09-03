/*
  # Project Annihilation Tracking Tables

  1. New Tables
    - `migration_requests` - Track white-glove migration requests
    - `creative_scores` - Store fraud and performance predictions  
    - `ab_tests` - Manage A/B test campaigns
    - `competitor_analysis` - Track competitive intelligence

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to access their own data
*/

-- Migration requests table for white-glove migration program
CREATE TABLE IF NOT EXISTS migration_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  current_tool text NOT NULL,
  monthly_spend text,
  pain_points text[] DEFAULT '{}',
  urgency text,
  team_size text,
  calendly_preference text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'scheduled', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Creative performance and fraud scoring
CREATE TABLE IF NOT EXISTS creative_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  creative_id uuid NOT NULL,
  performance_score numeric NOT NULL CHECK (performance_score BETWEEN 0 AND 100),
  fraud_score numeric NOT NULL CHECK (fraud_score BETWEEN 0 AND 100),
  platform text NOT NULL CHECK (platform IN ('facebook', 'google', 'instagram', 'tiktok', 'linkedin')),
  predicted_ctr numeric,
  predicted_cpa numeric,
  confidence_level numeric CHECK (confidence_level BETWEEN 0 AND 1),
  created_at timestamptz DEFAULT now()
);

-- A/B test campaign management
CREATE TABLE IF NOT EXISTS ab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  campaign_name text NOT NULL,
  variant_a_id uuid NOT NULL,
  variant_b_id uuid NOT NULL,
  winning_variant_id uuid,
  significance_level numeric DEFAULT 0.95 CHECK (significance_level BETWEEN 0 AND 1),
  status text DEFAULT 'running' CHECK (status IN ('running', 'completed', 'paused', 'cancelled')),
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  decided_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Competitive intelligence tracking
CREATE TABLE IF NOT EXISTS competitor_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  competitor_name text NOT NULL,
  analysis_type text NOT NULL CHECK (analysis_type IN ('pricing', 'features', 'creative', 'performance')),
  data_points jsonb NOT NULL DEFAULT '{}',
  insights text[],
  action_items text[],
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE migration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_analysis ENABLE ROW LEVEL SECURITY;

-- RLS Policies for migration_requests (admin access only for now)
CREATE POLICY "Migration requests are viewable by authenticated users"
  ON migration_requests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create migration requests"
  ON migration_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for creative_scores
CREATE POLICY "Users can view their own creative scores"
  ON creative_scores
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own creative scores"
  ON creative_scores
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for ab_tests
CREATE POLICY "Users can view their own A/B tests"
  ON ab_tests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own A/B tests"
  ON ab_tests
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for competitor_analysis
CREATE POLICY "Users can view their own competitor analysis"
  ON competitor_analysis
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own competitor analysis"
  ON competitor_analysis
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_creative_scores_user_id ON creative_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_creative_scores_creative_id ON creative_scores(creative_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_user_id ON ab_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_competitor_analysis_user_id ON competitor_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_migration_requests_email ON migration_requests(email);
CREATE INDEX IF NOT EXISTS idx_migration_requests_status ON migration_requests(status);