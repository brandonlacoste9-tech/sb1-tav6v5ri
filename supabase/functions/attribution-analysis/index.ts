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
  };
}

interface AttributionAnalysis {
  model: string;
  results: AttributionResult[];
  totalRevenue: number;
  totalConversions: number;
  insights: string[];
  recommendations: string[];
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

    if (req.method === 'POST' && req.url.includes('/record-touchpoint')) {
      // Record new touchpoint
      const touchpoint: TouchPoint = await req.json()
      
      // In production, store in high-performance analytics database
      console.log('📊 Recording touchpoint:', touchpoint.touchpointType, touchpoint.platform)
      
      return new Response(
        JSON.stringify({ success: true, touchpointId: touchpoint.id }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    if (req.method === 'POST' && req.url.includes('/analyze')) {
      // Perform attribution analysis
      const { campaignIds, model, timeRange }: AttributionRequest = await req.json()
      
      console.log('🎯 Analyzing attribution for campaigns:', campaignIds, 'using model:', model)
      
      const analysis = await performAttributionAnalysis(campaignIds, model, timeRange)
      
      return new Response(
        JSON.stringify(analysis),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    throw new Error('Invalid endpoint or method')
  } catch (error) {
    console.error('🚨 Attribution analysis error:', error)
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

async function performAttributionAnalysis(
  campaignIds: string[], 
  model: string, 
  timeRange: any
): Promise<AttributionAnalysis> {
  // Simulate comprehensive attribution analysis
  const mockTouchpoints = generateMockTouchpoints(campaignIds, timeRange)
  const userJourneys = groupTouchpointsByUser(mockTouchpoints)
  const attributionResults = calculateAttribution(userJourneys, model)
  
  const totalRevenue = attributionResults.reduce((sum, result) => sum + result.revenue, 0)
  const totalConversions = attributionResults.reduce((sum, result) => sum + result.conversions, 0)
  
  const insights = generateAttributionInsights(attributionResults, model)
  const recommendations = generateAttributionRecommendations(attributionResults)
  
  return {
    model,
    results: attributionResults,
    totalRevenue,
    totalConversions,
    insights,
    recommendations
  }
}

function generateMockTouchpoints(campaignIds: string[], timeRange: any): TouchPoint[] {
  const touchpoints: TouchPoint[] = []
  const platforms = ['facebook', 'instagram', 'google', 'tiktok']
  
  // Generate realistic user journeys
  for (let userId = 1; userId <= 100; userId++) {
    const journeyLength = Math.floor(Math.random() * 6) + 2 // 2-7 touchpoints
    const startTime = new Date(timeRange.start).getTime()
    const endTime = new Date(timeRange.end).getTime()
    
    for (let i = 0; i < journeyLength; i++) {
      const timestamp = new Date(startTime + (endTime - startTime) * (i / journeyLength))
      const campaignId = campaignIds[Math.floor(Math.random() * campaignIds.length)]
      const platform = platforms[Math.floor(Math.random() * platforms.length)]
      
      let touchpointType: 'impression' | 'click' | 'conversion' = 'impression'
      if (i > 0 && Math.random() > 0.7) touchpointType = 'click'
      if (i === journeyLength - 1 && Math.random() > 0.8) touchpointType = 'conversion'
      
      touchpoints.push({
        id: crypto.randomUUID(),
        userId: `user_${userId}`,
        creativeId: `creative_${campaignId}_${platform}`,
        campaignId,
        platform,
        touchpointType,
        timestamp: timestamp.toISOString(),
        value: touchpointType === 'conversion' ? Math.random() * 100 + 25 : undefined
      })
    }
  }
  
  return touchpoints
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

function calculateAttribution(userJourneys: Map<string, TouchPoint[]>, model: string): AttributionResult[] {
  const creativeAttribution = new Map<string, any>()
  
  for (const [userId, journey] of userJourneys) {
    const conversions = journey.filter(tp => tp.touchpointType === 'conversion')
    
    for (const conversion of conversions) {
      const pathToConversion = journey.filter(tp => 
        new Date(tp.timestamp) <= new Date(conversion.timestamp) && tp.touchpointType !== 'conversion'
      )
      
      if (pathToConversion.length === 0) continue
      
      const attributionWeights = calculateAttributionWeights(pathToConversion, model)
      const conversionValue = conversion.value || 50
      
      for (let i = 0; i < pathToConversion.length; i++) {
        const touchpoint = pathToConversion[i]
        const weight = attributionWeights[i]
        
        const current = creativeAttribution.get(touchpoint.creativeId) || {
          attribution: 0,
          revenue: 0,
          conversions: 0,
          touchpoints: 0,
          clicks: 0,
          impressions: 0
        }
        
        current.attribution += weight
        current.revenue += conversionValue * weight
        current.conversions += weight
        current.touchpoints += 1
        
        if (touchpoint.touchpointType === 'click') current.clicks += 1
        if (touchpoint.touchpointType === 'impression') current.impressions += 1
        
        creativeAttribution.set(touchpoint.creativeId, current)
      }
    }
  }
  
  // Convert to results format
  return Array.from(creativeAttribution.entries()).map(([creativeId, data]) => ({
    creativeId,
    attribution: Number(data.attribution.toFixed(3)),
    revenue: Number(data.revenue.toFixed(2)),
    conversions: Number(data.conversions.toFixed(1)),
    touchpoints: data.touchpoints,
    performance: {
      ctr: data.clicks > 0 ? Number(((data.clicks / Math.max(1, data.impressions)) * 100).toFixed(2)) : 0,
      conversionRate: data.clicks > 0 ? Number(((data.conversions / data.clicks) * 100).toFixed(2)) : 0,
      averageOrderValue: data.conversions > 0 ? Number((data.revenue / data.conversions).toFixed(2)) : 0
    }
  }))
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
  weights[0] = 0.4 // First touch
  weights[count - 1] = 0.4 // Last touch
  
  const middleWeight = 0.2 / (count - 2)
  for (let i = 1; i < count - 1; i++) {
    weights[i] = middleWeight
  }
  
  return weights
}

function generateAttributionInsights(results: AttributionResult[], model: string): string[] {
  const insights: string[] = []
  
  const topPerformer = results.reduce((max, current) => 
    current.revenue > max.revenue ? current : max, results[0]
  )
  
  if (topPerformer) {
    const revenueShare = (topPerformer.revenue / results.reduce((sum, r) => sum + r.revenue, 0)) * 100
    insights.push(`Creative ${topPerformer.creativeId} drives ${revenueShare.toFixed(1)}% of attributed revenue`)
  }
  
  const avgTouchpoints = results.reduce((sum, result) => sum + result.touchpoints, 0) / results.length
  
  if (avgTouchpoints > 5) {
    insights.push('Complex customer journey detected - consider nurture campaigns')
  } else if (avgTouchpoints < 2) {
    insights.push('Short customer journey - direct response campaigns are effective')
  }
  
  switch (model) {
    case 'first-touch':
      insights.push('First-touch model emphasizes awareness and discovery channels')
      break
    case 'last-touch':
      insights.push('Last-touch model highlights conversion-driving touchpoints')
      break
    case 'time-decay':
      insights.push('Time-decay model emphasizes recent interactions')
      break
  }
  
  return insights
}

function generateAttributionRecommendations(results: AttributionResult[]): string[] {
  const recommendations: string[] = []
  
  const sortedResults = results.sort((a, b) => b.revenue - a.revenue)
  const topPerformers = sortedResults.slice(0, 3)
  
  if (topPerformers.length > 0) {
    recommendations.push(`Scale budget for top-performing creative ${topPerformers[0].creativeId}`)
  }
  
  const totalRevenue = results.reduce((sum, result) => sum + result.revenue, 0)
  const revenueConcentration = topPerformers.reduce((sum, result) => sum + result.revenue, 0) / totalRevenue
  
  if (revenueConcentration > 0.8) {
    recommendations.push('Revenue concentrated in few creatives - diversify portfolio')
  }
  
  recommendations.push('Implement conversion tracking for more accurate attribution')
  recommendations.push('Test different attribution models for optimization insights')
  
  return recommendations
}

function getFallbackAttribution(): AttributionAnalysis {
  return {
    model: 'linear',
    results: [],
    totalRevenue: 0,
    totalConversions: 0,
    insights: ['Analysis in progress - implement tracking for detailed insights'],
    recommendations: ['Set up conversion tracking', 'Implement touchpoint recording']
  }
}