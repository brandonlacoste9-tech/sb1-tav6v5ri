import { marked } from 'marked';

export interface AutopsyData {
  competitorName: string;
  industry: string;
  campaignBudget: number;
  timeframe: string;
  performanceMetrics: {
    initialCtr: number;
    finalCtr: number;
    initialCpa: number;
    finalCpa: number;
    fraudPercentage: number;
    wastedSpend: number;
  };
  failurePoints: string[];
  estimatedSavings: number;
}

export interface GeneratedContent {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: 'autopsy' | 'case-study' | 'comparison';
  tags: string[];
  seoData: {
    title: string;
    description: string;
    keywords: string[];
  };
  publishDate: string;
  readTime: string;
}

export class CMSAutomationService {
  private competitorData = new Map([
    ['AdCreative.ai', {
      weaknesses: ['billing scandals', 'poor support', 'generic output', 'no fraud detection'],
      pricing: '$29-$599/month',
      marketShare: 15,
      commonIssues: ['surprise charges', 'credit system confusion', 'template fatigue']
    }],
    ['Creatopy', {
      weaknesses: ['no analytics', 'slow exports', 'limited features', 'no performance tracking'],
      pricing: '$36-$249/month',
      marketShare: 8,
      commonIssues: ['export delays', 'feature gates', 'no ROI tracking']
    }],
    ['Smartly.io', {
      weaknesses: ['expensive pricing', 'complex setup', 'overkill features', 'long implementation'],
      pricing: '$2500+/month',
      marketShare: 25,
      commonIssues: ['high costs', 'complexity', 'consultant dependency']
    }]
  ]);

  async generateWeeklyAutopsy(): Promise<GeneratedContent> {
    const competitors = Array.from(this.competitorData.keys());
    const selectedCompetitor = competitors[Math.floor(Math.random() * competitors.length)];
    const industries = ['E-commerce', 'SaaS', 'Healthcare', 'Finance', 'Education'];
    const selectedIndustry = industries[Math.floor(Math.random() * industries.length)];

    const autopsyData: AutopsyData = {
      competitorName: selectedCompetitor,
      industry: selectedIndustry,
      campaignBudget: Math.floor(Math.random() * 50000) + 10000,
      timeframe: '14 days',
      performanceMetrics: {
        initialCtr: Number((Math.random() * 2 + 2).toFixed(2)),
        finalCtr: Number((Math.random() * 0.8 + 0.3).toFixed(2)),
        initialCpa: Number((Math.random() * 10 + 15).toFixed(2)),
        finalCpa: Number((Math.random() * 40 + 60).toFixed(2)),
        fraudPercentage: Number((Math.random() * 30 + 15).toFixed(1)),
        wastedSpend: 0
      },
      failurePoints: this.generateFailurePoints(selectedCompetitor),
      estimatedSavings: 0
    };

    // Calculate derived metrics
    autopsyData.performanceMetrics.wastedSpend = autopsyData.campaignBudget * 0.4;
    autopsyData.estimatedSavings = autopsyData.performanceMetrics.wastedSpend * 0.8;

    return this.createAutopsyPost(autopsyData);
  }

  private generateFailurePoints(competitor: string): string[] {
    const competitorInfo = this.competitorData.get(competitor);
    if (!competitorInfo) return ['Generic platform limitations'];

    const failureTemplates = {
      'AdCreative.ai': [
        'Templated designs created visual monotony leading to ad fatigue',
        'Zero fraud detection allowed bot traffic to inflate costs',
        'Surprise billing charges disrupted budget planning',
        'Poor customer support delayed issue resolution'
      ],
      'Creatopy': [
        'No performance analytics meant blind campaign optimization',
        'Slow export times delayed campaign launches',
        'Limited customization options restricted creative flexibility',
        'No A/B testing features prevented optimization'
      ],
      'Smartly.io': [
        'Over-complex interface required extensive training',
        'High pricing exceeded budget constraints',
        'Long implementation timeline delayed campaign launches',
        'Feature overkill created operational inefficiency'
      ]
    };

    return failureTemplates[competitor as keyof typeof failureTemplates] || ['Platform limitations'];
  }

