
import { useState, useEffect } from 'react';
import { TrendingUp, Users, Brain, Zap } from 'lucide-react';

export const StatsSection = () => {
  const [counts, setCounts] = useState({
    writers: 0,
    collaborations: 0,
    aiEnhancements: 0,
    emotionalInsights: 0
  });

  const finalCounts = {
    writers: 15423,
    collaborations: 2847,
    aiEnhancements: 125000,
    emotionalInsights: 89432
  };

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    const counters = Object.keys(finalCounts).map(key => {
      const increment = finalCounts[key as keyof typeof finalCounts] / steps;
      let currentValue = 0;
      
      return setInterval(() => {
        currentValue += increment;
        setCounts(prev => ({
          ...prev,
          [key]: Math.floor(currentValue)
        }));
        
        if (currentValue >= finalCounts[key as keyof typeof finalCounts]) {
          setCounts(prev => ({
            ...prev,
            [key]: finalCounts[key as keyof typeof finalCounts]
          }));
        }
      }, stepDuration);
    });

    return () => counters.forEach(clearInterval);
  }, []);

  const stats = [
    {
      icon: Users,
      label: "Active Writers",
      value: counts.writers.toLocaleString(),
      color: "text-blue-400"
    },
    {
      icon: TrendingUp,
      label: "Collaborations Today",
      value: counts.collaborations.toLocaleString(),
      color: "text-green-400"
    },
    {
      icon: Brain,
      label: "AI Enhancements",
      value: counts.aiEnhancements.toLocaleString(),
      color: "text-purple-400"
    },
    {
      icon: Zap,
      label: "Emotional Insights",
      value: counts.emotionalInsights.toLocaleString(),
      color: "text-pink-400"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
