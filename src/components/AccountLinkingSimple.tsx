import React from 'react';
import { Link2, User, CheckCircle } from 'lucide-react';

export const AccountLinkingSimple: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Link2 className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Account Linking</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Connect multiple accounts to streamline your workflow.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Connected Accounts</h2>
        <p className="text-gray-500">No accounts connected yet.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Connections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white">
                  🔍
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Google</h3>
                  <p className="text-sm text-gray-600">Connect your Google account</p>
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600">
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};