export interface TrackingEvent {
  event: string;
  properties: Record<string, any>;
  userId?: string;
  timestamp: Date;
}

export interface ComparisonView {
  id: string;
  userId?: string;
  competitorName: string;
  viewDuration: number;
  scrollDepth: number;
  ctaClicked: boolean;
  conversionType?: 'signup' | 'migration' | 'demo';
  referrer?: string;
  userAgent: string;
  timestamp: Date;
}

export class AnalyticsTracker {
  private events: TrackingEvent[] = [];
  private sessionId: string;
  private startTime: number;

  constructor() {
    this.sessionId = crypto.randomUUID();
    this.startTime = Date.now();
    this.initializeTracking();
  }

  private initializeTracking(): void {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.track('page_hidden', { duration: Date.now() - this.startTime });
      } else {
        this.startTime = Date.now();
        this.track('page_visible', {});
      }
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        this.track('scroll_depth', { depth: scrollDepth });
      }
    });

    // Track clicks on comparison elements
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.closest('[data-track]')) {
        const trackingData = target.closest('[data-track]')?.getAttribute('data-track');
        if (trackingData) {
          this.track('element_click', { element: trackingData });
        }
      }
    });
  }

  track(event: string, properties: Record<string, any> = {}): void {
    const trackingEvent: TrackingEvent = {
      event,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date()
    };

    this.events.push(trackingEvent);
    
    // Send to analytics service
    this.sendToAnalytics(trackingEvent);
  }

  trackComparisonView(competitorName: string): void {
    this.track('comparison_view', {
      competitor: competitorName,
      page: window.location.pathname
    });
  }

  trackCTAClick(ctaType: string, competitor?: string): void {
    this.track('cta_click', {
      type: ctaType,
      competitor: competitor || 'unknown',
      position: this.getElementPosition(event?.target as HTMLElement)
    });
  }

  trackConversion(type: 'signup' | 'migration' | 'demo', competitor?: string): void {
    this.track('conversion', {
      type,
      competitor: competitor || 'unknown',
      sessionDuration: Date.now() - this.startTime
    });
  }

  trackFeatureInteraction(feature: string, action: string): void {
    this.track('feature_interaction', {
      feature,
      action,
      timestamp: new Date().toISOString()
    });
  }

  private async sendToAnalytics(event: TrackingEvent): Promise<void> {
    try {
      // Send to Supabase edge function for analytics processing
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analytics-tracker`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(event)
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  private getElementPosition(element: HTMLElement): { x: number; y: number } {
    if (!element) return { x: 0, y: 0 };
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  getSessionSummary(): {
    sessionId: string;
    duration: number;
    eventCount: number;
    topEvents: string[];
  } {
    const duration = Date.now() - this.startTime;
    const eventCounts = this.events.reduce((acc, event) => {
      acc[event.event] = (acc[event.event] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topEvents = Object.entries(eventCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([event]) => event);

    return {
      sessionId: this.sessionId,
      duration,
      eventCount: this.events.length,
      topEvents
    };
  }
}

// Singleton instance
export const analyticsTracker = new AnalyticsTracker();

// Convenience functions
export const trackComparisonView = (competitor: string) => 
  analyticsTracker.trackComparisonView(competitor);

export const trackCTAClick = (type: string, competitor?: string) => 
  analyticsTracker.trackCTAClick(type, competitor);

export const trackConversion = (type: 'signup' | 'migration' | 'demo', competitor?: string) => 
  analyticsTracker.trackConversion(type, competitor);

export const trackFeature = (feature: string, action: string) => 
  analyticsTracker.trackFeatureInteraction(feature, action);