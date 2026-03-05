"use client";

import React, { useState } from "react";
import { Barcode, Zap, Shield, Download } from "lucide-react";

export default function QRCodeFeatures() {
  const [clickedCard, setClickedCard] = useState(null);

  const features = [
    {
      icon: Barcode,
      title: "Multiple Formats",
      description:
        "Scan all types of QR codes: URLs, UPI, vCards, WiFi, text, and more instantly.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Scan QR codes in real-time — almost instantly without delays.",
    },
    {
      icon: Shield,
      title: "100% Secure",
      description:
        "Privacy-focused: scanning is fully client-side, no data leaves your device.",
    },
    {
      icon: Download,
      title: "Offline & Export",
      description:
        "Save scanned QR codes or generated codes as PNG or SVG for offline use.",
    },
  ];

  const handleClick = (i) => {
    setClickedCard(i);
    setTimeout(() => setClickedCard(null), 400);
  };

  return (
    <section id="features" className="relative py-20 px-4 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-(--primary) opacity-10 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 -left-20 w-72 h-72 rounded-full bg-(--primary) opacity-10 blur-3xl animate-pulse"></div>

      {/* Header */}
      <div className="text-center mb-14 relative z-10">
        <div className="inline-block px-4 py-1 rounded-full border border-(--border) bg-(--card) text-(--primary) text-sm font-semibold mb-4">
          ⚡ Powerful Features
        </div>

        <h2 className="heading">Everything You Need for QR Scanning</h2>

        <p className="description max-w-2xl mx-auto mt-4">
          Fast, secure, and offline-ready QR scanning for all your needs.
        </p>
      </div>

      {/* Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {features.map((feature, i) => {
          const Icon = feature.icon;

          return (
            <div
              key={i}
              onClick={() => handleClick(i)}
              className={`
                p-6 rounded-2xl 
                bg-(--card) 
                border border-(--border)
                transition-all duration-300
                hover:-translate-y-3
                hover:border-(--primary)
                cursor-pointer
                ${clickedCard === i ? "scale-95" : "scale-100"}
              `}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-(--primary) flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-(--primary-foreground)" />
              </div>

              {/* Title */}
              <h3 className="font-bold text-lg text-(--foreground) mb-2">
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
    </section>
  );
}
