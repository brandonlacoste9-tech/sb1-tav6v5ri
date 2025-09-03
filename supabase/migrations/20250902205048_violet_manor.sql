/*
  # Create Touchpoints Table for Attribution Analytics

  1. New Tables
    - `touchpoints`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `session_id` (text, user session identifier)
      - `creative_id` (uuid, creative identifier)
      - `campaign_id` (uuid, campaign identifier)
      - `platform` (text, advertising platform)
      - `touchpoint_type` (text, enum: impression, click, view, engagement, conversion)
      - `timestamp` (timestamptz, when touchpoint occurred)
      - `value` (numeric, conversion value if applicable)
      - `conversion_type` (text, type of conversion)
      - `device_type` (text, mobile/desktop/tablet)
      - `metadata` (jsonb, additional touchpoint data)
      - `created_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `touchpoints` table
    - Add policy for users to manage their own touchpoints
    - Add policy for users to view their own touchpoints

  3. Indexes
    - Index on user_id for fast user queries
    - Index on creative_id for performance analysis
    - Index on timestamp for time-based queries
    - Check constraints for valid enums
*/

CREATE TABLE IF NOT EXISTS touchpoints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  session_id text NOT NULL,
  creative_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  platform text NOT NULL,
  touchpoint_type text NOT NULL,
  timestamp timestamptz NOT NULL,
  value numeric DEFAULT 0,
  conversion_type text,
  device_type text DEFAULT 'desktop',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE touchpoints ENABLE ROW LEVEL SECURITY;

-- Create policies only if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'touchpoints' 
    AND policyname = 'Users can manage their own touchpoints'
  ) THEN
    CREATE POLICY "Users can manage their own touchpoints"
      ON touchpoints
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
    WHERE tablename = 'touchpoints' 
    AND policyname = 'Users can view their own touchpoints'
  ) THEN
    CREATE POLICY "Users can view their own touchpoints"
      ON touchpoints
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_touchpoints_user_id ON touchpoints(user_id);
CREATE INDEX IF NOT EXISTS idx_touchpoints_creative_id ON touchpoints(creative_id);
CREATE INDEX IF NOT EXISTS idx_touchpoints_timestamp ON touchpoints(timestamp);
CREATE INDEX IF NOT EXISTS idx_touchpoints_campaign_id ON touchpoints(campaign_id);

-- Add constraints if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'touchpoints' 
    AND constraint_name = 'touchpoints_touchpoint_type_check'
  ) THEN
    ALTER TABLE touchpoints ADD CONSTRAINT touchpoints_touchpoint_type_check 
      CHECK (touchpoint_type IN ('impression', 'click', 'view', 'engagement', 'conversion'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'touchpoints' 
    AND constraint_name = 'touchpoints_platform_check'
  ) THEN
    ALTER TABLE touchpoints ADD CONSTRAINT touchpoints_platform_check 
      CHECK (platform IN ('facebook', 'instagram', 'google', 'tiktok', 'linkedin', 'email', 'organic', 'direct'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'touchpoints' 
    AND constraint_name = 'touchpoints_device_type_check'
  ) THEN
    ALTER TABLE touchpoints ADD CONSTRAINT touchpoints_device_type_check 
      CHECK (device_type IN ('mobile', 'desktop', 'tablet'));
  END IF;
END $$;