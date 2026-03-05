import { useState } from "react";
import { Zap, Heart, Shield, Star, Quote } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Fast & Simple",
    description: "No bloat, no complexity. Tools that work instantly.",
    gradient: "from-[#22d3ee]/30 to-[#22d3ee]/10", // cyan
    stat: "< 1s",
    statLabel: "Avg load time",
  },
  {
    icon: Heart,
    title: "Curated Content",
    description: "Hand-picked tools, games, and deals worth your time.",
    gradient: "from-[#ec4899]/30 to-[#ec4899]/10", // pink
    stat: "300+",
    statLabel: "Quality tools",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "No tracking, no data collection. Your privacy matters.",
    gradient: "from-[#22c55e]/30 to-[#22c55e]/10", // green
    stat: "0",
    statLabel: "Data collected",
  },
];

const WhyUsersLove = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title mb-4">
            Why Users <span className="gradient-text">Love</span> Us
          </h2>
          <p className="section-subtitle mx-auto">
            Built different, designed better
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHovered = hoveredFeature === index;
            
            return (
              <div
                key={feature.title}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`text-center p-8 rounded-3xl bg-gradient-to-b ${feature.gradient} border border-(--border) cursor-pointer transition-all duration-500 ${
                  isHovered ? "scale-105 shadow-neon -translate-y-2" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-(--card)/50 flex items-center justify-center mb-6 transition-all duration-500 ${
                  isHovered ? "scale-110 rotate-6" : ""
                }`}>
                  <Icon className={`w-8 h-8 text-foreground transition-transform ${
                    isHovered ? "scale-110" : ""
                  }`} />
                </div>
                <h3 className="font-display font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                
                {/* Stat reveal on hover */}
                <div className={`transition-all duration-300 ${
                  isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}>
                  <div className="text-3xl font-bold gradient-text">{feature.stat}</div>
                  <div className="text-xs text-muted-foreground">{feature.statLabel}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUsersLove;
