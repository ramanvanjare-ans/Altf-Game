"use client";

import { useState, useMemo, useEffect } from "react";
import { extensionMap } from "@/platform/registry/extensionMap";
import ListingCard from "./components/ListingCard";
import Image from "next/image";
import { useAds } from "@/ads/AdsProvider";
import useDevice from "@/hooks/useDevice";
import { injectRandomAds } from "@/ads/adInjector";
import AdExtensionCard from "@/ads/layouts/extension/AdExtensionCard";

import {
  Search,
  LayoutGrid,
  Gamepad2,
  Puzzle,
  Sparkles,
  Zap,
  MessageSquare,
  GraduationCap,
  PenTool,
  Calendar,
  Code
} from "lucide-react";

export default function ExtensionsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(16);

  const device = useDevice();

  /* ---------------- SEARCH DEBOUNCE ---------------- */

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  /* ---------------- EXTENSION DATA ---------------- */

  const allExtensions = useMemo(
    () =>
      Object.entries(extensionMap).map(([slug, data]) => ({
        slug,
        ...data,
      })),
    []
  );

  const filteredExtensions = useMemo(() => {
    let result = allExtensions;

    if (selectedCategory !== "All") {
      result = result.filter((e) => e.category === selectedCategory);
    }

    if (debouncedSearchQuery) {
      const q = debouncedSearchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [selectedCategory, debouncedSearchQuery, allExtensions]);

  /* ---------------- ADS ---------------- */

  const extensionAds = useAds({
    placement: "extensions_listing",
    layout: "extension_card",
    device,
  });

  const extensionsWithAds = useMemo(() => {
    const sliced = filteredExtensions.slice(0, visibleCount);

    // Inject max 4 ads randomly
    return injectRandomAds(sliced, extensionAds, 4);
  }, [filteredExtensions, visibleCount, extensionAds]);

  /* ---------------- TOP CATEGORIES ---------------- */

  const topCategories = [
    {
      label: "Communication",
      icon: MessageSquare,
      realCat: "Productivity & Focus",
    },
    {
      label: "Education",
      icon: GraduationCap,
      realCat: "Text, Writing & Content",
    },
    {
      label: "Tools",
      icon: PenTool,
      realCat: "Utilities & Calculators",
    },
    {
      label: "Workflow & Planning",
      icon: Calendar,
      realCat: "Forms, Data & Automation",
    },
    {
      label: "Developer Tools",
      icon: Code,
      realCat: "File, Data & Formatter Tools",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">

      <main className="pb-20">

        {/* HERO */}
        <div className="mx-auto max-w-[1440px] px-4 md:px-6 pt-6 pb-12">
          <div className="relative w-full py-16 md:py-20 rounded-[40px] overflow-hidden bg-[var(--muted)] border border-[var(--border)] text-center">

            <Image
              src="/extension/hero.png"
              alt="Hero background"
              fill
              className="object-cover object-center"
              priority
            />

            <div className="absolute inset-0 bg-[var(--background)]/40" />

            <div className="relative z-10 max-w-4xl mx-auto">

              <h1 className="text-4xl md:text-5xl font-black mb-4">
                {selectedCategory === "All"
                  ? "Browser with Smart Extensions"
                  : `${selectedCategory} Extensions`}
              </h1>

              <p className="text-lg text-[var(--muted-foreground)] mb-8">
                Explore high-quality extensions and themes for productivity and workflows.
              </p>

              <div className="max-w-2xl mx-auto relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
                  <Search className="w-6 h-6" />
                </div>

                <input
                  type="text"
                  placeholder="Search extensions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 pl-16 pr-6 rounded-full border border-[var(--border)] bg-[var(--background)] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* TOP CATEGORIES */}
        <div className="mx-auto max-w-[1440px] px-4 md:px-6 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {topCategories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.realCat)}
                className="h-24 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-between px-4"
              >
                <span>{cat.label}</span>
                <cat.icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>

        {/* GRID */}
        <div className="mx-auto max-w-[1440px] px-4 md:px-6">

          {extensionsWithAds.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {extensionsWithAds.map((item) => {

                  if (item.type === "ad-single") {
                    return (
                      <AdExtensionCard key={item.id} ad={item.ad} />
                    );
                  }

                  const { slug, ...ext } = item;

                  return (
                    <ListingCard
                      key={slug}
                      slug={slug}
                      extension={ext}
                    />
                  );
                })}

              </div>

              {visibleCount < filteredExtensions.length && (
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 12)}
                    className="px-8 py-3 rounded-full border border-[var(--border)]"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <h3>No extensions found</h3>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
