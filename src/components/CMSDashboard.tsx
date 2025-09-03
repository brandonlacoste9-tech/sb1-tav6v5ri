import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Plus, Calendar, TrendingUp, Eye, Edit, Trash2, 
  Search, Filter, Download, Share2, BarChart3, Target,
  Clock, Users, MessageSquare, ExternalLink, CheckCircle,
  AlertTriangle, Zap, Brain, Shield
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  publishDate: string;
  readTime: string;
  status: 'draft' | 'published' | 'scheduled';
  category: 'autopsy' | 'case-study' | 'comparison' | 'strategy';
  tags: string[];
  viewCount: number;
  shareCount: number;
  conversionRate: number;
}

interface ContentMetrics {
  totalPosts: number;
  publishedPosts: number;
  totalViews: number;
  avgEngagement: number;
  conversionRate: number;
  topPerformingPost: string;
}

export const CMSDashboard: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [metrics, setMetrics] = useState<ContentMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadContentData();
  }, []);

  const loadContentData = async () => {
    try {
      // Simulate loading CMS data
      const mockPosts: BlogPost[] = [
        {
          id: '1',
          title: 'Autopsy: AdCreative.ai Campaign Disaster - $47,000 Lost in 14 Days',
          slug: 'autopsy-adcreative-ai-ecommerce-disaster',
          excerpt: 'A forensic analysis of an e-commerce campaign that collapsed due to templated designs and zero fraud protection.',
          author: 'AdGen AI Research Team',
          publishDate: '2025-01-15',
          readTime: '8 min read',
          status: 'published',
          category: 'autopsy',
          tags: ['autopsy', 'adcreative-ai', 'ecommerce', 'fraud-detection'],
          viewCount: 12847,
          shareCount: 234,
          conversionRate: 4.2
        },
        {
          id: '2',
          title: 'Case Study: TechFlow Achieves 340% ROAS Improvement',
          slug: 'case-study-techflow-roas-improvement',
          excerpt: 'How TechFlow Solutions transformed their SaaS marketing performance with AdGen AI\'s Full-Stack Marketing Brain.',
          author: 'AdGen AI Success Team',
          publishDate: '2025-01-12',
          readTime: '6 min read',
          status: 'published',
          category: 'case-study',
          tags: ['case-study', 'saas', 'success-story', 'roas'],
          viewCount: 8934,
          shareCount: 156,
          conversionRate: 6.8
        },
        {
          id: '3',
          title: 'Creatopy vs AdGen AI: Performance Analytics Comparison',
          slug: 'creatopy-vs-adgen-ai-analytics',
          excerpt: 'Why design tools without performance insights are costing marketers millions in missed opportunities.',
          author: 'AdGen AI Research Team',
          publishDate: '2025-01-10',
          readTime: '5 min read',
          status: 'published',
          category: 'comparison',
          tags: ['comparison', 'creatopy', 'analytics', 'performance'],
          viewCount: 6721,
          shareCount: 89,
          conversionRate: 3.1
        },
        {
          id: '4',
          title: 'The $84 Billion Ad Fraud Crisis: How AI Detection Saves Budgets',
          slug: 'ad-fraud-crisis-ai-detection-solution',
          excerpt: 'Deep dive into the global ad fraud epidemic and how intelligent detection systems protect marketing budgets.',
          author: 'AdGen AI Research Team',
          publishDate: '2025-01-08',
          readTime: '7 min read',
          status: 'draft',
          category: 'strategy',
          tags: ['fraud-detection', 'strategy', 'ai', 'budget-protection'],
          viewCount: 0,
          shareCount: 0,
          conversionRate: 0
        }
      ];

      const mockMetrics: ContentMetrics = {
        totalPosts: mockPosts.length,
        publishedPosts: mockPosts.filter(p => p.status === 'published').length,
        totalViews: mockPosts.reduce((sum, post) => sum + post.viewCount, 0),
        avgEngagement: 4.2,
        conversionRate: 4.7,
        topPerformingPost: mockPosts[0].title
      };

      setPosts(mockPosts);
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Failed to load content data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateWeeklyAutopsy = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cms-autopsy-generator/weekly-autopsy`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate autopsy');
      }

      const newAutopsy = await response.json();
      
      // Add to posts list
      setPosts(prev => [newAutopsy, ...prev]);
      
      console.log('✅ Generated new autopsy:', newAutopsy.title);
    } catch (error) {
      console.error('Failed to generate autopsy:', error);
      alert('Failed to generate autopsy. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredPosts = posts
    .filter(post => 
      (filterCategory === 'all' || post.category === filterCategory) &&
      (filterStatus === 'all' || post.status === filterStatus) &&
      (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content management system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Content Management</h1>
            <p className="text-gray-600">
              AI-powered content generation for competitive domination
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Export Analytics</span>
            </button>
            <button 
              onClick={generateWeeklyAutopsy}
              disabled={isGenerating}
              className="btn-primary flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  <span>Generate AI Autopsy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Metrics */}
        {metrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
          >
            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Posts</p>
                  <p className="text-3xl font-bold text-gray-900">{metrics.totalPosts}</p>
                  <p className="text-xs text-primary-600 font-medium">{metrics.publishedPosts} published</p>
                </div>
                <div className="bg-primary-100 p-3 rounded-xl">
                  <FileText className="w-8 h-8 text-primary-600" />
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Views</p>
                  <p className="text-3xl font-bold text-gray-900">{metrics.totalViews.toLocaleString()}</p>
                  <p className="text-xs text-success-600 font-medium">↗ +23% this month</p>
                </div>
                <div className="bg-success-100 p-3 rounded-xl">
                  <Eye className="w-8 h-8 text-success-600" />
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Engagement</p>
                  <p className="text-3xl font-bold text-gray-900">{metrics.avgEngagement}%</p>
                  <p className="text-xs text-warning-600 font-medium">Above industry avg</p>
                </div>
                <div className="bg-warning-100 p-3 rounded-xl">
                  <MessageSquare className="w-8 h-8 text-warning-600" />
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Conversion Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{metrics.conversionRate}%</p>
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
                  <p className="text-sm font-medium text-gray-600 mb-1">AI Generated</p>
                  <p className="text-3xl font-bold text-gray-900">87%</p>
                  <p className="text-xs text-primary-600 font-medium">Automation rate</p>
                </div>
                <div className="bg-primary-100 p-3 rounded-xl">
                  <Zap className="w-8 h-8 text-primary-600" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:flex-none lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Categories</option>
                <option value="autopsy">AI Ad Autopsy</option>
                <option value="case-study">Case Studies</option>
                <option value="comparison">Comparisons</option>
                <option value="strategy">Strategy</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Content Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-xl hover:scale-105 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    post.category === 'autopsy' ? 'bg-red-100 text-red-700' :
                    post.category === 'case-study' ? 'bg-success-100 text-success-700' :
                    post.category === 'comparison' ? 'bg-warning-100 text-warning-700' :
                    'bg-primary-100 text-primary-700'
                  }`}>
                    {post.category}
                  </span>
                  <span className={`w-3 h-3 rounded-full ${
                    post.status === 'published' ? 'bg-success-500' :
                    post.status === 'scheduled' ? 'bg-warning-500' :
                    'bg-gray-400'
                  }`}></span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                {post.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{post.author}</span>
                <span>{new Date(post.publishDate).toLocaleDateString()}</span>
              </div>

              {post.status === 'published' && (
                <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Views</p>
                    <p className="font-bold text-gray-900">{post.viewCount.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Shares</p>
                    <p className="font-bold text-gray-900">{post.shareCount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">CVR</p>
                    <p className="font-bold text-success-600">{post.conversionRate}%</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{post.readTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {post.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* AI Content Generation Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white mt-12"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2 flex items-center">
                <Brain className="w-8 h-8 mr-3" />
                AI Content Generation Engine
              </h3>
              <p className="opacity-90 mb-6">
                Automatically generate competitor analysis, case studies, and strategic content 
                to maintain thought leadership and drive organic acquisition.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Shield className="w-6 h-6 mb-2" />
                  <h4 className="font-semibold mb-1">Weekly Autopsies</h4>
                  <p className="text-sm opacity-90">Automated competitor failure analysis</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Target className="w-6 h-6 mb-2" />
                  <h4 className="font-semibold mb-1">Case Studies</h4>
                  <p className="text-sm opacity-90">Success story generation from data</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <BarChart3 className="w-6 h-6 mb-2" />
                  <h4 className="font-semibold mb-1">SEO Optimization</h4>
                  <p className="text-sm opacity-90">Keyword targeting and ranking</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <button 
                onClick={generateWeeklyAutopsy}
                disabled={isGenerating}
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Generate Autopsy
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                Schedule Content
              </button>
            </div>
          </div>
        </motion.div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No content found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
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