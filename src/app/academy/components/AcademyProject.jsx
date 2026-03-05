"use client";

import Image from "next/image";
import { academies } from "../data/academies";
import { useMemo, useState } from "react";

import AcademyHeroCarousel from "../components/AcademyHeroCarousel";
import AcademyStats from "../components/AcademyStats";
import AcademyFilter from "../components/AcademyFilter";
import FeaturedAcademies from "../components/FeaturedAcademies";

export default function AcademyProject() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    return [...new Set(academies.map((a) => a.category))];
  }, []);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return academies;
    return academies.filter((a) => a.category === activeCategory);
  }, [activeCategory]);

  const featured = academies.slice(0, 6);

  return (
    <main className="min-h-screen bg-[var(--background)] px-8 lg:px-36 py-14 space-y-16">
      {/* HERO */}
      <AcademyHeroCarousel />

      {/* STATS */}
      <AcademyStats />

      {/* FILTER */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Browse by category</h2>

        
          <AcademyFilter
            categories={categories}
            active={activeCategory}
            onChange={setActiveCategory}
          />
        
      </section>

      {/* FEATURED */}
      <FeaturedAcademies items={featured} />

      {/* HEADER */}
      <header className="max-w-4xl">
        <h2 className="text-3xl text-(--foreground) font-semibold tracking-tight">
          All learning academies
        </h2>
        <p className="mt-3 text-[15px] text-(--muted-foreground) max-w-2xl">
          Explore a thoughtfully curated collection of trusted learning
          platforms, designed to help you discover where to learn next.
        </p>
      </header>

      {/* GRID */}
      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((academy) => (
          <a
            key={academy.name}
            href={academy.url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              group relative overflow-hidden rounded-xl
              border border-(--border) bg-(--card)
              transition-all duration-300
              hover:border-(--border-hover) hover:shadow-lg
            "
          >
            <span
              className="
                absolute left-0 top-0 h-full w-1 bg-(--primary)/40
                scale-y-0 origin-top transition-transform duration-300
                group-hover:scale-y-100
              "
            />

            <div className="p-6 flex flex-col h-full">
              <div className="h-12 mb-5 flex items-center">
                <Image
                  src={academy.image}
                  alt={academy.name}
                  width={140}
                  height={48}
                  className="
                    object-contain
                    grayscale opacity-80
                    transition-all duration-300
                    group-hover:grayscale-0 group-hover:opacity-100
                  "
                />
              </div>

              <span
                className="
                  mb-3 w-fit rounded-full
                  bg-(--primary)/10 px-3 py-1
                  text-[11px] font-medium uppercase tracking-wide
                  text-(--muted-foreground)
                "
              >
                {academy.category}
              </span>

              <h2 className="text-lg font-medium mb-2 text-(--foreground)">
                {academy.name}
              </h2>

              <p className="text-sm text-(--muted-foreground) leading-relaxed line-clamp-3">
                {academy.description}
              </p>

              <span
                className="
                  mt-6 inline-flex items-center gap-1
                  text-sm font-medium text-(--primary)
                  opacity-0 translate-y-1
                  transition-all duration-300
                  group-hover:opacity-100 group-hover:translate-y-0
                "
              >
                Visit academy
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </div>
          </a>
        ))}
      </section>
    </main>
  );
}
