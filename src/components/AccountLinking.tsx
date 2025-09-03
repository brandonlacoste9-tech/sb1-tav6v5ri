import React, { useState } from 'react';
import { 
  Link2, 
  Unlink, 
  Shield, 
  Star, 
  AlertCircle, 
  CheckCircle, 
  ExternalLink,
  Settings,
  Clock,
  User
} from 'lucide-react';
import { useAccountLinking } from '../hooks/useAccountLinking';
import type { OAuthProvider } from '../types';
import { AccountLinkingUtils } from '../lib/account-linking-utils';

// Provider configurations
const PROVIDER_CONFIG = {
  google: {
    name: 'Google',
    icon: '🔍',
    color: 'bg-red-500',
    hoverColor: 'hover:bg-red-600',
    description: 'Connect your Google account for seamless integration',
  },
  facebook: {
    name: 'Facebook',
    icon: '📘',
    color: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700',
    description: 'Link Facebook for social media campaign management',
  },
  github: {
    name: 'GitHub',
    icon: '🐙',
    color: 'bg-gray-800',
    hoverColor: 'hover:bg-gray-900',
    description: 'Connect GitHub for development workflow integration',
  },
  twitter: {
    name: 'Twitter',
    icon: '🐦',
    color: 'bg-sky-500',
    hoverColor: 'hover:bg-sky-600',
    description: 'Link Twitter for social media insights and posting',
  },
  linkedin: {
    name: 'LinkedIn',
    icon: '💼',
    color: 'bg-blue-700',
    hoverColor: 'hover:bg-blue-800',
    description: 'Connect LinkedIn for professional network integration',
  },
  microsoft: {
    name: 'Microsoft',
    icon: '🏢',
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    description: 'Link Microsoft account for Office 365 integration',
  },
};

export const AccountLinking: React.FC = () => {
  const {
    linkedAccounts,
    loading,
    error,
    isLinking,
    initiateOAuthLink,
    unlinkAccount,
    setPrimaryAccount,
    isProviderLinked,
    getPrimaryAccount,
  } = useAccountLinking();

  const [selectedProvider, setSelectedProvider] = useState<OAuthProvider | null>(null);
  const [showConfirmUnlink, setShowConfirmUnlink] = useState<string | null>(null);

  const handleLinkAccount = async (provider: OAuthProvider) => {
    setSelectedProvider(provider);
    const result = await initiateOAuthLink(provider);
    
    if (!result.success) {
      setSelectedProvider(null);
    }
  };

  const handleUnlinkAccount = async (accountId: string) => {
    const result = await unlinkAccount(accountId);
    if (result.success) {
      setShowConfirmUnlink(null);
    }
  };

  const handleSetPrimary = async (accountId: string) => {
    await setPrimaryAccount(accountId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const primaryAccount = getPrimaryAccount();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Link2 className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Account Linking</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Connect multiple accounts to streamline your workflow and access integrated features across platforms.
          Link your social media, development, and business accounts for a unified experience.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Linked Accounts Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span>Connected Accounts ({linkedAccounts.length})</span>
          </h2>
        </div>

        <div className="p-6">
          {linkedAccounts.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No accounts connected yet</p>
              <p className="text-sm text-gray-400">Link your first account below to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {AccountLinkingUtils.sortAccountsByPriority(linkedAccounts).map((account) => {
                const config = PROVIDER_CONFIG[account.provider];
                const isPrimary = account.is_primary;
                
                return (
                  <div
                    key={account.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      isPrimary 
                        ? 'border-primary-200 bg-primary-50' 
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${config.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                        {config.icon}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{config.name}</h3>
                          {isPrimary && (
                            <div className="flex items-center space-x-1 bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                              <Star className="w-3 h-3" />
                              <span>Primary</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {account.provider_name || account.provider_email || 'Connected'}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Linked {formatDate(account.linked_at)}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span>Last used {formatDate(account.last_used_at)}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {!isPrimary && (
                        <button
                          onClick={() => handleSetPrimary(account.id)}
                          className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 transition-colors"
                        >
                          Set Primary
                        </button>
                      )}
                      <button
                        onClick={() => setShowConfirmUnlink(account.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Unlink account"
                      >
                        <Unlink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Available Providers Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <ExternalLink className="w-5 h-5 text-blue-600" />
            <span>Available Connections</span>
          </h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.keys(PROVIDER_CONFIG) as OAuthProvider[]).map((provider) => {
              const config = PROVIDER_CONFIG[provider];
              const isLinked = isProviderLinked(provider);
              const isCurrentlyLinking = isLinking && selectedProvider === provider;

              return (
                <div
                  key={provider}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isLinked 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-white hover:border-primary-200 hover:bg-primary-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${config.color} rounded-lg flex items-center justify-center text-white`}>
                        {config.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{config.name}</h3>
                        <p className="text-sm text-gray-600">{config.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isLinked ? (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Connected</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleLinkAccount(provider)}
                          disabled={isCurrentlyLinking}
                          className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${config.color} ${config.hoverColor} disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1`}
                        >
                          {isCurrentlyLinking ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Connecting...</span>
                            </>
                          ) : (
                            <>
                              <Link2 className="w-4 h-4" />
                              <span>Connect</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Security & Privacy</h3>
            <p className="text-sm text-blue-800 mb-2">
              Your linked accounts are securely encrypted and stored. We only access the minimum permissions required for integration features.
            </p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Tokens are encrypted at rest</li>
              <li>• You can unlink accounts at any time</li>
              <li>• We never store passwords</li>
              <li>• Primary account determines default integration preferences</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Unlink Confirmation Modal */}
      {showConfirmUnlink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">Unlink Account</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to unlink this account? This will remove access to integrated features for this provider.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmUnlink(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUnlinkAccount(showConfirmUnlink)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Unlink
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};