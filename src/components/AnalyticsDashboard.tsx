import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Users, Eye, Target, Calendar, Download,
  ArrowRight, Star, Shield, Brain, Zap, Crown, Building
} from 'lucide-react';

interface AnalyticsMetrics {
  totalViews: number;
  comparisonViews: Record<string, number>;
  conversionRate: number;
  topReferrers: string[];
  timeRange: string;
  performanceMetrics: {
    avgScore: number;
    fraudSavings: number;
    attributionAccuracy: number;
    userSatisfaction: number;
  };
}

export const AnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      // Simulate comprehensive analytics data
      const mockMetrics: AnalyticsMetrics = {
        totalViews: Math.floor(Math.random() * 50000) + 25000,
        comparisonViews: {
          'AdCreative.ai': Math.floor(Math.random() * 15000) + 8000,
          'Creatopy': Math.floor(Math.random() * 8000) + 4000,
          'Smartly.io': Math.floor(Math.random() * 6000) + 3000,
          'Canva Pro': Math.floor(Math.random() * 4000) + 2000,
          'Jasper': Math.floor(Math.random() * 3000) + 1500
        },
        conversionRate: Number((Math.random() * 0.08 + 0.04).toFixed(3)),
        topReferrers: ['google.com', 'linkedin.com', 'twitter.com', 'facebook.com', 'direct'],
        timeRange,
        performanceMetrics: {
          avgScore: Math.floor(Math.random() * 15) + 85,
          fraudSavings: Math.floor(Math.random() * 100000) + 50000,
          attributionAccuracy: Math.floor(Math.random() * 5) + 94,
          userSatisfaction: Number((Math.random() * 0.5 + 4.5).toFixed(1))
        }
      };

      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-lg"></div>
          <p className="text-gray-600 text-lg">Loading analytics intelligence...</p>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30 pt-20 relative overflow-hidden">
      {/* Enhanced background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-success-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8"
        >
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-2 text-shadow">
              Analytics Intelligence
              <Brain className="inline-block w-10 h-10 ml-3 text-primary-600 animate-bounce-gentle" />
            </h1>
            <p className="text-xl text-gray-600">
              Real-time insights into platform performance and competitive positioning
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button className="btn-secondary flex items-center space-x-2 hover:scale-110 transition-all duration-300">
              <Download className="w-5 h-5" />
              <span>Export Report</span>
            </button>
          </div>
        </motion.div>

        {/* Enhanced Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="metric-card group hover:scale-110 transition-all duration-500">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Platform Views</p>
                <p className="text-4xl font-bold text-gray-900 animate-scale-pulse">{metrics.totalViews.toLocaleString()}</p>
                <p className="text-xs text-success-600 font-medium animate-bounce-gentle">↗ +34% growth</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-xl group-hover:scale-125 group-hover:shadow-glow transition-all duration-500 neon-glow">
                <Eye className="w-8 h-8 text-primary-600 animate-float" />
              </div>
            </div>
          </div>

          <div className="metric-card group hover:scale-110 transition-all duration-500">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Conversion Rate</p>
                <p className="text-4xl font-bold text-gray-900 animate-scale-pulse">{(metrics.conversionRate * 100).toFixed(1)}%</p>
                <p className="text-xs text-success-600 font-medium animate-bounce-gentle">↗ Industry leading</p>
              </div>
              <div className="bg-success-100 p-3 rounded-xl group-hover:scale-125 group-hover:shadow-glow transition-all duration-500 success-glow">
                <Target className="w-8 h-8 text-success-600 animate-float" style={{ animationDelay: '1s' }} />
              </div>
            </div>
          </div>

          <div className="metric-card group hover:scale-110 transition-all duration-500">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">AI Performance Score</p>
                <p className="text-4xl font-bold text-gray-900 animate-scale-pulse">{metrics.performanceMetrics.avgScore}</p>
                <p className="text-xs text-primary-600 font-medium animate-bounce-gentle">Platform average</p>
              </div>
              <div className="bg-warning-100 p-3 rounded-xl group-hover:scale-125 group-hover:shadow-glow transition-all duration-500 warning-glow">
                <Brain className="w-8 h-8 text-warning-600 animate-float" style={{ animationDelay: '2s' }} />
              </div>
            </div>
          </div>

          <div className="metric-card group hover:scale-110 transition-all duration-500">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Fraud Savings</p>
                <p className="text-4xl font-bold text-gray-900 animate-scale-pulse">${(metrics.performanceMetrics.fraudSavings / 1000).toFixed(0)}K</p>
                <p className="text-xs text-success-600 font-medium animate-bounce-gentle">Total protected</p>
              </div>
              <div className="bg-success-100 p-3 rounded-xl group-hover:scale-125 group-hover:shadow-glow transition-all duration-500 success-glow">
                <Shield className="w-8 h-8 text-success-600 animate-float" style={{ animationDelay: '3s' }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Competitor Comparison Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 mb-8 hover:shadow-2xl transition-all duration-500"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="bg-primary-100 p-2 rounded-lg mr-3 animate-scale-pulse">
              <BarChart3 className="w-6 h-6 text-primary-600" />
            </div>
            Competitive Intelligence Dashboard
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Competitor Views Chart */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Competitor Comparison Traffic</h4>
              <div className="space-y-4">
                {Object.entries(metrics.comparisonViews)
                  .sort(([,a], [,b]) => b - a)
                  .map(([competitor, views], index) => (
                    <motion.div
                      key={competitor}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-primary-50 hover:to-primary-100 hover:scale-105 transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold group-hover:scale-125 transition-transform duration-300">
                          {index + 1}
                        </div>
                        <div>
                          <span className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">{competitor}</span>
                          <p className="text-xs text-gray-500">Comparison page views</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(views / Math.max(...Object.values(metrics.comparisonViews))) * 100}%` }}
                            transition={{ duration: 1.5, delay: index * 0.2 }}
                            className="h-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                          </motion.div>
                        </div>
                        <span className="font-bold text-gray-900 min-w-[4rem] text-right animate-scale-pulse">{views.toLocaleString()}</span>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>

            {/* Performance Insights */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Platform Performance Insights</h4>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-success-50 to-success-100 border border-success-200 rounded-xl p-4 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-success-800 font-medium">Attribution Accuracy</span>
                    <span className="text-2xl font-bold text-success-900 animate-scale-pulse">{metrics.performanceMetrics.attributionAccuracy}%</span>
                  </div>
                  <p className="text-success-700 text-sm">Industry-leading multi-touch attribution precision</p>
                </div>

                <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-xl p-4 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-primary-800 font-medium">User Satisfaction</span>
                    <span className="text-2xl font-bold text-primary-900 animate-scale-pulse">{metrics.performanceMetrics.userSatisfaction}/5.0</span>
                  </div>
                  <p className="text-primary-700 text-sm">Customer satisfaction rating vs competitors</p>
                </div>

                <div className="bg-gradient-to-r from-warning-50 to-warning-100 border border-warning-200 rounded-xl p-4 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-warning-800 font-medium">Market Position</span>
                    <span className="text-2xl font-bold text-warning-900 animate-scale-pulse">#1</span>
                  </div>
                  <p className="text-warning-700 text-sm">Fastest growing AI creative platform</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Competitive Intelligence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden animate-glow mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent animate-gradient-x"></div>
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4 flex items-center">
              <Crown className="w-8 h-8 mr-3 animate-bounce-gentle" />
              Market Domination Status
            </h3>
            <p className="text-xl opacity-90 mb-6">
              Real-time competitive intelligence showing our platform's superiority
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300">
                <Shield className="w-10 h-10 mb-3 animate-float" />
                <h4 className="font-bold mb-2">Fraud Protection Leader</h4>
                <p className="text-sm opacity-90">Only platform with built-in fraud detection</p>
                <p className="text-2xl font-bold mt-2 animate-scale-pulse">${(metrics.performanceMetrics.fraudSavings / 1000).toFixed(0)}K saved</p>
              </div>
              
              <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300">
                <Brain className="w-10 h-10 mb-3 animate-float" style={{ animationDelay: '1s' }} />
                <h4 className="font-bold mb-2">AI Prediction Accuracy</h4>
                <p className="text-sm opacity-90">Highest accuracy in the industry</p>
                <p className="text-2xl font-bold mt-2 animate-scale-pulse">{metrics.performanceMetrics.attributionAccuracy}%</p>
              </div>
              
              <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300">
                <Star className="w-10 h-10 mb-3 animate-float" style={{ animationDelay: '2s' }} />
                <h4 className="font-bold mb-2">Customer Satisfaction</h4>
                <p className="text-sm opacity-90">Highest rated AI creative platform</p>
                <p className="text-2xl font-bold mt-2 animate-scale-pulse">{metrics.performanceMetrics.userSatisfaction}/5.0</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Traffic Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 hover:shadow-2xl transition-all duration-500"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="bg-warning-100 p-2 rounded-lg mr-3 animate-scale-pulse">
              <Users className="w-6 h-6 text-warning-600" />
            </div>
            Top Traffic Sources
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {metrics.topReferrers.map((referrer, index) => (
              <motion.div
                key={referrer}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-primary-50 hover:to-primary-100 hover:scale-110 transition-all duration-300 group"
              >
                <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-125 transition-transform duration-300">
                  <span className="text-sm font-bold">{index + 1}</span>
                </div>
                <p className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">{referrer}</p>
                <p className="text-xs text-gray-500 mt-1">Traffic source</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};