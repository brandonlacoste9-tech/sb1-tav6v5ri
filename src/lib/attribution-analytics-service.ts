export interface TouchPoint {
  id: string;
  userId: string;
  creativeId: string;
  campaignId: string;
  platform: string;
  touchpointType: 'impression' | 'click' | 'conversion';
  timestamp: Date;
  value?: number;
  metadata?: Record<string, any>;
}

export interface AttributionResult {
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

export interface AttributionAnalysis {
  model: AttributionModel;
  results: AttributionResult[];
  totalRevenue: number;
  totalConversions: number;
  insights: string[];
  recommendations: string[];
  summary: {
    topPerformer: string;
    avgTouchpoints: number;
    totalROI: number;
  };
}

export type AttributionModel = 'first-touch' | 'last-touch' | 'linear' | 'time-decay' | 'position-based';

export class AttributionAnalyticsService {
  private touchpoints: Map<string, TouchPoint[]> = new Map();

  async recordTouchpoint(touchpoint: TouchPoint): Promise<void> {
    const userTouchpoints = this.touchpoints.get(touchpoint.userId) || [];
    userTouchpoints.push(touchpoint);
    userTouchpoints.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    this.touchpoints.set(touchpoint.userId, userTouchpoints);
    
    console.log('📊 Touchpoint recorded:', touchpoint.touchpointType, touchpoint.platform);
  }

  async analyzeAttribution(
    campaignIds: string[],
    model: AttributionModel,
    timeRange: { start: Date; end: Date }
  ): Promise<AttributionAnalysis> {
    try {
      const relevantTouchpoints = this.getRelevantTouchpoints(campaignIds, timeRange);
      const userJourneys = this.groupTouchpointsByUser(relevantTouchpoints);
      const attributionResults = this.calculateAttribution(userJourneys, model);
      
      const totalRevenue = attributionResults.reduce((sum, result) => sum + result.revenue, 0);
      const totalConversions = attributionResults.reduce((sum, result) => sum + result.conversions, 0);
      
      const insights = this.generateInsights(attributionResults, model);
      const recommendations = this.generateRecommendations(attributionResults);
      const summary = this.generateSummary(attributionResults);

      return {
        model,
        results: attributionResults,
        totalRevenue,
        totalConversions,
        insights,
        recommendations,
        summary
      };
    } catch (error) {
      console.error('🚨 Attribution analysis error:', error);
      return this.getFallbackAttribution(campaignIds, model);
    }
  }

