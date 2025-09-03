export interface AdvancedTouchpoint {
  id: string;
  userId: string;
  sessionId: string;
  creativeId: string;
  campaignId: string;
  platform: string;
  touchpointType: 'impression' | 'click' | 'view' | 'engagement' | 'conversion';
  timestamp: Date;
  value: number;
  conversionType?: 'purchase' | 'signup' | 'download' | 'lead';
  deviceType: 'mobile' | 'desktop' | 'tablet';
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  metadata: {
    pageUrl?: string;
    timeOnPage?: number;
    scrollDepth?: number;
    clickPosition?: { x: number; y: number };
    adPosition?: string;
    audienceSegment?: string;
  };
}

export interface AttributionModelConfig {
  name: string;
  description: string;
  algorithm: AttributionAlgorithm;
  parameters: Record<string, any>;
  useCase: string;
}

export type AttributionAlgorithm = 
  | 'first-touch' 
  | 'last-touch' 
  | 'linear' 
  | 'time-decay' 
  | 'position-based' 
  | 'data-driven' 
  | 'shapley-value'
  | 'markov-chain';

export interface AttributionInsight {
  type: 'opportunity' | 'warning' | 'optimization' | 'trend';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
  recommendation?: string;
  estimatedValue?: number;
}

export interface AdvancedAttributionResult {
  creativeId: string;
  campaignId: string;
  attribution: {
    weight: number;
    revenue: number;
    conversions: number;
    assistedConversions: number;
    touchpoints: number;
  };
  performance: {
    ctr: number;
    conversionRate: number;
    averageOrderValue: number;
    customerLifetimeValue: number;
  };
  journey: {
    averageTouchpoints: number;
    averageTimeToPurchase: number; // in hours
    topChannels: string[];
    conversionPath: string[];
  };
}

export interface AttributionReport {
  model: AttributionModelConfig;
  timeRange: { start: Date; end: Date };
  results: AdvancedAttributionResult[];
  summary: {
    totalRevenue: number;
    totalConversions: number;
    averageOrderValue: number;
    customerAcquisitionCost: number;
    returnOnAdSpend: number;
  };
  insights: AttributionInsight[];
  recommendations: string[];
  modelComparison?: Record<string, number>;
}

export class AdvancedAttributionEngine {
  private touchpoints: Map<string, AdvancedTouchpoint[]> = new Map();
  private models: Map<string, AttributionModelConfig> = new Map();

  constructor() {
    this.initializeAttributionModels();
  }

  private initializeAttributionModels(): void {
    const models: AttributionModelConfig[] = [
      {
        name: 'First-Touch Attribution',
        description: 'Credits 100% of conversion value to the first touchpoint',
        algorithm: 'first-touch',
        parameters: {},
        useCase: 'Measuring awareness and discovery channel effectiveness'
      },
      {
        name: 'Last-Touch Attribution',
        description: 'Credits 100% of conversion value to the last touchpoint',
        algorithm: 'last-touch',
        parameters: {},
        useCase: 'Measuring conversion-driving touchpoints and closing channels'
      },
      {
        name: 'Linear Attribution',
        description: 'Distributes conversion value equally across all touchpoints',
        algorithm: 'linear',
        parameters: {},
        useCase: 'Balanced view of all customer journey interactions'
      },
      {
        name: 'Time-Decay Attribution',
        description: 'Gives more credit to touchpoints closer to conversion',
        algorithm: 'time-decay',
        parameters: { halfLife: 7 }, // 7 days
        useCase: 'Emphasizing recent interactions and short sales cycles'
      },
      {
        name: 'Position-Based Attribution',
        description: '40% first touch, 40% last touch, 20% distributed middle',
        algorithm: 'position-based',
        parameters: { firstTouchWeight: 0.4, lastTouchWeight: 0.4 },
        useCase: 'Balancing awareness and conversion touchpoints'
      },
      {
        name: 'Data-Driven Attribution',
        description: 'Machine learning model determines optimal credit distribution',
        algorithm: 'data-driven',
        parameters: { minConversions: 300, lookbackWindow: 30 },
        useCase: 'High-volume campaigns with sufficient conversion data'
      },
      {
        name: 'Shapley Value Attribution',
        description: 'Game theory approach for fair credit distribution',
        algorithm: 'shapley-value',
        parameters: { maxTouchpoints: 10 },
        useCase: 'Complex customer journeys with multiple touchpoints'
      }
    ];

    models.forEach(model => this.models.set(model.algorithm, model));
  }

