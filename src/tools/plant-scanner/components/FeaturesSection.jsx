"use client";

import { useState } from "react";
import { Leaf, Zap, Shield } from "lucide-react";

export default function FeaturesSection() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      icon: Leaf,
      title: "AI Plant Identification",
      description:
        "Instantly identify any plant using advanced AI. Get detailed insights about its species, common names, growth patterns, and recommended care routines.",
      big: true,
    },
    {
      icon: Zap,
      title: "Fast & Accurate",
      description:
        "Experience rapid and highly accurate plant recognition powered by cutting-edge algorithms, delivering reliable results within seconds for every image.",
    },
    {
      icon: Shield,
      title: "Privacy Protected",
      description:
        "Your images never leave your device. All processing happens securely in your browser, ensuring complete privacy with no data stored or shared externally.",
    },
  ];

  return (
    <section
      id="features"
      className="py-16 md:py-24 bg-linear-to-br from-(--background) to-(--muted)"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-(--foreground) mb-4">
            Key Features
          </h2>

          <p className="text-(--muted-foreground) max-w-2xl mx-auto text-base md:text-lg">
            Everything you need to identify and learn about plants safely and
            instantly.
          </p>
        </div>

        {/* Flex Layout - Equal Width Cards */}
        <div className="flex flex-col md:flex-row gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className="
          flex-1
          relative rounded-2xl p-6 md:p-8
          bg-(--card)
          border border-(--border)
          transition-all duration-300
          hover:-translate-y-2
          hover:shadow-xl
        "
              >
                <div
                  className={`
            w-14 h-14 rounded-xl
            flex items-center justify-center
            mb-4
            bg-(--primary)
            text-(--primary-foreground)
            transition-transform duration-300
            ${hoveredCard === index ? "scale-110" : "scale-100"}
          `}
                >
                  <Icon size={28} />
                </div>

                <h3 className="text-xl font-bold text-(--foreground) mb-2">
                  {feature.title}
                </h3>

                <p className="text-(--muted-foreground) leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
