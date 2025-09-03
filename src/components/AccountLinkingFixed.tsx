import React from 'react';
import { Link2, User } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

export const AccountLinkingFixed: React.FC = () => {
  const { subscription, loading } = useSubscription();

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

  if (!subscription) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h1>
          <p className="text-gray-600 mb-6">
            Please sign in to manage your linked accounts.
          </p>
          <button className="btn-primary">
            Sign In with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Link2 className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Account Linking</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Connect multiple accounts to streamline your workflow and access integrated features across platforms.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Connected Accounts (0)</h2>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No accounts connected yet</p>
            <p className="text-sm text-gray-400">Link your first account below to get started</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Available Connections</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border-2 border-gray-200 bg-white hover:border-primary-200 hover:bg-primary-50 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white">
                    🔍
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Google</h3>
                    <p className="text-sm text-gray-600">Connect your Google account for seamless integration</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors flex items-center space-x-1">
                  <Link2 className="w-4 h-4" />
                  <span>Connect</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-lg border-2 border-gray-200 bg-white hover:border-primary-200 hover:bg-primary-50 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                    📘
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Facebook</h3>
                    <p className="text-sm text-gray-600">Link Facebook for social media campaign management</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1">
                  <Link2 className="w-4 h-4" />
                  <span>Connect</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};