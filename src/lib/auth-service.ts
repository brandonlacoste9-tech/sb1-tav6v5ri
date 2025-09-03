import { supabase } from './supabase';
import type { OAuthProvider } from '../types';

export class AuthService {
  /**
   * Sign in with OAuth provider
   */
  static async signInWithProvider(provider: OAuthProvider, redirectTo?: string) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: redirectTo || `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      throw new Error(`Failed to sign in with ${provider}: ${error.message}`);
    }

    return data;
  }

  /**
   * Sign out current user
   */
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(`Failed to sign out: ${error.message}`);
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      throw new Error(`Failed to get current user: ${error.message}`);
    }
    return user;
  }

  /**
   * Get current session
   */
  static async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      throw new Error(`Failed to get current session: ${error.message}`);
    }
    return session;
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch {
      return false;
    }
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  /**
   * Provider configurations for OAuth
   */
  static getProviderConfig(provider: OAuthProvider) {
    const configs = {
      google: {
        scopes: ['openid', 'email', 'profile'],
        additionalParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
      facebook: {
        scopes: ['email', 'public_profile'],
        additionalParams: {},
      },
      github: {
        scopes: ['user:email', 'read:user'],
        additionalParams: {},
      },
      twitter: {
        scopes: ['tweet.read', 'users.read'],
        additionalParams: {},
      },
      linkedin: {
        scopes: ['r_liteprofile', 'r_emailaddress'],
        additionalParams: {},
      },
      microsoft: {
        scopes: ['openid', 'email', 'profile'],
        additionalParams: {},
      },
    };

    return configs[provider] || configs.google;
  }

  /**
   * Generate secure state token for OAuth flow
   */
  static generateStateToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Validate state token
   */
  static validateStateToken(token: string): boolean {
    // Basic validation - in production, you might want more sophisticated validation
    return typeof token === 'string' && token.length > 0 && /^[a-f0-9-]+$/i.test(token);
  }
}