"use client";

import { useState } from "react";
import {
  Flame,
  TrendingUp,
  Wrench,
  Puzzle,
  Gamepad2,
  Heart,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";


const tabs = [
  { id: "tools", label: "Tools", icon: Wrench },
  { id: "extensions", label: "Extensions", icon: Puzzle },
  { id: "games", label: "Games", icon: Gamepad2 },
];

const trendingItems = {
  tools: [
    
    {
      name: "BG Remover",
      usage: "8.2k uses",
      trending: true,
      likes: 189,
      href: "/tools/bg-remover",
      image: "/trending/tools/bgremove.png",
    },
    {
      name: "Annimation Generator",
      usage: "6.8k uses",
      trending: false,
      likes: 156,
      href: "/tools/animation-generator",
      image: "/trending/tools/annimation.png",
      
    },
    {
      name: "Image Compressor",
      usage: "6.8k uses",
      trending: false,
      likes: 156,
      href: "/tools/image-compressor",
      image: "/trending/tools/imagered.png",

    },
    {
      name: "FB-Ad Generator",
      usage: "6.8k uses",
      trending: false,
      likes: 156,
      href: "/tools/facebook-ad-generator",
      image: "/trending/tools/fbadd.png",
    },
    {
      name: "Age Gender Detector",
      usage: "12.5k uses",
      trending: true,
      likes: 234,
      href: "/tools/age-gender-detector",
      image: "/trending/tools/agegender.png",
    },
    {
      name: "Youtube Video Analyzer",
      usage: "6.8k uses",
      trending: false,
      likes: 156,
      href: "/tools/youtube-video-analyzer",
      image: "/trending/tools/ytan.png",

    },
  ],
  extensions: [
    {
      name: "Auto Form Filler",
      usage: "9.3k installs",
      trending: true,
      likes: 312,
      href: "/extensions/auto-form-filler",
    },
    {
      name: "Auto Question Extractor",
      usage: "7.1k installs",
      trending: false,
      likes: 267,
      href: "/extensions/auto-question-extractor",
    },
    {
      name: "Bookmark Manager",
      usage: "7.1k installs",
      trending: false,
      likes: 267,
      href: "/extensions",
    },
    {
      name: "Budget Planner",
      usage: "7.1k installs",
      trending: false,
      likes: 267,
      href: "/extensions/budget-planner",
    },
    {
      name: "Image Cropper",
      usage: "7.1k installs",
      trending: false,
      likes: 267,
      href: "/extensions/image-cropper",
    },
    {
      name: "Image To PDF Converter",
      usage: "7.1k installs",
      trending: false,
      likes: 267,
      href: "/extensions/image-to-pdf",
    },
  ],
  games: [
    {
      name: "Cricket",
      usage: "15.2k plays",
      trending: true,
      likes: 456,
      href: "/games/cricket",
      image: "/trending/game/cricke.jpg",
    },
    {
      name: "Fruit Clash",
      usage: "11.8k plays",
      trending: true,
      likes: 389,
      href: "/games/fruit-clash",
      image: "/trending/game/fruit.jpg",
    },
    {
      name: "Flappy Bird",
      usage: "11.8k plays",
      trending: true,
      likes: 389,
      href: "/games/flappy-bird",
      image: "/trending/game/flappyb.jpg",

    },
    {
      name: "Neon Racer",
      usage: "11.8k plays",
      trending: true,
      likes: 389,
      href: "/games/neon-racer",
      image: "/trending/game/Neon.png",
    },
    {
      name: "Snake IO",
      usage: "11.8k plays",
      trending: true,
      likes: 389,
      href: "/games/snake-io",
      image: "/trending/game/snake.jpg",
    },
    {
      name: "Chess",
      usage: "11.8k plays",
      trending: true,
      likes: 389,
      href: "/games/chess",
      image: "/trending/game/chess.png",
    },
  ],
};

export default function TrendingSection() {
  const [activeTab, setActiveTab] = useState("tools");
  const [liked, setLiked] = useState({});

  return (
    <section className="py-6">
      <div className="container mx-auto space-y-6 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-orange-500 text-sm font-semibold">
              <Flame className="w-4 h-4" /> Trending now
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Trending <span className="text-gradient">This Week</span>
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl overflow-x-auto no-scrollbar whitespace-nowrap max-w-full">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium flex-shrink-0 transition cursor-pointer ${
                  activeTab === id
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2">
          {trendingItems[activeTab].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group snap-start min-w-[260px] sm:min-w-[280px] lg:min-w-[300px] xl:min-w-[320px] rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 flex-shrink-0 overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Image container with fixed aspect ratio */}
              {item.image && (
                <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-3">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  {item.trending && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-orange-500 text-white rounded-full text-xs animate-pulse">
                      🔥 Hot
                    </span>
                  )}
                </div>
              )}

              {/* Name */}
              <h3 className="font-semibold text-base sm:text-lg truncate mb-1">
                {item.name}
              </h3>

              {/* Usage */}
             <div className="flex items-center justify-between mt-1">
  {/* Usage */}
  <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
    {item.usage}
  </p>

  {/* Try Now button */}
  <div className="flex items-center gap-1 text-xs sm:text-sm text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    Try Now <ExternalLink className="w-3 h-3" />
  </div>
</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}