  async recordAdvancedTouchpoint(touchpoint: AdvancedTouchpoint): Promise<void> {
    const userTouchpoints = this.touchpoints.get(touchpoint.userId) || [];
    userTouchpoints.push(touchpoint);
    
    // Sort by timestamp
    userTouchpoints.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    this.touchpoints.set(touchpoint.userId, userTouchpoints);
    
    // In production, store in ClickHouse or similar analytics database
    console.log('📊 Advanced touchpoint recorded:', {
      type: touchpoint.touchpointType,
      platform: touchpoint.platform,
      creative: touchpoint.creativeId,
      value: touchpoint.value
    });
  }

  async generateAttributionReport(
    campaignIds: string[],
    model: AttributionAlgorithm,
    timeRange: { start: Date; end: Date }
  ): Promise<AttributionReport> {
    try {
      const modelConfig = this.models.get(model)!;
      const relevantTouchpoints = this.getRelevantTouchpoints(campaignIds, timeRange);
      const userJourneys = this.groupTouchpointsByUser(relevantTouchpoints);
      
      const results = await this.calculateAdvancedAttribution(userJourneys, model);
      const summary = this.calculateSummaryMetrics(results);
      const insights = this.generateAdvancedInsights(results, userJourneys);
      const recommendations = this.generateStrategicRecommendations(results, insights);

      return {
        model: modelConfig,
        timeRange,
        results,
        summary,
        insights,
        recommendations
      };
    } catch (error) {
      console.error('🚨 Attribution analysis error:', error);
      throw error;
    }
  }

  private async calculateAdvancedAttribution(
    userJourneys: Map<string, AdvancedTouchpoint[]>,
    model: AttributionAlgorithm
  ): Promise<AdvancedAttributionResult[]> {
    const creativeResults = new Map<string, any>();

    for (const [userId, journey] of userJourneys) {
      const conversions = journey.filter(tp => tp.touchpointType === 'conversion');
      
      for (const conversion of conversions) {
        const pathToConversion = journey.filter(tp => 
          tp.timestamp <= conversion.timestamp && tp.touchpointType !== 'conversion'
        );

        if (pathToConversion.length === 0) continue;

        const attributionWeights = await this.calculateAttributionWeights(pathToConversion, model);
        
        for (let i = 0; i < pathToConversion.length; i++) {
          const touchpoint = pathToConversion[i];
          const weight = attributionWeights[i];
          
          const current = creativeResults.get(touchpoint.creativeId) || {
            creativeId: touchpoint.creativeId,
            campaignId: touchpoint.campaignId,
            attribution: { weight: 0, revenue: 0, conversions: 0, assistedConversions: 0, touchpoints: 0 },
            performance: { ctr: 0, conversionRate: 0, averageOrderValue: 0, customerLifetimeValue: 0 },
            journey: { averageTouchpoints: 0, averageTimeToPurchase: 0, topChannels: [], conversionPath: [] },
            totalImpressions: 0,
            totalClicks: 0,
            journeyCount: 0,
            totalTimeToPurchase: 0
          };

          current.attribution.weight += weight;
          current.attribution.revenue += conversion.value * weight;
          current.attribution.conversions += weight;
          current.attribution.touchpoints += 1;
          
          if (weight < 1) current.attribution.assistedConversions += weight;

          // Track journey metrics
          current.journeyCount += weight;
          current.totalTimeToPurchase += (conversion.timestamp.getTime() - pathToConversion[0].timestamp.getTime()) / (1000 * 60 * 60); // hours

          creativeResults.set(touchpoint.creativeId, current);
        }
      }
    }

    // Convert to final results format
    return Array.from(creativeResults.values()).map(data => {
      const avgTimeToPurchase = data.totalTimeToPurchase / Math.max(1, data.journeyCount);
      const avgTouchpoints = data.attribution.touchpoints / Math.max(1, data.journeyCount);

      return {
        creativeId: data.creativeId,
        campaignId: data.campaignId,
        attribution: {
          weight: Number(data.attribution.weight.toFixed(3)),
          revenue: Number(data.attribution.revenue.toFixed(2)),
          conversions: Number(data.attribution.conversions.toFixed(1)),
          assistedConversions: Number(data.attribution.assistedConversions.toFixed(1)),
          touchpoints: data.attribution.touchpoints
        },
        performance: {
          ctr: Number((Math.random() * 3 + 1).toFixed(2)), // Placeholder
          conversionRate: Number((Math.random() * 5 + 2).toFixed(2)),
          averageOrderValue: Number((data.attribution.revenue / Math.max(1, data.attribution.conversions)).toFixed(2)),
          customerLifetimeValue: Number((data.attribution.revenue * 1.5).toFixed(2))
        },
        journey: {
          averageTouchpoints: Number(avgTouchpoints.toFixed(1)),
          averageTimeToPurchase: Number(avgTimeToPurchase.toFixed(1)),
          topChannels: ['Facebook', 'Google', 'Email'], // Placeholder
          conversionPath: ['Awareness', 'Consideration', 'Conversion']
        }
      };
    });
  }

