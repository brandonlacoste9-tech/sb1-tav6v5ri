import React from 'react';
import { motion } from 'framer-motion';
import { useSubscription } from '../hooks/useSubscription';
import { CheckoutButton } from './CheckoutButton';
import { STRIPE_PRICE_IDS } from '../lib/stripe';
import { 
  CheckCircle, AlertTriangle, XCircle, Crown, Building, Zap, 
  ArrowRight, Shield, Star, CreditCard, Calendar
} from 'lucide-react';

export const SubscriptionStatus: React.FC = () => {
  const { subscription, loading, isPro, isEnterprise, isPaid } = useSubscription();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-3 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-warning-50 to-warning-100 border-2 border-warning-200 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-warning-200 p-3 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-warning-700" />
            </div>
            <div>
              <p className="text-warning-900 font-semibold text-lg">Authentication Required</p>
              <p className="text-warning-800">Please sign in to view your subscription status and access premium features</p>
            </div>
          </div>
          <button className="btn-primary">
            Sign In
          </button>
        </div>
      </motion.div>
    );
  }

  const getStatusIcon = () => {
    switch (subscription.subscription_status) {
      case 'active':
        return <CheckCircle className="w-6 h-6 text-success-600" />;
      case 'past_due':
        return <AlertTriangle className="w-6 h-6 text-warning-600" />;
      case 'cancelled':
        return <XCircle className="w-6 h-6 text-error-500" />;
      default:
        return <Zap className="w-6 h-6 text-gray-500" />;
    }
  };

  const getPlanIcon = () => {
    if (isEnterprise) return <Building className="w-8 h-8 text-warning-600" />;
    if (isPro) return <Crown className="w-8 h-8 text-primary-600" />;
    return <Zap className="w-8 h-8 text-gray-500" />;
  };

  const getStatusColor = () => {
    switch (subscription.subscription_status) {
      case 'active':
        return 'from-success-50 to-success-100 border-success-200';
      case 'past_due':
        return 'from-warning-50 to-warning-100 border-warning-200';
      case 'cancelled':
        return 'from-error-50 to-error-100 border-error-200';
      default:
        return 'from-gray-50 to-gray-100 border-gray-200';
    }
  };

  const getPlanFeatures = () => {
    if (isEnterprise) {
      return ['Unlimited everything', 'Dedicated manager', 'API access', 'Priority support'];
    }
    if (isPro) {
      return ['100 fraud scans/month', 'Performance predictions', 'A/B testing', 'Email support'];
    }
    return ['Basic generation', '5 predictions/month', 'Community support'];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r ${getStatusColor()} border-2 rounded-2xl p-6 shadow-lg`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="bg-white/90 p-3 rounded-xl shadow-lg animate-scale-pulse backdrop-blur-sm">
            {getPlanIcon()}
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h3 className="text-2xl font-bold text-gray-900 capitalize text-shadow">
                {subscription.plan_type} Plan
              </h3>
              {isPaid && <Star className="w-5 h-5 text-yellow-500 fill-current animate-bounce-gentle" />}
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className="text-sm font-medium text-gray-700 capitalize">
                {subscription.subscription_status}
              </span>
              {subscription.subscription_status === 'active' && (
                <span className="text-xs bg-success-200 text-success-800 px-2 py-1 rounded-full animate-pulse-slow">
                  Active
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            {subscription.plan_type === 'pro' ? '$15' : 
             subscription.plan_type === 'enterprise' ? '$500' : '$0'}
            <span className="text-sm font-normal text-gray-600">/month</span>
          </p>
          {subscription.subscription_created_at && (
            <p className="text-xs text-gray-500 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              Since {new Date(subscription.subscription_created_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Plan Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {getPlanFeatures().map((feature, index) => (
          <div key={index} className="bg-white/70 backdrop-blur-md rounded-lg p-3 text-center hover:bg-white/80 hover:scale-105 transition-all duration-300 border border-white/20">
            <p className="text-xs text-gray-700 font-medium">{feature}</p>
          </div>
        ))}
      </div>

      {/* Status-specific content */}
      {subscription.subscription_status === 'past_due' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-warning-100 border border-warning-300 rounded-xl p-4 mb-4"
        >
          <div className="flex items-center space-x-3">
            <CreditCard className="w-5 h-5 text-warning-700" />
            <div>
              <p className="text-warning-900 font-semibold">Payment Issue Detected</p>
              <p className="text-warning-800 text-sm">
                Your payment is past due. Please update your payment method to continue using premium features.
              </p>
            </div>
          </div>
          <button className="mt-3 bg-warning-600 hover:bg-warning-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Update Payment Method
          </button>
        </motion.div>
      )}

      {subscription.subscription_status === 'cancelled' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-error-100 border border-error-300 rounded-xl p-4 mb-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <XCircle className="w-5 h-5 text-error-700" />
              <div>
                <p className="text-error-900 font-semibold">Subscription Cancelled</p>
                <p className="text-error-800 text-sm">
                  Your subscription has been cancelled. Resubscribe to regain access to premium features.
                </p>
              </div>
            </div>
            <button className="bg-error-600 hover:bg-error-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Resubscribe
            </button>
          </div>
        </motion.div>
      )}

      {/* Upgrade CTA for free users */}
      {subscription.plan_type === 'free' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold mb-2">Unlock Advanced Features</h4>
              <p className="text-sm opacity-90 mb-4">
                Get fraud detection, unlimited predictions, and A/B testing
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>Fraud Protection</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>Performance Boost</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <CheckoutButton
                priceId={STRIPE_PRICE_IDS.pro}
                planName="Pro"
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Upgrade to Pro
              </CheckoutButton>
              <a href="/pricing" className="text-center text-xs text-white/80 hover:text-white">
                View all plans
              </a>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pro user enterprise upsell */}
      {isPro && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-warning-500 to-warning-600 rounded-xl p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold mb-1">Ready for Enterprise?</h4>
              <p className="text-sm opacity-90">Unlimited everything + dedicated support</p>
            </div>
            <CheckoutButton
              priceId={STRIPE_PRICE_IDS.enterprise}
              planName="Enterprise"
              className="bg-white text-warning-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
            >
              Upgrade
            </CheckoutButton>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};