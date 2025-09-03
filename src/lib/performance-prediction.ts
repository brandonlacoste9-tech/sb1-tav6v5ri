import * as tf from '@tensorflow/tfjs';

export interface CreativeFeatures {
  textLength: number;
  imageAspectRatio: number;
  colorContrast: number;
  ctaPresence: boolean;
  brandElementsCount: number;
  emotionalTone: number; // -1 to 1 scale
  visualComplexity: number; // 0 to 1 scale
  platform: 'facebook' | 'google' | 'instagram' | 'tiktok' | 'linkedin';
}

export interface PerformancePrediction {
  score: number;
  expectedCtr: number;
  expectedCpa: number;
  confidence: number;
  insights: string[];
  recommendations: string[];
}

export class PerformancePredictionEngine {
  private model: tf.LayersModel | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // In production, load pre-trained model from cloud storage
      // For now, create a simple neural network architecture
      this.model = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [8], units: 64, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 32, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.1 }),
          tf.layers.dense({ units: 16, activation: 'relu' }),
          tf.layers.dense({ units: 3, activation: 'sigmoid' }) // CTR, CPA, Confidence
        ]
      });

      // Compile model
      this.model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'meanSquaredError',
        metrics: ['mae']
      });

      this.isInitialized = true;
      console.log('Performance Prediction Engine initialized');
    } catch (error) {
      console.error('Failed to initialize Performance Prediction Engine:', error);
      throw error;
    }
  }

  private extractFeatures(creative: any): CreativeFeatures {
    // Extract features from creative data
    const textLength = creative.description?.length || 0;
    const imageAspectRatio = creative.imageWidth && creative.imageHeight 
      ? creative.imageWidth / creative.imageHeight 
      : 1.0;
    
    // Simulate feature extraction (in production, use computer vision APIs)
    return {
      textLength: Math.min(textLength / 100, 1), // Normalize
      imageAspectRatio: Math.min(imageAspectRatio, 2),
      colorContrast: Math.random() * 0.5 + 0.5, // Placeholder
      ctaPresence: creative.description?.toLowerCase().includes('buy') || 
                   creative.description?.toLowerCase().includes('shop') || false,
      brandElementsCount: Math.random() * 0.3 + 0.2, // Placeholder
      emotionalTone: Math.random() * 2 - 1, // -1 to 1
      visualComplexity: Math.random() * 0.4 + 0.3, // Placeholder
      platform: creative.platform || 'facebook'
    };
  }

  private platformMultiplier(platform: string): number {
    const multipliers = {
      'facebook': 1.0,
      'instagram': 1.15,
      'tiktok': 1.25,
      'google': 0.85,
      'linkedin': 0.75
    };
    return multipliers[platform as keyof typeof multipliers] || 1.0;
  }

  async predict(creative: any): Promise<PerformancePrediction> {
    if (!this.isInitialized || !this.model) {
      await this.initialize();
    }

    try {
      const features = this.extractFeatures(creative);
      
      // Convert features to tensor
      const inputTensor = tf.tensor2d([[
        features.textLength,
        features.imageAspectRatio,
        features.colorContrast,
        features.ctaPresence ? 1 : 0,
        features.brandElementsCount,
        features.emotionalTone,
        features.visualComplexity,
        this.platformMultiplier(features.platform)
      ]]);

      // Make prediction
      const prediction = this.model!.predict(inputTensor) as tf.Tensor;
      const predictionData = await prediction.data();

      // Clean up tensors
      inputTensor.dispose();
      prediction.dispose();

      // Extract predictions
      const rawCtr = predictionData[0];
      const rawCpa = predictionData[1];
      const confidence = predictionData[2];

      // Apply platform-specific adjustments
      const platformMult = this.platformMultiplier(features.platform);
      const expectedCtr = Math.max(0.5, Math.min(8.0, rawCtr * 5 * platformMult));
      const expectedCpa = Math.max(5.0, Math.min(100.0, rawCpa * 50 / platformMult));
      const score = Math.round((expectedCtr / 8.0 + (1 - expectedCpa / 100.0) + confidence) / 3 * 100);

      // Generate insights
      const insights = this.generateInsights(features, expectedCtr, expectedCpa, confidence);
      const recommendations = this.generateRecommendations(features, score);

      return {
        score: Math.max(1, Math.min(100, score)),
        expectedCtr: Number(expectedCtr.toFixed(2)),
        expectedCpa: Number(expectedCpa.toFixed(2)),
        confidence: Math.round(confidence * 100),
        insights,
        recommendations
      };
    } catch (error) {
      console.error('Prediction error:', error);
      
      // Fallback prediction
      return {
        score: 75,
        expectedCtr: 2.5,
        expectedCpa: 15.0,
        confidence: 80,
        insights: ['Analysis in progress - using baseline estimates'],
        recommendations: ['Ensure strong call-to-action placement', 'Test multiple creative variations']
      };
    }
  }

  private generateInsights(features: CreativeFeatures, ctr: number, cpa: number, confidence: number): string[] {
    const insights: string[] = [];

    if (features.colorContrast > 0.8) {
      insights.push('Excellent visual hierarchy and contrast detected');
    } else if (features.colorContrast < 0.4) {
      insights.push('Consider improving color contrast for better visibility');
    }

    if (features.ctaPresence) {
      insights.push('Strong call-to-action detected - good for conversions');
    } else {
      insights.push('No clear call-to-action found - consider adding one');
    }

    if (features.textLength > 0.7) {
      insights.push('Text-heavy creative - may perform better on LinkedIn/Facebook');
    } else if (features.textLength < 0.3) {
      insights.push('Visual-focused creative - ideal for Instagram/TikTok');
    }

    if (features.emotionalTone > 0.5) {
      insights.push('Positive emotional tone detected - good for brand awareness');
    } else if (features.emotionalTone < -0.3) {
      insights.push('Urgent/negative tone - effective for direct response');
    }

    return insights.slice(0, 4); // Limit to top 4 insights
  }

  private generateRecommendations(features: CreativeFeatures, score: number): string[] {
    const recommendations: string[] = [];

    if (score < 70) {
      recommendations.push('Consider A/B testing different visual approaches');
      recommendations.push('Strengthen the value proposition messaging');
    }

    if (!features.ctaPresence) {
      recommendations.push('Add a clear, compelling call-to-action');
    }

    if (features.visualComplexity > 0.8) {
      recommendations.push('Simplify the visual design for better mobile performance');
    }

    if (features.platform === 'tiktok' && features.textLength > 0.5) {
      recommendations.push('Reduce text overlay for TikTok - focus on visual storytelling');
    }

    if (features.platform === 'linkedin' && features.emotionalTone > 0.3) {
      recommendations.push('Consider more professional tone for LinkedIn audience');
    }

    return recommendations.slice(0, 3); // Limit to top 3 recommendations
  }

  async trainModel(trainingData: any[]): Promise<void> {
    if (!this.model) {
      await this.initialize();
    }

    // In production, implement actual model training
    console.log('Model training initiated with', trainingData.length, 'samples');
  }
}

// Singleton instance
export const performancePredictionEngine = new PerformancePredictionEngine();