# Account Linking System

This document describes the account linking functionality implemented in the AdGen AI application.

## Overview

The account linking system allows users to connect multiple OAuth providers (Google, Facebook, GitHub, Twitter, LinkedIn, Microsoft) to their AdGen AI account for seamless integration and enhanced functionality.

## Architecture

### Database Schema

#### `linked_accounts` Table
- Stores OAuth provider connections for users
- Includes encrypted access/refresh tokens
- Supports primary account designation
- Tracks usage and linking timestamps

#### `account_link_requests` Table
- Temporary storage for OAuth linking process
- Uses state tokens for security
- Automatically expires after 10 minutes

### Key Components

#### `useAccountLinking` Hook
- Manages linked account state
- Handles OAuth flow initiation and completion
- Provides account management functions (link, unlink, set primary)
- Real-time updates via Supabase subscriptions

#### `AccountLinking` Component
- Main UI for managing linked accounts
- Shows connected providers with status indicators
- Provides linking/unlinking controls
- Security information and notices

#### `OAuthCallback` Component
- Handles OAuth redirect callbacks
- Completes the linking process
- Shows linking status and error handling

#### `AccountSettings` Page
- Comprehensive account management interface
- Tabbed interface including linked accounts
- Profile, billing, security, and privacy settings

## Usage

### Linking an Account

1. User navigates to Account Settings → Linked Accounts
2. Clicks "Connect" on desired provider
3. Redirected to OAuth provider for authorization
4. Returns to `/auth/callback` with authorization code
5. System completes linking and stores encrypted tokens

### Managing Linked Accounts

- **View**: All linked accounts shown with provider info and status
- **Set Primary**: Designate which account is primary for integrations
- **Unlink**: Remove provider connection (with confirmation)
- **Refresh**: Update token and usage timestamps

### Security Features

- **Encrypted Tokens**: Access and refresh tokens encrypted at rest
- **State Validation**: OAuth flows protected with secure state tokens
- **Row Level Security**: Database policies ensure users only access their data
- **Token Expiration**: Automatic cleanup of expired link requests
- **Audit Trail**: Tracking of linking, usage, and modification timestamps

## API Reference

### Hook Functions

```typescript
const {
  linkedAccounts,          // Array of linked accounts
  loading,                 // Loading state
  error,                   // Error message
  isLinking,              // Currently linking state
  initiateOAuthLink,      // Start OAuth flow
  completeOAuthLink,      // Complete OAuth flow
  unlinkAccount,          // Remove linked account
  setPrimaryAccount,      // Set primary account
  isProviderLinked,       // Check if provider is linked
  getPrimaryAccount,      // Get primary account
  refreshProviderToken,   // Refresh access token
} = useAccountLinking();
```

### Database Functions

```sql
-- Set primary account (only one per user)
SELECT set_primary_linked_account('account-uuid');

-- Cleanup expired link requests
SELECT cleanup_expired_link_requests();
```

## Provider Configurations

Each OAuth provider has specific configuration:

- **Google**: Full profile access, offline access for refresh tokens
- **Facebook**: Basic profile and email access
- **GitHub**: User profile and email access
- **Twitter**: User profile and tweet read access
- **LinkedIn**: Professional profile and email access
- **Microsoft**: Office 365 profile access

## Integration Points

The linked accounts can be used for:

1. **Campaign Management**: Auto-import campaigns from linked ad accounts
2. **Social Media**: Post content across linked social platforms
3. **Analytics**: Aggregate performance data from multiple sources
4. **Automation**: Cross-platform campaign synchronization
5. **Reporting**: Unified reporting across all linked accounts

## Error Handling

- Network errors during OAuth flow
- Provider-specific errors (invalid tokens, revoked access)
- Duplicate account linking attempts
- Expired or invalid state tokens
- Missing required permissions

## Security Considerations

- Tokens are encrypted in the database
- OAuth state parameter prevents CSRF attacks
- Row-level security ensures data isolation
- Regular token refresh for long-lived integrations
- Secure cleanup of expired requests

## Future Enhancements

- Token refresh automation
- Provider-specific integration features
- Bulk account management
- Advanced security settings (2FA for linking)
- Integration usage analytics