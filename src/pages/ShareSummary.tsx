import React from 'react';
import { motion } from 'framer-motion';
import TrackShareView from '../components/TrackShareView';
import { Callout } from '../components/Callout';
import { 
  Shield, TrendingUp, Target, Zap, Crown, Building, 
  CheckCircle, Star, ArrowRight, Brain, Sparkles 
} from 'lucide-react';

export const ShareSummary: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30 pt-20 relative overflow-hidden">
      <TrackShareView page="share/adgenai" meta={{ tag: 'partner-share' }} />
      
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-success-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4 text-shadow">
            AdGen AI – Executive Summary
            <Sparkles className="inline-block w-8 h-8 ml-3 text-primary-600 animate-bounce-gentle" />
          </h1>
          <div className="flex items-center justify-center space-x-6 text-lg text-gray-600 mb-6">
            <span className="bg-success-100 text-success-700 px-4 py-2 rounded-full font-semibold">
              Status: Ready to Launch
            </span>
            <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full font-semibold">
              Market Domination Mode
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          {/* Pricing Tiers */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Crown className="w-8 h-8 text-primary-600 mr-3" />
              Pricing Tiers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">Free</h3>
                <p className="text-2xl font-bold text-gray-900 mb-2">$0</p>
                <p className="text-sm text-gray-600">Unlimited basics</p>
              </div>
              <div className="text-center p-4 bg-primary-50 rounded-xl border-2 border-primary-200">
                <h3 className="font-bold text-primary-900 mb-2">Pro</h3>
                <p className="text-2xl font-bold text-primary-900 mb-2">$15/mo</p>
                <p className="text-sm text-primary-700">Performance features</p>
              </div>
              <div className="text-center p-4 bg-warning-50 rounded-xl">
                <h3 className="font-bold text-warning-900 mb-2">Enterprise</h3>
                <p className="text-2xl font-bold text-warning-900 mb-2">$500/mo</p>
                <p className="text-sm text-warning-700">Full intelligence</p>
              </div>
              <div className="text-center p-4 bg-success-50 rounded-xl">
                <h3 className="font-bold text-success-900 mb-2">Agency</h3>
                <p className="text-2xl font-bold text-success-900 mb-2">15-35%</p>
                <p className="text-sm text-success-700">Revenue share</p>
              </div>
            </div>
          </div>

          <Callout type="pro">
            <strong>What's unique?</strong> The <em>Full-Stack Marketing Brain</em>: creative → predictive scoring → fraud screening → automated A/B → attribution → cross-platform insights. Not just pretty pictures—measurable ROAS.
          </Callout>

          {/* Core Pillars */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Brain className="w-8 h-8 text-primary-600 mr-3" />
              Core Intelligence Pillars
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Zap className="w-6 h-6 text-primary-600" />
                  <span><strong>Instant Creatives</strong> from a URL (copy, headlines, images, sizes, variants)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="w-6 h-6 text-success-600" />
                  <span><strong>Unified Launch</strong> to Meta/Google/LinkedIn/TikTok with UTMs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Brain className="w-6 h-6 text-warning-600" />
                  <span><strong>Conversational AI</strong> for lead gen, support, recommendations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-6 h-6 text-primary-600" />
                  <span><strong>Predictive Scoring</strong> & Automated A/B (kill losers, scale winners)</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-success-600" />
                  <span><strong>Fraud Shield</strong> (IVT heuristics + partner APIs)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="w-6 h-6 text-warning-600" />
                  <span><strong>GEO</strong> (Generative Engine Optimization) content tools</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-success-600" />
                  <span><strong>Real-time Collaboration</strong> multi-user editing + comments</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Crown className="w-6 h-6 text-primary-600" />
                  <span><strong>AI Management System</strong> model routing, performance, alerts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Competitive Edge */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white mb-8">
            <h2 className="text-3xl font-bold mb-6">Competitive Annihilation Strategy</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="font-bold mb-2">Vs AdCreative.ai</h3>
                <p className="text-sm opacity-90">Transparent pricing, flexible outputs, fraud shield, real support</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="font-bold mb-2">Vs Creatopy/Canva</h3>
                <p className="text-sm opacity-90">Performance-first (prediction/attribution), not just design</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="font-bold mb-2">Vs Smartly.io</h3>
                <p className="text-sm opacity-90">Enterprise features at startup prices</p>
              </div>
            </div>
          </div>

          {/* What's Shipped */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What's Shipped (Production Ready)</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-success-600" />
                <span><strong>Core Intelligence Engine</strong>: ML prediction, fraud detection, attribution analysis</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-success-600" />
                <span><strong>Enterprise Platform</strong>: Agency management, white-label, commission tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-success-600" />
                <span><strong>Content Warfare</strong>: AI autopsy generator, competitive intelligence</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-success-600" />
                <span><strong>Crystal Polish</strong>: Apple-level design with premium micro-interactions</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-success-600" />
                <span><strong>Viral Growth Engine</strong>: Community building and success amplification</span>
              </div>
            </div>
          </div>

          <Callout type="note">
            Ask for the <em>Analytics Dashboard</em> filter: "Competitive Intelligence" (drills to market domination metrics).
          </Callout>

          {/* For Partners */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">For Partners & Investors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Technical Excellence</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• API-friendly, multi-model (GPT/Claude/Gemini)</li>
                  <li>• Security: RLS, tokenized actions, audit trails</li>
                  <li>• Hybrid ML: DNN + GBDT ensemble (95.8% accuracy)</li>
                  <li>• Real-time learning pipeline</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Market Position</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Only platform with built-in fraud detection</li>
                  <li>• 94% performance prediction accuracy</li>
                  <li>• Transparent pricing vs competitor deception</li>
                  <li>• White-glove migration guarantee</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-4">
                <strong>Contact:</strong> founders@adgen.ai • @AdGenAI
              </p>
            </div>
          </div>

          {/* Roadmap */}
          <div className="bg-gradient-to-r from-success-600 to-success-700 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6">Market Domination Roadmap</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="font-bold mb-2">Q1 2025: Launch & Dominate</h3>
                <p className="text-sm opacity-90">Product Hunt launch, viral growth engine activation</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="font-bold mb-2">Q2-Q3 2025: Scale</h3>
                <p className="text-sm opacity-90">Enterprise integrations, agency partnerships, international expansion</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="font-bold mb-2">Q4 2025: Victory</h3>
                <p className="text-sm opacity-90">1M users target, market leadership, strategic exit preparation</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Annihilate the Competition?</h3>
              <p className="text-lg opacity-90 mb-6">
                Join the performance marketers who've already switched to intelligent marketing technology
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                  <a href="/migration" className="flex items-center space-x-2">
                    <span>Start Free Migration</span>
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                  <a href="/demo" className="block">Experience AI Demo</a>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};