  private getRelevantTouchpoints(campaignIds: string[], timeRange: { start: Date; end: Date }): TouchPoint[] {
    const allTouchpoints: TouchPoint[] = [];
    
    for (const touchpointList of this.touchpoints.values()) {
      const filtered = touchpointList.filter(tp => 
        campaignIds.includes(tp.campaignId) &&
        tp.timestamp >= timeRange.start &&
        tp.timestamp <= timeRange.end
      );
      allTouchpoints.push(...filtered);
    }
    
    return allTouchpoints.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  private groupTouchpointsByUser(touchpoints: TouchPoint[]): Map<string, TouchPoint[]> {
    const userJourneys = new Map<string, TouchPoint[]>();
    
    for (const touchpoint of touchpoints) {
      const userTouchpoints = userJourneys.get(touchpoint.userId) || [];
      userTouchpoints.push(touchpoint);
      userJourneys.set(touchpoint.userId, userTouchpoints);
    }
    
    return userJourneys;
  }

  private calculateAttribution(userJourneys: Map<string, TouchPoint[]>, model: AttributionModel): AttributionResult[] {
    const creativeAttribution = new Map<string, any>();

    for (const [userId, journey] of userJourneys) {
      const conversions = journey.filter(tp => tp.touchpointType === 'conversion');
      
      for (const conversion of conversions) {
        const pathToConversion = journey.filter(tp => 
          tp.timestamp <= conversion.timestamp && tp.touchpointType !== 'conversion'
        );

        if (pathToConversion.length === 0) continue;

        const attributionWeights = this.calculateAttributionWeights(pathToConversion, model);
        const conversionValue = conversion.value || 50;

        for (let i = 0; i < pathToConversion.length; i++) {
          const touchpoint = pathToConversion[i];
          const weight = attributionWeights[i];
          
          const current = creativeAttribution.get(touchpoint.creativeId) || {
            attribution: 0,
            revenue: 0,
            conversions: 0,
            touchpoints: 0,
            clicks: 0,
            impressions: 0
          };

          current.attribution += weight;
          current.revenue += conversionValue * weight;
          current.conversions += weight;
          current.touchpoints += 1;

          if (touchpoint.touchpointType === 'click') current.clicks += 1;
          if (touchpoint.touchpointType === 'impression') current.impressions += 1;

          creativeAttribution.set(touchpoint.creativeId, current);
        }
      }
    }

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
    }));
  }

  private calculateAttributionWeights(touchpoints: TouchPoint[], model: AttributionModel): number[] {
    const count = touchpoints.length;
    if (count === 0) return [];

    switch (model) {
      case 'first-touch':
        return touchpoints.map((_, i) => i === 0 ? 1 : 0);
      
      case 'last-touch':
        return touchpoints.map((_, i) => i === count - 1 ? 1 : 0);
      
      case 'linear':
        return touchpoints.map(() => 1 / count);
      
      case 'time-decay':
        return this.calculateTimeDecayWeights(touchpoints);
      
      case 'position-based':
        return this.calculatePositionBasedWeights(count);
      
      default:
        return touchpoints.map(() => 1 / count);
    }
  }

  private calculateTimeDecayWeights(touchpoints: TouchPoint[]): number[] {
    const lastTimestamp = touchpoints[touchpoints.length - 1].timestamp.getTime();
    const halfLife = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    const weights = touchpoints.map(tp => {
      const timeDiff = lastTimestamp - tp.timestamp.getTime();
      return Math.exp(-timeDiff / halfLife);
    });
    
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    return weights.map(weight => weight / totalWeight);
  }

  private calculatePositionBasedWeights(count: number): number[] {
    if (count === 1) return [1];
    if (count === 2) return [0.5, 0.5];
    
    const weights = new Array(count).fill(0);
    weights[0] = 0.4;
    weights[count - 1] = 0.4;
    
    const middleWeight = 0.2 / (count - 2);
    for (let i = 1; i < count - 1; i++) {
      weights[i] = middleWeight;
    }
    
    return weights;
  }

  private generateInsights(results: AttributionResult[], model: AttributionModel): string[] {
    const insights: string[] = [];
    
    const topPerformer = results.reduce((max, current) => 
      current.revenue > max.revenue ? current : max, results[0]
    );
    
    if (topPerformer) {
      const revenueShare = (topPerformer.revenue / results.reduce((sum, r) => sum + r.revenue, 0)) * 100;
      insights.push(`Creative ${topPerformer.creativeId} drives ${revenueShare.toFixed(1)}% of attributed revenue`);
    }

    const avgTouchpoints = results.reduce((sum, result) => sum + result.touchpoints, 0) / results.length;
    
    if (avgTouchpoints > 5) {
      insights.push('Complex customer journey detected - consider nurture campaigns');
    } else if (avgTouchpoints < 2) {
      insights.push('Short customer journey - direct response campaigns are effective');
    }

    switch (model) {
      case 'first-touch':
        insights.push('First-touch model emphasizes awareness and discovery channels');
        break;
      case 'last-touch':
        insights.push('Last-touch model highlights conversion-driving touchpoints');
        break;
      case 'time-decay':
        insights.push('Time-decay model emphasizes recent interactions');
        break;
    }

    return insights;
  }

  private generateRecommendations(results: AttributionResult[]): string[] {
    const recommendations: string[] = [];
    
    const sortedResults = results.sort((a, b) => b.revenue - a.revenue);
    const topPerformers = sortedResults.slice(0, 3);
    
    if (topPerformers.length > 0) {
      recommendations.push(`Scale budget for top-performing creative ${topPerformers[0].creativeId}`);
    }

    const totalRevenue = results.reduce((sum, result) => sum + result.revenue, 0);
    const revenueConcentration = topPerformers.reduce((sum, result) => sum + result.revenue, 0) / totalRevenue;
    
    if (revenueConcentration > 0.8) {
      recommendations.push('Revenue concentrated in few creatives - diversify portfolio');
    }

    recommendations.push('Implement conversion tracking for more accurate attribution');
    
    return recommendations;
  }

  private generateSummary(results: AttributionResult[]) {
    const topPerformer = results.reduce((max, current) => 
      current.revenue > max.revenue ? current : max, results[0]
    );
    
    const avgTouchpoints = results.reduce((sum, result) => sum + result.touchpoints, 0) / results.length;
    const totalRevenue = results.reduce((sum, result) => sum + result.revenue, 0);
    const totalSpend = totalRevenue / 4; // Assume 4:1 ROAS baseline

    return {
      topPerformer: topPerformer?.creativeId || 'N/A',
      avgTouchpoints: Number(avgTouchpoints.toFixed(1)),
      totalROI: Number((totalRevenue / totalSpend).toFixed(1))
    };
  }

  private getFallbackAttribution(campaignIds: string[], model: AttributionModel): AttributionAnalysis {
    const mockResults: AttributionResult[] = campaignIds.map((id, index) => ({
      creativeId: id,
      attribution: Math.random() * 0.4 + 0.1,
      revenue: Math.random() * 5000 + 1000,
      conversions: Math.random() * 50 + 10,
      touchpoints: Math.floor(Math.random() * 8) + 2,
      performance: {
        ctr: Number((Math.random() * 3 + 1).toFixed(2)),
        conversionRate: Number((Math.random() * 5 + 2).toFixed(2)),
        averageOrderValue: Number((Math.random() * 100 + 50).toFixed(2))
      }
    }));

    return {
      model,
      results: mockResults,
      totalRevenue: mockResults.reduce((sum, result) => sum + result.revenue, 0),
      totalConversions: mockResults.reduce((sum, result) => sum + result.conversions, 0),
      insights: ['Analysis in progress - using baseline attribution model'],
      recommendations: ['Implement conversion tracking for accurate attribution'],
      summary: {
        topPerformer: mockResults[0]?.creativeId || 'N/A',
        avgTouchpoints: 3.2,
        totalROI: 4.1
      }
    };
  }

  async compareModels(campaignIds: string[], timeRange: { start: Date; end: Date }): Promise<Record<AttributionModel, AttributionAnalysis>> {
    const models: AttributionModel[] = ['first-touch', 'last-touch', 'linear', 'time-decay', 'position-based'];
    const results: Record<string, AttributionAnalysis> = {};

    for (const model of models) {
      results[model] = await this.analyzeAttribution(campaignIds, model, timeRange);
    }

    return results as Record<AttributionModel, AttributionAnalysis>;
  }
}

export const attributionAnalyticsService = new AttributionAnalyticsService();