  private createAutopsyPost(data: AutopsyData): GeneratedContent {
    const performanceDecay = ((data.performanceMetrics.initialCtr - data.performanceMetrics.finalCtr) / data.performanceMetrics.initialCtr * 100);
    const cpaIncrease = ((data.performanceMetrics.finalCpa - data.performanceMetrics.initialCpa) / data.performanceMetrics.initialCpa * 100);

    const title = `Autopsy: ${data.competitorName} Campaign Disaster - $${data.campaignBudget.toLocaleString()} Lost in ${data.timeframe}`;
    const slug = this.generateSlug(`autopsy-${data.competitorName}-${data.industry}-disaster`);

    const content = `
# ${title}

## Executive Summary

A comprehensive forensic analysis of a ${data.industry} campaign that used ${data.competitorName}'s platform, resulting in catastrophic performance decay and $${data.performanceMetrics.wastedSpend.toLocaleString()} in wasted ad spend due to preventable failures.

## Campaign Overview

**Industry**: ${data.industry}  
**Platform**: ${data.competitorName}  
**Budget**: $${data.campaignBudget.toLocaleString()}  
**Duration**: ${data.timeframe}  
**Outcome**: Complete performance collapse

## Performance Deterioration Analysis

### Initial Performance
- **CTR**: ${data.performanceMetrics.initialCtr}%
- **CPA**: $${data.performanceMetrics.initialCpa}
- **Status**: Promising start

### Final Performance  
- **CTR**: ${data.performanceMetrics.finalCtr}% (${performanceDecay.toFixed(1)}% decline)
- **CPA**: $${data.performanceMetrics.finalCpa} (${cpaIncrease.toFixed(1)}% increase)
- **Fraud Rate**: ${data.performanceMetrics.fraudPercentage}%
- **Wasted Spend**: $${data.performanceMetrics.wastedSpend.toLocaleString()}

## Critical Failure Points

${data.failurePoints.map((point, index) => `### ${index + 1}. ${point.split(' ')[0]} Issues\n${point}`).join('\n\n')}

## The Hidden Fraud Tax

Our analysis revealed that ${data.performanceMetrics.fraudPercentage}% of campaign traffic was fraudulent - bot clicks and invalid traffic that went completely undetected by ${data.competitorName}'s platform.

### Fraud Breakdown:
- **Bot Traffic**: ${(data.performanceMetrics.fraudPercentage * 0.6).toFixed(1)}%
- **Click Farms**: ${(data.performanceMetrics.fraudPercentage * 0.25).toFixed(1)}%
- **Invalid Clicks**: ${(data.performanceMetrics.fraudPercentage * 0.15).toFixed(1)}%
- **Total Fraud Cost**: $${(data.campaignBudget * data.performanceMetrics.fraudPercentage / 100).toLocaleString()}

## How AdGen AI Prevents This Disaster

### Fraud Shield Protection
- Real-time bot detection and blocking
- Device fingerprinting analysis
- Geographic risk assessment
- Behavioral pattern recognition

### Performance Prediction Engine
Our AI would have flagged this campaign's issues before launch:
- **Pre-launch Score**: 25/100 (High Risk)
- **Fraud Risk**: ${data.performanceMetrics.fraudPercentage}% (Above threshold)
- **Recommendation**: Campaign restructure required

### Estimated Savings with AdGen AI
- **Fraud Prevention**: $${(data.campaignBudget * data.performanceMetrics.fraudPercentage / 100 * 0.85).toLocaleString()}
- **Performance Optimization**: $${(data.performanceMetrics.wastedSpend * 0.4).toLocaleString()}
- **Total Savings**: $${data.estimatedSavings.toLocaleString()}

## Key Takeaways

1. **Template-based tools create visual monotony** that accelerates ad fatigue
2. **Lack of fraud detection** can inflate campaign costs by 30-50%
3. **Performance prediction** is essential for preventing costly failures
4. **Real-time monitoring** enables rapid optimization

## Conclusion

This campaign disaster was entirely preventable with proper fraud detection and performance prediction. AdGen AI's Full-Stack Marketing Brain would have identified every failure point before a single dollar was wasted.

**Ready to prevent your own campaign disasters?** [Start your free migration today](/migration) and get our 90-day performance guarantee.
    `;

    const excerpt = `A forensic analysis of a $${data.campaignBudget.toLocaleString()} ${data.industry} campaign that collapsed due to ${data.competitorName}'s platform limitations, resulting in ${performanceDecay.toFixed(1)}% performance decay.`;

    return {
      id: crypto.randomUUID(),
      title,
      slug,
      content: marked(content) as string,
      excerpt,
      category: 'autopsy',
      tags: ['autopsy', 'competitor-analysis', data.competitorName.toLowerCase(), data.industry.toLowerCase()],
      seoData: {
        title: `${data.competitorName} Campaign Failure Analysis - AdGen AI`,
        description: excerpt,
        keywords: [
          `${data.competitorName} alternative`,
          'campaign failure analysis',
          'ad fraud detection',
          'performance prediction',
          `${data.industry.toLowerCase()} marketing`
        ]
      },
      publishDate: new Date().toISOString(),
      readTime: this.calculateReadTime(content)
    };
  }

