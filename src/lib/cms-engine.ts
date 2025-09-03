import { supabase } from './supabase';
import type { BlogPost, AutopsyPost, CaseStudyPost, ContentTemplate, SEOData } from '../types/cms';

export class CMSEngine {
  async createBlogPost(post: Partial<BlogPost>): Promise<BlogPost> {
    const slug = this.generateSlug(post.title || '');
    const readTime = this.calculateReadTime(post.content || '');
    
    const newPost: BlogPost = {
      id: crypto.randomUUID(),
      title: post.title || '',
      slug,
      subtitle: post.subtitle || '',
      content: post.content || '',
      excerpt: post.excerpt || this.generateExcerpt(post.content || ''),
      author: post.author || 'AdGen AI Research Team',
      publishDate: post.publishDate || new Date().toISOString(),
      readTime,
      status: post.status || 'draft',
      category: post.category || 'strategy',
      tags: post.tags || [],
      featuredImage: post.featuredImage,
      seoTitle: post.seoTitle || post.title,
      seoDescription: post.seoDescription || this.generateExcerpt(post.content || ''),
      viewCount: 0,
      shareCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // In production, save to database
    console.log('Blog post created:', newPost.title);
    return newPost;
  }

  async generateAutopsyPost(competitorData: {
    competitorName: string;
    campaignBudget: number;
    performanceMetrics: any;
    keyFailures: string[];
  }): Promise<AutopsyPost> {
    const template = await this.getTemplate('autopsy');
    const content = this.populateTemplate(template, competitorData);
    
    const autopsyPost: AutopsyPost = {
      id: crypto.randomUUID(),
      title: `Autopsy: How ${competitorData.competitorName} Campaign Lost $${competitorData.campaignBudget.toLocaleString()}`,
      slug: this.generateSlug(`autopsy-${competitorData.competitorName}-campaign-failure`),
      subtitle: `A deep-dive analysis of campaign failures and how AdGen AI prevents these disasters`,
      content,
      excerpt: this.generateExcerpt(content),
      author: 'AdGen AI Research Team',
      publishDate: new Date().toISOString(),
      readTime: this.calculateReadTime(content),
      status: 'draft',
      category: 'autopsy',
      tags: ['autopsy', 'competitor-analysis', competitorData.competitorName.toLowerCase()],
      competitorName: competitorData.competitorName,
      campaignBudget: competitorData.campaignBudget,
      performanceMetrics: competitorData.performanceMetrics,
      keyFailures: competitorData.keyFailures,
      adgenSolution: {
        title: 'How AdGen AI Prevents This Disaster',
        description: 'Our Full-Stack Marketing Brain identifies and prevents every failure point',
        features: [
          'Fraud Shield: Real-time bot detection',
          'Performance Prediction: Pre-launch scoring',
          'Creative Diversity Engine: Prevents fatigue patterns',
          'Attribution Intelligence: True ROI tracking'
        ],
        estimatedSavings: competitorData.campaignBudget * 0.4
      },
      viewCount: 0,
      shareCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return autopsyPost;
  }

  async generateCaseStudyPost(clientData: {
    clientName: string;
    industry: string;
    challenge: string;
    results: any;
    testimonial: any;
  }): Promise<CaseStudyPost> {
    const template = await this.getTemplate('case-study');
    const content = this.populateTemplate(template, clientData);

    const caseStudyPost: CaseStudyPost = {
      id: crypto.randomUUID(),
      title: `Case Study: ${clientData.clientName} Achieves ${clientData.results.roasImprovement}% ROAS Improvement`,
      slug: this.generateSlug(`case-study-${clientData.clientName}-success`),
      subtitle: `How ${clientData.clientName} transformed their marketing performance with AdGen AI`,
      content,
      excerpt: this.generateExcerpt(content),
      author: 'AdGen AI Success Team',
      publishDate: new Date().toISOString(),
      readTime: this.calculateReadTime(content),
      status: 'draft',
      category: 'case-study',
      tags: ['case-study', 'success-story', clientData.industry.toLowerCase()],
      clientName: clientData.clientName,
      industry: clientData.industry,
      challenge: clientData.challenge,
      solution: 'AdGen AI Full-Stack Marketing Brain implementation',
      results: clientData.results,
      testimonial: clientData.testimonial,
      viewCount: 0,
      shareCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return caseStudyPost;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private calculateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  }

  private generateExcerpt(content: string, maxLength: number = 160): string {
    const plainText = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength).trim() + '...'
      : plainText;
  }

  private async getTemplate(type: string): Promise<string> {
    const templates = {
      'autopsy': `
# {{title}}

## Executive Summary
{{summary}}

## Campaign Analysis
**Budget**: ${{campaignBudget}}
**Competitor**: {{competitorName}}
**Duration**: {{duration}}

### Performance Decline
{{performanceAnalysis}}

### Key Failure Points
{{#each keyFailures}}
- {{this}}
{{/each}}

### The Hidden Costs
{{fraudAnalysis}}

## How AdGen AI Prevents This
{{adgenSolution}}

### Estimated Savings
With AdGen AI's integrated fraud detection and performance prediction, this campaign could have saved **${{estimatedSavings}}** in wasted spend.
      `,
      'case-study': `
# {{title}}

## Client Overview
**Company**: {{clientName}}
**Industry**: {{industry}}
**Challenge**: {{challenge}}

## The Solution
{{solution}}

## Results Achieved
{{#each results}}
- **{{@key}}**: {{this}}
{{/each}}

## Client Testimonial
> "{{testimonial.quote}}"
> 
> — {{testimonial.author}}, {{testimonial.role}} at {{testimonial.company}}

## Key Takeaways
{{takeaways}}
      `
    };

    return templates[type as keyof typeof templates] || '';
  }

  private populateTemplate(template: string, data: any): string {
    // Simple template engine - in production, use Handlebars or similar
    let populated = template;
    
    for (const [key, value] of Object.entries(data)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      populated = populated.replace(regex, String(value));
    }

    return populated;
  }

  async publishPost(postId: string): Promise<void> {
    // In production, update database and trigger SEO/social sharing
    console.log('Publishing post:', postId);
  }

  async schedulePost(postId: string, publishDate: Date): Promise<void> {
    // In production, add to publishing queue
    console.log('Scheduling post:', postId, 'for', publishDate);
  }

  async generateSEOData(post: BlogPost): Promise<SEOData> {
    return {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      keywords: [
        ...post.tags,
        'AI ad creative',
        'performance marketing',
        'fraud detection',
        'attribution analysis'
      ],
      canonicalUrl: `https://adgen.ai/blog/${post.slug}`,
      ogImage: post.featuredImage,
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': post.title,
        'description': post.excerpt,
        'author': {
          '@type': 'Organization',
          'name': post.author
        },
        'datePublished': post.publishDate,
        'dateModified': post.updatedAt.toISOString()
      }
    };
  }

  async getAnalytics(postId: string): Promise<{
    views: number;
    shares: number;
    engagement: number;
    conversionRate: number;
  }> {
    // In production, fetch from analytics service
    return {
      views: Math.floor(Math.random() * 10000) + 1000,
      shares: Math.floor(Math.random() * 500) + 50,
      engagement: Math.random() * 0.1 + 0.05,
      conversionRate: Math.random() * 0.05 + 0.02
    };
  }
}

// Singleton instance
export const cmsEngine = new CMSEngine();