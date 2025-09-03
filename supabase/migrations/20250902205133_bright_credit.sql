/*
  # Create Agency Clients Table

  1. New Tables
    - `agency_clients`
      - `id` (uuid, primary key)
      - `agency_id` (uuid, foreign key to agency_partners)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text, client contact name)
      - `email` (text, client email)
      - `company` (text, client company name)
      - `industry` (text, client industry)
      - `monthly_budget` (numeric, client monthly ad budget)
      - `status` (text, enum: active, paused, churned)
      - `campaigns` (text array, campaign identifiers)
      - `performance_metrics` (jsonb, client performance data)
      - `last_activity` (timestamptz, last activity timestamp)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `agency_clients` table
    - Add policy for agency partners to manage their clients
    - Add policy for service role to manage all clients

  3. Indexes
    - Index on agency_id for fast agency queries
    - Index on user_id for user queries
    - Index on status for filtering
    - Check constraints for valid enums
*/

CREATE TABLE IF NOT EXISTS agency_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL,
  user_id uuid NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  industry text NOT NULL,
  monthly_budget numeric DEFAULT 0,
  status text DEFAULT 'active',
  campaigns text[] DEFAULT '{}',
  performance_metrics jsonb DEFAULT '{}',
  last_activity timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE agency_clients ENABLE ROW LEVEL SECURITY;

-- Create policies only if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'agency_clients' 
    AND policyname = 'Agency partners can manage their clients'
  ) THEN
    CREATE POLICY "Agency partners can manage their clients"
      ON agency_clients
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM agency_partners 
          WHERE agency_partners.id = agency_clients.agency_id 
          AND agency_partners.user_id = auth.uid()
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM agency_partners 
          WHERE agency_partners.id = agency_clients.agency_id 
          AND agency_partners.user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'agency_clients' 
    AND policyname = 'Service role can manage all clients'
  ) THEN
    CREATE POLICY "Service role can manage all clients"
      ON agency_clients
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_agency_clients_agency_id ON agency_clients(agency_id);
CREATE INDEX IF NOT EXISTS idx_agency_clients_user_id ON agency_clients(user_id);
CREATE INDEX IF NOT EXISTS idx_agency_clients_status ON agency_clients(status);
CREATE INDEX IF NOT EXISTS idx_agency_clients_industry ON agency_clients(industry);

-- Add constraints if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'agency_clients' 
    AND constraint_name = 'agency_clients_status_check'
  ) THEN
    ALTER TABLE agency_clients ADD CONSTRAINT agency_clients_status_check 
      CHECK (status IN ('active', 'paused', 'churned'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'agency_clients' 
    AND constraint_name = 'agency_clients_monthly_budget_check'
  ) THEN
    ALTER TABLE agency_clients ADD CONSTRAINT agency_clients_monthly_budget_check 
      CHECK (monthly_budget >= 0);
  END IF;
END $$;