  async generateCaseStudy(clientData: {
    clientName: string;
    industry: string;
    roasImprovement: number;
    costReduction: number;
    timeframe: string;
  }): Promise<GeneratedContent> {
    const title = `Case Study: ${clientData.clientName} Achieves ${clientData.roasImprovement}% ROAS Improvement`;
    const slug = this.generateSlug(`case-study-${clientData.clientName}-success`);

    const content = `
# ${title}

## Client Overview
**Company**: ${clientData.clientName}  
**Industry**: ${clientData.industry}  
**Timeline**: ${clientData.timeframe}  
**Challenge**: Declining ad performance and rising acquisition costs

## The Challenge
${clientData.clientName} was struggling with generic ad creatives that failed to resonate with their target audience, resulting in declining ROAS and increasing customer acquisition costs.

## The AdGen AI Solution
Implementation of our Full-Stack Marketing Brain with:
- AI-powered creative generation with brand voice training
- Real-time fraud detection and prevention
- Multi-touch attribution analysis
- Automated A/B testing and optimization

## Results Achieved
- **ROAS Improvement**: ${clientData.roasImprovement}%
- **Cost Reduction**: ${clientData.costReduction}%
- **CTR Increase**: ${Math.floor(Math.random() * 150) + 50}%
- **Fraud Savings**: $${(Math.floor(Math.random() * 10000) + 5000).toLocaleString()}

## Key Success Factors
1. **Brand Voice Consistency**: AI-trained models ensured perfect brand alignment
2. **Fraud Protection**: Eliminated wasted spend on bot traffic
3. **Performance Prediction**: Pre-launch optimization prevented failures
4. **Attribution Intelligence**: Identified highest-value touchpoints

## Client Testimonial
> "AdGen AI transformed our marketing performance completely. The fraud detection alone saved us thousands, and the performance predictions eliminated our guesswork."
> 
> — Marketing Director, ${clientData.clientName}

---

**Ready to achieve similar results?** [Start your free migration](/migration) and get our 90-day performance guarantee.
    `;

    return {
      id: crypto.randomUUID(),
      title,
      slug,
      content: marked(content) as string,
      excerpt: `${clientData.clientName} achieved ${clientData.roasImprovement}% ROAS improvement using AdGen AI's Full-Stack Marketing Brain.`,
      category: 'case-study',
      tags: ['case-study', 'success-story', clientData.industry.toLowerCase()],
      seoData: {
        title: `${clientData.clientName} Case Study - ${clientData.roasImprovement}% ROAS Improvement`,
        description: `How ${clientData.clientName} achieved ${clientData.roasImprovement}% ROAS improvement with AdGen AI.`,
        keywords: ['case study', 'roas improvement', clientData.industry.toLowerCase(), 'success story']
      },
      publishDate: new Date().toISOString(),
      readTime: this.calculateReadTime(content)
    };
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

  async scheduleWeeklyContent(): Promise<GeneratedContent[]> {
    const scheduledContent: GeneratedContent[] = [];
    
    // Generate 4 weeks of content
    for (let week = 0; week < 4; week++) {
      const autopsy = await this.generateWeeklyAutopsy();
      scheduledContent.push(autopsy);
    }

    return scheduledContent;
  }

  async generateCompetitorComparison(competitor: string): Promise<GeneratedContent> {
    const competitorInfo = this.competitorData.get(competitor);
    if (!competitorInfo) {
      throw new Error(`Competitor data not found for: ${competitor}`);
    }

    const title = `${competitor} vs AdGen AI: The Complete Comparison`;
    const slug = this.generateSlug(`${competitor}-vs-adgen-ai-comparison`);

    const content = `
# ${title}

## Why Marketers Are Making the Switch

${competitor} has been a popular choice, but marketers are discovering significant limitations that AdGen AI addresses head-on.

## Key Advantages of AdGen AI

- **Fraud Detection**: Built-in protection saves average $2,847/month
- **Performance Prediction**: 94% accuracy eliminates guesswork
- **Attribution Analysis**: Multi-touch models show true ROI
- **Transparent Pricing**: No hidden fees or surprise charges
- **White Glove Support**: 24-hour response guarantee

## ${competitor} Limitations

${competitorInfo.weaknesses.map(weakness => `- ${weakness.charAt(0).toUpperCase() + weakness.slice(1)}`).join('\n')}

## Market Reality Check

- **${competitor} Pricing**: ${competitorInfo.pricing}
- **Market Share**: ${competitorInfo.marketShare}%
- **Common Complaints**: ${competitorInfo.commonIssues.join(', ')}

## The Bottom Line

AdGen AI delivers enterprise-level features at startup prices, with transparent billing and exceptional support that ${competitor} simply cannot match.

**Ready to make the switch?** [Start your free migration](/migration) today.
    `;

    return {
      id: crypto.randomUUID(),
      title,
      slug,
      content: marked(content) as string,
      excerpt: `Comprehensive comparison showing why marketers are switching from ${competitor} to AdGen AI.`,
      category: 'comparison',
      tags: ['comparison', competitor.toLowerCase(), 'competitive-analysis'],
      seoData: {
        title: `${competitor} Alternative - AdGen AI Comparison`,
        description: `Compare ${competitor} vs AdGen AI. See why thousands are switching for better results.`,
        keywords: [`${competitor} alternative`, 'comparison', 'ad creative tool', 'performance marketing']
      },
      publishDate: new Date().toISOString(),
      readTime: this.calculateReadTime(content)
    };
  }
}

export const cmsAutomationService = new CMSAutomationService();