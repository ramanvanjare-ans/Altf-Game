"use client";

import {
  Clock,
  Globe,
  Zap,
  Sparkles,
} from "lucide-react";

const features = [
  {
    title: "Smart Time Matching",
    description:
      "Automatically finds the best overlapping time for all participants, saving hours of manual coordination.",
    icon: Clock,
  },
  {
    title: "Global Timezone Support",
    description:
      "Works seamlessly across all countries and time zones with accurate daylight handling.",
    icon: Globe,
  },
  {
    title: "Fast & Accurate Results",
    description:
      "Instant calculations powered by reliable timezone logic for precise scheduling.",
    icon: Zap,
  },
  {
    title: "Clean User Experience",
    description:
      "Minimal, distraction-free interface designed for speed and clarity.",
    icon: Sparkles,
  },
];

export default function Features() {
  return (
    <section className="w-full py-20 px-4 bg-(--background)"id="features" >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="heading md:text-5xl text-(--foreground) mb-4">
            Powerful Features
          </h2>
          <p className="description max-w-2xl mx-auto">
            Everything you need to schedule meetings effortlessly across time zones.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="
                  bg-(--card)
                  border border-(--border)
                  rounded-2xl
                  p-6
                  transition-all
                  hover:shadow-xl
                  hover:-translate-y-1
                  duration-300
                "
              >
                {/* Icon */}
                <div className="
                  w-12 h-12
                  flex items-center justify-center
                  rounded-xl
                  bg-(--primary)
                  text-(--primary-foreground)
                  mb-5
                ">
                  <Icon size={22} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-(--foreground) mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-(--muted-foreground) leading-relaxed">
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
