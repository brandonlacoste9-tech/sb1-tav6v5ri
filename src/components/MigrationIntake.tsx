import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Shield, CheckCircle, ArrowRight, Calendar, Star, Target, TrendingUp } from 'lucide-react';

interface MigrationFormData {
  name: string;
  email: string;
  company: string;
  currentTool: string;
  monthlySpend: string;
  painPoints: string[];
  urgency: string;
  teamSize: string;
  calendlyPreference: string;
}

export const MigrationIntake: React.FC = () => {
  const [formData, setFormData] = useState<MigrationFormData>({
    name: '',
    email: '',
    company: '',
    currentTool: '',
    monthlySpend: '',
    painPoints: [],
    urgency: '',
    teamSize: '',
    calendlyPreference: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentTools = [
    'AdCreative.ai',
    'Creatopy',
    'Canva Pro',
    'Smartly.io',
    'Jasper',
    'Copy.ai',
    'Figma',
    'Adobe Creative Suite',
    'Other'
  ];

  const painPointOptions = [
    'Surprise billing/hidden fees',
    'Poor customer support',
    'Generic/templated output',
    'No performance analytics',
    'Slow export times',
    'Limited customization',
    'No fraud detection',
    'Complex setup/learning curve',
    'Expensive pricing',
    'No A/B testing features',
    'Poor brand consistency',
    'No attribution tracking'
  ];

  const handlePainPointChange = (painPoint: string) => {
    setFormData(prev => ({
      ...prev,
      painPoints: prev.painPoints.includes(painPoint)
        ? prev.painPoints.filter(p => p !== painPoint)
        : [...prev.painPoints, painPoint]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('migration_requests')
        .insert({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          current_tool: formData.currentTool,
          monthly_spend: formData.monthlySpend,
          pain_points: formData.painPoints,
          urgency: formData.urgency,
          team_size: formData.teamSize,
          calendly_preference: formData.calendlyPreference,
          status: 'new'
        });

      if (error) {
        throw error;
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting migration request:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8 text-center relative overflow-hidden"
      >
        {/* Success background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-success-50 to-success-100 opacity-50"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-success-200 rounded-full -translate-y-16 translate-x-16 opacity-30"></div>
        
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="bg-success-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center"
          >
            <CheckCircle className="w-12 h-12 text-success-600" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Migration Request Received! 🎉
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Our migration specialist will contact you within <span className="font-bold text-success-600">24 hours</span> to schedule your 
            white-glove migration and strategy session.
          </p>
          
          <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-primary-900 mb-3">What happens next:</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <span className="text-primary-800">Personal consultation call within 24 hours</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <span className="text-primary-800">Custom migration plan created for your needs</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <span className="text-primary-800">Complete asset transfer and team training</span>
              </div>
            </div>
          </div>
          
          <div className="bg-success-50 border border-success-200 rounded-xl p-4 mb-8">
            <p className="text-success-800 font-semibold flex items-center justify-center">
              <Calendar className="w-4 h-4 mr-2" />
              📧 Check your email for calendar link and next steps
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setSubmitted(false)}
              className="btn-secondary"
            >
              Submit Another Request
            </button>
            <button className="btn-primary">
              <a href="/dashboard" className="flex items-center space-x-2">
                <span>Explore Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-white/20 p-3 rounded-xl">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold">White Glove Migration</h1>
          </div>
          <p className="text-xl opacity-90 mb-6">
            We'll migrate all your assets, data, and workflows for free. 
            Plus get a <span className="font-bold">90-day performance guarantee</span>.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <Star className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm font-medium">Free Migration</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm font-medium">90-Day Guarantee</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm font-medium">24hr Response</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              placeholder="John Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Work Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              placeholder="john@company.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            required
            value={formData.company}
            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            placeholder="Acme Corp"
          />
        </div>

        {/* Current Tool */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Current Creative Tool *
          </label>
          <select
            required
            value={formData.currentTool}
            onChange={(e) => setFormData(prev => ({ ...prev, currentTool: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          >
            <option value="">Select your current tool</option>
            {currentTools.map(tool => (
              <option key={tool} value={tool}>{tool}</option>
            ))}
          </select>
        </div>

        {/* Monthly Spend & Team Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Monthly Ad Spend
            </label>
            <select
              value={formData.monthlySpend}
              onChange={(e) => setFormData(prev => ({ ...prev, monthlySpend: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            >
              <option value="">Select range</option>
              <option value="<$5K">Less than $5K</option>
              <option value="$5K-$25K">$5K - $25K</option>
              <option value="$25K-$100K">$25K - $100K</option>
              <option value="$100K+">$100K+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Team Size
            </label>
            <select
              value={formData.teamSize}
              onChange={(e) => setFormData(prev => ({ ...prev, teamSize: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            >
              <option value="">Select size</option>
              <option value="1">Just me</option>
              <option value="2-5">2-5 people</option>
              <option value="6-20">6-20 people</option>
              <option value="20+">20+ people</option>
            </select>
          </div>
        </div>

        {/* Pain Points */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            What problems are you experiencing? (Select all that apply)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {painPointOptions.map(painPoint => (
              <motion.label 
                key={painPoint} 
                className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="checkbox"
                  checked={formData.painPoints.includes(painPoint)}
                  onChange={() => handlePainPointChange(painPoint)}
                  className="w-5 h-5 text-primary-600 border-2 border-gray-300 rounded focus:ring-primary-500 transition-colors"
                />
                <span className="text-sm text-gray-700 font-medium">{painPoint}</span>
              </motion.label>
            ))}
          </div>
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            How urgent is this migration?
          </label>
          <div className="space-y-3">
            {[
              { value: 'asap', label: 'ASAP - We need to switch immediately', badge: 'Priority' },
              { value: 'month', label: 'Within the next month', badge: null },
              { value: 'quarter', label: 'Within the next quarter', badge: null },
              { value: 'exploring', label: 'Just exploring options', badge: null }
            ].map(option => (
              <motion.label 
                key={option.value} 
                className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary-300 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="urgency"
                    value={option.value}
                    checked={formData.urgency === option.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
                    className="w-5 h-5 text-primary-600 border-2 border-gray-300 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{option.label}</span>
                </div>
                {option.badge && (
                  <span className="bg-error-100 text-error-700 px-3 py-1 rounded-full text-xs font-bold">
                    {option.badge}
                  </span>
                )}
              </motion.label>
            ))}
          </div>
        </div>

        {/* Calendar Preference */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Preferred meeting time
          </label>
          <select
            value={formData.calendlyPreference}
            onChange={(e) => setFormData(prev => ({ ...prev, calendlyPreference: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          >
            <option value="">Select preference</option>
            <option value="morning">Morning (9AM - 12PM EST)</option>
            <option value="afternoon">Afternoon (12PM - 5PM EST)</option>
            <option value="evening">Evening (5PM - 8PM EST)</option>
            <option value="flexible">I'm flexible</option>
          </select>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 shadow-lg hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden shimmer animate-glow"
          whileHover={{ scale: submitting ? 1 : 1.02 }}
          whileTap={{ scale: submitting ? 1 : 0.98 }}
        >
          {submitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin shadow-lg"></div>
              <span>Submitting...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <span>Start My Free Migration</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          )}
        </motion.button>

        {/* Guarantee */}
        <div className="bg-success-50 border border-success-200 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Shield className="w-5 h-5 text-success-600" />
            <p className="text-success-800 font-bold">90-Day Performance Guarantee</p>
          </div>
          <p className="text-success-700 text-sm">
            See measurable improvement in your ad performance or get your money back. 
            Plus, migration is completely free regardless.
          </p>
        </div>
      </form>
    </div>
  );
};