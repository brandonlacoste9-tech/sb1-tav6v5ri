import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { mlPerformanceAPI } from '../lib/ml-performance-api';
import { fraudDetectionService } from '../lib/fraud-detection-service';
import { Brain, Shield, Target, TrendingUp, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

interface DemoCreative {
  title: string;
  description: string;
  platform: 'facebook' | 'google' | 'instagram' | 'tiktok' | 'linkedin';
  industry: string;
  budget: number;
}

export const PerformancePredictionDemo: React.FC = () => {
  const [creative, setCreative] = useState<DemoCreative>({
    title: 'Summer Sale - 50% Off Everything',
    description: 'Limited time offer! Get 50% off all products. Shop now before this amazing deal expires. Free shipping on orders over $50.',
    platform: 'facebook',
    industry: 'ecommerce',
    budget: 5000
  });

  const [prediction, setPrediction] = useState<any>(null);
  const [fraudAnalysis, setFraudAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      // Run performance prediction
      const performanceResult = await mlPerformanceAPI.predict(creative);
      setPrediction(performanceResult);

      // Run fraud analysis
      const fraudResult = await fraudDetectionService.analyzeFraud({
        creativeId: 'demo-creative',
        campaignId: 'demo-campaign',
        targetAudience: { size: 'medium' },
        budget: creative.budget,
        platform: creative.platform
      });
      setFraudAnalysis(fraudResult);

    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-success-600';
    if (score >= 70) return 'text-warning-600';
    return 'text-error-500';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-success-600 bg-success-50 border-success-200';
      case 'medium': return 'text-warning-600 bg-warning-50 border-warning-200';
      case 'high': return 'text-error-600 bg-error-50 border-error-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Performance Prediction Demo
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Experience the power of our Full-Stack Marketing Brain. Analyze any creative 
          for performance prediction and fraud risk assessment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="bg-primary-100 p-2 rounded-lg mr-3">
              <Brain className="w-6 h-6 text-primary-600" />
            </div>
            Creative Input
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Creative Title
              </label>
              <input
                type="text"
                value={creative.title}
                onChange={(e) => setCreative(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your ad title..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Creative Description
              </label>
              <textarea
                value={creative.description}
                onChange={(e) => setCreative(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your ad copy and description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Platform
                </label>
                <select
                  value={creative.platform}
                  onChange={(e) => setCreative(prev => ({ ...prev, platform: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                >
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="google">Google Ads</option>
                  <option value="tiktok">TikTok</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  value={creative.industry}
                  onChange={(e) => setCreative(prev => ({ ...prev, industry: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                >
                  <option value="ecommerce">E-commerce</option>
                  <option value="saas">SaaS</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="education">Education</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Campaign Budget ($)
              </label>
              <input
                type="number"
                value={creative.budget}
                onChange={(e) => setCreative(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                placeholder="5000"
              />
            </div>

            <button
              onClick={runAnalysis}
              disabled={analyzing}
              className="w-full btn-primary text-lg py-4 flex items-center justify-center space-x-2"
            >
              {analyzing ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6" />
                  <span>Analyze Creative</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Performance Prediction Results */}
          {prediction && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="bg-primary-100 p-2 rounded-lg mr-3">
                  <TrendingUp className="w-6 h-6 text-primary-600" />
                </div>
                Performance Prediction
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Performance Score</p>
                  <p className={`text-3xl font-bold ${getScoreColor(prediction.score)}`}>
                    {prediction.score}/100
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Confidence</p>
                  <p className="text-3xl font-bold text-primary-600">{prediction.confidence}%</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Expected CTR</p>
                  <p className="text-lg font-bold text-gray-900">{prediction.expectedCtr}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Expected CPA</p>
                  <p className="text-lg font-bold text-gray-900">${prediction.expectedCpa}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Expected ROAS</p>
                  <p className="text-lg font-bold text-success-600">{prediction.expectedRoas}x</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">AI Insights</h4>
                  <ul className="space-y-2">
                    {prediction.insights.map((insight: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
                  <ul className="space-y-2">
                    {prediction.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                        <Target className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Fraud Analysis Results */}
          {fraudAnalysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="bg-success-100 p-2 rounded-lg mr-3">
                  <Shield className="w-6 h-6 text-success-600" />
                </div>
                Fraud Risk Analysis
              </h3>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-6">
                <span className="font-medium text-gray-900">Risk Assessment</span>
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    fraudAnalysis.riskLevel === 'low' ? 'bg-success-500' :
                    fraudAnalysis.riskLevel === 'medium' ? 'bg-warning-500' :
                    'bg-error-500'
                  }`}></div>
                  <span className={`font-bold capitalize px-3 py-1 rounded-full border ${getRiskColor(fraudAnalysis.riskLevel)}`}>
                    {fraudAnalysis.riskLevel} Risk
                  </span>
                  <span className="text-sm text-gray-600">({fraudAnalysis.riskScore}/100)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Confidence</p>
                  <p className="text-2xl font-bold text-primary-600">{fraudAnalysis.confidence}%</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Estimated Savings</p>
                  <p className="text-2xl font-bold text-success-600">${fraudAnalysis.estimatedSavings.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Risk Factors</h4>
                  <ul className="space-y-2">
                    {fraudAnalysis.factors.map((factor: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          fraudAnalysis.riskLevel === 'low' ? 'bg-success-500' :
                          fraudAnalysis.riskLevel === 'medium' ? 'bg-warning-500' :
                          'bg-error-500'
                        }`}></div>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <h4 className="font-semibold text-primary-900 mb-2">AI Recommendation</h4>
                  <p className="text-sm text-primary-800">{fraudAnalysis.recommendation}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Demo CTA */}
          {!prediction && !fraudAnalysis && (
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white text-center relative overflow-hidden animate-glow">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent animate-gradient-x"></div>
              <div className="relative z-10">
              <Brain className="w-16 h-16 mx-auto mb-4 animate-float" />
              <h3 className="text-2xl font-bold mb-4">See the AI in Action</h3>
              <p className="text-lg opacity-90 mb-6">
                Enter your creative details above and click "Analyze Creative" to see 
                real-time performance prediction and fraud risk assessment.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/15 backdrop-blur-md rounded-lg p-4 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 animate-bounce-gentle" />
                  <p className="font-semibold">Performance Score</p>
                  <p className="text-sm opacity-90">0-100 prediction accuracy</p>
                </div>
                <div className="bg-white/15 backdrop-blur-md rounded-lg p-4 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <Shield className="w-8 h-8 mx-auto mb-2 animate-bounce-gentle" style={{ animationDelay: '0.2s' }} />
                  <p className="font-semibold">Fraud Protection</p>
                  <p className="text-sm opacity-90">Real-time risk assessment</p>
                </div>
                <div className="bg-white/15 backdrop-blur-md rounded-lg p-4 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <Target className="w-8 h-8 mx-auto mb-2 animate-bounce-gentle" style={{ animationDelay: '0.4s' }} />
                  <p className="font-semibold">ROI Optimization</p>
                  <p className="text-sm opacity-90">Actionable recommendations</p>
                </div>
              </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feature Showcase */}
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Why Our AI Outperforms Competitors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center hover:shadow-xl transition-all duration-300">
            <div className="bg-primary-100 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Brain className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Advanced ML Models</h3>
            <p className="text-gray-600">
              Neural networks trained on billions of data points deliver 94% prediction accuracy
            </p>
          </div>

          <div className="card text-center hover:shadow-xl transition-all duration-300">
            <div className="bg-success-100 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="w-8 h-8 text-success-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Fraud Detection</h3>
            <p className="text-gray-600">
              Protect your budget with instant bot detection and traffic quality analysis
            </p>
          </div>

          <div className="card text-center hover:shadow-xl transition-all duration-300">
            <div className="bg-warning-100 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Target className="w-8 h-8 text-warning-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Attribution Intelligence</h3>
            <p className="text-gray-600">
              Multi-touch attribution reveals true ROI and optimizes budget allocation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};