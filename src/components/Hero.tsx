import React from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Target, Zap, ArrowRight, Play, CreditCard } from 'lucide-react';

export const Hero: React.FC = () => {
  const stats = [
    { label: 'Fraud Savings', value: '$84B+', description: 'Protected annually' },
    { label: 'Performance Boost', value: '45%', description: 'Average ROAS increase' },
    { label: 'Time Saved', value: '90%', description: 'Faster than competitors' },
  ];

  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50 pt-20 pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-success-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-warning-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-flex items-center bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
              Built for Performance, Not Just Pretty Pictures
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight text-shadow">
              The Full-Stack
              <span className="gradient-text block animate-gradient-x text-glow">
                Marketing Brain
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              Generate high-converting ad creatives with integrated{' '}
              <span className="font-semibold text-success-600">fraud detection</span>,{' '}
              <span className="font-semibold text-primary-600">performance prediction</span>, and{' '}
              <span className="font-semibold text-warning-600">attribution analysis</span>.{' '}
              Stop wasting budget on templated designs.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          >
            <button className="btn-primary text-lg px-10 py-5 group animate-glow">
              <a href="/migration" className="flex items-center space-x-2">
                <span>Start Free Migration</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </button>
            <button className="btn-secondary text-lg px-10 py-5 group shimmer">
              <a href="/autopsy/templated-campaign-fatigue" className="flex items-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Watch AI Autopsy</span>
              </a>
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16"
          >
            {stats.map((stat, index) => (
              <div key={index} className="glass-card p-6 text-center group hover:scale-110 transition-all duration-500 animate-bounce-gentle" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="text-3xl font-bold gradient-text mb-2 animate-scale-pulse">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </div>
            ))}
          </motion.div>

          {/* Core Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            <div className="flex flex-col items-center text-center group">
              <div className="bg-gradient-to-br from-success-100 to-success-200 p-6 rounded-2xl mb-6 group-hover:scale-125 group-hover:shadow-glow transition-all duration-500 success-glow animate-bounce-gentle">
                <Shield className="w-10 h-10 text-success-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fraud Annihilation</h3>
              <p className="text-gray-600 leading-relaxed">
                Built-in fraud detection saves up to <span className="font-semibold text-success-600">$84B</span> in wasted ad spend annually. 
                Protect your budget before fraudulent traffic drains your ROI.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-6 rounded-2xl mb-6 group-hover:scale-125 group-hover:shadow-glow transition-all duration-500 neon-glow animate-bounce-gentle" style={{ animationDelay: '0.3s' }}>
                <TrendingUp className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Performance Prediction</h3>
              <p className="text-gray-600 leading-relaxed">
                AI-powered performance scores predict campaign success before you spend a dollar. 
                <span className="font-semibold text-primary-600">94% accuracy</span> eliminates guesswork.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="bg-gradient-to-br from-warning-100 to-warning-200 p-6 rounded-2xl mb-6 group-hover:scale-125 group-hover:shadow-glow transition-all duration-500 warning-glow animate-bounce-gentle" style={{ animationDelay: '0.6s' }}>
                <Target className="w-10 h-10 text-warning-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Attribution Intelligence</h3>
              <p className="text-gray-600 leading-relaxed">
                Multi-touch attribution across all platforms and touchpoints. 
                See exactly which creatives drive <span className="font-semibold text-warning-600">revenue</span>, not just clicks.
              </p>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-500"
          >
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-success-600" />
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span>99.9% Uptime SLA</span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-primary-600" />
              <span>PCI DSS Certified</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};