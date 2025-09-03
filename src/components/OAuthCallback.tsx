import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useAccountLinking } from '../hooks/useAccountLinking';
import type { OAuthProvider } from '../types';
import { supabase } from '../lib/supabase';

export const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { completeOAuthLink } = useAccountLinking();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing account link...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get parameters from URL
        const stateToken = searchParams.get('state');
        const provider = searchParams.get('provider') as OAuthProvider;
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Check for OAuth errors
        if (error) {
          throw new Error(errorDescription || `OAuth error: ${error}`);
        }

        if (!stateToken || !provider) {
          throw new Error('Missing required parameters for account linking');
        }

        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (!session) {
          throw new Error('No active session found');
        }

        // Complete the linking process
        const result = await completeOAuthLink(provider, stateToken, session);
        
        if (result.success) {
          setStatus('success');
          setMessage(`Successfully linked your ${provider} account!`);
          
          // Redirect after a short delay
          setTimeout(() => {
            navigate('/account-linking', { replace: true });
          }, 2000);
        } else {
          throw new Error(result.error || 'Failed to complete account linking');
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'An unexpected error occurred');
        
        // Redirect to account linking page after error
        setTimeout(() => {
          navigate('/account-linking', { replace: true });
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, completeOAuthLink, navigate]);

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader className="w-8 h-8 text-blue-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="mb-6">
          {getStatusIcon()}
        </div>
        
        <h1 className={`text-xl font-semibold mb-3 ${getStatusColor()}`}>
          {status === 'processing' && 'Linking Account...'}
          {status === 'success' && 'Account Linked!'}
          {status === 'error' && 'Linking Failed'}
        </h1>
        
        <p className="text-gray-600 mb-6">{message}</p>
        
        {status === 'processing' && (
          <div className="text-sm text-gray-500">
            Please wait while we securely connect your account...
          </div>
        )}
        
        {status === 'success' && (
          <div className="text-sm text-gray-500">
            Redirecting you back to account settings...
          </div>
        )}
        
        {status === 'error' && (
          <button
            onClick={() => navigate('/account-linking', { replace: true })}
            className="btn-primary"
          >
            Back to Account Linking
          </button>
        )}
      </div>
    </div>
  );
};