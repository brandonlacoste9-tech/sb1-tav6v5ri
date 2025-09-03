import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Download, Twitter, Linkedin, Facebook, Check, TrendingUp, DollarSign, Shield, Target } from 'lucide-react';

interface ViralShareData {
  type: 'fraud-savings' | 'performance-improvement' | 'roas-boost' | 'competitor-comparison';
  title: string;
  metrics: {
    primary: string;
    secondary: string;
    improvement: string;
  };
  description: string;
  hashtags: string[];
}

export const ViralGrowthEngine: React.FC = () => {
  const [selectedShare, setSelectedShare] = useState<ViralShareData | null>(null);
  const [copied, setCopied] = useState(false);

  const viralMoments: ViralShareData[] = [
    {
      type: 'fraud-savings',
      title: 'AdGen AI Saved Me $3,200 in Bot Traffic This Month',
      metrics: {
        primary: '$3,200',
        secondary: '34% of traffic',
        improvement: 'was fraudulent'
      },
      description: 'I had no idea how much money I was losing to bot clicks until AdGen AI\'s fraud detection showed me the truth. This is money that would have been completely wasted.',
      hashtags: ['#AdFraud', '#MarketingROI', '#PerformanceMarketing', '#AdGenAI']
    },
    {
      type: 'performance-improvement',
      title: 'AI Predicted My Campaign Would Fail - It Was 100% Right',
      metrics: {
        primary: '94%',
        secondary: 'accuracy',
        improvement: 'prediction'
      },
      description: 'AdGen AI\'s performance prediction gave my campaign a 23/100 score and recommended not to launch. I ignored it and lost $5K. Never again.',
      hashtags: ['#AIMarketing', '#PerformancePrediction', '#MarketingAI', '#AdGenAI']
    },
    {
      type: 'roas-boost',
      title: 'Switched from AdCreative.ai to AdGen AI - 340% ROAS Increase',
      metrics: {
        primary: '340%',
        secondary: 'ROAS',
        improvement: 'increase'
      },
      description: 'After getting burned by AdCreative.ai\'s surprise billing and templated designs, AdGen AI delivered real results with transparent pricing.',
      hashtags: ['#AdCreativeAI', '#MarketingROI', '#PerformanceMarketing', '#AdGenAI']
    },
    {
      type: 'competitor-comparison',
      title: 'Why I Left Smartly.io for AdGen AI (80% Cost Reduction)',
      metrics: {
        primary: '80%',
        secondary: 'cost',
        improvement: 'reduction'
      },
      description: 'Same enterprise features, 80% less cost, 90x faster setup. Smartly.io was overkill and overpriced for what we actually needed.',
      hashtags: ['#Smartly', '#MarketingTech', '#CostOptimization', '#AdGenAI']
    }
  ];

  const generateShareContent = (data: ViralShareData) => {
    return `${data.title}

${data.description}

Key Results:
• ${data.metrics.primary} ${data.metrics.improvement}
• ${data.metrics.secondary} impact
• Immediate ROI improvement

${data.hashtags.join(' ')}

Try it free: adgen.ai/migration`;
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareToSocial = (platform: string, content: string) => {
    const encodedContent = encodeURIComponent(content);
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedContent}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://adgen.ai')}&summary=${encodedContent}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://adgen.ai')}&quote=${encodedContent}`
    };
    
    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'fraud-savings': return <Shield className="w-8 h-8 text-success-600" />;
      case 'performance-improvement': return <TrendingUp className="w-8 h-8 text-primary-600" />;
      case 'roas-boost': return <DollarSign className="w-8 h-8 text-warning-600" />;
      case 'competitor-comparison': return <Target className="w-8 h-8 text-error-600" />;
      default: return <Share2 className="w-8 h-8 text-gray-600" />;
    }
  };

  const getGradient = (type: string) => {
    switch (type) {
      case 'fraud-savings': return 'from-success-500 to-success-600';
      case 'performance-improvement': return 'from-primary-500 to-primary-600';
      case 'roas-boost': return 'from-warning-500 to-warning-600';
      case 'competitor-comparison': return 'from-error-500 to-error-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Viral Growth Engine
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Share your AdGen AI success stories and help other marketers discover 
          the power of intelligent marketing technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {viralMoments.map((moment, index) => (
          <motion.div
            key={moment.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="card hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group"
            onClick={() => setSelectedShare(moment)}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="bg-gray-100 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                {getIcon(moment.type)}
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{moment.metrics.primary}</p>
                <p className="text-sm text-gray-600">{moment.metrics.secondary} {moment.metrics.improvement}</p>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
              {moment.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {moment.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {moment.hashtags.slice(0, 2).map(tag => (
                  <span key={tag} className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              <button className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Viral Sharing Modal */}
      {selectedShare && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedShare(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-8">
              <div className={`inline-flex p-4 rounded-2xl mb-4 bg-gradient-to-r ${getGradient(selectedShare.type)}`}>
                {getIcon(selectedShare.type)}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Share Your Success</h2>
              <p className="text-gray-600">Help other marketers discover the power of intelligent marketing</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Preview:</h3>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                  {generateShareContent(selectedShare)}
                </pre>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => copyToClipboard(generateShareContent(selectedShare))}
                className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-3 rounded-xl font-medium transition-colors"
              >
                {copied ? <Check className="w-5 h-5 text-success-600" /> : <Copy className="w-5 h-5" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
              
              <button className="flex items-center justify-center space-x-2 bg-primary-100 hover:bg-primary-200 text-primary-700 px-4 py-3 rounded-xl font-medium transition-colors">
                <Download className="w-5 h-5" />
                <span>Download Image</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => shareToSocial('twitter', generateShareContent(selectedShare))}
                className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-medium transition-colors"
              >
                <Twitter className="w-5 h-5" />
                <span>Twitter</span>
              </button>
              
              <button
                onClick={() => shareToSocial('linkedin', generateShareContent(selectedShare))}
                className="flex items-center justify-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-3 rounded-xl font-medium transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </button>
              
              <button
                onClick={() => shareToSocial('facebook', generateShareContent(selectedShare))}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-colors"
              >
                <Facebook className="w-5 h-5" />
                <span>Facebook</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Viral Growth Stats */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Join the Viral Growth Movement</h2>
        <p className="text-lg opacity-90 mb-6">
          Help us reach 100,000 marketers and destroy the competition together
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-2xl font-bold">12,847</p>
            <p className="text-sm opacity-90">Success Stories Shared</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-2xl font-bold">$2.4M</p>
            <p className="text-sm opacity-90">Fraud Savings Reported</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-2xl font-bold">340%</p>
            <p className="text-sm opacity-90">Avg ROAS Improvement</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-2xl font-bold">94%</p>
            <p className="text-sm opacity-90">Prediction Accuracy</p>
          </div>
        </div>
      </div>
    </div>
  );
};