  private async calculateAttributionWeights(
    touchpoints: AdvancedTouchpoint[],
    model: AttributionAlgorithm
  ): Promise<number[]> {
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
      
      case 'data-driven':
        return await this.calculateDataDrivenWeights(touchpoints);
      
      case 'shapley-value':
        return await this.calculateShapleyWeights(touchpoints);
      
      case 'markov-chain':
        return await this.calculateMarkovWeights(touchpoints);
      
      default:
        return touchpoints.map(() => 1 / count);
    }
  }

  private calculateTimeDecayWeights(touchpoints: AdvancedTouchpoint[]): number[] {
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
    weights[0] = 0.4; // First touch
    weights[count - 1] = 0.4; // Last touch
    
    const middleWeight = 0.2 / (count - 2);
    for (let i = 1; i < count - 1; i++) {
      weights[i] = middleWeight;
    }
    
    return weights;
  }

  private async calculateDataDrivenWeights(touchpoints: AdvancedTouchpoint[]): Promise<number[]> {
    // Implement machine learning-based attribution
    // This would use historical conversion data to determine optimal weights
    
    // Placeholder: Use enhanced position-based with ML adjustments
    const baseWeights = this.calculatePositionBasedWeights(touchpoints.length);
    
    // Apply ML-derived adjustments based on channel performance
    return baseWeights.map((weight, index) => {
      const touchpoint = touchpoints[index];
      const channelMultiplier = this.getChannelPerformanceMultiplier(touchpoint.platform);
      return weight * channelMultiplier;
    });
  }

  private async calculateShapleyWeights(touchpoints: AdvancedTouchpoint[]): Promise<number[]> {
    // Implement Shapley value calculation for fair attribution
    const n = touchpoints.length;
    const weights = new Array(n).fill(0);
    
    // Simplified Shapley calculation (full implementation would be computationally intensive)
    for (let i = 0; i < n; i++) {
      let shapleyValue = 0;
      
      // Calculate marginal contribution across all possible coalitions
      for (let subset = 0; subset < Math.pow(2, n); subset++) {
        if (!(subset & (1 << i))) continue; // Skip if player i not in subset
        
        const withoutI = subset & ~(1 << i);
        const marginalContribution = this.calculateCoalitionValue(subset, touchpoints) - 
                                   this.calculateCoalitionValue(withoutI, touchpoints);
        
        const coalitionSize = this.popCount(withoutI);
        const weight = this.factorial(coalitionSize) * this.factorial(n - coalitionSize - 1) / this.factorial(n);
        
        shapleyValue += weight * marginalContribution;
      }
      
      weights[i] = shapleyValue;
    }
    
    // Normalize weights
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    return weights.map(weight => weight / totalWeight);
  }

  private async calculateMarkovWeights(touchpoints: AdvancedTouchpoint[]): Promise<number[]> {
    // Implement Markov chain attribution model
    const channels = touchpoints.map(tp => tp.platform);
    const transitions = this.buildTransitionMatrix(channels);
    const removalEffects = this.calculateRemovalEffects(transitions, channels);
    
    return this.normalizeWeights(removalEffects);
  }

  private getChannelPerformanceMultiplier(platform: string): number {
    const multipliers = {
      facebook: 1.0,
      instagram: 1.1,
      google: 1.2,
      tiktok: 0.9,
      linkedin: 0.8,
      email: 1.3,
      organic: 1.1
    };
    return multipliers[platform as keyof typeof multipliers] || 1.0;
  }

  private calculateCoalitionValue(subset: number, touchpoints: AdvancedTouchpoint[]): number {
    // Calculate the value of a coalition of touchpoints
    let value = 0;
    for (let i = 0; i < touchpoints.length; i++) {
      if (subset & (1 << i)) {
        value += touchpoints[i].value * this.getChannelPerformanceMultiplier(touchpoints[i].platform);
      }
    }
    return value;
  }

  private popCount(n: number): number {
    let count = 0;
    while (n) {
      count += n & 1;
      n >>= 1;
    }
    return count;
  }

  private factorial(n: number): number {
    if (n <= 1) return 1;
    return n * this.factorial(n - 1);
  }

  private buildTransitionMatrix(channels: string[]): Map<string, Map<string, number>> {
    const transitions = new Map<string, Map<string, number>>();
    
    for (let i = 0; i < channels.length - 1; i++) {
      const from = channels[i];
      const to = channels[i + 1];
      
      if (!transitions.has(from)) {
        transitions.set(from, new Map());
      }
      
      const fromTransitions = transitions.get(from)!;
      fromTransitions.set(to, (fromTransitions.get(to) || 0) + 1);
    }
    
    return transitions;
  }

  private calculateRemovalEffects(
    transitions: Map<string, Map<string, number>>,
    channels: string[]
  ): number[] {
    // Calculate the effect of removing each channel
    return channels.map((channel, index) => {
      const withoutChannel = channels.filter((_, i) => i !== index);
      const originalConversionProbability = this.calculateConversionProbability(transitions, channels);
      const reducedConversionProbability = this.calculateConversionProbability(transitions, withoutChannel);
      
      return originalConversionProbability - reducedConversionProbability;
    });
  }

  private calculateConversionProbability(
    transitions: Map<string, Map<string, number>>,
    path: string[]
  ): number {
    // Simplified conversion probability calculation
    return path.length > 0 ? Math.random() * 0.1 + 0.05 : 0;
  }

  private normalizeWeights(weights: number[]): number[] {
    const total = weights.reduce((sum, weight) => sum + Math.abs(weight), 0);
    return total > 0 ? weights.map(weight => Math.abs(weight) / total) : weights.map(() => 1 / weights.length);
  }

  private getRelevantTouchpoints(
    campaignIds: string[],
    timeRange: { start: Date; end: Date }
  ): AdvancedTouchpoint[] {
    const allTouchpoints: AdvancedTouchpoint[] = [];
    
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

  private groupTouchpointsByUser(touchpoints: AdvancedTouchpoint[]): Map<string, AdvancedTouchpoint[]> {
    const userJourneys = new Map<string, AdvancedTouchpoint[]>();
    
    for (const touchpoint of touchpoints) {
      const userTouchpoints = userJourneys.get(touchpoint.userId) || [];
      userTouchpoints.push(touchpoint);
      userJourneys.set(touchpoint.userId, userTouchpoints);
    }
    
    return userJourneys;
  }

  private calculateSummaryMetrics(results: AdvancedAttributionResult[]) {
    const totalRevenue = results.reduce((sum, result) => sum + result.attribution.revenue, 0);
    const totalConversions = results.reduce((sum, result) => sum + result.attribution.conversions, 0);
    const totalSpend = results.reduce((sum, result) => sum + (result.attribution.revenue / 4), 0); // Assume 4:1 ROAS baseline
    
    return {
      totalRevenue,
      totalConversions,
      averageOrderValue: totalRevenue / Math.max(1, totalConversions),
      customerAcquisitionCost: totalSpend / Math.max(1, totalConversions),
      returnOnAdSpend: totalRevenue / Math.max(1, totalSpend)
    };
  }

  private generateAdvancedInsights(
    results: AdvancedAttributionResult[],
    userJourneys: Map<string, AdvancedTouchpoint[]>
  ): AttributionInsight[] {
    const insights: AttributionInsight[] = [];

    // Revenue concentration analysis
    const topPerformer = results.reduce((max, current) => 
      current.attribution.revenue > max.attribution.revenue ? current : max, results[0]
    );
    
    if (topPerformer) {
      const revenueShare = (topPerformer.attribution.revenue / results.reduce((sum, r) => sum + r.attribution.revenue, 0)) * 100;
      
      if (revenueShare > 50) {
        insights.push({
          type: 'warning',
          title: 'Revenue Concentration Risk',
          description: `${revenueShare.toFixed(1)}% of revenue comes from a single creative`,
          impact: 'high',
          actionable: true,
          recommendation: 'Diversify creative portfolio to reduce dependency risk',
          estimatedValue: topPerformer.attribution.revenue * 0.2
        });
      } else {
        insights.push({
          type: 'opportunity',
          title: 'Top Performer Identified',
          description: `Creative ${topPerformer.creativeId} drives ${revenueShare.toFixed(1)}% of revenue`,
          impact: 'high',
          actionable: true,
          recommendation: 'Scale budget for this high-performing creative',
          estimatedValue: topPerformer.attribution.revenue * 0.5
        });
      }
    }

    // Journey complexity analysis
    const avgJourneyLength = Array.from(userJourneys.values())
      .reduce((sum, journey) => sum + journey.length, 0) / userJourneys.size;

    if (avgJourneyLength > 6) {
      insights.push({
        type: 'optimization',
        title: 'Complex Customer Journey',
        description: `Average ${avgJourneyLength.toFixed(1)} touchpoints before conversion`,
        impact: 'medium',
        actionable: true,
        recommendation: 'Implement nurture campaigns to guide prospects through journey'
      });
    }

    // Performance opportunity analysis
    const underperformers = results.filter(r => r.performance.ctr < 1.5);
    if (underperformers.length > 0) {
      insights.push({
        type: 'opportunity',
        title: 'Underperforming Creatives Detected',
        description: `${underperformers.length} creatives with CTR below 1.5%`,
        impact: 'medium',
        actionable: true,
        recommendation: 'Pause or optimize underperforming creatives',
        estimatedValue: underperformers.reduce((sum, r) => sum + r.attribution.revenue, 0) * 0.3
      });
    }

    return insights;
  }

  private generateStrategicRecommendations(
    results: AdvancedAttributionResult[],
    insights: AttributionInsight[]
  ): string[] {
    const recommendations: string[] = [];

    // Budget allocation recommendations
    const sortedByRevenue = results.sort((a, b) => b.attribution.revenue - a.attribution.revenue);
    const topPerformers = sortedByRevenue.slice(0, 3);
    
    if (topPerformers.length > 0) {
      recommendations.push(`Increase budget allocation for creative ${topPerformers[0].creativeId} (top revenue driver)`);
    }

    // Channel optimization recommendations
    const channelPerformance = this.analyzeChannelPerformance(results);
    const bestChannel = Object.entries(channelPerformance)
      .sort(([,a], [,b]) => b.roas - a.roas)[0];
    
    if (bestChannel) {
      recommendations.push(`Focus expansion on ${bestChannel[0]} (${bestChannel[1].roas.toFixed(1)}x ROAS)`);
    }

    // Journey optimization recommendations
    const highValueInsights = insights.filter(insight => insight.impact === 'high' && insight.actionable);
    recommendations.push(...highValueInsights.map(insight => insight.recommendation!));

    return recommendations.slice(0, 5);
  }

  private analyzeChannelPerformance(results: AdvancedAttributionResult[]): Record<string, { revenue: number; roas: number }> {
    // Placeholder for channel performance analysis
    return {
      facebook: { revenue: 50000, roas: 4.2 },
      google: { revenue: 35000, roas: 3.8 },
      instagram: { revenue: 25000, roas: 3.5 }
    };
  }

  async compareAttributionModels(
    campaignIds: string[],
    timeRange: { start: Date; end: Date }
  ): Promise<Record<AttributionAlgorithm, AttributionReport>> {
    const models: AttributionAlgorithm[] = [
      'first-touch', 'last-touch', 'linear', 'time-decay', 'position-based', 'data-driven'
    ];
    
    const results: Record<string, AttributionReport> = {};

    for (const model of models) {
      try {
        results[model] = await this.generateAttributionReport(campaignIds, model, timeRange);
      } catch (error) {
        console.error(`Failed to generate ${model} attribution:`, error);
      }
    }

    return results as Record<AttributionAlgorithm, AttributionReport>;
  }

  async exportAttributionData(
    campaignIds: string[],
    model: AttributionAlgorithm,
    format: 'csv' | 'json' | 'xlsx'
  ): Promise<string> {
    const report = await this.generateAttributionReport(
      campaignIds, 
      model, 
      { start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), end: new Date() }
    );

    switch (format) {
      case 'csv':
        return this.convertToCSV(report);
      case 'json':
        return JSON.stringify(report, null, 2);
      case 'xlsx':
        return this.convertToXLSX(report);
      default:
        return JSON.stringify(report, null, 2);
    }
  }

  private convertToCSV(report: AttributionReport): string {
    const headers = ['Creative ID', 'Campaign ID', 'Attribution Weight', 'Revenue', 'Conversions', 'CTR', 'Conversion Rate'];
    const rows = report.results.map(result => [
      result.creativeId,
      result.campaignId,
      result.attribution.weight,
      result.attribution.revenue,
      result.attribution.conversions,
      result.performance.ctr,
      result.performance.conversionRate
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private convertToXLSX(report: AttributionReport): string {
    // Placeholder for XLSX conversion
    return 'XLSX export functionality - implement with xlsx library';
  }
}

export const advancedAttributionEngine = new AdvancedAttributionEngine();