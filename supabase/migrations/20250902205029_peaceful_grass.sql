/*
  # Create A/B Tests Table

  1. New Tables
    - `ab_tests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `campaign_name` (text)
      - `variant_a_id` (uuid, creative A)
      - `variant_b_id` (uuid, creative B)
      - `winning_variant_id` (uuid, nullable)
      - `significance_level` (numeric, default 0.95)
      - `status` (text, enum: running, completed, paused, cancelled)
      - `start_date` (timestamptz, default now)
      - `end_date` (timestamptz, nullable)
      - `decided_at` (timestamptz, nullable)
      - `created_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `ab_tests` table
    - Add policy for users to manage their own A/B tests
    - Add policy for users to view their own A/B tests

  3. Indexes
    - Index on user_id for fast user queries
    - Check constraint for valid status values
    - Check constraint for significance level range
*/

CREATE TABLE IF NOT EXISTS ab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  campaign_name text NOT NULL,
  variant_a_id uuid NOT NULL,
  variant_b_id uuid NOT NULL,
  winning_variant_id uuid,
  significance_level numeric DEFAULT 0.95,
  status text DEFAULT 'running',
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  decided_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;

-- Create policies only if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ab_tests' 
    AND policyname = 'Users can manage their own A/B tests'
  ) THEN
    CREATE POLICY "Users can manage their own A/B tests"
      ON ab_tests
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ab_tests' 
    AND policyname = 'Users can view their own A/B tests'
  ) THEN
    CREATE POLICY "Users can view their own A/B tests"
      ON ab_tests
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_ab_tests_user_id ON ab_tests(user_id);

-- Add constraints if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'ab_tests' 
    AND constraint_name = 'ab_tests_status_check'
  ) THEN
    ALTER TABLE ab_tests ADD CONSTRAINT ab_tests_status_check 
      CHECK (status IN ('running', 'completed', 'paused', 'cancelled'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'ab_tests' 
    AND constraint_name = 'ab_tests_significance_level_check'
  ) THEN
    ALTER TABLE ab_tests ADD CONSTRAINT ab_tests_significance_level_check 
      CHECK (significance_level >= 0 AND significance_level <= 1);
  END IF;
END $$;