import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { LinkedAccount, AccountLinkRequest, OAuthProvider, AccountLinkingState } from '../types';

export const useAccountLinking = () => {
  const [state, setState] = useState<AccountLinkingState>({
    linkedAccounts: [],
    loading: true,
    error: null,
    isLinking: false,
  });

  // Fetch linked accounts for the current user
  const fetchLinkedAccounts = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setState(prev => ({ ...prev, linkedAccounts: [], loading: false }));
        return;
      }

      const { data, error } = await supabase
        .from('linked_accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('linked_at', { ascending: false });

      if (error) throw error;

      setState(prev => ({
        ...prev,
        linkedAccounts: data || [],
        loading: false,
      }));
    } catch (err) {
      console.error('Error fetching linked accounts:', err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to fetch linked accounts',
        loading: false,
      }));
    }
  }, []);

  // Initialize OAuth linking process
  const initiateOAuthLink = useCallback(async (provider: OAuthProvider, redirectUrl?: string) => {
    try {
      setState(prev => ({ ...prev, isLinking: true, error: null }));
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User must be authenticated to link accounts');
      }

      // Check if account is already linked
      const { data: existingAccount } = await supabase
        .from('linked_accounts')
        .select('id')
        .eq('user_id', user.id)
        .eq('provider', provider)
        .single();

      if (existingAccount) {
        throw new Error(`${provider} account is already linked`);
      }

      // Create a link request with state token
      const stateToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const { error } = await supabase
        .from('account_link_requests')
        .insert({
          user_id: user.id,
          provider,
          state_token: stateToken,
          redirect_url: redirectUrl || window.location.href,
        });

      if (error) throw error;

      // Redirect to OAuth provider
      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?state=${stateToken}&provider=${provider}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (authError) throw authError;

      return { success: true, authUrl: data.url };
    } catch (err) {
      console.error('Error initiating OAuth link:', err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to initiate account linking',
        isLinking: false,
      }));
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }, []);

  // Complete the OAuth linking process
  const completeOAuthLink = useCallback(async (
    provider: OAuthProvider,
    stateToken: string,
    session: any
  ) => {
    try {
      setState(prev => ({ ...prev, isLinking: true, error: null }));

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User must be authenticated to complete linking');
      }

      // Verify the link request
      const { data: linkRequest, error: requestError } = await supabase
        .from('account_link_requests')
        .select('*')
        .eq('state_token', stateToken)
        .eq('user_id', user.id)
        .eq('provider', provider)
        .single();

      if (requestError || !linkRequest) {
        throw new Error('Invalid or expired link request');
      }

      // Extract provider information from session
      const providerData = session.user.user_metadata;
      const providerUserId = session.user.id;
      
      // Check if this provider account is already linked to another user
      const { data: existingLink } = await supabase
        .from('linked_accounts')
        .select('user_id')
        .eq('provider', provider)
        .eq('provider_user_id', providerUserId)
        .single();

      if (existingLink && existingLink.user_id !== user.id) {
        throw new Error('This account is already linked to another user');
      }

      // Create the linked account
      const { error: insertError } = await supabase
        .from('linked_accounts')
        .insert({
          user_id: user.id,
          provider,
          provider_user_id: providerUserId,
          provider_email: providerData.email,
          provider_name: providerData.full_name || providerData.name,
          provider_avatar_url: providerData.avatar_url || providerData.picture,
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          token_expires_at: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
          metadata: providerData,
          is_primary: false, // Never set as primary automatically
        });

      if (insertError) throw insertError;

      // Clean up the link request
      await supabase
        .from('account_link_requests')
        .delete()
        .eq('id', linkRequest.id);

      // Refresh the linked accounts
      await fetchLinkedAccounts();

      setState(prev => ({ ...prev, isLinking: false }));
      return { success: true };
    } catch (err) {
      console.error('Error completing OAuth link:', err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to complete account linking',
        isLinking: false,
      }));
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }, [fetchLinkedAccounts]);

  // Unlink an account
  const unlinkAccount = useCallback(async (accountId: string) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      const { error } = await supabase
        .from('linked_accounts')
        .delete()
        .eq('id', accountId);

      if (error) throw error;

      // Refresh the linked accounts
      await fetchLinkedAccounts();
      return { success: true };
    } catch (err) {
      console.error('Error unlinking account:', err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to unlink account',
      }));
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }, [fetchLinkedAccounts]);

  // Set primary account
  const setPrimaryAccount = useCallback(async (accountId: string) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      const { error } = await supabase.rpc('set_primary_linked_account', {
        account_id: accountId,
      });

      if (error) throw error;

      // Refresh the linked accounts
      await fetchLinkedAccounts();
      return { success: true };
    } catch (err) {
      console.error('Error setting primary account:', err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to set primary account',
      }));
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }, [fetchLinkedAccounts]);

  // Get account by provider
  const getAccountByProvider = useCallback((provider: OAuthProvider) => {
    return state.linkedAccounts.find(account => account.provider === provider);
  }, [state.linkedAccounts]);

  // Check if provider is linked
  const isProviderLinked = useCallback((provider: OAuthProvider) => {
    return state.linkedAccounts.some(account => account.provider === provider);
  }, [state.linkedAccounts]);

  // Get primary account
  const getPrimaryAccount = useCallback(() => {
    return state.linkedAccounts.find(account => account.is_primary);
  }, [state.linkedAccounts]);

  // Refresh access token for a provider
  const refreshProviderToken = useCallback(async (accountId: string) => {
    try {
      const account = state.linkedAccounts.find(acc => acc.id === accountId);
      if (!account) {
        throw new Error('Account not found');
      }

      // This would typically involve calling the provider's token refresh endpoint
      // For now, we'll just update the last_used_at timestamp
      const { error } = await supabase
        .from('linked_accounts')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', accountId);

      if (error) throw error;

      await fetchLinkedAccounts();
      return { success: true };
    } catch (err) {
      console.error('Error refreshing token:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }, [state.linkedAccounts, fetchLinkedAccounts]);

  // Initialize on mount
  useEffect(() => {
    fetchLinkedAccounts();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          fetchLinkedAccounts();
        }
      }
    );

    // Listen for real-time updates to linked accounts
    const channel = supabase
      .channel('linked-accounts-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'linked_accounts',
        },
        () => {
          fetchLinkedAccounts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      channel.unsubscribe();
    };
  }, [fetchLinkedAccounts]);

  return {
    ...state,
    initiateOAuthLink,
    completeOAuthLink,
    unlinkAccount,
    setPrimaryAccount,
    getAccountByProvider,
    isProviderLinked,
    getPrimaryAccount,
    refreshProviderToken,
    refreshLinkedAccounts: fetchLinkedAccounts,
  };
};