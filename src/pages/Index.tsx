
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Users, Zap, Target, TrendingUp, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { FeatureGrid } from '@/components/FeatureGrid';
import { StatsSection } from '@/components/StatsSection';
import { BlogFeed } from '@/components/BlogFeed';

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <main className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <HeroSection />
        
        {/* 3D Model Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Experience
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> 3D Innovation</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Explore our interactive 3D model that brings creativity to life.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              <iframe 
                src="https://sketchfab.com/models/9adb85301caf42a8a59988da1a41d508/embed?autostart=1&internal=1&tracking=0&ui_ar=0&ui_infos=0&ui_snapshots=1&ui_stop=0&ui_theatre=1&ui_watermark=0"
                width="100%" 
                height="600" 
                allow="autoplay; fullscreen; xr-spatial-tracking" 
                xr-spatial-tracking="true" 
                execution-while-out-of-viewport="true" 
                execution-while-not-rendered="true" 
                web-share="true"
                className="w-full"
              />
            </div>
          </div>
        </section>
        
        <StatsSection />
        <FeatureGrid />
        <BlogFeed />
      </main>
    </div>
  );
};

export default Index;
