import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

interface AutopsyGenerationRequest {
  competitorName: string;
  industry: string;
  campaignBudget: number;
  timeframe: string;
  performanceData?: {
    initialCtr: number;
    finalCtr: number;
    initialCpa: number;
    finalCpa: number;
    fraudPercentage: number;
  };
}

interface AutopsyPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  publishDate: string;
  readTime: string;
  category: string;
  tags: string[];
  seoData: {
    title: string;
    description: string;
    keywords: string[];
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (req.method === 'POST' && req.url.includes('/generate-autopsy')) {
      const request: AutopsyGenerationRequest = await req.json()
      
      console.log('📝 Generating AI Ad Autopsy for:', request.competitorName)
      
      const autopsyPost = await generateAutopsyPost(request)
      
      // In production, save to CMS database
      console.log('✅ Generated autopsy:', autopsyPost.title)
      
      return new Response(
        JSON.stringify(autopsyPost),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    if (req.method === 'GET' && req.url.includes('/weekly-autopsy')) {
      // Generate automated weekly autopsy
      const weeklyAutopsy = await generateWeeklyAutopsy()
      
      return new Response(
        JSON.stringify(weeklyAutopsy),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    throw new Error('Invalid endpoint')
  } catch (error) {
    console.error('🚨 CMS generation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

async function generateAutopsyPost(request: AutopsyGenerationRequest): Promise<AutopsyPost> {
  const performanceData = request.performanceData || generateMockPerformanceData()
  
  // Calculate key metrics
  const performanceDecay = ((performanceData.initialCtr - performanceData.finalCtr) / performanceData.initialCtr * 100)
  const cpaIncrease = ((performanceData.finalCpa - performanceData.initialCpa) / performanceData.initialCpa * 100)
  const wastedSpend = request.campaignBudget * 0.4
  const fraudCost = request.campaignBudget * (performanceData.fraudPercentage / 100)
  
  const title = `Autopsy: ${request.competitorName} Campaign Disaster - $${request.campaignBudget.toLocaleString()} Lost in ${request.timeframe}`
  const slug = generateSlug(`autopsy-${request.competitorName}-${request.industry}-disaster`)
  
  const content = generateAutopsyContent({
    ...request,
    performanceData,
    performanceDecay: performanceDecay.toFixed(1),
    cpaIncrease: cpaIncrease.toFixed(1),
    wastedSpend: wastedSpend.toFixed(0),
    fraudCost: fraudCost.toFixed(0),
    totalSavings: (fraudCost * 0.85 + wastedSpend * 0.4).toFixed(0)
  })
  
  const excerpt = `A forensic analysis of a $${request.campaignBudget.toLocaleString()} ${request.industry} campaign that collapsed due to ${request.competitorName}'s platform limitations, resulting in ${performanceDecay.toFixed(1)}% performance decay.`
  
  return {
    id: crypto.randomUUID(),
    title,
    slug,
    content,
    excerpt,
    publishDate: new Date().toISOString(),
    readTime: calculateReadTime(content),
    category: 'autopsy',
    tags: ['autopsy', 'competitor-analysis', request.competitorName.toLowerCase(), request.industry.toLowerCase()],
    seoData: {
      title: `${request.competitorName} Campaign Failure Analysis - AdGen AI`,
      description: excerpt,
      keywords: [
        `${request.competitorName} alternative`,
        'campaign failure analysis',
        'ad fraud detection',
        'performance prediction',
        request.industry.toLowerCase() + ' marketing'
      ]
    }
  }
}

async function generateWeeklyAutopsy(): Promise<AutopsyPost> {
  const competitors = ['AdCreative.ai', 'Creatopy', 'Smartly.io', 'Canva Pro']
  const industries = ['E-commerce', 'SaaS', 'Healthcare', 'Finance', 'Education']
  
  const selectedCompetitor = competitors[Math.floor(Math.random() * competitors.length)]
  const selectedIndustry = industries[Math.floor(Math.random() * industries.length)]
  
  const request: AutopsyGenerationRequest = {
    competitorName: selectedCompetitor,
    industry: selectedIndustry,
    campaignBudget: Math.floor(Math.random() * 50000) + 10000,
    timeframe: '14 days',
    performanceData: generateMockPerformanceData()
  }
  
  return generateAutopsyPost(request)
}

function generateMockPerformanceData() {
  const initialCtr = Number((Math.random() * 2 + 2).toFixed(2))
  const finalCtr = Number((Math.random() * 0.8 + 0.3).toFixed(2))
  const initialCpa = Number((Math.random() * 10 + 15).toFixed(2))
  const finalCpa = Number((Math.random() * 40 + 60).toFixed(2))
  const fraudPercentage = Number((Math.random() * 30 + 15).toFixed(1))
  
  return {
    initialCtr,
    finalCtr,
    initialCpa,
    finalCpa,
    fraudPercentage
  }
}

function generateAutopsyContent(data: any): string {
  return `
# ${data.title}

## Executive Summary

A comprehensive forensic analysis of a ${data.industry} campaign that used ${data.competitorName}'s platform, resulting in catastrophic performance decay and $${data.wastedSpend} in wasted ad spend due to preventable failures.

## Campaign Overview

**Industry**: ${data.industry}  
**Platform**: ${data.competitorName}  
**Budget**: $${data.campaignBudget.toLocaleString()}  
**Duration**: ${data.timeframe}  
**Outcome**: Complete performance collapse

## Performance Deterioration Analysis

### Initial Performance
- **CTR**: ${data.performanceData.initialCtr}%
- **CPA**: $${data.performanceData.initialCpa}
- **Status**: Promising start

### Final Performance  
- **CTR**: ${data.performanceData.finalCtr}% (${data.performanceDecay}% decline)
- **CPA**: $${data.performanceData.finalCpa} (${data.cpaIncrease}% increase)
- **Fraud Rate**: ${data.performanceData.fraudPercentage}%
- **Wasted Spend**: $${data.wastedSpend}

## Critical Failure Points

### 1. Template Monotony
${data.competitorName}'s templated approach created visual fatigue within days. All creatives shared identical structural patterns, leading to audience saturation.

### 2. Zero Fraud Protection
${data.performanceData.fraudPercentage}% of traffic was fraudulent - bot clicks and invalid traffic that went completely undetected, inflating true CPA by $${data.fraudCost}.

### 3. No Performance Prediction
Campaign launched blind with no success indicators, leading to $${data.wastedSpend} in preventable waste.

## The Hidden Fraud Tax

Our analysis revealed that ${data.performanceData.fraudPercentage}% of campaign traffic was fraudulent:
- **Bot Traffic**: ${(data.performanceData.fraudPercentage * 0.6).toFixed(1)}%
- **Click Farms**: ${(data.performanceData.fraudPercentage * 0.25).toFixed(1)}%
- **Invalid Clicks**: ${(data.performanceData.fraudPercentage * 0.15).toFixed(1)}%
- **Total Fraud Cost**: $${data.fraudCost}

## How AdGen AI Prevents This Disaster

### Fraud Shield Protection
- Real-time bot detection and blocking
- Device fingerprinting analysis
- Geographic risk assessment
- Behavioral pattern recognition

### Performance Prediction Engine
Our AI would have flagged this campaign's issues before launch:
- **Pre-launch Score**: 25/100 (High Risk)
- **Fraud Risk**: ${data.performanceData.fraudPercentage}% (Above threshold)
- **Recommendation**: Campaign restructure required

### Estimated Savings with AdGen AI
- **Fraud Prevention**: $${(data.fraudCost * 0.85).toFixed(0)}
- **Performance Optimization**: $${(data.wastedSpend * 0.4).toFixed(0)}
- **Total Savings**: $${data.totalSavings}

## Key Takeaways

1. **Template-based tools create visual monotony** that accelerates ad fatigue
2. **Lack of fraud detection** can inflate campaign costs by 30-50%
3. **Performance prediction** is essential for preventing costly failures
4. **Real-time monitoring** enables rapid optimization

## Conclusion

This campaign disaster was entirely preventable with proper fraud detection and performance prediction. AdGen AI's Full-Stack Marketing Brain would have identified every failure point before a single dollar was wasted.

**Ready to prevent your own campaign disasters?** [Start your free migration today](/migration) and get our 90-day performance guarantee.
  `
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min read`
}