import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubscriptionStatus } from './SubscriptionStatus';
import { useSubscription } from '../hooks/useSubscription';
import { 
  Plus, Shield, TrendingUp, Target, AlertTriangle, CheckCircle, 
  X, Eye, Edit, Play, Pause, BarChart3, Users, Calendar,
  Download, Share2, Filter, Search, SortDesc
} from 'lucide-react';
import type { AdCreative, FraudAnalysis, PerformancePrediction } from '../types';

export const Dashboard: React.FC = () => {
  const [selectedAd, setSelectedAd] = useState<AdCreative | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'performance' | 'created' | 'fraud'>('performance');
  const { isPro, isEnterprise, isPaid, subscription } = useSubscription();

  const mockAds: AdCreative[] = [
    {
      id: '1',
      title: 'Summer Sale Campaign',
      description: 'High-converting summer promotion for e-commerce with urgency messaging',
      imageUrl: 'https://images.pexels.com/photos/1029896/pexels-photo-1029896.jpeg?auto=compress&cs=tinysrgb&w=400',
      platform: 'facebook',
      performanceScore: 92,
      fraudScore: 15,
      status: 'active',
      createdAt: new Date('2025-01-10'),
      metrics: {
        impressions: 125000,
        clicks: 3750,
        conversions: 187,
        ctr: 3.0,
        cpa: 12.50,
        roas: 4.2
      }
    },
    {
      id: '2',
      title: 'Product Launch Teaser',
      description: 'Brand awareness campaign for new product line with social proof',
      imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      platform: 'instagram',
      performanceScore: 87,
      fraudScore: 8,
      status: 'active',
      createdAt: new Date('2025-01-08'),
      metrics: {
        impressions: 89000,
        clicks: 2670,
        conversions: 134,
        ctr: 3.0,
        cpa: 15.75,
        roas: 3.8
      }
    },
    {
      id: '3',
      title: 'Retargeting Campaign',
      description: 'Cart abandonment recovery with urgency messaging and social proof',
      imageUrl: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
      platform: 'google',
      performanceScore: 78,
      fraudScore: 45,
      status: 'paused',
      createdAt: new Date('2025-01-05'),
      metrics: {
        impressions: 45000,
        clicks: 900,
        conversions: 27,
        ctr: 2.0,
        cpa: 22.30,
        roas: 2.1
      }
    },
    {
      id: '4',
      title: 'Black Friday Blitz',
      description: 'High-impact promotional campaign with countdown timer',
      imageUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
      platform: 'tiktok',
      performanceScore: 95,
      fraudScore: 12,
      status: 'completed',
      createdAt: new Date('2024-11-25'),
      metrics: {
        impressions: 234000,
        clicks: 8190,
        conversions: 412,
        ctr: 3.5,
        cpa: 9.80,
        roas: 5.7
      }
    }
  ];

  const getFraudAnalysis = (score: number): FraudAnalysis => {
    if (score <= 20) {
      return {
        score,
        riskLevel: 'low',
        factors: ['Clean traffic patterns', 'Verified user behavior', 'Low bot activity', 'High engagement quality'],
        recommendation: 'Campaign is safe to scale. Consider increasing budget allocation.'
      };
    } else if (score <= 40) {
      return {
        score,
        riskLevel: 'medium',
        factors: ['Some suspicious activity', 'Mixed traffic quality', 'Moderate bot detection', 'Variable engagement'],
        recommendation: 'Continue with caution. Implement additional targeting filters and monitor closely.'
      };
    } else {
      return {
        score,
        riskLevel: 'high',
        factors: ['High bot activity detected', 'Suspicious click patterns', 'Low-quality traffic sources', 'Poor engagement metrics'],
        recommendation: 'Pause campaign immediately. Refine targeting and implement stricter fraud filters.'
      };
    }
  };

  const getPerformancePrediction = (score: number): PerformancePrediction => {
    return {
      score,
      expectedCtr: score > 90 ? 3.8 : score > 85 ? 3.2 : score > 70 ? 2.8 : 1.9,
      expectedCpa: score > 90 ? 7.50 : score > 85 ? 10.50 : score > 70 ? 14.75 : 22.90,
      confidence: score > 90 ? 96 : score > 85 ? 91 : score > 70 ? 84 : 72,
      insights: [
        score > 90 ? 'Exceptional visual hierarchy and contrast' : score > 80 ? 'Strong visual hierarchy' : 'Consider improving visual contrast',
        score > 85 ? 'Highly compelling call-to-action' : score > 75 ? 'Good call-to-action placement' : 'CTA could be more prominent',
        score > 80 ? 'Perfect brand alignment and consistency' : score > 70 ? 'Good brand alignment' : 'Ensure stronger brand consistency',
        score > 75 ? 'Optimal text-to-image ratio' : 'Consider adjusting text density'
      ]
    };
  };

  const filteredAds = mockAds
    .filter(ad => filterStatus === 'all' || ad.status === filterStatus)
    .filter(ad => ad.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  ad.description.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'performance': return b.performanceScore - a.performanceScore;
        case 'fraud': return a.fraudScore - b.fraudScore;
        case 'created': return b.createdAt.getTime() - a.createdAt.getTime();
        default: return 0;
      }
    });

  const totalMetrics = mockAds.reduce((acc, ad) => {
    if (ad.metrics) {
      acc.impressions += ad.metrics.impressions;
      acc.clicks += ad.metrics.clicks;
      acc.conversions += ad.metrics.conversions;
      acc.spend += ad.metrics.cpa * ad.metrics.conversions;
    }
    return acc;
  }, { impressions: 0, clicks: 0, conversions: 0, spend: 0 });

  const avgRoas = totalMetrics.spend > 0 ? (totalMetrics.conversions * 50) / totalMetrics.spend : 0;
  const avgPerformanceScore = mockAds.reduce((sum, ad) => sum + ad.performanceScore, 0) / mockAds.length;
  const fraudSavings = mockAds.reduce((sum, ad) => sum + (ad.fraudScore * 50), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Campaign Dashboard</h1>
            <p className="text-gray-600">
              Monitor performance and optimize your ad creatives with AI-powered insights
              {!isPaid && <span className="text-primary-600 font-semibold ml-1">- Upgrade for advanced features</span>}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="btn-secondary flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </button>
            <button className="btn-primary flex items-center space-x-2 group animate-glow">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Generate New Ad</span>
            </button>
          </div>
        </div>

        {/* Subscription Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <SubscriptionStatus />
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="metric-card group">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total ROAS</p>
                <p className="text-3xl font-bold text-gray-900">{avgRoas.toFixed(1)}x</p>
                <p className="text-xs text-success-600 font-medium">↗ +12% vs last month</p>
                {!isPaid && <p className="text-xs text-gray-500 mt-1">Limited tracking</p>}
              </div>
              <div className="bg-success-100 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-success-600" />
              </div>
            </div>
          </div>
          
          <div className="metric-card group">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Performance Score</p>
                <p className="text-3xl font-bold text-gray-900">{avgPerformanceScore.toFixed(0)}</p>
                <p className="text-xs text-primary-600 font-medium">↗ +8 points this week</p>
                {!isPro && !isEnterprise && <p className="text-xs text-gray-500 mt-1">5/month limit</p>}
              </div>
              <div className="bg-primary-100 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-primary-600" />
              </div>
            </div>
          </div>
          
          <div className="metric-card group">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Fraud Savings</p>
                <p className="text-3xl font-bold text-gray-900">${fraudSavings.toLocaleString()}</p>
                <p className="text-xs text-success-600 font-medium">Protected this month</p>
                {!isPaid && <p className="text-xs text-gray-500 mt-1">Pro feature</p>}
              </div>
              <div className="bg-success-100 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-success-600" />
              </div>
            </div>
          </div>
          
          <div className="metric-card group">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Campaigns</p>
                <p className="text-3xl font-bold text-gray-900">{mockAds.filter(ad => ad.status === 'active').length}</p>
                <p className="text-xs text-gray-600">of {mockAds.length} total</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-8 h-8 text-primary-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:flex-none lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="draft">Draft</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="performance">Sort by Performance</option>
                <option value="created">Sort by Date</option>
                <option value="fraud">Sort by Fraud Risk</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Ad Creatives Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8"
        >
          <AnimatePresence>
            {filteredAds.map((ad, index) => {
              const fraudAnalysis = getFraudAnalysis(ad.fraudScore);
              const performancePrediction = getPerformancePrediction(ad.performanceScore);
              
              return (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="card group cursor-pointer hover:shadow-3xl hover:scale-110 transition-all duration-500 relative overflow-hidden shimmer"
                  onClick={() => setSelectedAd(ad)}
                >
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-success-500/5 to-warning-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="relative mb-6">
                      <img
                        src={ad.imageUrl}
                        alt={ad.title}
                        className="w-full h-48 object-cover rounded-xl group-hover:scale-110 transition-transform duration-500 group-hover:shadow-2xl"
                      />
                      <div className="absolute top-3 right-3 flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                          ad.status === 'active' ? 'bg-success-500 text-white' :
                          ad.status === 'paused' ? 'bg-warning-500 text-white' :
                          ad.status === 'completed' ? 'bg-primary-500 text-white' :
                          'bg-gray-500 text-white'
                        } animate-pulse-slow`}>
                          {ad.status}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-black/80 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                          {ad.platform}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {ad.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-6 line-clamp-2">{ad.description}</p>

                    <div className="space-y-4">
                      {/* Performance Score */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Performance Score</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-20 bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-3 rounded-full transition-all duration-1000 relative overflow-hidden ${
                                ad.performanceScore > 85 ? 'bg-gradient-to-r from-success-400 via-success-500 to-success-600' :
                                ad.performanceScore > 70 ? 'bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600' :
                                'bg-gradient-to-r from-warning-400 via-warning-500 to-warning-600'
                              }`}
                              style={{ width: `${ad.performanceScore}%` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-gray-900 min-w-[2rem] animate-scale-pulse">{ad.performanceScore}</span>
                        </div>
                      </div>

                      {/* Fraud Risk */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Fraud Risk</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full shadow-sm ${
                            fraudAnalysis.riskLevel === 'low' ? 'bg-success-500' :
                            fraudAnalysis.riskLevel === 'medium' ? 'bg-warning-500' :
                            'bg-error-500'
                          }`}></div>
                          <span className="text-sm font-semibold capitalize">{fraudAnalysis.riskLevel}</span>
                        </div>
                      </div>

                      {/* Live Metrics */}
                      {ad.metrics && (
                        <div className="pt-4 border-t border-gray-100">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="text-center">
                              <p className="text-gray-600 mb-1">CTR</p>
                              <p className="font-bold text-gray-900">{ad.metrics.ctr}%</p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-600 mb-1">ROAS</p>
                              <p className="font-bold text-gray-900">{ad.metrics.roas}x</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                      <button className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1 group">
                        <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>View Details</span>
                      </button>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Detailed Analysis Modal */}
        <AnimatePresence>
          {selectedAd && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedAd(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  {/* Modal Header */}
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedAd.title}</h2>
                      <p className="text-gray-600">{selectedAd.description}</p>
                    </div>
                    <button
                      onClick={() => setSelectedAd(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Creative Preview */}
                    <div>
                      <div className="relative group">
                        <img
                          src={selectedAd.imageUrl}
                          alt={selectedAd.title}
                          className="w-full rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            selectedAd.status === 'active' ? 'bg-success-100 text-success-700' :
                            selectedAd.status === 'paused' ? 'bg-warning-100 text-warning-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {selectedAd.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            Created {selectedAd.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200">
                            <Download className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200">
                            <Share2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Analysis Panels */}
                    <div className="space-y-6">
                      {/* Performance Analysis */}
                      <div className="card">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                          <div className="bg-primary-100 p-2 rounded-lg mr-3">
                            <TrendingUp className="w-5 h-5 text-primary-600" />
                          </div>
                          Performance Analysis
                        </h3>
                        {(() => {
                          const prediction = getPerformancePrediction(selectedAd.performanceScore);
                          return (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <p className="text-sm text-gray-600 mb-1">Score</p>
                                  <p className="text-2xl font-bold text-gray-900">{prediction.score}/100</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <p className="text-sm text-gray-600 mb-1">Confidence</p>
                                  <p className="text-2xl font-bold text-gray-900">{prediction.confidence}%</p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-600 mb-1">Expected CTR</p>
                                  <p className="text-lg font-semibold text-primary-600">{prediction.expectedCtr}%</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600 mb-1">Expected CPA</p>
                                  <p className="text-lg font-semibold text-primary-600">${prediction.expectedCpa}</p>
                                </div>
                              </div>
                              
                              <div className="pt-4 border-t border-gray-100">
                                <h4 className="font-semibold text-gray-900 mb-3">AI Insights:</h4>
                                <ul className="space-y-2">
                                  {prediction.insights.map((insight, index) => (
                                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                                      <span>{insight}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Fraud Analysis */}
                      <div className="card">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                          <div className="bg-success-100 p-2 rounded-lg mr-3">
                            <Shield className="w-5 h-5 text-success-600" />
                          </div>
                          Fraud Protection
                          {!isPaid && (
                            <span className="ml-2 text-xs bg-warning-100 text-warning-700 px-2 py-1 rounded-full">
                              Pro Feature
                            </span>
                          )}
                        </h3>
                        {(() => {
                          const fraudAnalysis = getFraudAnalysis(selectedAd.fraudScore);
                          return (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <span className="font-medium">Risk Assessment</span>
                                <div className="flex items-center space-x-3">
                                  <div className={`w-4 h-4 rounded-full shadow-sm ${
                                    fraudAnalysis.riskLevel === 'low' ? 'bg-success-500' :
                                    fraudAnalysis.riskLevel === 'medium' ? 'bg-warning-500' :
                                    'bg-error-500'
                                  }`}></div>
                                  <span className="font-bold capitalize text-lg">{fraudAnalysis.riskLevel} Risk</span>
                                  <span className="text-sm text-gray-600">({fraudAnalysis.score}/100)</span>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Analysis Factors:</h4>
                                <ul className="space-y-2">
                                  {fraudAnalysis.factors.map((factor, index) => (
                                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                                      <CheckCircle className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                                      <span>{factor}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                                <h4 className="font-semibold text-primary-900 mb-2">AI Recommendation:</h4>
                                <p className="text-sm text-primary-800">{fraudAnalysis.recommendation}</p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Live Metrics */}
                      {selectedAd.metrics && (
                        <div className="card">
                          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <div className="bg-warning-100 p-2 rounded-lg mr-3">
                              <BarChart3 className="w-5 h-5 text-warning-600" />
                            </div>
                            Live Performance
                          </h3>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">Impressions</p>
                              <p className="text-2xl font-bold text-gray-900">{selectedAd.metrics.impressions.toLocaleString()}</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">Clicks</p>
                              <p className="text-2xl font-bold text-gray-900">{selectedAd.metrics.clicks.toLocaleString()}</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">CTR</p>
                              <p className="text-2xl font-bold text-primary-600">{selectedAd.metrics.ctr}%</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">ROAS</p>
                              <p className="text-2xl font-bold text-success-600">{selectedAd.metrics.roas}x</p>
                            </div>
                          </div>
                          
                          <div className="mt-6 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Total Conversions:</span>
                              <span className="font-bold text-gray-900">{selectedAd.metrics.conversions}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-2">
                              <span className="text-gray-600">Cost per Acquisition:</span>
                              <span className="font-bold text-gray-900">${selectedAd.metrics.cpa}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredAds.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};