"use client";

import {
  Wrench,
  Puzzle,
  Gamepad2,
  Newspaper,
  BookOpen,
  Tag,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const categories = [
  {
    icon: Wrench,
    title: "Micro Tools",
    count: "100+",
    description: "Productivity boosters & quick utilities",
    gradient: "from-blue-500/30 via-blue-500/10 to-transparent",
    iconBg: "bg-blue-500/20",
    hoverColor: "group-hover:text-blue-400",
    href: "/tools",
    bgImage:
      "https://www.syncfusion.com/blogs/wp-content/uploads/2025/04/Syncfusions-Free-Tools-Every-Developer-Should-Know.jpg",
  },
  {
    icon: Puzzle,
    title: "Browser Extensions",
    count: "100+",
    description: "Enhance your browsing experience",
    gradient: "from-purple-500/30 via-purple-500/10 to-transparent",
    iconBg: "bg-purple-500/20",
    hoverColor: "group-hover:text-purple-400",
    href: "/extensions",
    bgImage:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    icon: Gamepad2,
    title: "Mini Games",
    count: "100+",
    description: "Quick fun when you need a break",
    gradient: "from-cyan-500/30 via-cyan-500/10 to-transparent",
    iconBg: "bg-cyan-500/20",
    hoverColor: "group-hover:text-cyan-400",
    href: "/games",
    bgImage:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    icon: Newspaper,
    title: "News",
    count: "Fresh",
    description: "Latest updates & trending news",
    gradient: "from-green-500/30 via-green-500/10 to-transparent",
    iconBg: "bg-green-500/20",
    hoverColor: "group-hover:text-green-400",
    href: "/news",
    bgImage:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    icon: BookOpen,
    title: "Blogs",
    count: "Updated",
    description: "Guides, tips & insights",
    gradient: "from-indigo-500/30 via-indigo-500/10 to-transparent",
    iconBg: "bg-indigo-500/20",
    hoverColor: "group-hover:text-indigo-400",
    href: "/blogs",
    bgImage:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    icon: Tag,
    title: "Deals & Offers",
    count: "Live",
    description: "Best discounts and promotions",
    gradient: "from-orange-500/30 via-orange-500/10 to-transparent",
    iconBg: "bg-orange-500/20",
    hoverColor: "group-hover:text-orange-400",
    href: "/exclusivedeals",
    bgImage:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=1200&auto=format&fit=crop",
  },
];

const FeaturedCategories = () => {
  return (
    <section className="pt-12 relative" id="categories">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="section-title mb-4">
            Explore <span className="gradient-text">Categories</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Dive into our curated collections
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.title}
                href={category.href}
                className="category-card relative overflow-hidden group"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                {/* Background image */}
                {category.bgImage && (
                  <img
                    src={category.bgImage}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    className="
                      absolute inset-0
                      h-full w-full
                      object-cover
                      opacity-70
                      scale-105
                      transition-transform duration-700
                      group-hover:scale-110
                    "
                  />
                )}

                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-black/25" />

                {/* Gradient overlay */}
                <div
                  className={`category-gradient absolute inset-0 bg-gradient-to-br ${category.gradient}`}
                />

                {/* Animated border */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition">
                  {/* <div className="absolute inset-0 rounded-3xl border-glow" /> */}
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl category-icon
                      flex items-center justify-center
                      ${category.iconBg}
                      group-hover:scale-110 group-hover:rotate-3
                      transition-all duration-500`}
                    >
                      <Icon
                        className={`w-8 h-8 text-white ${category.hoverColor}
                        transition-colors duration-300`}
                      />
                    </div>

                    <span className="text-sm font-medium text-white bg-primary/10 px-3 py-1 rounded-full group-hover:bg-primary/20 transition-colors">
                      {category.count}
                    </span>
                  </div>

                  <h3 className="font-bold text-xl mb-2 text-white group-hover:translate-x-1 transition-transform duration-300">
                    {category.title}
                  </h3>

                  <p className="text-muted-foreground text-white text-sm mb-6">
                    {category.description}
                  </p>

                  <div className="flex items-center text-white font-medium text-sm gap-2 group-hover:gap-3 transition-all duration-300">
                    <span className="group-hover:font-semibold">Explore</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;