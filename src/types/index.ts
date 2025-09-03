export interface AdCreative {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  platform: 'facebook' | 'google' | 'instagram' | 'tiktok';
  performanceScore: number;
  fraudScore: number;
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt: Date;
  metrics?: AdMetrics;
}

export interface AdMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpa: number;
  roas: number;
}

export interface BrandKit {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  fonts: string[];
  tone: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  brandKits: BrandKit[];
  createdAt: Date;
}

export interface FraudAnalysis {
  score: number;
  riskLevel: 'low' | 'medium' | 'high';
  factors: string[];
  recommendation: string;
}

export interface PerformancePrediction {
  score: number;
  expectedCtr: number;
  expectedCpa: number;
  confidence: number;
  insights: string[];
}

export type OAuthProvider = 'google' | 'facebook' | 'github' | 'twitter' | 'linkedin' | 'microsoft';

export interface LinkedAccount {
  id: string;
  user_id: string;
  provider: OAuthProvider;
  provider_user_id: string;
  provider_email?: string;
  provider_name?: string;
  provider_avatar_url?: string;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
  metadata: Record<string, any>;
  is_primary: boolean;
  linked_at: string;
  last_used_at: string;
  created_at: string;
  updated_at: string;
}

export interface AccountLinkRequest {
  id: string;
  user_id: string;
  provider: OAuthProvider;
  state_token: string;
  redirect_url?: string;
  expires_at: string;
  created_at: string;
}

export interface AccountLinkingState {
  linkedAccounts: LinkedAccount[];
  loading: boolean;
  error: string | null;
  isLinking: boolean;
}