import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckoutButton } from './CheckoutButton';
import { STRIPE_PRICE_IDS, formatPrice, SUBSCRIPTION_PLANS } from '../lib/stripe';
import { Check, Zap, Crown, Building, Star, Shield, ArrowRight, X } from 'lucide-react';

export const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Free',
      price: '$0',
      originalPrice: null,
      period: 'forever',
      description: 'Perfect for getting started with AI ad creation',
      icon: Zap,
      iconColor: 'text-gray-600',
      bgColor: 'bg-gray-100',
      features: [
        'Unlimited basic ad generation',
        '5 performance predictions/month',
        '1 brand kit',
        'Community support',
        'Basic templates library',
        'Standard export formats'
      ],
      limitations: [
        'No fraud detection',
        'No attribution analysis',
        'No automated A/B testing',
        'No priority support'
      ],
      cta: 'Start Free',
      stripeAction: null,
      popular: false,
      badge: null
    },
    {
      name: 'Pro',
      price: billingCycle === 'monthly' ? '$15' : '$150',
      originalPrice: billingCycle === 'yearly' ? '$180' : null,
      period: billingCycle === 'monthly' ? 'per month' : 'per year',
      description: 'For growing businesses and agencies',
      icon: Crown,
      iconColor: 'text-primary-600',
      bgColor: 'bg-primary-100',
      features: [
        'Everything in Free',
        '100 fraud scans/month',
        'Unlimited performance predictions',
        'Basic attribution models',
        '10 automated A/B tests/month',
        '5 brand kits',
        '3 team seats',
        'Email & chat support',
        'White glove migration',
        'Advanced export formats',
        'API access (limited)'
      ],
      limitations: [],
      cta: 'Start Pro Trial',
      stripeAction: 'pro',
      popular: true,
      badge: 'Most Popular'
    },
    {
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? '$500' : '$5,000',
      originalPrice: billingCycle === 'yearly' ? '$6,000' : null,
      period: billingCycle === 'monthly' ? 'per month' : 'per year',
      description: 'For large teams requiring advanced features',
      icon: Building,
      iconColor: 'text-warning-600',
      bgColor: 'bg-warning-100',
      features: [
        'Everything in Pro',
        'Unlimited fraud detection',
        'Advanced attribution models',
        'Unlimited automated A/B testing',
        'Unlimited brand kits',
        'Unlimited team seats',
        'Dedicated account manager',
        'Custom onboarding & training',
        'Full API access',
        'Priority support (2hr response)',
        'Custom integrations',
        'White-label options'
      ],
      limitations: [],
      cta: 'Start Enterprise Trial',
      stripeAction: 'enterprise',
      popular: false,
      badge: 'Best Value'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Enterprise Features at{' '}
              <span className="gradient-text">Startup Prices</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Transparent, predictable pricing with no hidden fees or surprise charges. 
              <span className="font-semibold text-success-600">90-day performance guarantee</span> included.
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center bg-white rounded-xl p-1 shadow-lg border border-gray-200 mb-12"
          >
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 relative ${
                billingCycle === 'yearly'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-success-500 text-white text-xs px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative rounded-3xl border-2 p-8 transition-all duration-300 hover:shadow-2xl ${
                  plan.popular
                    ? 'border-primary-500 shadow-3xl scale-105 bg-gradient-to-br from-white to-primary-50 neon-glow animate-glow'
                    : 'border-gray-200 shadow-lg bg-white hover:border-primary-300 hover:shadow-3xl hover:scale-105'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className={`px-6 py-2 rounded-full text-sm font-bold shadow-2xl animate-bounce-gentle ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white neon-glow'
                        : 'bg-gradient-to-r from-warning-500 to-warning-600 text-white warning-glow'
                    }`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`inline-flex p-4 rounded-2xl mb-6 ${plan.bgColor} group-hover:scale-125 transition-transform duration-500 animate-scale-pulse`}>
                    <Icon className={`w-10 h-10 ${plan.iconColor}`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">{plan.name}</h3>
                  
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center space-x-2">
                      <span className="text-5xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">{plan.price}</span>
                      {plan.originalPrice && (
                        <span className="text-xl text-gray-500 line-through">{plan.originalPrice}</span>
                      )}
                    </div>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: featureIndex * 0.05 }}
                      className="flex items-start space-x-3"
                    >
                      <Check className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </motion.div>
                  ))}
                  
                  {plan.limitations.length > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500 mb-2">Not included:</p>
                      {plan.limitations.map((limitation, limitIndex) => (
                        <div key={limitIndex} className="flex items-start space-x-3 mb-2">
                          <X className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-500">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {plan.stripeAction ? (
                  <CheckoutButton
                    priceId={STRIPE_PRICE_IDS[plan.stripeAction as keyof typeof STRIPE_PRICE_IDS]}
                    planName={plan.name}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                      plan.popular
                        ? 'btn-primary shadow-lg hover:shadow-xl'
                        : 'bg-gray-900 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {plan.cta}
                  </CheckoutButton>
                ) : (
                  <button className="w-full py-4 px-6 rounded-xl font-bold text-lg bg-gray-100 hover:bg-gray-200 text-gray-900 transition-all duration-300">
                    {plan.cta}
                  </button>
                )}

                {plan.name === 'Pro' && (
                  <div className="mt-6 text-center">
                    <div className="bg-success-50 border border-success-200 rounded-lg p-3 mb-3">
                      <p className="text-success-800 font-medium text-sm flex items-center justify-center">
                        <Shield className="w-4 h-4 mr-2" />
                        90-day performance guarantee
                      </p>
                    </div>
                    <a 
                      href="/migration" 
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center justify-center group"
                    >
                      Need help switching? Get free migration
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Migration CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            
            <div className="relative">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Switching from a Competitor?
              </h3>
              <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
                Get our <span className="font-bold">White Glove Migration Service</span> absolutely free. 
                We'll handle the entire transition process and ensure you\'re set up for success from day one.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Shield className="w-8 h-8 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Asset Migration</h4>
                  <p className="text-sm opacity-90">Transfer all your creatives & data</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Star className="w-8 h-8 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Team Training</h4>
                  <p className="text-sm opacity-90">Get your team up to speed fast</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Crown className="w-8 h-8 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Performance Guarantee</h4>
                  <p className="text-sm opacity-90">90-day improvement promise</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl group">
                  <a href="/migration" className="flex items-center space-x-2">
                    <span>Start Free Migration</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-primary-600 transition-all duration-300">
                  <a href="/compare/adcreative-ai-alternative" className="block">Compare with AdCreative.ai</a>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20"
        >
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-600 text-sm">Yes, cancel anytime with no penalties. Your subscription remains active until the end of your billing period.</p>
            </div>
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-2">What's included in migration?</h4>
              <p className="text-gray-600 text-sm">Complete asset transfer, team training, workflow setup, and 90-day performance guarantee - all free.</p>
            </div>
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-2">How does fraud detection work?</h4>
              <p className="text-gray-600 text-sm">Real-time analysis of traffic patterns, click behavior, and conversion quality to identify and block fraudulent activity.</p>
            </div>
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h4>
              <p className="text-gray-600 text-sm">Yes, 90-day performance guarantee. If you don't see measurable improvement, we'll refund your subscription.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};