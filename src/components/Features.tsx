import React from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Target, Zap, Users, BarChart3, Brain, Crosshair, ArrowRight } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Ad Fraud Annihilation',
      description: 'Built-in fraud detection saves up to $84B in wasted ad spend. Protect your budget before fraudulent traffic drains your ROI with real-time bot detection and traffic quality analysis.',
      stats: 'Saves avg. $2,847/month',
      color: 'success',
      gradient: 'from-success-500 to-success-600'
    },
    {
      icon: Brain,
      title: 'Predictive Performance Engine',
      description: 'AI-powered performance scores predict campaign success before you spend a dollar. Eliminate guesswork from your creative strategy with 94% accuracy machine learning models.',
      stats: '94% prediction accuracy',
      color: 'primary',
      gradient: 'from-primary-500 to-primary-600'
    },
    {
      icon: Crosshair,
      title: 'Multi-Touch Attribution',
      description: 'Track the complete customer journey across all touchpoints. See exactly which creatives drive revenue, not just clicks, with advanced attribution modeling.',
      stats: '5 attribution models',
      color: 'warning',
      gradient: 'from-warning-500 to-warning-600'
    },
    {
      icon: Zap,
      title: 'Brand Voice Consistency',
      description: 'AI learns your brand identity from your website and guidelines. Every creative maintains perfect brand alignment automatically with intelligent style transfer.',
      stats: '99% brand consistency',
      color: 'primary',
      gradient: 'from-primary-500 to-primary-600'
    },
    {
      icon: Users,
      title: 'Automated A/B Testing',
      description: 'Generate variations, launch tests, and get statistical significance alerts automatically. Optimize performance without manual effort using smart test design.',
      stats: '3x faster optimization',
      color: 'success',
      gradient: 'from-success-500 to-success-600'
    },
    {
      icon: BarChart3,
      title: 'Cross-Platform Intelligence',
      description: 'Unified insights across Facebook, Google, TikTok, and more. Break free from platform silos and see the complete picture with integrated analytics.',
      stats: '12+ platforms supported',
      color: 'warning',
      gradient: 'from-warning-500 to-warning-600'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'success':
        return 'bg-success-100 text-success-600 border-success-200';
      case 'warning':
        return 'bg-warning-100 text-warning-600 border-warning-200';
      default:
        return 'bg-primary-100 text-primary-600 border-primary-200';
    }
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Full-Stack{' '}
              <span className="gradient-text">Marketing Brain</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Beyond creative generation. We manage the entire performance lifecycle 
              of your ad assets from prediction to attribution, giving you the competitive 
              edge that templated tools simply cannot match.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card group hover:shadow-2xl hover:scale-105 transition-all duration-500 relative overflow-hidden"
              >
                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Animated border */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-20 blur-sm animate-pulse-slow`}></div>
                </div>
                
                <div className="relative z-10">
                  <div className={`inline-flex p-4 rounded-2xl mb-6 border-2 ${getColorClasses(feature.color)} group-hover:scale-125 group-hover:shadow-2xl transition-all duration-500 animate-bounce-gentle`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-500 text-shadow">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full group-hover:bg-primary-100 group-hover:scale-110 transition-all duration-300 animate-pulse-slow">
                        {feature.stats}
                      </span>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-2 group-hover:scale-125 transition-all duration-500" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
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
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
            
            <div className="relative">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Annihilate Your Competition?
              </h3>
              <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
                Join the performance marketers who've already switched from overpriced, 
                unreliable competitors to the future of AI advertising.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <Shield className="w-10 h-10 mx-auto mb-3" />
                  <h4 className="font-bold mb-2">90-Day Guarantee</h4>
                  <p className="text-sm opacity-90">See results or get your money back</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <Target className="w-10 h-10 mx-auto mb-3" />
                  <h4 className="font-bold mb-2">White Glove Migration</h4>
                  <p className="text-sm opacity-90">We handle everything for free</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <TrendingUp className="w-10 h-10 mx-auto mb-3" />
                  <h4 className="font-bold mb-2">Instant Results</h4>
                  <p className="text-sm opacity-90">See improvement in 7 days</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-primary-600 px-10 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl group">
                  <a href="/migration" className="flex items-center space-x-2">
                    <span>Start Free Migration</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </button>
                <button className="border-2 border-white text-white px-10 py-4 rounded-xl font-bold hover:bg-white hover:text-primary-600 transition-all duration-300">
                  <a href="/autopsy/templated-campaign-fatigue" className="block">Watch AI Autopsy</a>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};