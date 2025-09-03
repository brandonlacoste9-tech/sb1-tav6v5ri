import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

interface TouchPoint {
  id: string;
  userId: string;
  creativeId: string;
  campaignId: string;
  platform: string;
  touchpointType: 'impression' | 'click' | 'conversion';
  timestamp: string;
  value?: number;
  metadata?: Record<string, any>;
}

interface AttributionRequest {
  campaignIds: string[];
  model: 'first-touch' | 'last-touch' | 'linear' | 'time-decay' | 'position-based';
  timeRange: {
    start: string;
    end: string;
  };
  userId: string;
}

interface AttributionResult {
  creativeId: string;
  attribution: number;
  revenue: number;
  conversions: number;
  touchpoints: number;
  performance: {
    ctr: number;
    conversionRate: number;
    averageOrderValue: number;
    customerLifetimeValue: number;
  };
  journey: {
    averageTouchpoints: number;
    averageTimeToPurchase: number;
    topChannels: string[];
  };
}

interface AttributionAnalysis {
  model: string;
  results: AttributionResult[];
  totalRevenue: number;
  totalConversions: number;
  insights: string[];
  recommendations: string[];
  summary: {
    topPerformer: string;
    avgTouchpoints: number;
    totalROI: number;
    revenueConcentration: number;
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

    const url = new URL(req.url)
    
    if (req.method === 'POST' && url.pathname.includes('/record-touchpoint')) {
      // Record new touchpoint
      const touchpoint: TouchPoint = await req.json()
      
      console.log('📊 Recording advanced touchpoint:', touchpoint.touchpointType, touchpoint.platform)
      
      // In production, store in high-performance analytics database (ClickHouse, BigQuery)
      // For now, simulate storage
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          touchpointId: touchpoint.id,
          timestamp: new Date().toISOString()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    if (req.method === 'POST' && url.pathname.includes('/analyze-attribution')) {
      // Perform advanced attribution analysis
      const { campaignIds, model, timeRange, userId }: AttributionRequest = await req.json()
      
      console.log('🎯 Advanced Attribution Analysis for campaigns:', campaignIds, 'using model:', model)
      
      const analysis = await performAdvancedAttributionAnalysis(campaignIds, model, timeRange, userId)
      
      return new Response(
        JSON.stringify(analysis),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    if (req.method === 'GET' && url.pathname.includes('/compare-models')) {
      // Compare multiple attribution models
      const campaignIds = url.searchParams.get('campaigns')?.split(',') || []
      const userId = url.searchParams.get('userId') || ''
      
      const comparison = await compareAttributionModels(campaignIds, userId)
      
      return new Response(
        JSON.stringify(comparison),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    throw new Error('Invalid endpoint or method')
  } catch (error) {
    console.error('🚨 Attribution analytics error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        fallback: getFallbackAttribution()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

async function performAdvancedAttributionAnalysis(
  campaignIds: string[], 
  model: string, 
  timeRange: any,
  userId: string
): Promise<AttributionAnalysis> {
  // Generate sophisticated attribution analysis
  const mockTouchpoints = generateAdvancedTouchpoints(campaignIds, timeRange)
  const userJourneys = groupTouchpointsByUser(mockTouchpoints)
  const attributionResults = calculateAdvancedAttribution(userJourneys, model)
  
  const totalRevenue = attributionResults.reduce((sum, result) => sum + result.revenue, 0)
  const totalConversions = attributionResults.reduce((sum, result) => sum + result.conversions, 0)
  
  const insights = generateAdvancedInsights(attributionResults, model, userJourneys)
  const recommendations = generateStrategicRecommendations(attributionResults)
  const summary = generateAdvancedSummary(attributionResults)
  
  return {
    model,
    results: attributionResults,
    totalRevenue,
    totalConversions,
    insights,
    recommendations,
    summary
  }
}

function generateAdvancedTouchpoints(campaignIds: string[], timeRange: any): TouchPoint[] {
  const touchpoints: TouchPoint[] = []
  const platforms = ['facebook', 'instagram', 'google', 'tiktok', 'linkedin', 'email', 'organic']
  
  // Generate realistic complex user journeys
  for (let userId = 1; userId <= 150; userId++) {
    const journeyLength = Math.floor(Math.random() * 8) + 2 // 2-9 touchpoints
    const startTime = new Date(timeRange.start).getTime()
    const endTime = new Date(timeRange.end).getTime()
    
    for (let i = 0; i < journeyLength; i++) {
      const timestamp = new Date(startTime + (endTime - startTime) * (i / journeyLength) + Math.random() * 86400000)
      const campaignId = campaignIds[Math.floor(Math.random() * campaignIds.length)]
      const platform = platforms[Math.floor(Math.random() * platforms.length)]
      
      let touchpointType: 'impression' | 'click' | 'conversion' = 'impression'
      if (i > 0 && Math.random() > 0.6) touchpointType = 'click'
      if (i === journeyLength - 1 && Math.random() > 0.75) touchpointType = 'conversion'
      
      touchpoints.push({
        id: crypto.randomUUID(),
        userId: `user_${userId}`,
        creativeId: `creative_${campaignId}_${platform}`,
        campaignId,
        platform,
        touchpointType,
        timestamp: timestamp.toISOString(),
        value: touchpointType === 'conversion' ? Math.random() * 200 + 25 : undefined,
        metadata: {
          deviceType: Math.random() > 0.6 ? 'mobile' : 'desktop',
          adPosition: Math.random() > 0.5 ? 'feed' : 'sidebar',
          timeOnPage: Math.random() * 300 + 30
        }
      })
    }
  }
  
  return touchpoints.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
}

function groupTouchpointsByUser(touchpoints: TouchPoint[]): Map<string, TouchPoint[]> {
  const userJourneys = new Map<string, TouchPoint[]>()
  
  for (const touchpoint of touchpoints) {
    const userTouchpoints = userJourneys.get(touchpoint.userId) || []
    userTouchpoints.push(touchpoint)
    userJourneys.set(touchpoint.userId, userTouchpoints)
  }
  
  // Sort each user's journey by timestamp
  for (const [userId, journey] of userJourneys) {
    journey.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    userJourneys.set(userId, journey)
  }
  
  return userJourneys
}

function calculateAdvancedAttribution(userJourneys: Map<string, TouchPoint[]>, model: string): AttributionResult[] {
  const creativeAttribution = new Map<string, any>()
  
  for (const [userId, journey] of userJourneys) {
    const conversions = journey.filter(tp => tp.touchpointType === 'conversion')
    
    for (const conversion of conversions) {
      const pathToConversion = journey.filter(tp => 
        new Date(tp.timestamp) <= new Date(conversion.timestamp) && tp.touchpointType !== 'conversion'
      )
      
      if (pathToConversion.length === 0) continue
      
      const attributionWeights = calculateAttributionWeights(pathToConversion, model)
      const conversionValue = conversion.value || 75
      const timeToPurchase = (new Date(conversion.timestamp).getTime() - new Date(pathToConversion[0].timestamp).getTime()) / (1000 * 60 * 60) // hours
      
      for (let i = 0; i < pathToConversion.length; i++) {
        const touchpoint = pathToConversion[i]
        const weight = attributionWeights[i]
        
        const current = creativeAttribution.get(touchpoint.creativeId) || {
          attribution: 0,
          revenue: 0,
          conversions: 0,
          touchpoints: 0,
          clicks: 0,
          impressions: 0,
          totalTimeToPurchase: 0,
          journeyCount: 0,
          platforms: new Set()
        }
        
        current.attribution += weight
        current.revenue += conversionValue * weight
        current.conversions += weight
        current.touchpoints += 1
        current.totalTimeToPurchase += timeToPurchase * weight
        current.journeyCount += weight
        current.platforms.add(touchpoint.platform)
        
        if (touchpoint.touchpointType === 'click') current.clicks += 1
        if (touchpoint.touchpointType === 'impression') current.impressions += 1
        
        creativeAttribution.set(touchpoint.creativeId, current)
      }
    }
  }
  
  // Convert to advanced results format
  return Array.from(creativeAttribution.entries()).map(([creativeId, data]) => {
    const avgTimeToPurchase = data.totalTimeToPurchase / Math.max(1, data.journeyCount)
    const avgTouchpoints = data.touchpoints / Math.max(1, data.journeyCount)
    
    return {
      creativeId,
      attribution: Number(data.attribution.toFixed(3)),
      revenue: Number(data.revenue.toFixed(2)),
      conversions: Number(data.conversions.toFixed(1)),
      touchpoints: data.touchpoints,
      performance: {
        ctr: data.clicks > 0 ? Number(((data.clicks / Math.max(1, data.impressions)) * 100).toFixed(2)) : 0,
        conversionRate: data.clicks > 0 ? Number(((data.conversions / data.clicks) * 100).toFixed(2)) : 0,
        averageOrderValue: data.conversions > 0 ? Number((data.revenue / data.conversions).toFixed(2)) : 0,
        customerLifetimeValue: data.conversions > 0 ? Number((data.revenue * 2.5 / data.conversions).toFixed(2)) : 0
      },
      journey: {
        averageTouchpoints: Number(avgTouchpoints.toFixed(1)),
        averageTimeToPurchase: Number(avgTimeToPurchase.toFixed(1)),
        topChannels: Array.from(data.platforms).slice(0, 3)
      }
    }
  })
}

function calculateAttributionWeights(touchpoints: TouchPoint[], model: string): number[] {
  const count = touchpoints.length
  if (count === 0) return []
  
  switch (model) {
    case 'first-touch':
      return touchpoints.map((_, i) => i === 0 ? 1 : 0)
    
    case 'last-touch':
      return touchpoints.map((_, i) => i === count - 1 ? 1 : 0)
    
    case 'linear':
      return touchpoints.map(() => 1 / count)
    
    case 'time-decay':
      return calculateTimeDecayWeights(touchpoints)
    
    case 'position-based':
      return calculatePositionBasedWeights(count)
    
    default:
      return touchpoints.map(() => 1 / count)
  }
}

function calculateTimeDecayWeights(touchpoints: TouchPoint[]): number[] {
  const lastTimestamp = new Date(touchpoints[touchpoints.length - 1].timestamp).getTime()
  const halfLife = 7 * 24 * 60 * 60 * 1000 // 7 days
  
  const weights = touchpoints.map(tp => {
    const timeDiff = lastTimestamp - new Date(tp.timestamp).getTime()
    return Math.exp(-timeDiff / halfLife)
  })
  
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
  return weights.map(weight => weight / totalWeight)
}

function calculatePositionBasedWeights(count: number): number[] {
  if (count === 1) return [1]
  if (count === 2) return [0.5, 0.5]
  
  const weights = new Array(count).fill(0)
  weights[0] = 0.4 // First touch gets 40%
  weights[count - 1] = 0.4 // Last touch gets 40%
  
  const middleWeight = 0.2 / (count - 2)
  for (let i = 1; i < count - 1; i++) {
    weights[i] = middleWeight
  }
  
  return weights
}

function generateAdvancedInsights(results: AttributionResult[], model: string, userJourneys: Map<string, TouchPoint[]>): string[] {
  const insights: string[] = []
  
  const topPerformer = results.reduce((max, current) => 
    current.revenue > max.revenue ? current : max, results[0]
  )
  
  if (topPerformer) {
    const revenueShare = (topPerformer.revenue / results.reduce((sum, r) => sum + r.revenue, 0)) * 100
    insights.push(`Creative ${topPerformer.creativeId} drives ${revenueShare.toFixed(1)}% of attributed revenue with ${topPerformer.performance.ctr}% CTR`)
  }
  
  // Journey complexity analysis
  const avgJourneyLength = Array.from(userJourneys.values())
    .reduce((sum, journey) => sum + journey.length, 0) / userJourneys.size
  
  if (avgJourneyLength > 6) {
    insights.push(`Complex customer journey detected (${avgJourneyLength.toFixed(1)} avg touchpoints) - implement nurture campaigns`)
  } else if (avgJourneyLength < 3) {
    insights.push(`Short customer journey (${avgJourneyLength.toFixed(1)} touchpoints) - direct response campaigns are highly effective`)
  }
  
  // Revenue concentration analysis
  const totalRevenue = results.reduce((sum, result) => sum + result.revenue, 0)
  const topThreeRevenue = results.sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3)
    .reduce((sum, result) => sum + result.revenue, 0)
  const concentration = (topThreeRevenue / totalRevenue) * 100
  
  if (concentration > 75) {
    insights.push(`High revenue concentration (${concentration.toFixed(1)}%) in top 3 creatives - diversification recommended`)
  }
  
  // Model-specific insights
  switch (model) {
    case 'first-touch':
      insights.push('First-touch attribution emphasizes awareness channels - optimize top-of-funnel investments')
      break
    case 'last-touch':
      insights.push('Last-touch attribution highlights conversion drivers - focus on bottom-funnel optimization')
      break
    case 'time-decay':
      insights.push('Time-decay model shows recent touchpoints drive most value - prioritize retargeting')
      break
    case 'position-based':
      insights.push('Position-based model balances awareness and conversion - optimize both funnel ends')
      break
    case 'linear':
      insights.push('Linear attribution provides balanced view - all touchpoints contribute equally')
      break
  }
  
  // Performance insights
  const avgCLV = results.reduce((sum, result) => sum + result.performance.customerLifetimeValue, 0) / results.length
  if (avgCLV > 200) {
    insights.push(`High customer lifetime value (${avgCLV.toFixed(0)}) detected - increase acquisition budget`)
  }
  
  return insights.slice(0, 6)
}

function generateStrategicRecommendations(results: AttributionResult[]): string[] {
  const recommendations: string[] = []
  
  const sortedResults = results.sort((a, b) => b.revenue - a.revenue)
  const topPerformers = sortedResults.slice(0, 3)
  const underperformers = sortedResults.slice(-2)
  
  if (topPerformers.length > 0) {
    recommendations.push(`Immediately scale budget for creative ${topPerformers[0].creativeId} (${topPerformers[0].performance.ctr}% CTR, ${topPerformers[0].performance.customerLifetimeValue.toFixed(0)} CLV)`)
  }
  
  if (underperformers.length > 0 && underperformers[0].revenue < sortedResults[0].revenue * 0.1) {
    recommendations.push(`Pause underperforming creative ${underperformers[0].creativeId} and reallocate budget to top performers`)
  }
  
  const totalRevenue = results.reduce((sum, result) => sum + result.revenue, 0)
  const revenueConcentration = topPerformers.reduce((sum, result) => sum + result.revenue, 0) / totalRevenue
  
  if (revenueConcentration > 0.8) {
    recommendations.push('Revenue highly concentrated - develop creative variations to reduce dependency risk')
  }
  
  // Journey optimization recommendations
  const avgTouchpoints = results.reduce((sum, result) => sum + result.journey.averageTouchpoints, 0) / results.length
  if (avgTouchpoints > 5) {
    recommendations.push('Long customer journey detected - implement retargeting sequences and nurture campaigns')
  }
  
  // Performance optimization
  const highCLVCreatives = results.filter(r => r.performance.customerLifetimeValue > 150)
  if (highCLVCreatives.length > 0) {
    recommendations.push(`Focus on high-CLV creatives: ${highCLVCreatives.map(c => c.creativeId).join(', ')} for long-term value`)
  }
  
  return recommendations.slice(0, 5)
}

function generateAdvancedSummary(results: AttributionResult[]) {
  const topPerformer = results.reduce((max, current) => 
    current.revenue > max.revenue ? current : max, results[0]
  )
  
  const avgTouchpoints = results.reduce((sum, result) => sum + result.journey.averageTouchpoints, 0) / results.length
  const totalRevenue = results.reduce((sum, result) => sum + result.revenue, 0)
  const totalSpend = totalRevenue / 4.2 // Assume 4.2:1 ROAS baseline
  
  const topThreeRevenue = results.sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3)
    .reduce((sum, result) => sum + result.revenue, 0)
  const revenueConcentration = (topThreeRevenue / totalRevenue) * 100

  return {
    topPerformer: topPerformer?.creativeId || 'N/A',
    avgTouchpoints: Number(avgTouchpoints.toFixed(1)),
    totalROI: Number((totalRevenue / totalSpend).toFixed(1)),
    revenueConcentration: Number(revenueConcentration.toFixed(1))
  }
}

async function compareAttributionModels(campaignIds: string[], userId: string): Promise<Record<string, AttributionAnalysis>> {
  const models = ['first-touch', 'last-touch', 'linear', 'time-decay', 'position-based']
  const timeRange = {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date().toISOString()
  }
  
  const results: Record<string, AttributionAnalysis> = {}
  
  for (const model of models) {
    results[model] = await performAdvancedAttributionAnalysis(campaignIds, model, timeRange, userId)
  }
  
  return results
}

function getFallbackAttribution(): AttributionAnalysis {
  return {
    model: 'linear',
    results: [],
    totalRevenue: 0,
    totalConversions: 0,
    insights: ['Analysis in progress - implement touchpoint tracking for detailed insights'],
    recommendations: ['Set up conversion tracking', 'Implement comprehensive touchpoint recording'],
    summary: {
      topPerformer: 'N/A',
      avgTouchpoints: 0,
      totalROI: 0,
      revenueConcentration: 0
    }
  }
}