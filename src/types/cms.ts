export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  content: string;
  excerpt: string;
  author: string;
  publishDate: string;
  readTime: string;
  status: 'draft' | 'published' | 'archived';
  category: 'autopsy' | 'strategy' | 'case-study' | 'industry-news';
  tags: string[];
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  viewCount: number;
  shareCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AutopsyPost extends BlogPost {
  category: 'autopsy';
  competitorName: string;
  campaignBudget: number;
  performanceMetrics: {
    initialCtr: number;
    finalCtr: number;
    initialCpa: number;
    finalCpa: number;
    fraudPercentage: number;
    wastedSpend: number;
  };
  keyFailures: string[];
  adgenSolution: {
    title: string;
    description: string;
    features: string[];
    estimatedSavings: number;
  };
}

export interface CaseStudyPost extends BlogPost {
  category: 'case-study';
  clientName: string;
  industry: string;
  challenge: string;
  solution: string;
  results: {
    roasImprovement: number;
    costReduction: number;
    timeframe: string;
    additionalMetrics: Record<string, string>;
  };
  testimonial: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
}

export interface ContentTemplate {
  id: string;
  name: string;
  type: 'autopsy' | 'case-study' | 'comparison';
  template: string;
  variables: string[];
  description: string;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: Record<string, any>;
}