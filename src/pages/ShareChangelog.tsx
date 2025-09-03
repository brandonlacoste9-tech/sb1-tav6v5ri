import React from 'react';
import { motion } from 'framer-motion';
import TrackShareView from '../components/TrackShareView';
import { Callout } from '../components/Callout';
import { Calendar, CheckCircle, Zap, Shield, Brain, Target } from 'lucide-react';

export const ShareChangelog: React.FC = () => {
  const releases = [
    {
      version: '2.1.0',
      date: '2025-01-15',
      title: 'Crystal Ball Perfection Release',
      type: 'major',
      features: [
        'Advanced ML Architecture with DNN + GBDT ensemble',
        'Hybrid Fraud Detection with multiple provider integration',
        'Brand Voice Engine with 94.7% consistency',
        'Real-time learning pipeline with hourly retraining',
        'Crystal-level UI polish with Apple-grade animations'
      ]
    },
    {
      version: '2.0.0',
      date: '2025-01-10',
      title: 'Full-Stack Marketing Brain',
      type: 'major',
      features: [
        'Complete performance prediction engine',
        'Multi-touch attribution analysis',
        'Agency management and white-label system',
        'Automated content generation (AI Ad Autopsy)',
        'Competitive intelligence dashboard'
      ]
    },
    {
      version: '1.5.0',
      date: '2025-01-05',
      title: 'Enterprise Foundation',
      type: 'minor',
      features: [
        'Subscription management with Stripe integration',
        'Advanced analytics and tracking',
        'Migration intake system',
        'Performance guarantees and SLAs'
      ]
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'major': return 'bg-primary-100 text-primary-700 border-primary-300';
      case 'minor': return 'bg-success-100 text-success-700 border-success-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30 pt-20">
      <TrackShareView page="share/changelog" meta={{ tag: 'changelog-share' }} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AdGen AI Changelog
          </h1>
          <p className="text-xl text-gray-600">
            Track our journey to market domination with each release
          </p>
        </motion.div>

        <div className="space-y-8">
          {releases.map((release, index) => (
            <motion.div
              key={release.version}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getTypeColor(release.type)}`}>
                    v{release.version}
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{release.title}</h2>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(release.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {release.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <Callout type="pro">
          <strong>Next Release Preview:</strong> Advanced competitive intelligence with real-time competitor monitoring, automated A/B testing, and enhanced viral growth mechanics.
        </Callout>
      </div>
    </div>
  );
};