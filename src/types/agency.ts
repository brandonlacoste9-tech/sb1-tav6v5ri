export interface AgencyPartner {
  id: string;
  name: string;
  email: string;
  company: string;
  website?: string;
  tier: 'starter' | 'pro' | 'enterprise';
  status: 'pending' | 'active' | 'suspended' | 'cancelled';
  clientCount: number;
  monthlyRevenue: number;
  commissionRate: number;
  whiteLabel: boolean;
  customBranding?: {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    companyName: string;
  };
  accountManager?: string;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgencyClient {
  id: string;
  agencyId: string;
  name: string;
  email: string;
  company: string;
  industry: string;
  monthlyBudget: number;
  status: 'active' | 'paused' | 'churned';
  campaigns: string[];
  performanceMetrics: {
    totalSpend: number;
    totalRevenue: number;
    roas: number;
    avgCtr: number;
    avgCpa: number;
  };
  createdAt: Date;
  lastActivity: Date;
}

export interface AgencyDashboardData {
  partner: AgencyPartner;
  clients: AgencyClient[];
  totalRevenue: number;
  totalCommission: number;
  activeClients: number;
  avgClientRoas: number;
  monthlyGrowth: number;
  topPerformingClients: AgencyClient[];
}

export interface WhiteLabelConfig {
  agencyId: string;
  branding: {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    companyName: string;
    domain?: string;
  };
  features: {
    hideAdgenBranding: boolean;
    customDomain: boolean;
    customEmailTemplates: boolean;
    customReporting: boolean;
  };
  pricing: {
    markup: number; // Percentage markup on base pricing
    customPricing: boolean;
    hideOriginalPricing: boolean;
  };
}

export interface AgencyReport {
  id: string;
  agencyId: string;
  period: 'weekly' | 'monthly' | 'quarterly';
  startDate: Date;
  endDate: Date;
  metrics: {
    totalClients: number;
    activeClients: number;
    newClients: number;
    churnedClients: number;
    totalRevenue: number;
    totalCommission: number;
    avgClientRoas: number;
    topPerformingCampaigns: any[];
  };
  insights: string[];
  recommendations: string[];
  generatedAt: Date;
}