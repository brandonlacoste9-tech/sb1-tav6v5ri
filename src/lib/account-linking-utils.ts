import type { LinkedAccount, OAuthProvider } from '../types';

/**
 * Utility functions for account linking
 */

export const AccountLinkingUtils = {
  /**
   * Get provider display name
   */
  getProviderDisplayName(provider: OAuthProvider): string {
    const names = {
      google: 'Google',
      facebook: 'Facebook',
      github: 'GitHub',
      twitter: 'Twitter',
      linkedin: 'LinkedIn',
      microsoft: 'Microsoft',
    };
    return names[provider] || provider;
  },

  /**
   * Get provider icon/emoji
   */
  getProviderIcon(provider: OAuthProvider): string {
    const icons = {
      google: '🔍',
      facebook: '📘',
      github: '🐙',
      twitter: '🐦',
      linkedin: '💼',
      microsoft: '🏢',
    };
    return icons[provider] || '🔗';
  },

  /**
   * Get provider color classes
   */
  getProviderColors(provider: OAuthProvider) {
    const colors = {
      google: {
        bg: 'bg-red-500',
        hover: 'hover:bg-red-600',
        text: 'text-red-600',
        light: 'bg-red-50',
      },
      facebook: {
        bg: 'bg-blue-600',
        hover: 'hover:bg-blue-700',
        text: 'text-blue-600',
        light: 'bg-blue-50',
      },
      github: {
        bg: 'bg-gray-800',
        hover: 'hover:bg-gray-900',
        text: 'text-gray-800',
        light: 'bg-gray-50',
      },
      twitter: {
        bg: 'bg-sky-500',
        hover: 'hover:bg-sky-600',
        text: 'text-sky-600',
        light: 'bg-sky-50',
      },
      linkedin: {
        bg: 'bg-blue-700',
        hover: 'hover:bg-blue-800',
        text: 'text-blue-700',
        light: 'bg-blue-50',
      },
      microsoft: {
        bg: 'bg-blue-500',
        hover: 'hover:bg-blue-600',
        text: 'text-blue-500',
        light: 'bg-blue-50',
      },
    };
    return colors[provider] || colors.google;
  },

  /**
   * Format account display name
   */
  formatAccountName(account: LinkedAccount): string {
    return account.provider_name || account.provider_email || `${this.getProviderDisplayName(account.provider)} Account`;
  },

  /**
   * Check if token is expired
   */
  isTokenExpired(account: LinkedAccount): boolean {
    if (!account.token_expires_at) return false;
    return new Date(account.token_expires_at) < new Date();
  },

  /**
   * Get time until token expires
   */
  getTokenExpiryInfo(account: LinkedAccount): { expired: boolean; expiresIn?: string } {
    if (!account.token_expires_at) {
      return { expired: false };
    }

    const expiryDate = new Date(account.token_expires_at);
    const now = new Date();
    
    if (expiryDate < now) {
      return { expired: true };
    }

    const diffMs = expiryDate.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diffDays > 0) {
      return { expired: false, expiresIn: `${diffDays} days` };
    } else if (diffHours > 0) {
      return { expired: false, expiresIn: `${diffHours} hours` };
    } else {
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return { expired: false, expiresIn: `${diffMinutes} minutes` };
    }
  },

  /**
   * Get supported providers
   */
  getSupportedProviders(): OAuthProvider[] {
    return ['google', 'facebook', 'github', 'twitter', 'linkedin', 'microsoft'];
  },

  /**
   * Validate provider
   */
  isValidProvider(provider: string): provider is OAuthProvider {
    return this.getSupportedProviders().includes(provider as OAuthProvider);
  },

  /**
   * Get integration capabilities for each provider
   */
  getProviderCapabilities(provider: OAuthProvider) {
    const capabilities = {
      google: {
        features: ['Google Ads Integration', 'Analytics Data', 'YouTube Ads'],
        permissions: ['Profile Access', 'Email', 'Ads Management'],
      },
      facebook: {
        features: ['Facebook Ads', 'Instagram Ads', 'Page Management'],
        permissions: ['Profile Access', 'Email', 'Ads Management', 'Page Access'],
      },
      github: {
        features: ['Repository Integration', 'Issue Tracking', 'Code Analysis'],
        permissions: ['Profile Access', 'Email', 'Repository Access'],
      },
      twitter: {
        features: ['Tweet Posting', 'Analytics', 'Audience Insights'],
        permissions: ['Profile Access', 'Tweet Access', 'Analytics'],
      },
      linkedin: {
        features: ['Professional Network', 'Company Pages', 'Lead Generation'],
        permissions: ['Profile Access', 'Email', 'Network Access'],
      },
      microsoft: {
        features: ['Office 365', 'Teams Integration', 'OneDrive'],
        permissions: ['Profile Access', 'Email', 'Office Access'],
      },
    };
    return capabilities[provider] || { features: [], permissions: [] };
  },

  /**
   * Sort accounts by priority (primary first, then by provider popularity)
   */
  sortAccountsByPriority(accounts: LinkedAccount[]): LinkedAccount[] {
    const providerPriority = {
      google: 1,
      facebook: 2,
      microsoft: 3,
      linkedin: 4,
      github: 5,
      twitter: 6,
    };

    return [...accounts].sort((a, b) => {
      // Primary accounts first
      if (a.is_primary && !b.is_primary) return -1;
      if (!a.is_primary && b.is_primary) return 1;

      // Then by provider priority
      const aPriority = providerPriority[a.provider] || 999;
      const bPriority = providerPriority[b.provider] || 999;
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      // Finally by link date (newest first)
      return new Date(b.linked_at).getTime() - new Date(a.linked_at).getTime();
    });
  },
};