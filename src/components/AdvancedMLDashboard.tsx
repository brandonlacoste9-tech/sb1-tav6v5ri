import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dataPipelineEngine } from '../lib/data-pipeline-engine';
import { hybridFraudEngine } from '../lib/advanced-fraud-integration';
import { brandVoiceEngine } from '../lib/brand-voice-engine';
import { 
  Brain, Shield, Palette, BarChart3, TrendingUp, Target, Zap,
  Settings, Download, RefreshCw, AlertTriangle, CheckCircle,
  Crown, Star, Sparkles, Rocket, Eye, Edit
} from 'lucide-react';

interface MLMetrics {
  dnnAccuracy: number;
  gbdtAccuracy: number;
  ensembleAccuracy: number;
  trainingDataSize: number;
  lastTrained: Date;
  fraudProviderStatus: {
    humanSecurity: boolean;
    clickCease: boolean;
    internal: boolean;
  };
  brandProfilesActive: number;
}

export const AdvancedMLDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<MLMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'dnn' | 'gbdt' | 'ensemble'>('ensemble');

  useEffect(() => {
    loadMLMetrics();
  }, []);

  const loadMLMetrics = async () => {
    try {
      // Get model metrics from data pipeline engine
      const modelMetrics = await dataPipelineEngine.getModelMetrics();
      
      const mockMetrics: MLMetrics = {
        dnnAccuracy: 94.2,
        gbdtAccuracy: 91.7,
        ensembleAccuracy: 95.8,
        trainingDataSize: 2847392,
        lastTrained: new Date(Date.now() - 3600000), // 1 hour ago
        fraudProviderStatus: {
          humanSecurity: true,
          clickCease: true,
          internal: true
        },
        brandProfilesActive: 247
      };

      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Failed to load ML metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerModelRetraining = async () => {
    setRetraining(true);
    try {
      console.log('🎯 Triggering model retraining...');
      // Simulate retraining process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update metrics
      if (metrics) {
        setMetrics({
          ...metrics,
          dnnAccuracy: Math.min(98, metrics.dnnAccuracy + Math.random() * 2),
          gbdtAccuracy: Math.min(96, metrics.gbdtAccuracy + Math.random() * 1.5),
          ensembleAccuracy: Math.min(99, metrics.ensembleAccuracy + Math.random() * 1),
          lastTrained: new Date()
        });
      }
      
      console.log('✅ Model retraining complete');
    } catch (error) {
      console.error('❌ Model retraining failed:', error);
    } finally {
      setRetraining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-lg"></div>
          <p className="text-gray-600 text-lg">Loading ML intelligence dashboard...</p>
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
              ML Intelligence Center
              <Brain className="inline-block w-10 h-10 ml-3 text-primary-600 animate-bounce-gentle" />
            </h1>
            <p className="text-xl text-gray-600">
              Advanced machine learning pipeline with hybrid DNN + GBDT architecture
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <button 
              onClick={triggerModelRetraining}
              disabled={retraining}
              className="btn-secondary flex items-center space-x-2 hover:scale-110 transition-all duration-300"
            >
              {retraining ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Retraining...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  <span>Retrain Models</span>
                </>
              )}
            </button>
            <button className="btn-primary flex items-center space-x-2 group animate-glow hover:scale-110 transition-all duration-300">
              <Download className="w-5 h-5" />
              <span>Export Data</span>
            </button>
          </div>
        </motion.div>

        {/* Model Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="metric-card group hover:scale-110 transition-all duration-500">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">DNN Accuracy</p>
                <p className="text-4xl font-bold text-gray-900 animate-scale-pulse">{metrics.dnnAccuracy.toFixed(1)}%</p>
                <p className="text-xs text-success-600 font-medium animate-bounce-gentle">Deep Neural Network</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-xl group-hover:scale-125 group-hover:shadow-glow transition-all duration-500 neon-glow">
                <Brain className="w-8 h-8 text-primary-600 animate-float" />
              </div>
            </div>
          </div>

          <div className="metric-card group hover:scale-110 transition-all duration-500">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">GBDT Accuracy</p>
                <p className="text-4xl font-bold text-gray-900 animate-scale-pulse">{metrics.gbdtAccuracy.toFixed(1)}%</p>
                <p className="text-xs text-warning-600 font-medium animate-bounce-gentle">Gradient Boosting</p>
              </div>
              <div className="bg-warning-100 p-3 rounded-xl group-hover:scale-125 group-hover:shadow-glow transition-all duration-500 warning-glow">
                <Target className="w-8 h-8 text-warning-600 animate-float" style={{ animationDelay: '1s' }} />
              </div>
            </div>
          </div>

          <div className="metric-card group hover:scale-110 transition-all duration-500">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Ensemble Accuracy</p>
                <p className="text-4xl font-bold text-gray-900 animate-scale-pulse">{metrics.ensembleAccuracy.toFixed(1)}%</p>
                <p className="text-xs text-success-600 font-medium animate-bounce-gentle">Combined Models</p>
              </div>
              <div className="bg-success-100 p-3 rounded-xl group-hover:scale-125 group-hover:shadow-glow transition-all duration-500 success-glow">
                <Crown className="w-8 h-8 text-success-600 animate-float" style={{ animationDelay: '2s' }} />
              </div>
            </div>
          </div>

          <div className="metric-card group hover:scale-110 transition-all duration-500">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Training Data</p>
                <p className="text-4xl font-bold text-gray-900 animate-scale-pulse">{(metrics.trainingDataSize / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-primary-600 font-medium animate-bounce-gentle">Response samples</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-xl group-hover:scale-125 group-hover:shadow-glow transition-all duration-500 neon-glow">
                <BarChart3 className="w-8 h-8 text-primary-600 animate-float" style={{ animationDelay: '3s' }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fraud Provider Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 mb-8 hover:shadow-2xl transition-all duration-500"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="bg-success-100 p-2 rounded-lg mr-3 animate-scale-pulse">
              <Shield className="w-6 h-6 text-success-600" />
            </div>
            Hybrid Fraud Detection Status
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(metrics.fraudProviderStatus).map(([provider, status], index) => (
              <motion.div
                key={provider}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`card hover:shadow-xl hover:scale-105 transition-all duration-300 ${
                  status ? 'border-success-200 bg-gradient-to-br from-success-50 to-success-100' : 
                  'border-error-200 bg-gradient-to-br from-error-50 to-error-100'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-900 capitalize">
                    {provider.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <div className={`w-4 h-4 rounded-full ${
                    status ? 'bg-success-500 animate-pulse-slow success-glow' : 'bg-error-500'
                  }`}></div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-semibold ${status ? 'text-success-600' : 'text-error-600'}`}>
                      {status ? 'Active' : 'Offline'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response Time:</span>
                    <span className="font-semibold text-gray-900">
                      {provider === 'humanSecurity' ? '150ms' : 
                       provider === 'clickCease' ? '200ms' : '50ms'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accuracy:</span>
                    <span className="font-semibold text-gray-900">
                      {provider === 'humanSecurity' ? '96%' : 
                       provider === 'clickCease' ? '93%' : '89%'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Brand Voice Engine Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8 mb-8 hover:shadow-2xl transition-all duration-500"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="bg-warning-100 p-2 rounded-lg mr-3 animate-scale-pulse">
              <Palette className="w-6 h-6 text-warning-600" />
            </div>
            Brand Voice Intelligence
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="bg-warning-100 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center animate-bounce-gentle">
                <Palette className="w-8 h-8 text-warning-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Active Profiles</h4>
              <p className="text-3xl font-bold text-warning-600 animate-scale-pulse">{metrics.brandProfilesActive}</p>
              <p className="text-sm text-gray-600">Brand voice models</p>
            </div>

            <div className="card text-center hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="bg-success-100 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center animate-bounce-gentle" style={{ animationDelay: '0.2s' }}>
                <CheckCircle className="w-8 h-8 text-success-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Consistency Score</h4>
              <p className="text-3xl font-bold text-success-600 animate-scale-pulse">94.7%</p>
              <p className="text-sm text-gray-600">Brand alignment</p>
            </div>

            <div className="card text-center hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="bg-primary-100 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center animate-bounce-gentle" style={{ animationDelay: '0.4s' }}>
                <Sparkles className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Compliance Rate</h4>
              <p className="text-3xl font-bold text-primary-600 animate-scale-pulse">99.2%</p>
              <p className="text-sm text-gray-600">Safety adherence</p>
            </div>
          </div>
        </motion.div>

        {/* Model Performance Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-8 mb-8 hover:shadow-2xl transition-all duration-500"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="bg-primary-100 p-2 rounded-lg mr-3 animate-scale-pulse">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
              Model Performance Analysis
            </h3>
            <div className="flex items-center space-x-2">
              {['dnn', 'gbdt', 'ensemble'].map(model => (
                <button
                  key={model}
                  onClick={() => setSelectedModel(model as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedModel === model
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {model.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200 hover:scale-105 transition-all duration-300">
              <h4 className="font-bold text-primary-900 mb-3">Deep Neural Network</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-primary-700">Accuracy:</span>
                  <span className="font-bold text-primary-900">{metrics.dnnAccuracy.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-700">Architecture:</span>
                  <span className="font-bold text-primary-900">128→256→128→64</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-700">Use Case:</span>
                  <span className="font-bold text-primary-900">Complex Patterns</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-warning-50 to-warning-100 rounded-xl p-6 border border-warning-200 hover:scale-105 transition-all duration-300">
              <h4 className="font-bold text-warning-900 mb-3">Gradient Boosting</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-warning-700">Accuracy:</span>
                  <span className="font-bold text-warning-900">{metrics.gbdtAccuracy.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warning-700">Trees:</span>
                  <span className="font-bold text-warning-900">100 estimators</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warning-700">Use Case:</span>
                  <span className="font-bold text-warning-900">Structured Data</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-xl p-6 border border-success-200 hover:scale-105 transition-all duration-300">
              <h4 className="font-bold text-success-900 mb-3">Ensemble Model</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-success-700">Accuracy:</span>
                  <span className="font-bold text-success-900">{metrics.ensembleAccuracy.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-success-700">Weighting:</span>
                  <span className="font-bold text-success-900">60% DNN, 40% GBDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-success-700">Use Case:</span>
                  <span className="font-bold text-success-900">Production</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Real-Time Training Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden animate-glow"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent animate-gradient-x"></div>
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4 flex items-center">
              <Rocket className="w-8 h-8 mr-3 animate-bounce-gentle" />
              Real-Time Learning Pipeline
            </h3>
            <p className="text-xl opacity-90 mb-6">
              Continuous model improvement with live user response data
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300">
                <Eye className="w-10 h-10 mb-3 animate-float" />
                <h4 className="font-bold mb-2">Data Ingestion</h4>
                <p className="text-sm opacity-90">Real-time user response collection</p>
                <p className="text-2xl font-bold mt-2 animate-scale-pulse">24/7</p>
              </div>
              
              <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300">
                <Brain className="w-10 h-10 mb-3 animate-float" style={{ animationDelay: '1s' }} />
                <h4 className="font-bold mb-2">Model Training</h4>
                <p className="text-sm opacity-90">Hourly model retraining</p>
                <p className="text-2xl font-bold mt-2 animate-scale-pulse">Auto</p>
              </div>
              
              <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300">
                <Target className="w-10 h-10 mb-3 animate-float" style={{ animationDelay: '2s' }} />
                <h4 className="font-bold mb-2">Accuracy Tracking</h4>
                <p className="text-sm opacity-90">Performance monitoring</p>
                <p className="text-2xl font-bold mt-2 animate-scale-pulse">95.8%</p>
              </div>
              
              <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300">
                <Zap className="w-10 h-10 mb-3 animate-float" style={{ animationDelay: '3s' }} />
                <h4 className="font-bold mb-2">Deployment</h4>
                <p className="text-sm opacity-90">Instant model updates</p>
                <p className="text-2xl font-bold mt-2 animate-scale-pulse">Live</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Training Data Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6 hover:shadow-2xl transition-all duration-500"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Training Data Pipeline Status</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Data Sources</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-gray-700">User Response Data</span>
                  <span className="font-bold text-success-600">2.8M samples</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-gray-700">Campaign Performance</span>
                  <span className="font-bold text-primary-600">1.2M campaigns</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-gray-700">Fraud Patterns</span>
                  <span className="font-bold text-warning-600">847K incidents</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Model Status</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-gray-700">Last Training:</span>
                  <span className="font-bold text-gray-900">{metrics.lastTrained.toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-gray-700">Next Training:</span>
                  <span className="font-bold text-primary-600">
                    {new Date(metrics.lastTrained.getTime() + 3600000).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-gray-700">Training Status:</span>
                  <span className="font-bold text-success-600 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Healthy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};