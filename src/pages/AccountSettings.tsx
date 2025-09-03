import React, { useState } from 'react';
import { 
  User, 
  Link2, 
  CreditCard, 
  Shield, 
  Bell, 
  Download,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { useAccountLinking } from '../hooks/useAccountLinking';
import { AccountLinking } from '../components/AccountLinking';

type SettingsTab = 'profile' | 'accounts' | 'billing' | 'notifications' | 'security' | 'data';

export const AccountSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const { linkedAccounts } = useAccountLinking();

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'accounts' as const, label: 'Linked Accounts', icon: Link2 },
    { id: 'billing' as const, label: 'Billing', icon: CreditCard },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'data' as const, label: 'Data & Privacy', icon: Download },
  ];

  if (subscriptionLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-4 gap-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="col-span-3 h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h1>
            <p className="text-gray-600 mb-6">
              Please sign in to access your account settings and manage linked accounts.
            </p>
            <button className="btn-primary">
              Sign In with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Information</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={subscription.full_name || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={subscription.email || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button className="btn-primary">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600 capitalize">
                      {subscription.plan_type}
                    </div>
                    <div className="text-sm text-gray-500">Current Plan</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 capitalize">
                      {subscription.subscription_status}
                    </div>
                    <div className="text-sm text-gray-500">Status</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {linkedAccounts.length}
                    </div>
                    <div className="text-sm text-gray-500">Linked Accounts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'accounts':
        return <AccountLinking />;

      case 'billing':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Billing & Subscription</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">
                      {subscription.plan_type} Plan
                    </h3>
                    <p className="text-gray-600">
                      Status: <span className="capitalize font-medium">{subscription.subscription_status}</span>
                    </p>
                  </div>
                  <button className="btn-primary">
                    Manage Subscription
                  </button>
                </div>
                
                {subscription.subscription_id && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-medium text-gray-900 mb-2">Subscription Details</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Subscription ID: {subscription.subscription_id}</p>
                      {subscription.subscription_created_at && (
                        <p>Started: {new Date(subscription.subscription_created_at).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Notification Preferences</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-600">Receive updates about your campaigns and account</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Performance Alerts</h3>
                      <p className="text-sm text-gray-600">Get notified when campaign performance changes significantly</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Weekly Reports</h3>
                      <p className="text-sm text-gray-600">Receive weekly performance summaries</p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Security Settings</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <button className="btn-secondary">
                      Enable 2FA
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-medium text-gray-900 mb-2">Active Sessions</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Manage devices that are currently signed in to your account
                    </p>
                    <button className="btn-secondary">
                      View Sessions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data & Privacy</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Export Your Data</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Download a copy of all your data including campaigns, analytics, and account information
                    </p>
                    <button className="btn-secondary flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Request Data Export</span>
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-medium text-red-600 mb-2 flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Delete Account</span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2">
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Account</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Tab content not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">
            Manage your profile, linked accounts, billing, and privacy settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700 border border-primary-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{tab.label}</span>
                      {tab.id === 'accounts' && linkedAccounts.length > 0 && (
                        <span className="ml-auto bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full">
                          {linkedAccounts.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};