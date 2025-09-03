import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Star, Award, TrendingUp, MessageSquare, Calendar, Crown, Shield, Target, Zap } from 'lucide-react';

interface CommunityMember {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  tier: 'member' | 'advocate' | 'champion';
  achievements: string[];
  stats: {
    roasImprovement: number;
    fraudSavings: number;
    referrals: number;
  };
}

interface CommunityEvent {
  id: string;
  title: string;
  type: 'webinar' | 'workshop' | 'case-study' | 'networking';
  date: string;
  attendees: number;
  speaker: string;
  description: string;
}

export const CommunityHub: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'members' | 'events' | 'leaderboard'>('members');

  const topMembers: CommunityMember[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'Performance Marketing Manager',
      company: 'TechFlow Solutions',
      avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100',
      tier: 'champion',
      achievements: ['First 1000 Club', 'Fraud Detective', 'ROAS Master'],
      stats: {
        roasImprovement: 340,
        fraudSavings: 12400,
        referrals: 8
      }
    },
    {
      id: '2',
      name: 'Marcus Rodriguez',
      role: 'Agency Owner',
      company: 'GrowthLab Agency',
      avatar: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100',
      tier: 'advocate',
      achievements: ['Agency Pioneer', 'Community Builder', 'Success Story'],
      stats: {
        roasImprovement: 156,
        fraudSavings: 8900,
        referrals: 12
      }
    },
    {
      id: '3',
      name: 'Emily Watson',
      role: 'E-commerce Director',
      company: 'StyleCo',
      avatar: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100',
      tier: 'advocate',
      achievements: ['Attribution Expert', 'Performance Optimizer'],
      stats: {
        roasImprovement: 234,
        fraudSavings: 6700,
        referrals: 5
      }
    }
  ];

  const upcomingEvents: CommunityEvent[] = [
    {
      id: '1',
      title: 'Advanced Attribution Modeling Workshop',
      type: 'workshop',
      date: '2025-01-25',
      attendees: 247,
      speaker: 'Dr. Analytics Expert',
      description: 'Deep dive into multi-touch attribution and revenue optimization strategies'
    },
    {
      id: '2',
      title: 'Fraud Detection Masterclass',
      type: 'webinar',
      date: '2025-01-30',
      attendees: 189,
      speaker: 'Security Specialist',
      description: 'Learn advanced fraud detection techniques and save thousands monthly'
    },
    {
      id: '3',
      title: 'Agency Success Stories Showcase',
      type: 'case-study',
      date: '2025-02-05',
      attendees: 156,
      speaker: 'Top Agency Partners',
      description: 'Real agencies share their transformation stories and results'
    }
  ];

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'champion': return <Crown className="w-5 h-5 text-warning-600" />;
      case 'advocate': return <Star className="w-5 h-5 text-primary-600" />;
      default: return <Users className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'champion': return 'from-warning-100 to-warning-200 border-warning-300';
      case 'advocate': return 'from-primary-100 to-primary-200 border-primary-300';
      default: return 'from-gray-100 to-gray-200 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Performance Marketing Community
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join 10,000+ performance marketers sharing strategies, success stories, 
            and advanced techniques for marketing intelligence.
          </p>
        </div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Members</p>
                <p className="text-3xl font-bold text-gray-900">10,247</p>
                <p className="text-xs text-success-600 font-medium">↗ +23% this month</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-xl">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Success Stories</p>
                <p className="text-3xl font-bold text-gray-900">1,847</p>
                <p className="text-xs text-success-600 font-medium">Shared this month</p>
              </div>
              <div className="bg-success-100 p-3 rounded-xl">
                <Star className="w-8 h-8 text-success-600" />
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Fraud Saved</p>
                <p className="text-3xl font-bold text-gray-900">$2.4M</p>
                <p className="text-xs text-success-600 font-medium">Community total</p>
              </div>
              <div className="bg-warning-100 p-3 rounded-xl">
                <Shield className="w-8 h-8 text-warning-600" />
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Avg ROAS Boost</p>
                <p className="text-3xl font-bold text-gray-900">267%</p>
                <p className="text-xs text-success-600 font-medium">Member average</p>
              </div>
              <div className="bg-success-100 p-3 rounded-xl">
                <TrendingUp className="w-8 h-8 text-success-600" />
              </div>
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
              { id: 'members', label: 'Top Members', icon: Users },
              { id: 'events', label: 'Events', icon: Calendar },
              { id: 'leaderboard', label: 'Leaderboard', icon: Award }
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
          {selectedTab === 'members' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`card hover:shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-br ${getTierColor(member.tier)} border-2`}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover shadow-lg"
                    />
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                        {getTierIcon(member.tier)}
                      </div>
                      <p className="text-sm text-gray-600">{member.role}</p>
                      <p className="text-sm text-gray-500">{member.company}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-success-600">{member.stats.roasImprovement}%</p>
                      <p className="text-xs text-gray-600">ROAS Boost</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-primary-600">${member.stats.fraudSavings.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">Fraud Saved</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-warning-600">{member.stats.referrals}</p>
                      <p className="text-xs text-gray-600">Referrals</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {member.achievements.map(achievement => (
                      <span key={achievement} className="bg-white/80 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                        {achievement}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {selectedTab === 'events' && (
            <div className="space-y-6">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-xl ${
                        event.type === 'webinar' ? 'bg-primary-100' :
                        event.type === 'workshop' ? 'bg-success-100' :
                        event.type === 'case-study' ? 'bg-warning-100' :
                        'bg-gray-100'
                      }`}>
                        {event.type === 'webinar' ? <Zap className="w-6 h-6 text-primary-600" /> :
                         event.type === 'workshop' ? <Target className="w-6 h-6 text-success-600" /> :
                         event.type === 'case-study' ? <Star className="w-6 h-6 text-warning-600" /> :
                         <Users className="w-6 h-6 text-gray-600" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-600">by {event.speaker}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">{event.attendees} attending</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{event.description}</p>
                  
                  <button className="btn-primary w-full">
                    Register for Event
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {selectedTab === 'leaderboard' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Leaderboard</h3>
              <div className="space-y-4">
                {topMembers.map((member, index) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0 ? 'bg-warning-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-warning-600' :
                        'bg-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                      <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full" />
                      <div>
                        <p className="font-semibold text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-success-600">{member.stats.roasImprovement}% ROAS</p>
                      <p className="text-sm text-gray-600">${member.stats.fraudSavings.toLocaleString()} saved</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Join Community CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white text-center mt-12"
        >
          <h2 className="text-2xl font-bold mb-4">Join the Elite Performance Marketing Community</h2>
          <p className="text-lg opacity-90 mb-6">
            Connect with top marketers, share success stories, and learn advanced strategies
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Join Community
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-colors">
              View Success Stories
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};