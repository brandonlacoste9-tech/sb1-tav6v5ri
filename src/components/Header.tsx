import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Menu, X, User } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const { subscription, loading } = useSubscription();

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-primary-600 p-2 rounded-lg group-hover:bg-primary-700 transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow animate-scale-pulse">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">AdGen AI</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 font-medium transition-all duration-300 hover:scale-105 hover:text-shadow relative">
              Dashboard
            </Link>
            <Link to="/demo" className="text-gray-600 hover:text-primary-600 font-medium transition-all duration-300 hover:scale-105 hover:text-shadow relative">
              AI Demo
            </Link>
            <Link to="/autopsy/templated-campaign-fatigue" className="text-gray-600 hover:text-primary-600 font-medium transition-all duration-300 hover:scale-105 hover:text-shadow relative">
              AI Ad Autopsy
            </Link>
            <Link to="/cms" className="text-gray-600 hover:text-primary-600 font-medium transition-all duration-300 hover:scale-105 hover:text-shadow relative">
              Content
            </Link>
            <Link to="/analytics" className="text-gray-600 hover:text-primary-600 font-medium transition-all duration-300 hover:scale-105 hover:text-shadow relative">
              Analytics
            </Link>
            <Link to="/community" className="text-gray-600 hover:text-primary-600 font-medium transition-all duration-300 hover:scale-105 hover:text-shadow relative">
              Community
            </Link>
            <Link to="/ml-dashboard" className="text-gray-600 hover:text-primary-600 font-medium transition-all duration-300 hover:scale-105 hover:text-shadow relative">
              ML Intelligence
            </Link>
            <Link to="/agency-partners" className="text-gray-600 hover:text-primary-600 font-medium transition-all duration-300 hover:scale-105 hover:text-shadow relative">
              Partners
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-primary-600 font-medium transition-all duration-300 hover:scale-105 hover:text-shadow relative">
              Pricing
            </Link>
            <Link to="/share/adgenai" className="text-gray-600 hover:text-primary-600 font-medium transition-all duration-300 hover:scale-105 hover:text-shadow relative">
              Share
            </Link>
            
            {!loading && subscription ? (
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-900">{subscription.email}</span>
              </div>
            ) : (
              <button className="btn-primary animate-glow">
                <a href="/migration" className="block">Start Free Migration</a>
              </button>
            )}
          </nav>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-4">
            <Link to="/dashboard" className="block text-gray-600 hover:text-primary-600 font-medium">
              Dashboard
            </Link>
            <Link to="/demo" className="block text-gray-600 hover:text-primary-600 font-medium">
              AI Demo
            </Link>
            <Link to="/cms" className="block text-gray-600 hover:text-primary-600 font-medium">
              Content
            </Link>
            <Link to="/pricing" className="block text-gray-600 hover:text-primary-600 font-medium">
              Pricing
            </Link>
            
            <button className="btn-primary w-full">
              Start Free Trial
            </button>
          </div>
        </div>
      )}
    </header>
  );
};