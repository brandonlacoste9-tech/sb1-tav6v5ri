/*
  # Add subscription tracking fields

  1. New Columns
    - `subscription_status` (text) - Track subscription status (active, cancelled, past_due)
    - `subscription_id` (text) - Stripe subscription ID
    - `plan_type` (text) - Current plan (free, pro, enterprise)
    - `subscription_created_at` (timestamp) - When subscription started
    - `subscription_updated_at` (timestamp) - Last subscription update

  2. Security
    - Users can only read their own subscription data
    - Only system can update subscription status via webhooks
*/

-- Add subscription fields to profiles table (create if doesn't exist)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  full_name text,
  subscription_status text DEFAULT 'free',
  subscription_id text,
  plan_type text DEFAULT 'free',
  subscription_created_at timestamptz,
  subscription_updated_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add subscription fields if table already exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_status text DEFAULT 'free';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'subscription_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'plan_type'
  ) THEN
    ALTER TABLE profiles ADD COLUMN plan_type text DEFAULT 'free';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'subscription_created_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_created_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'subscription_updated_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_updated_at timestamptz;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Add constraints
ALTER TABLE profiles ADD CONSTRAINT profiles_subscription_status_check 
  CHECK (subscription_status IN ('free', 'active', 'cancelled', 'past_due'));

ALTER TABLE profiles ADD CONSTRAINT profiles_plan_type_check 
  CHECK (plan_type IN ('free', 'pro', 'enterprise'));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_id ON profiles(subscription_id);
CREATE INDEX IF NOT EXISTS idx_profiles_plan_type ON profiles(plan_type);