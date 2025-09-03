import React from 'react';
import { TrendingUp, Users, DollarSign, Shield, CheckCircle, ArrowRight } from 'lucide-react';

export const AgencyPartnerOnePager: React.FC = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: 'Improve Client Results',
      description: 'Deliver 45% average ROAS improvement with fraud detection and performance prediction',
      metric: '45% avg ROAS boost'
    },
    {
      icon: Users,
      title: 'Scale Your Team',
      description: 'Serve 3x more clients with the same headcount using automated workflows',
      metric: '3x team efficiency'
    },
    {
      icon: DollarSign,
      title: 'Increase Margins',
      description: 'White-label pricing and revenue sharing opportunities',
      metric: '25% commission'
    },
    {
      icon: Shield,
      title: 'Risk-Free Guarantee',
      description: '90-day performance guarantee for all your clients',
      metric: '90-day guarantee'
    }
  ];

  const features = [
    'Unlimited creative generation for all clients',
    'White-label dashboard and reporting',
    'Dedicated account manager',
    'Priority support (2-hour response)',
    'Custom onboarding for your team',
    'Co-marketing opportunities',
    'Revenue sharing program',
    'Client migration assistance'
  ];

  const pricing = [
    {
      tier: 'Agency Starter',
      price: '$99/month',
      description: 'Perfect for boutique agencies',
      limits: 'Up to 5 client accounts',
      features: ['Basic fraud detection', 'Performance prediction', 'Email support']
    },
    {
      tier: 'Agency Pro',
      price: '$299/month',
      description: 'For growing agencies',
      limits: 'Up to 25 client accounts',
      features: ['Full fraud suite', 'Advanced attribution', 'Priority support', 'White-label options'],
      popular: true
    },
    {
      tier: 'Agency Enterprise',
      price: 'Custom',
      description: 'For large agencies',
      limits: 'Unlimited client accounts',
      features: ['Everything in Pro', 'Dedicated success manager', 'Custom integrations', 'Revenue sharing']
    }
  ];

  return (
    <div className="max-w-6xl mx-auto bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Agency Partner Program</h1>
        <p className="text-xl opacity-90 max-w-3xl mx-auto">
          Scale your agency with the Full-Stack Marketing Brain. Deliver enterprise results 
          at startup prices while increasing your margins.
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="p-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Why Top Agencies Choose AdGen AI
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="text-center">
                <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 mb-3">{benefit.description}</p>
                <div className="bg-success-100 text-success-700 px-3 py-1 rounded-full text-sm font-medium">
                  {benefit.metric}
                </div>
              </div>
            );
          })}
        </div>

        {/* Features List */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            What's Included in Your Partnership
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Agency Pricing Tiers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((plan, index) => (
              <div key={index} className={`rounded-2xl border-2 p-8 ${
                plan.popular ? 'border-primary-500 shadow-xl scale-105' : 'border-gray-200'
              }`}>
                {plan.popular && (
                  <div className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium text-center mb-4">
                    Most Popular
                  </div>
                )}
                <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.tier}</h4>
                <div className="text-3xl font-bold text-primary-600 mb-2">{plan.price}</div>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <p className="text-sm text-gray-500 mb-6">{plan.limits}</p>
                <ul className="space-y-2 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-success-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.popular 
                    ? 'bg-primary-600 hover:bg-primary-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}>
                  {plan.price === 'Custom' ? 'Contact Sales' : 'Start Partnership'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Case Study Preview */}
        <div className="bg-primary-600 text-white rounded-2xl p-8 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Success Story</h3>
            <blockquote className="text-xl mb-6">
              "AdGen AI helped us scale from 12 to 40 clients without hiring additional creatives. 
              Our client retention improved 67% because we're delivering measurably better results."
            </blockquote>
            <div className="flex items-center justify-center space-x-8">
              <div>
                <p className="font-semibold">Marcus Rodriguez</p>
                <p className="opacity-90">GrowthLab Agency</p>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <p className="font-bold">67% retention boost</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Scale Your Agency?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join 50+ agencies already using AdGen AI to deliver better results, 
            serve more clients, and increase their margins.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
              <span>Apply for Partnership</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-primary-600 text-primary-600 hover:bg-primary-50 px-8 py-4 rounded-lg font-semibold transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};