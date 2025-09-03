/*
  # Create Agency Partners Table

  1. New Tables
    - `agency_partners`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text, partner contact name)
      - `email` (text, partner email)
      - `company` (text, agency company name)
      - `website` (text, agency website)
      - `tier` (text, enum: starter, pro, enterprise)
      - `status` (text, enum: pending, active, suspended, cancelled)
      - `client_count` (integer, number of clients)
      - `monthly_revenue` (numeric, total monthly revenue)
      - `commission_rate` (numeric, commission percentage)
      - `white_label` (boolean, white label enabled)
      - `custom_branding` (jsonb, branding configuration)
      - `account_manager` (text, assigned account manager)
      - `onboarding_completed` (boolean, onboarding status)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `agency_partners` table
    - Add policy for users to manage their own partner data
    - Add policy for service role to manage all partners

  3. Indexes
    - Index on user_id for fast user queries
    - Index on email for lookups
    - Index on status for filtering
    - Check constraints for valid enums
*/

CREATE TABLE IF NOT EXISTS agency_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  company text NOT NULL,
  website text,
  tier text DEFAULT 'starter',
  status text DEFAULT 'pending',
  client_count integer DEFAULT 0,
  monthly_revenue numeric DEFAULT 0,
  commission_rate numeric DEFAULT 15,
  white_label boolean DEFAULT false,
  custom_branding jsonb DEFAULT '{}',
  account_manager text,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE agency_partners ENABLE ROW LEVEL SECURITY;

-- Create policies only if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'agency_partners' 
    AND policyname = 'Users can manage their own partner data'
  ) THEN
    CREATE POLICY "Users can manage their own partner data"
      ON agency_partners
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
    WHERE tablename = 'agency_partners' 
    AND policyname = 'Service role can manage all partners'
  ) THEN
    CREATE POLICY "Service role can manage all partners"
      ON agency_partners
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_agency_partners_user_id ON agency_partners(user_id);
CREATE INDEX IF NOT EXISTS idx_agency_partners_email ON agency_partners(email);
CREATE INDEX IF NOT EXISTS idx_agency_partners_status ON agency_partners(status);
CREATE INDEX IF NOT EXISTS idx_agency_partners_tier ON agency_partners(tier);

-- Add constraints if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'agency_partners' 
    AND constraint_name = 'agency_partners_tier_check'
  ) THEN
    ALTER TABLE agency_partners ADD CONSTRAINT agency_partners_tier_check 
      CHECK (tier IN ('starter', 'pro', 'enterprise'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'agency_partners' 
    AND constraint_name = 'agency_partners_status_check'
  ) THEN
    ALTER TABLE agency_partners ADD CONSTRAINT agency_partners_status_check 
      CHECK (status IN ('pending', 'active', 'suspended', 'cancelled'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'agency_partners' 
    AND constraint_name = 'agency_partners_commission_rate_check'
  ) THEN
    ALTER TABLE agency_partners ADD CONSTRAINT agency_partners_commission_rate_check 
      CHECK (commission_rate >= 0 AND commission_rate <= 50);
  END IF;
END $$;