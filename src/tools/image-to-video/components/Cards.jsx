"use client";

import React from "react";
import {
  WifiOff,
  Sparkles,
  Instagram,
  ShieldCheck,
  Monitor,
  Lock
} from "lucide-react";

export default function Cards() {
  const cardData = [
    {
      title: "Offline & Fast",
      description:
        "Convert your images into videos fully in-browser, without any server or login.",
      icon: WifiOff,
    },
    {
      title: "Multiple Transitions",
      description:
        "Choose from fade, slide, zoom and more to make your video look professional.",
      icon: Sparkles,
    },
    {
      title: "Perfect for Socials",
      description:
        "Ideal for reels, shorts, mockups, and stories. Works on all modern browsers.",
      icon: Instagram,
    },
    {
      title: "No Watermarks",
      description:
        "Generate videos without any watermark, fully clean output for your projects.",
      icon: ShieldCheck,
    },
    {
      title: "High Resolution",
      description:
        "Output videos in HD quality, perfect for social media and presentations.",
      icon: Monitor,
    },
    {
      title: "Fully Frontend",
      description:
        "Everything runs in your browser. No uploads, no server, 100% privacy.",
      icon: Lock,
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {cardData.map((card, idx) => {
        const Icon = card.icon;

        return (
          <div
            key={idx}
            className="
              bg-(--card)
              border border-(--border)
              rounded-2xl
              p-6
              shadow-sm
              hover:shadow-xl
              transition-all
              duration-300
              hover:-translate-y-2
              group
            "
          >
            {/* Icon */}
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-(--primary)/10 mb-4 group-hover:bg-(--primary)/20 transition">
              <Icon className="w-6 h-6 text-(--primary)" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-(--foreground) mb-2">
              {card.title}
            </h3>

            {/* Description */}
            <p className="text-(--muted-foreground) text-sm leading-relaxed">
              {card.description}
            </p>
          </div>
        );
      })}
    </section>
  );
}
