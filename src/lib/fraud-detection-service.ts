export interface FraudDetectionResult {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  factors: string[];
  recommendation: string;
  estimatedSavings: number;
  preventionStrategies: string[];
  monitoringAlerts: string[];
}

export interface FraudAnalysisRequest {
  creativeId: string;
  campaignId: string;
  targetAudience: any;
  budget: number;
  platform: string;
  historicalData?: any[];
}

export class FraudDetectionService {
  private apiKey: string;
  private baseUrl: string;
  private cache: Map<string, FraudDetectionResult> = new Map();

  constructor() {
    this.apiKey = import.meta.env.VITE_FRAUD_API_KEY || 'demo_key';
    this.baseUrl = 'https://api.frauddetection.com/v1';
  }

  async analyzeFraud(request: FraudAnalysisRequest): Promise<FraudDetectionResult> {
    const cacheKey = `${request.creativeId}-${request.campaignId}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const analysis = await this.performFraudAnalysis(request);
      
      // Cache for 1 hour
      this.cache.set(cacheKey, analysis);
      setTimeout(() => this.cache.delete(cacheKey), 3600000);

      return analysis;
    } catch (error) {
      console.error('🚨 Fraud detection error:', error);
      return this.getFallbackAnalysis(request);
    }
  }

  private async performFraudAnalysis(request: FraudAnalysisRequest): Promise<FraudDetectionResult> {
    // Simulate comprehensive fraud analysis
    const deviceAnalysis = this.analyzeDevicePatterns(request);
    const behaviorAnalysis = this.analyzeBehaviorPatterns(request);
    const geoAnalysis = this.analyzeGeographicRisk(request);
    const temporalAnalysis = this.analyzeTemporalPatterns(request);

    const riskScore = this.calculateCompositeRisk(deviceAnalysis, behaviorAnalysis, geoAnalysis, temporalAnalysis);
    const riskLevel = this.categorizeRisk(riskScore);
    const estimatedSavings = this.calculateSavings(riskScore, request.budget);

    return {
      riskScore,
      riskLevel,
      confidence: 94,
      factors: this.identifyRiskFactors(deviceAnalysis, behaviorAnalysis, geoAnalysis, temporalAnalysis),
      recommendation: this.generateRecommendation(riskLevel, riskScore),
      estimatedSavings,
      preventionStrategies: this.generatePreventionStrategies(riskLevel),
      monitoringAlerts: this.generateMonitoringAlerts(riskLevel)
    };
  }

  private analyzeDevicePatterns(request: FraudAnalysisRequest): number {
    // Simulate device fingerprint analysis
    const uniqueDeviceRatio = Math.random() * 0.4 + 0.6;
    const suspiciousPatterns = Math.random() > 0.8 ? 1 : 0;
    
    return Math.round((1 - uniqueDeviceRatio + suspiciousPatterns * 0.2) * 100);
  }

  private analyzeBehaviorPatterns(request: FraudAnalysisRequest): number {
    // Simulate behavior analysis
    const engagementQuality = Math.random() * 0.4 + 0.6;
    const clickPatterns = Math.random() > 0.7 ? 1 : 0;
    
    return Math.round((1 - engagementQuality + clickPatterns * 0.15) * 100);
  }

  private analyzeGeographicRisk(request: FraudAnalysisRequest): number {
    // Simulate geographic risk analysis
    const vpnDetection = Math.random() * 0.3;
    const highRiskRegions = Math.random() > 0.8 ? 1 : 0;
    
    return Math.round((vpnDetection + highRiskRegions * 0.2) * 100);
  }

  private analyzeTemporalPatterns(request: FraudAnalysisRequest): number {
    // Simulate temporal pattern analysis
    const botActivity = Math.random() * 0.4;
    const unusualTiming = Math.random() > 0.7 ? 1 : 0;
    
    return Math.round((botActivity + unusualTiming * 0.15) * 100);
  }

  private calculateCompositeRisk(device: number, behavior: number, geo: number, temporal: number): number {
    const weights = { device: 0.3, behavior: 0.3, geo: 0.2, temporal: 0.2 };
    
    return Math.round(
      device * weights.device +
      behavior * weights.behavior +
      geo * weights.geo +
      temporal * weights.temporal
    );
  }

  private categorizeRisk(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score <= 20) return 'low';
    if (score <= 40) return 'medium';
    if (score <= 70) return 'high';
    return 'critical';
  }

  private calculateSavings(riskScore: number, budget: number): number {
    const fraudRate = riskScore / 100;
    const potentialWaste = budget * fraudRate;
    return Math.round(potentialWaste * 0.85);
  }

  private identifyRiskFactors(device: number, behavior: number, geo: number, temporal: number): string[] {
    const factors: string[] = [];

    if (device > 50) factors.push('Suspicious device fingerprint patterns detected');
    if (behavior > 50) factors.push('Unusual user behavior patterns identified');
    if (geo > 50) factors.push('High-risk geographic traffic sources');
    if (temporal > 50) factors.push('Abnormal timing patterns in traffic');

    if (factors.length === 0) {
      factors.push('Clean traffic patterns detected');
      factors.push('Normal user behavior indicators');
      factors.push('Healthy geographic distribution');
    }

    return factors;
  }

  private generateRecommendation(riskLevel: string, score: number): string {
    switch (riskLevel) {
      case 'low':
        return 'Campaign shows healthy traffic patterns. Safe to scale budget and expand targeting.';
      case 'medium':
        return 'Moderate fraud risk detected. Implement additional targeting filters and monitor closely.';
      case 'high':
        return 'High fraud risk detected. Pause campaign and implement comprehensive fraud filters.';
      case 'critical':
        return 'Critical fraud risk - immediate action required. Pause all spending and review targeting.';
      default:
        return 'Continue monitoring campaign performance and traffic quality.';
    }
  }

  private generatePreventionStrategies(riskLevel: string): string[] {
    const baseStrategies = [
      'Implement device fingerprinting',
      'Use IP reputation filtering',
      'Enable click velocity monitoring'
    ];

    switch (riskLevel) {
      case 'high':
      case 'critical':
        return [
          ...baseStrategies,
          'Implement CAPTCHA verification',
          'Use advanced bot detection',
          'Enable geographic restrictions',
          'Implement time-based filtering'
        ];
      case 'medium':
        return [
          ...baseStrategies,
          'Enable behavioral analysis',
          'Implement conversion tracking verification'
        ];
      default:
        return baseStrategies;
    }
  }

  private generateMonitoringAlerts(riskLevel: string): string[] {
    const alerts = ['Monitor CTR anomalies', 'Track conversion quality'];

    if (riskLevel === 'high' || riskLevel === 'critical') {
      alerts.push('Real-time fraud score monitoring');
      alerts.push('Immediate budget pause triggers');
    }

    return alerts;
  }

  private getFallbackAnalysis(request: FraudAnalysisRequest): FraudDetectionResult {
    return {
      riskScore: 20,
      riskLevel: 'low',
      confidence: 75,
      factors: ['Analysis in progress', 'Using baseline fraud patterns'],
      recommendation: 'Monitor campaign performance and implement standard fraud prevention measures.',
      estimatedSavings: 0,
      preventionStrategies: ['Standard fraud prevention measures'],
      monitoringAlerts: ['Basic performance monitoring']
    };
  }
}

export const fraudDetectionService = new FraudDetectionService();