import React from 'react';
import { motion } from 'framer-motion';
import TrackShareView from '../components/TrackShareView';
import { Callout } from '../components/Callout';
import { Download, Image, FileText, Users, TrendingUp, Shield, Crown } from 'lucide-react';

export const SharePressKit: React.FC = () => {
  const assets = [
    {
      type: 'Logo Package',
      description: 'High-resolution logos in PNG, SVG, and vector formats',
      files: ['logo-primary.svg', 'logo-white.svg', 'logo-mark.png'],
      icon: Image
    },
    {
      type: 'Brand Guidelines',
      description: 'Complete brand identity guide with colors, typography, and usage',
      files: ['brand-guidelines.pdf', 'color-palette.pdf'],
      icon: FileText
    },
    {
      type: 'Product Screenshots',
      description: 'High-quality product interface screenshots and demos',
      files: ['dashboard-hero.png', 'analytics-view.png', 'ml-dashboard.png'],
      icon: Image
    },
    {
      type: 'Executive Bios',
      description: 'Founder and leadership team biographies and headshots',
      files: ['founder-bio.pdf', 'team-headshots.zip'],
      icon: Users
    }
  ];

  const keyMetrics = [
    { label: 'Platform Accuracy', value: '95.8%', description: 'ML prediction accuracy' },
    { label: 'Fraud Savings', value: '$2.4M+', description: 'Protected for customers' },
    { label: 'Customer Growth', value: '340%', description: 'Month-over-month' },
    { label: 'Enterprise Adoption', value: '50+', description: 'Fortune 1000 companies' }
  ];

  const factSheet = {
    founded: '2024',
    headquarters: 'San Francisco, CA',
    employees: '25+',
    funding: 'Series A',
    customers: '10,000+',
    markets: 'Global'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30 pt-20">
      <TrackShareView page="share/press-kit" meta={{ tag: 'press-kit-share' }} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AdGen AI Press Kit
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Media resources, company information, and key metrics for press coverage
          </p>
        </motion.div>

        {/* Company Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Company Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">About AdGen AI</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                AdGen AI is the world's first Full-Stack Marketing Brain, combining AI-powered creative generation 
                with integrated fraud detection, performance prediction, and attribution analysis. Unlike competitors 
                that focus solely on design, AdGen AI optimizes for measurable business results.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Founded in 2024, the company has quickly become the preferred alternative to expensive, 
                unreliable competitors like AdCreative.ai and Smartly.io, offering enterprise features 
                at startup prices with transparent billing.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Company Facts</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(factSheet).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="font-bold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white mb-8"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Key Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {keyMetrics.map((metric, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <p className="text-3xl font-bold mb-2">{metric.value}</p>
                <p className="font-semibold mb-1">{metric.label}</p>
                <p className="text-sm opacity-90">{metric.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Media Assets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Media Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assets.map((asset, index) => {
              const Icon = asset.icon;
              return (
                <div key={index} className="card hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-primary-100 p-3 rounded-xl">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{asset.type}</h3>
                      <p className="text-sm text-gray-600">{asset.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    {asset.files.map(file => (
                      <div key={file} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">{file}</span>
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                  <button className="btn-secondary w-full flex items-center justify-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Download Package</span>
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Key Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Messages for Media</h2>
          
          <Callout type="pro">
            <strong>Primary Narrative:</strong> AdGen AI is revolutionizing performance marketing by being the first platform to integrate creative generation with fraud detection, performance prediction, and attribution analysis - delivering enterprise intelligence at startup prices.
          </Callout>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-success-50 border border-success-200 rounded-xl p-6">
              <Shield className="w-8 h-8 text-success-600 mb-3" />
              <h3 className="font-bold text-success-900 mb-2">Fraud Protection Leader</h3>
              <p className="text-success-800 text-sm">
                Only AI creative platform with built-in fraud detection, saving customers average $2,847/month
              </p>
            </div>
            
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
              <Brain className="w-8 h-8 text-primary-600 mb-3" />
              <h3 className="font-bold text-primary-900 mb-2">AI Prediction Accuracy</h3>
              <p className="text-primary-800 text-sm">
                95.8% accuracy in performance prediction using hybrid DNN + GBDT architecture
              </p>
            </div>
            
            <div className="bg-warning-50 border border-warning-200 rounded-xl p-6">
              <Target className="w-8 h-8 text-warning-600 mb-3" />
              <h3 className="font-bold text-warning-900 mb-2">Market Disruption</h3>
              <p className="text-warning-800 text-sm">
                Transparent pricing vs competitor deception - no hidden fees or surprise charges
              </p>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-4">Media Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-700"><strong>Press Inquiries:</strong> press@adgen.ai</p>
                <p className="text-gray-700"><strong>Partnership Inquiries:</strong> partners@adgen.ai</p>
              </div>
              <div>
                <p className="text-gray-700"><strong>Investor Relations:</strong> investors@adgen.ai</p>
                <p className="text-gray-700"><strong>General:</strong> hello@adgen.ai</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};