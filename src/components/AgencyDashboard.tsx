import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { agencyEngine } from '../lib/agency-engine';
import type { AgencyDashboardData } from '../types/agency';
import {
  Users, DollarSign, TrendingUp, Award, Calendar, Download,
  Plus, Settings, BarChart3, Target, Shield, Star, ArrowRight,
  Eye, Edit, Pause, Play, AlertTriangle, CheckCircle
} from 'lucide-react';

export const AgencyDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<AgencyDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'quarterly'>('monthly');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await agencyEngine.getDashboardData('agency-1');
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to load agency dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading agency dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-warning-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Unavailable</h2>
          <p className="text-gray-600">Unable to load agency dashboard data</p>
        </div>
      </div>
    );
  }

  const { partner, clients, totalRevenue, totalCommission, activeClients, avgClientRoas, monthlyGrowth } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {partner.company} Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your clients and track performance across all campaigns
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Export Report</span>
            </button>
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Client</span>
            </button>
          </div>
        </div>

        {/* Partner Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold capitalize">{partner.tier} Partner</h3>
                <p className="opacity-90">
                  {partner.commissionRate}% commission rate • {activeClients} active clients
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">${totalCommission.toLocaleString()}</p>
              <p className="opacity-90">Total commission earned</p>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-success-600 font-medium">↗ +{monthlyGrowth}% this month</p>
              </div>
              <div className="bg-success-100 p-3 rounded-xl">
                <DollarSign className="w-8 h-8 text-success-600" />
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Clients</p>
                <p className="text-3xl font-bold text-gray-900">{activeClients}</p>
                <p className="text-xs text-primary-600 font-medium">of {clients.length} total</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-xl">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Avg Client ROAS</p>
                <p className="text-3xl font-bold text-gray-900">{avgClientRoas.toFixed(1)}x</p>
                <p className="text-xs text-success-600 font-medium">↗ +0.8x improvement</p>
              </div>
              <div className="bg-warning-100 p-3 rounded-xl">
                <TrendingUp className="w-8 h-8 text-warning-600" />
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Commission Rate</p>
                <p className="text-3xl font-bold text-gray-900">{partner.commissionRate}%</p>
                <p className="text-xs text-primary-600 font-medium">{partner.tier} tier benefits</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-xl">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Client Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Client Portfolio</h2>
            <div className="flex items-center space-x-3">
              <button className="btn-ghost flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Analytics</span>
              </button>
              <button className="btn-secondary flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Manage</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {clients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-xl hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {client.company}
                    </h3>
                    <p className="text-sm text-gray-600">{client.industry}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    client.status === 'active' ? 'bg-success-500' :
                    client.status === 'paused' ? 'bg-warning-500' :
                    'bg-error-500'
                  }`}></div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Monthly Budget</span>
                    <span className="font-semibold text-gray-900">${client.monthlyBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">ROAS</span>
                    <span className="font-semibold text-success-600">{client.performanceMetrics.roas}x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Campaigns</span>
                    <span className="font-semibold text-gray-900">{client.campaigns.length}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Top Performers */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="bg-success-100 p-2 rounded-lg mr-3">
                <Star className="w-6 h-6 text-success-600" />
              </div>
              Top Performing Clients
            </h3>
            <div className="space-y-4">
              {dashboardData.topPerformingClients.map((client, index) => (
                <div key={client.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{client.company}</p>
                      <p className="text-sm text-gray-600">{client.industry}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-success-600">{client.performanceMetrics.roas}x ROAS</p>
                    <p className="text-sm text-gray-600">${client.performanceMetrics.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commission Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="bg-warning-100 p-2 rounded-lg mr-3">
                <DollarSign className="w-6 h-6 text-warning-600" />
              </div>
              Commission Breakdown
            </h3>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-primary-700 font-medium">Total Commission</span>
                  <span className="text-2xl font-bold text-primary-900">${totalCommission.toLocaleString()}</span>
                </div>
                <p className="text-sm text-primary-600">
                  {partner.commissionRate}% of ${totalRevenue.toLocaleString()} client revenue
                </p>
              </div>
              
              <div className="space-y-3">
                {clients.slice(0, 3).map(client => {
                  const clientCommission = client.performanceMetrics.totalRevenue * (partner.commissionRate / 100);
                  return (
                    <div key={client.id} className="flex justify-between items-center">
                      <span className="text-gray-700">{client.company}</span>
                      <span className="font-semibold text-gray-900">${clientCommission.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* White Label Settings */}
        {partner.whiteLabel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white mt-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">White Label Dashboard</h3>
                <p className="opacity-90 mb-4">
                  Customize the platform with your branding and offer it to your clients
                </p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Custom branding enabled</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Client portal access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Revenue sharing active</span>
                  </div>
                </div>
              </div>
              <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Configure</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};