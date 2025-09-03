import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Stripe Price IDs - Replace these with your actual Stripe Price IDs
export const STRIPE_PRICE_IDS = {
  pro: 'price_1QdVJhP8mnDdBQuYhvQBQtY1', // $15/month Pro plan
  enterprise: 'price_1QdVJhP8mnDdBQuYhvQBQtY2', // $500/month Enterprise plan
} as const;

export type PlanType = keyof typeof STRIPE_PRICE_IDS;

export interface SubscriptionData {
  priceId: string;
  planName: string;
  amount: number;
  interval: 'month' | 'year';
  features: string[];
  description: string;
}

export const SUBSCRIPTION_PLANS: Record<PlanType, SubscriptionData> = {
  pro: {
    priceId: STRIPE_PRICE_IDS.pro,
    planName: 'Pro',
    amount: 1500, // $15.00 in cents
    interval: 'month',
    description: 'Perfect for growing businesses and agencies',
    features: [
      'Unlimited creative generation',
      '100 fraud scans/month',
      'Performance predictions',
      'Basic attribution models',
      '10 A/B tests/month',
      'Email & chat support'
    ]
  },
  enterprise: {
    priceId: STRIPE_PRICE_IDS.enterprise,
    planName: 'Enterprise',
    amount: 50000, // $500.00 in cents
    interval: 'month',
    description: 'For large teams requiring advanced features',
    features: [
      'Everything in Pro',
      'Unlimited fraud detection',
      'Advanced attribution models',
      'Unlimited A/B testing',
      'Dedicated account manager',
      'API access',
      'Priority support'
    ]
  },
};

// Utility functions
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount / 100);
};

export const getPlanDisplayName = (planType: string): string => {
  switch (planType) {
    case 'pro': return 'Pro';
    case 'enterprise': return 'Enterprise';
    default: return 'Free';
  }
};

export const getPlanPrice = (planType: string): string => {
  switch (planType) {
    case 'pro': return '$15/month';
    case 'enterprise': return '$500/month';
    default: return 'Free';
  }
};