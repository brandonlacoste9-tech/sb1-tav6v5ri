import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { CompetitorComparison } from './components/CompetitorComparison';
import { Testimonials } from './components/Testimonials';
import { Pricing } from './components/Pricing';
// import { Dashboard } from './components/Dashboard';
import { EnhancedDashboard } from './components/EnhancedDashboard';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ComparisonPage } from './pages/ComparisonPage';
import { AutopsyPage } from './pages/AutopsyPage';
import { MigrationIntake } from './components/MigrationIntake';
import { AgencyPartnerOnePager } from './components/AgencyPartnerOnePager';
import { AgencyManagementDashboard } from './components/AgencyManagementDashboard';
import { CMSDashboard } from './components/CMSDashboard';
import { PerformancePredictionDemo } from './components/PerformancePredictionDemo';
import { ViralGrowthEngine } from './components/ViralGrowthEngine';
import { CommunityHub } from './components/CommunityHub';
import { AdvancedMLDashboard } from './components/AdvancedMLDashboard';
import { ShareSummary } from './pages/ShareSummary';
import { ShareChangelog } from './pages/ShareChangelog';
import { SharePressKit } from './pages/SharePressKit';
import { AccountLinkingFixed } from './components/AccountLinkingFixed';
import { OAuthCallback } from './components/OAuthCallback';
import { AccountSettings } from './pages/AccountSettings';
import { Footer } from './components/Footer';

const HomePage: React.FC = () => (
  <>
    <Hero />
    <Features />
    <CompetitorComparison />
    <Testimonials />
    <Pricing />
  </>
);

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<EnhancedDashboard />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/compare/:slug" element={<ComparisonPage />} />
            <Route path="/autopsy/:slug" element={<AutopsyPage />} />
            <Route path="/migration" element={<div className="min-h-screen bg-gray-50 pt-20 py-12"><div className="max-w-4xl mx-auto px-4"><MigrationIntake /></div></div>} />
            <Route path="/agency-partners" element={<div className="min-h-screen bg-gray-50 pt-20"><AgencyPartnerOnePager /></div>} />
            <Route path="/agency-dashboard" element={<AgencyManagementDashboard />} />
            <Route path="/cms" element={<CMSDashboard />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/demo" element={<div className="min-h-screen bg-gray-50 pt-20 py-12"><PerformancePredictionDemo /></div>} />
            <Route path="/viral" element={<div className="min-h-screen bg-gray-50 pt-20 py-12"><ViralGrowthEngine /></div>} />
            <Route path="/community" element={<CommunityHub />} />
            <Route path="/ml-dashboard" element={<AdvancedMLDashboard />} />
            <Route path="/share/adgenai" element={<div className="min-h-screen"><ShareSummary /></div>} />
            <Route path="/share/changelog" element={<div className="min-h-screen"><ShareChangelog /></div>} />
            <Route path="/share/press-kit" element={<div className="min-h-screen"><SharePressKit /></div>} />
            <Route path="/account-linking" element={<div className="min-h-screen bg-gray-50 pt-20 py-12"><AccountLinkingFixed /></div>} />
            <Route path="/auth/callback" element={<div className="min-h-screen bg-gray-50 pt-20 py-12"><div>OAuth Callback Test</div></div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;