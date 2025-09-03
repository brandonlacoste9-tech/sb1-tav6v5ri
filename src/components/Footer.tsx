import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Twitter, Linkedin, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-primary-600 p-2 rounded-lg animate-scale-pulse">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">AdGen AI</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              The Full-Stack Marketing Brain for performance marketers who demand 
              results, not just pretty pictures. Built for ROI optimization.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-125 hover:shadow-glow">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-125 hover:shadow-glow">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-125 hover:shadow-glow">
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Product</h3>
            <ul className="space-y-4">
              <li><Link to="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/templates" className="text-gray-400 hover:text-white transition-colors">Templates</Link></li>
              <li><Link to="/integrations" className="text-gray-400 hover:text-white transition-colors">Integrations</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Resources</h3>
            <ul className="space-y-4">
              <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">AI Ad Autopsy Blog</Link></li>
              <li><Link to="/case-studies" className="text-gray-400 hover:text-white transition-colors">Case Studies</Link></li>
              <li><Link to="/migration" className="text-gray-400 hover:text-white transition-colors">Migration Guide</Link></li>
              <li><Link to="/support" className="text-gray-400 hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 AdGen AI. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/security" className="text-gray-400 hover:text-white text-sm transition-colors">
                Security
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};