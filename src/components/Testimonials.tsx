import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Performance Marketing Manager',
      company: 'TechFlow Solutions',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'After getting burned by AdCreative.ai\'s surprise billing and templated designs, AdGen AI was a breath of fresh air. The fraud detection alone saved us $3,200 in our first month.',
      previousTool: 'AdCreative.ai',
      improvement: '340% ROAS increase'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Digital Marketing Director',
      company: 'GrowthLab Agency',
      image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'We were paying $2,800/month for Smartly.io and getting the same results we now get with AdGen AI for $500. The ROI is incredible, and our clients love the transparent reporting.',
      previousTool: 'Smartly.io',
      improvement: '82% cost reduction'
    },
    {
      name: 'Emily Watson',
      role: 'E-commerce Marketing Lead',
      company: 'StyleCo',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'Canva was great for basic designs, but we needed performance data. AdGen AI gives us beautiful creatives AND the analytics to prove they work. Game changer.',
      previousTool: 'Canva Pro',
      improvement: '156% CTR improvement'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Marketers Are Making The Switch
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from performance marketers who left overpriced, 
            unreliable competitors for AdGen AI's transparent, results-driven platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 hover:scale-105 relative overflow-hidden shimmer"
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-success-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4 hover:scale-110 transition-transform duration-300 shadow-lg"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
              </div>

              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current animate-bounce-gentle" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>

              <Quote className="w-8 h-8 text-gray-300 mb-4 animate-float" />
              
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Switched from:</span>
                  <span className="font-medium text-gray-700">{testimonial.previousTool}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="text-gray-500">Result:</span>
                  <span className="font-semibold text-success-600 animate-pulse-slow">{testimonial.improvement}</span>
                </div>
              </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-primary-600 text-white p-8 rounded-2xl max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Join 10,000+ Marketers Who've Made The Switch
            </h3>
            <p className="text-lg opacity-90 mb-6">
              Stop wasting budget on templated designs and deceptive billing. 
              Start optimizing for real performance today.
            </p>
            <button className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Your Free Migration
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};