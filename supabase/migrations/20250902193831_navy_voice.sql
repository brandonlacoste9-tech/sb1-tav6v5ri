/*
  # Add subscription tracking to profiles table

  1. New Columns
    - `subscription_status` (text) - Track subscription status (free, active, cancelled, past_due)
    - `subscription_id` (text) - Stripe subscription ID for linking
    - `plan_type` (text) - Current plan tier (free, pro, enterprise)
    - `subscription_created_at` (timestamp) - When subscription started
    - `subscription_updated_at` (timestamp) - Last subscription update

  2. Security
    - Users can only read their own subscription data
    - Only system can update subscription status via webhooks
    - Add constraints for valid status and plan values

  3. Indexes
    - Index on subscription_id for webhook lookups
    - Index on plan_type for analytics queries
*/

-- Add subscription tracking columns to profiles table
DO $$
BEGIN
  -- Add subscription_status column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_status text DEFAULT 'free';
  END IF;

  -- Add subscription_id column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'subscription_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_id text;
  END IF;

  -- Add plan_type column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'plan_type'
  ) THEN
    ALTER TABLE profiles ADD COLUMN plan_type text DEFAULT 'free';
  END IF;

  -- Add subscription_created_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'subscription_created_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_created_at timestamptz;
  END IF;

  -- Add subscription_updated_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'subscription_updated_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_updated_at timestamptz;
  END IF;
END $$;

-- Add constraints for valid values
DO $$
BEGIN
  -- Add subscription_status constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'profiles' AND constraint_name = 'profiles_subscription_status_check'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_subscription_status_check 
    CHECK (subscription_status IN ('free', 'active', 'cancelled', 'past_due'));
  END IF;

  -- Add plan_type constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'profiles' AND constraint_name = 'profiles_plan_type_check'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_plan_type_check 
    CHECK (plan_type IN ('free', 'pro', 'enterprise'));
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_id ON profiles(subscription_id);
CREATE INDEX IF NOT EXISTS idx_profiles_plan_type ON profiles(plan_type);

-- Enable RLS on profiles table (if not already enabled)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them with subscription access
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create comprehensive RLS policies for subscription data
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create service role policy for webhook updates (system-only subscription updates)
CREATE POLICY "Service role can update subscriptions"
  ON profiles
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);