"use client";

import React from "react";
import { QrCode, Camera, Zap, CheckCircle } from "lucide-react";

const QRScannerHero = () => {
  const features = [
    { icon: Camera, label: "Camera Scan" },
    { icon: Zap, label: "Instant Results" },
    { icon: CheckCircle, label: "High Accuracy" },
    { icon: QrCode, label: "All QR Types" },
  ];

  const stats = [
    { value: "∞", label: "Unlimited Scans" },
    { value: "0ms", label: "Latency" },
    { value: "99.9%", label: "Accuracy Rate" },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Glow Blobs */}
      <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-(--primary) opacity-10 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-(--primary) opacity-10 blur-3xl animate-pulse"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-(--primary) bg-(--muted) mb-6 animate-fadeIn">
          <QrCode className="w-5 h-5 text-(--primary)" />
          <span className="text-sm font-semibold text-(--primary)">
            Instant QR Scanner
          </span>
        </div>

        {/* Heading */}
        <h1 className="heading mb-6">
          Scan QR Codes <br />
          <span className="text-(--foreground)">Effortlessly</span>
        </h1>

        {/* Subtext */}
        <p className="description max-w-2xl mx-auto mb-10">
          Scan QR codes instantly using your camera or upload images.
          <span className="text-(--primary) font-semibold">
            {" "}
            No data stored
          </span>
          , works offline, and completely free.
        </p>

        {/* Feature Chips */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-(--border) bg-(--card) hover:border-(--primary) transition hover:-translate-y-1"
              >
                <Icon className="w-4 h-4 text-(--primary)" />
                <span className="text-sm font-medium text-(--foreground)">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* QR Pattern Decorative */}
        <div className="grid grid-cols-9 gap-1 max-w-62.5 mx-auto opacity-30 mb-14">
          {Array.from({ length: 81 }).map((_, index) => {
            const active = index % 2 === 0;
            return (
              <div
                key={index}
                className={`w-full aspect-square rounded-sm ${
                  active ? "bg-(--primary)" : "bg-transparent"
                }`}
              ></div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="px-6 py-4 rounded-2xl bg-(--card) border border-(--border) hover:border-(--primary) transition hover:-translate-y-1"
            >
              <div className="text-3xl font-extrabold text-(--primary)">
                {stat.value}
              </div>
              <div className="text-sm text-(--muted-foreground) font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QRScannerHero;
