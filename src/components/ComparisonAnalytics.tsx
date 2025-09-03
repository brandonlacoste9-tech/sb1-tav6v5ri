import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Eye, Target, ArrowRight } from 'lucide-react';

interface ComparisonMetrics {
  totalViews: number;
  comparisonViews: Record<string, number>;
  conversionRate: number;
  topReferrers: string[];
  timeRange: string;
}

export const ComparisonAnalytics: React.FC = () => {
  const [metrics, setMetrics] = useState<ComparisonMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analytics-tracker/analytics-summary?range=${timeRange}`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <div className="bg-primary-100 p-2 rounded-lg mr-3">
            <BarChart3 className="w-6 h-6 text-primary-600" />
          </div>
          Comparison Analytics
        </h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Views</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.totalViews.toLocaleString()}</p>
              <p className="text-xs text-success-600 font-medium">↗ +23% vs previous period</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-xl">
              <Eye className="w-8 h-8 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Conversion Rate</p>
              <p className="text-3xl font-bold text-gray-900">{(metrics.conversionRate * 100).toFixed(1)}%</p>
              <p className="text-xs text-success-600 font-medium">↗ +1.2% improvement</p>
            </div>
            <div className="bg-success-100 p-3 rounded-xl">
              <Target className="w-8 h-8 text-success-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Top Competitor</p>
              <p className="text-2xl font-bold text-gray-900">
                {Object.entries(metrics.comparisonViews).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
              </p>
              <p className="text-xs text-primary-600 font-medium">Most compared</p>
            </div>
            <div className="bg-warning-100 p-3 rounded-xl">
              <Users className="w-8 h-8 text-warning-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Competitor Comparison Views</h4>
        {Object.entries(metrics.comparisonViews)
          .sort(([,a], [,b]) => b - a)
          .map(([competitor, views], index) => (
            <div key={competitor} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <span className="font-medium text-gray-900">{competitor}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-1000"
                    style={{ width: `${(views / Math.max(...Object.values(metrics.comparisonViews))) * 100}%` }}
                  ></div>
                </div>
                <span className="font-bold text-gray-900 min-w-[3rem]">{views.toLocaleString()}</span>
              </div>
            </div>
          ))}
      </div>
    </motion.div>
  );
};