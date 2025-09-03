import React from 'react';
import { Check, X, AlertTriangle } from 'lucide-react';

export const CompetitorComparison: React.FC = () => {
  const features = [
    {
      feature: 'Core Creative Generation',
      adgenAi: 'Unlimited',
      adcreativeAi: '10 Credits/mo',
      creatopy: 'Unlimited',
      smartly: 'Unlimited',
    },
    {
      feature: 'Fraud Detection',
      adgenAi: '✓ Built-in',
      adcreativeAi: '✗ None',
      creatopy: '✗ None',
      smartly: '✗ Separate Tool',
    },
    {
      feature: 'Performance Prediction',
      adgenAi: '✓ AI-Powered',
      adcreativeAi: '✓ Basic',
      creatopy: '✗ None',
      smartly: '✓ Advanced',
    },
    {
      feature: 'Attribution Analysis',
      adgenAi: '✓ Multi-Touch',
      adcreativeAi: '✗ None',
      creatopy: '✗ None',
      smartly: '✓ Advanced',
    },
    {
      feature: 'Brand Voice Consistency',
      adgenAi: '✓ AI-Trained',
      adcreativeAi: '⚠ Limited',
      creatopy: '✓ Good',
      smartly: '✓ Advanced',
    },
    {
      feature: 'Pricing (Starting)',
      adgenAi: 'Free / $15/mo',
      adcreativeAi: '$29/mo',
      creatopy: '$36/mo',
      smartly: '$2,500+/mo',
    },
    {
      feature: 'Customer Support',
      adgenAi: 'White Glove',
      adcreativeAi: '⚠ Poor Reviews',
      creatopy: 'Standard',
      smartly: 'Dedicated Manager',
    },
  ];

  const getIcon = (value: string) => {
    if (value.includes('✓')) return <Check className="w-5 h-5 text-success-600" />;
    if (value.includes('✗')) return <X className="w-5 h-5 text-error-500" />;
    if (value.includes('⚠')) return <AlertTriangle className="w-5 h-5 text-warning-500" />;
    return null;
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why AdGen AI Dominates the Competition
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive comparison showing how we deliver enterprise features 
            at startup prices while competitors struggle with basic reliability.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-primary-600 animate-gradient-x">AdGen AI</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">AdCreative.ai</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Creatopy</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Smartly.io</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {features.map((row, index) => (
                  <tr key={index} className="hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-transparent transition-all duration-300 hover:scale-105">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {getIcon(row.adgenAi)}
                        <span className="text-sm font-medium text-primary-600 animate-pulse-slow">
                          {row.adgenAi.replace(/[✓✗⚠]/g, '').trim()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {getIcon(row.adcreativeAi)}
                        <span className="text-sm text-gray-600">
                          {row.adcreativeAi.replace(/[✓✗⚠]/g, '').trim()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {getIcon(row.creatopy)}
                        <span className="text-sm text-gray-600">
                          {row.creatopy.replace(/[✓✗⚠]/g, '').trim()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {getIcon(row.smartly)}
                        <span className="text-sm text-gray-600">
                          {row.smartly.replace(/[✓✗⚠]/g, '').trim()}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-primary-600 text-white p-6 rounded-xl max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-2">Ready to Switch?</h3>
            <p className="mb-4">
              Join thousands of marketers who've left overpriced, unreliable competitors
            </p>
            <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Your Free Migration
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};