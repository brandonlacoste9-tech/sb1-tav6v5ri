import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, DollarSign, TrendingUp, Award, Calendar, Download,
  Plus, Settings, BarChart3, Target, Shield, Star, ArrowRight,
  Eye, Edit, Pause, Play, AlertTriangle, CheckCircle, Crown,
  Building, Zap, CreditCard, Globe, Palette, Code, Bell
} from 'lucide-react';

interface AgencyPartner {
  id: string;
  name: string;
  company: string;
  tier: 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'pending' | 'suspended';
  clientCount: number;
  monthlyRevenue: number;
  commissionRate: number;
  whiteLabel: boolean;
  accountManager?: string;
  createdAt: string;
}

interface AgencyClient {
  id: string;
  name: string;
  company: string;
  industry: string;
  monthlyBudget: number;
  status: 'active' | 'paused' | 'churned';
  performanceMetrics: {
    totalSpend: number;
    totalRevenue: number;
    roas: number;
    avgCtr: number;
    avgCpa: number;
  };
  lastActivity: string;
}

interface WhiteLabelConfig {
  branding: {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    companyName: string;
  };
  features: {
    hideAdgenBranding: boolean;
    customDomain: boolean;
    customReporting: boolean;
  };
}

export const AgencyDashboardAdvanced: React.FC = () => {
  const [partner, setPartner] = useState<AgencyPartner | null>(null);
  const [clients, setClients] = useState<AgencyClient[]>([]);
  const [whiteLabelConfig, setWhiteLabelConfig] = useState<WhiteLabelConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'clients' | 'white-label' | 'reports'>('overview');

  useEffect(() => {
    loadAgencyData();
  }, []);

  const loadAgencyData = async () => {
    try {
      // Simulate loading agency data
      const mockPartner: AgencyPartner = {
        id: 'agency-1',
        name: 'Marcus Rodriguez',
        company: 'GrowthLab Agency',
        tier: 'pro',
        status: 'active',
        clientCount: 18,
        monthlyRevenue: 127500,
        commissionRate: 25,
        whiteLabel: true,
        accountManager: 'Sarah Chen',
        createdAt: '2024-06-15'
      };

      const mockClients: AgencyClient[] = [
        {
          id: '1',
          name: 'Emily Watson',
          company: 'StyleCo Fashion',
          industry: 'E-commerce',
          monthlyBudget: 25000,
          status: 'active',
          performanceMetrics: {
            totalSpend: 75000,
            totalRevenue: 315000,
            roas: 4.2,
            avgCtr: 3.1,
            avgCpa: 12.50
          },
          lastActivity: '2025-01-15'
        },
        {
          id: '2',
          name: 'David Kim',
          company: 'TechFlow Solutions',
          industry: 'SaaS',
          monthlyBudget: 35000,
          status: 'active',
          performanceMetrics: {
            totalSpend: 105000,
            totalRevenue: 472500,
            roas: 4.5,
            avgCtr: 2.8,
            avgCpa: 18.75
          },
          lastActivity: '2025-01-15'
        },
        {
          id: '3',
          name: 'Lisa Chen',
          company: 'HealthPlus Clinic',
          industry: 'Healthcare',
          monthlyBudget: 15000,
          status: 'active',
          performanceMetrics: {
            totalSpend: 45000,
            totalRevenue: 157500,
            roas: 3.5,
            avgCtr: 2.2,
            avgCpa: 22.30
          },
          lastActivity: '2025-01-14'
        }
      ];

      const mockWhiteLabel: WhiteLabelConfig = {
        branding: {
          logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100',
          primaryColor: '#1e40af',
          secondaryColor: '#3b82f6',
          companyName: 'GrowthLab AI'
        },
        features: {
          hideAdgenBranding: true,
          customDomain: true,
          customReporting: true
        }
      };

      setPartner(mockPartner);
      setClients(mockClients);
      setWhiteLabelConfig(mockWhiteLabel);
    } catch (error) {
      console.error('Failed to load agency data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = clients.reduce((sum, client) => sum + client.performanceMetrics.totalRevenue, 0);
  const totalCommission = totalRevenue * ((partner?.commissionRate || 0) / 100);
  const activeClients = clients.filter(c => c.status === 'active').length;
  const avgClientRoas = clients.reduce((sum, client) => sum + client.performanceMetrics.roas, 0) / clients.length;

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

  if (!partner) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-warning-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Agency Access Required</h2>
          <p className="text-gray-600 mb-6">Please contact support to set up your agency partnership</p>
          <button className="btn-primary">Contact Support</button>
        </div>
      </div>
    );
  }

  const getTierIcon = () => {
    switch (partner.tier) {
      case 'enterprise': return <Building className="w-8 h-8 text-warning-600" />;
      case 'pro': return <Crown className="w-8 h-8 text-primary-600" />;
      default: return <Zap className="w-8 h-8 text-gray-500" />;
    }
  };

  const getTierColor = () => {
    switch (partner.tier) {
      case 'enterprise': return 'from-warning-600 to-warning-700';
      case 'pro': return 'from-primary-600 to-primary-700';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {partner.company} Agency Portal
            </h1>
            <p className="text-gray-600">
              Manage clients, track performance, and scale your agency with white-label solutions
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
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
          className={`bg-gradient-to-r ${getTierColor()} rounded-2xl p-6 text-white mb-8 relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-xl">
                {getTierIcon()}
              </div>
              <div>
                <h3 className="text-2xl font-bold capitalize">{partner.tier} Partner</h3>
                <p className="opacity-90">
                  {partner.commissionRate}% commission • {activeClients} active clients • Since {new Date(partner.createdAt).getFullYear()}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>White-label enabled</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Dedicated manager</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">${totalCommission.toLocaleString()}</p>
              <p className="opacity-90">Total commission earned</p>
              <p className="text-sm opacity-75 mt-1">From ${totalRevenue.toLocaleString()} client revenue</p>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-8"
        >
          <div className="flex space-x-2">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'clients', label: 'Client Management', icon: Users },
              { id: 'white-label', label: 'White Label', icon: Palette },
              { id: 'reports', label: 'Reports', icon: FileText }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    selectedTab === tab.id
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedTab === 'overview' && (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="metric-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                      <p className="text-3xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                      <p className="text-xs text-success-600 font-medium">↗ +34% this quarter</p>
                    </div>
                    <div className="bg-success-100 p-3 rounded-xl">
                      <DollarSign className="w-8 h-8 text-success-600" />
                    </div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Commission Earned</p>
                      <p className="text-3xl font-bold text-gray-900">${totalCommission.toLocaleString()}</p>
                      <p className="text-xs text-primary-600 font-medium">{partner.commissionRate}% rate</p>
                    </div>
                    <div className="bg-primary-100 p-3 rounded-xl">
                      <Award className="w-8 h-8 text-primary-600" />
                    </div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Active Clients</p>
                      <p className="text-3xl font-bold text-gray-900">{activeClients}</p>
                      <p className="text-xs text-success-600 font-medium">+3 this month</p>
                    </div>
                    <div className="bg-warning-100 p-3 rounded-xl">
                      <Users className="w-8 h-8 text-warning-600" />
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
                    <div className="bg-success-100 p-3 rounded-xl">
                      <TrendingUp className="w-8 h-8 text-success-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Performing Clients */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="bg-success-100 p-2 rounded-lg mr-3">
                    <Star className="w-6 h-6 text-success-600" />
                  </div>
                  Top Performing Clients
                </h3>
                <div className="space-y-4">
                  {clients.slice(0, 3).map((client, index) => (
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
            </div>
          )}

          {selectedTab === 'clients' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Client Portfolio</h3>
                  <button className="btn-primary flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Add New Client</span>
                  </button>
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
                          <h4 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                            {client.company}
                          </h4>
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
                          <span className="text-sm text-gray-600">Total Revenue</span>
                          <span className="font-semibold text-gray-900">${client.performanceMetrics.totalRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Your Commission</span>
                          <span className="font-semibold text-primary-600">
                            ${(client.performanceMetrics.totalRevenue * (partner.commissionRate / 100)).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <button className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>View Dashboard</span>
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
              </div>
            </div>
          )}

          {selectedTab === 'white-label' && whiteLabelConfig && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="bg-primary-100 p-2 rounded-lg mr-3">
                    <Palette className="w-6 h-6 text-primary-600" />
                  </div>
                  White Label Configuration
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Branding Settings */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                      <input
                        type="text"
                        value={whiteLabelConfig.branding.companyName}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Color</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={whiteLabelConfig.branding.primaryColor}
                          className="w-12 h-12 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="text"
                          value={whiteLabelConfig.branding.primaryColor}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Logo URL</label>
                      <input
                        type="url"
                        value={whiteLabelConfig.branding.logo}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  {/* Feature Settings */}
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-gray-900">White Label Features</h4>
                    
                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-900">Hide AdGen Branding</p>
                          <p className="text-sm text-gray-600">Remove all AdGen AI references</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={whiteLabelConfig.features.hideAdgenBranding}
                          className="w-5 h-5 text-primary-600 border-2 border-gray-300 rounded focus:ring-primary-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-900">Custom Domain</p>
                          <p className="text-sm text-gray-600">Use your own domain for client access</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={whiteLabelConfig.features.customDomain}
                          className="w-5 h-5 text-primary-600 border-2 border-gray-300 rounded focus:ring-primary-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-900">Custom Reporting</p>
                          <p className="text-sm text-gray-600">Branded reports and analytics</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={whiteLabelConfig.features.customReporting}
                          className="w-5 h-5 text-primary-600 border-2 border-gray-300 rounded focus:ring-primary-500"
                        />
                      </label>
                    </div>

                    <button className="w-full btn-primary">
                      Save Configuration
                    </button>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">White Label Preview</h4>
                <div className="bg-gray-100 rounded-xl p-6 border-2 border-dashed border-gray-300">
                  <div className="flex items-center space-x-3 mb-4">
                    <img src={whiteLabelConfig.branding.logo} alt="Logo" className="w-10 h-10 rounded-lg" />
                    <span className="text-xl font-bold" style={{ color: whiteLabelConfig.branding.primaryColor }}>
                      {whiteLabelConfig.branding.companyName}
                    </span>
                  </div>
                  <p className="text-gray-600">This is how your clients will see the platform with your branding applied.</p>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'reports' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="card text-center">
                  <BarChart3 className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">Monthly Performance</h4>
                  <p className="text-gray-600 text-sm mb-4">Comprehensive client performance analysis</p>
                  <button className="btn-secondary w-full">Generate Report</button>
                </div>
                
                <div className="card text-center">
                  <DollarSign className="w-12 h-12 text-success-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">Commission Report</h4>
                  <p className="text-gray-600 text-sm mb-4">Detailed commission breakdown</p>
                  <button className="btn-secondary w-full">Generate Report</button>
                </div>
                
                <div className="card text-center">
                  <Target className="w-12 h-12 text-warning-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">Client Health</h4>
                  <p className="text-gray-600 text-sm mb-4">Client satisfaction and retention metrics</p>
                  <button className="btn-secondary w-full">Generate Report</button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};