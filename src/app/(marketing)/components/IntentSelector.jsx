"use client";

import { useState } from "react";
import {
  Briefcase,
  Gamepad2,
  Zap,
  Newspaper,
  Tag,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const intents = [
  {
    icon: Briefcase,
    title: "Be Productive",
    description: "Tools to boost your workflow",
    href: "/tools",
    gradient: "from-blue-500/20 to-cyan-500/5",
    glow: "hover:shadow-[0_0_40px_rgba(59,130,246,0.25)]",
  },
  {
    icon: Gamepad2,
    title: "Have Fun",
    description: "Games and entertainment",
    href: "/games",
    gradient: "from-purple-500/20 to-pink-500/5",
    glow: "hover:shadow-[0_0_40px_rgba(168,85,247,0.25)]",
  },
  {
    icon: Zap,
    title: "Quick Utilities",
    description: "Fast, simple tools",
    href: "/tools",
    gradient: "from-indigo-500/20 to-sky-500/5",
    glow: "hover:shadow-[0_0_40px_rgba(99,102,241,0.25)]",
  },
  {
    icon: Newspaper,
    title: "Stay Updated",
    description: "News and trending content",
    href: "/news",
    gradient: "from-green-500/20 to-emerald-500/5",
    glow: "hover:shadow-[0_0_40px_rgba(34,197,94,0.25)]",
  },
  {
    icon: Tag,
    title: "Find Deals",
    description: "Best offers and discounts",
    href: "/exclusivedeals",
    gradient: "from-orange-500/20 to-amber-500/5",
    glow: "hover:shadow-[0_0_40px_rgba(249,115,22,0.25)]",
  },
];

export default function IntentSelector() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="section-title mb-4">
            What do you want to do{" "}
            <span className="gradient-text">right now</span>?
          </h2>
          <p className="description max-w-2xl mx-auto">
            Choose your vibe and we’ll guide you to the perfect tools
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {intents.map((intent, index) => {
            const Icon = intent.icon;
            const isHovered = hovered === index;

            return (
              <Link
                key={intent.title}
                href={intent.href}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                className={`group relative rounded-2xl border border-[var(--border)]
                  bg-gradient-to-b ${intent.gradient}
                  backdrop-blur-xl p-6 text-center
                  transition-all duration-300
                  hover:-translate-y-2 ${intent.glow}`}
              >
                {/* Subtle overlay */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition
                  bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center
                      bg-[var(--card)] mb-4 transition-all duration-300
                      ${isHovered ? "scale-110 rotate-3" : ""}`}
                  >
                    <Icon className="w-7 h-7 text-[var(--foreground)]" />
                  </div>

                  {/* Text */}
                  <h3 className="font-semibold text-base mb-1">
                    {intent.title}
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)] mb-3">
                    {intent.description}
                  </p>

                  {/* CTA */}
                  <div
                    className={`flex items-center gap-1 text-xs font-medium text-[var(--primary)]
                      transition-all duration-300
                      ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                  >
                    Explore <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
