/*
  # Account Linking System

  1. New Tables
    - `linked_accounts` - Stores OAuth provider connections for users
    - `account_link_requests` - Temporary storage for linking process

  2. Security
    - Enable RLS on all tables
    - Users can only manage their own linked accounts
*/

-- Linked accounts table
CREATE TABLE IF NOT EXISTS linked_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider IN ('google', 'facebook', 'github', 'twitter', 'linkedin', 'microsoft')),
  provider_user_id text NOT NULL,
  provider_email text,
  provider_name text,
  provider_avatar_url text,
  access_token text, -- Encrypted in production
  refresh_token text, -- Encrypted in production
  token_expires_at timestamptz,
  metadata jsonb DEFAULT '{}',
  is_primary boolean DEFAULT false,
  linked_at timestamptz DEFAULT now(),
  last_used_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, provider),
  UNIQUE(provider, provider_user_id)
);

-- Account link requests (temporary storage during OAuth flow)
CREATE TABLE IF NOT EXISTS account_link_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL,
  state_token text NOT NULL UNIQUE,
  redirect_url text,
  expires_at timestamptz DEFAULT (now() + interval '10 minutes'),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE linked_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_link_requests ENABLE ROW LEVEL SECURITY;

-- Policies for linked_accounts
CREATE POLICY "Users can read own linked accounts"
  ON linked_accounts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own linked accounts"
  ON linked_accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own linked accounts"
  ON linked_accounts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own linked accounts"
  ON linked_accounts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for account_link_requests
CREATE POLICY "Users can manage own link requests"
  ON account_link_requests
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Functions for account linking
CREATE OR REPLACE FUNCTION update_linked_account_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  NEW.last_used_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update timestamps
CREATE TRIGGER update_linked_accounts_timestamp
  BEFORE UPDATE ON linked_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_linked_account_timestamp();

-- Function to set primary account
CREATE OR REPLACE FUNCTION set_primary_linked_account(account_id uuid)
RETURNS void AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Get the user_id for the account
  SELECT user_id INTO target_user_id
  FROM linked_accounts
  WHERE id = account_id AND user_id = auth.uid();
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'Account not found or access denied';
  END IF;
  
  -- Remove primary flag from all accounts for this user
  UPDATE linked_accounts
  SET is_primary = false
  WHERE user_id = target_user_id;
  
  -- Set the target account as primary
  UPDATE linked_accounts
  SET is_primary = true
  WHERE id = account_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup function for expired link requests
CREATE OR REPLACE FUNCTION cleanup_expired_link_requests()
RETURNS void AS $$
BEGIN
  DELETE FROM account_link_requests
  WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_linked_accounts_user_id ON linked_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_linked_accounts_provider ON linked_accounts(provider);
CREATE INDEX IF NOT EXISTS idx_linked_accounts_provider_user_id ON linked_accounts(provider_user_id);
CREATE INDEX IF NOT EXISTS idx_linked_accounts_is_primary ON linked_accounts(is_primary) WHERE is_primary = true;
CREATE INDEX IF NOT EXISTS idx_account_link_requests_state_token ON account_link_requests(state_token);
CREATE INDEX IF NOT EXISTS idx_account_link_requests_expires_at ON account_link_requests(expires_at);

-- Add linked accounts count to profiles view
CREATE OR REPLACE VIEW user_profile_with_links AS
SELECT 
  p.*,
  COALESCE(la.linked_accounts_count, 0) as linked_accounts_count,
  COALESCE(la.providers, '{}') as linked_providers
FROM profiles p
LEFT JOIN (
  SELECT 
    user_id,
    COUNT(*) as linked_accounts_count,
    array_agg(provider) as providers
  FROM linked_accounts
  GROUP BY user_id
) la ON p.id = la.user_id;