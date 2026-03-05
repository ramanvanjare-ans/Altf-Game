"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Flame, Users, Eye } from "lucide-react";
import Image from "next/image";


const themeMap = {
  hot: {
    tabActive: "bg-red-600 text-white shadow-red-200",
    tag: "bg-red-500 text-white",
    border: "border-red-600",
    rankText: "text-red-600",
    discountBg: "bg-red-600/10 text-red-600",
    button: "bg-red-600 hover:bg-red-600 text-white",
  },
  trending: {
    tabActive: "bg-green-500 text-white shadow-blue-200",
    tag: "bg-green-500 text-white",
    border: "border-blue-500",
    rankText: "text-blue-500",
    discountBg: "bg-blue-500/10 text-blue-500",
    button: "bg-green-500 hover:bg-blue-600 text-white",
  },
  popular: {
    tabActive: "bg-purple-500 text-white shadow-purple-200",
    tag: "bg-purple-500 text-white",
    border: "border-purple-500",
    rankText: "text-purple-500",
    discountBg: "bg-purple-500/10 text-purple-500",
    button: "bg-purple-500 hover:bg-purple-600 text-white",
  },
};


export default function TrendingNow({ trendingDeals }) {
  const [activeTab, setActiveTab] = useState("hot");
  const [liveViews, setLiveViews] = useState({});

  // Simulate live view counts
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViews((prev) => {
        const updated = { ...prev };
        trendingDeals.forEach((deal) => {
          updated[deal.id] = (prev[deal.id] || deal.viewCount) + Math.floor(Math.random() * 5);
        });
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [trendingDeals]);

  const activeTheme = themeMap[activeTab];

  const tabs = [
    { id: "hot", label: "Hot Deals", icon: Flame },
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "popular", label: "Most Popular", icon: Users },
  ];

  const filteredDeals = trendingDeals.filter((deal) => {
    if (activeTab === "hot") return deal.tag === "hot";
    if (activeTab === "trending") return deal.tag === "trending";
    return deal.tag === "popular";
  });

  return (
    <section className="pb-20 bg-(--background)">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              {/* <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                <Flame className="w-6 h-6 text-white" />
              </div> */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-(--foreground)">
                  Trending Now
                </h2>
                <p className="text-(--muted-foreground) text-sm">
                  Live deals everyone's grabbing
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-(--background) rounded-full border border-(--border)">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-(--foreground)">
                Live
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm
                  transition-all duration-300 whitespace-nowrap cursor-pointer
                  ${
                    activeTab === tab.id
                      ? activeTheme.tabActive
                      : "bg-(--background) text-(--muted-foreground) hover:bg-(--muted)"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Deals Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredDeals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative bg-(--background) border border-(--border) rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
              >
                {/* Rank Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="w-10 h-10 rounded-full bg-(--card) border-2 border-(--primary) flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-(--primary)">
                      #{index + 1}
                    </span>
                  </div>
                </div>

                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={deal.image}
                    alt={deal.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                  {/* Live Views */}
                  <div className="absolute bottom-4 right-4">
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                      <Eye className="w-3.5 h-3.5 text-white" />
                      <span className="text-xs font-semibold text-white">
                        {liveViews[deal.id] || deal.viewCount} watching
                      </span>
                    </div>
                  </div>

                  {/* Tag */}
                  <div className="absolute top-4 right-4">
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className={`inline-block px-3 py-1 text-xs font-bold rounded-full shadow-lg ${activeTheme.tag}`}

                    >
                      {deal.tag === "hot" && "Hot"}
                      {deal.tag === "trending" && "Trending"}
                      {deal.tag === "popular" && "Popular"}
                    </motion.span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 pt-1">
                  <span className="text-xs font-medium text-(--muted-foreground) uppercase tracking-wide">
                    {deal.category}
                  </span>

                  <h3 className="font-semibold text-(--foreground)  line-clamp-2 min-h-6">
                    {deal.title}
                  </h3>

                  <div className="flex items-center gap-4 mt-4 mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-green-600">
                        ${deal.salePrice}
                      </span>
                      <span className="text-sm text-(--muted-foreground) line-through">
                        ${deal.originalPrice}
                      </span>
                    </div>
                    <span className="px-2 py-1 bg-(--primary)/10 text-(--primary) text-xs font-bold rounded-xl">
                      -{deal.discount}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-(--muted-foreground) mb-2">
                      <span>Claimed: {deal.claimedPercent}%</span>
                      <span>{deal.stockLeft} left</span>
                    </div>
                    <div className="h-2 bg-(--muted) rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${deal.claimedPercent}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-full bg-linear-to-r from-green-600 to-red-500 rounded-full`}
                      />
                    </div>
                  </div>

                  <a
                    href={deal.ctaLink}
                    target="_blank"
                    className={`block w-full text-center px-4 py-3 rounded-xl bg-(--primary) hover:opacity-90 text-(--primary-foreground) font-semibold transition`}
                  >
                    Claim Deal
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}