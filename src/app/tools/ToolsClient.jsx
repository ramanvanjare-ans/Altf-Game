"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Wrench } from "lucide-react";
import Icon from "@/shared/ui/Icon";
import CTAButton from "@/shared/ui/CTAButton";
import { useAds } from "@/ads/AdsProvider";
import { injectAds } from "@/ads/adInjector";
import AdPairRow from "@/ads/layouts/tools/AdToolPairRow";
import CapabilitySlider from "../tools/CapabilitySlider";


export default function ToolsClient({ meta }) {
  const slugs = useMemo(() => Object.keys(meta), [meta]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const ITEMS_PER_PAGE = 10;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(true);

const device =
  typeof window !== "undefined" && window.innerWidth < 1024
    ? "mobile"
    : "desktop";

const toolAds = useAds({
  placement: "tools_listing",
  layout: "tool_card",
  device,
});

  

  /* ---------------- RESET PAGINATION ---------------- */
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [selectedCategory, search]);

  /* ---------------- CATEGORIES ---------------- */
  const categories = useMemo(() => {
    const set = new Set(["All"]);
    Object.values(meta).forEach((tool) => {
      if (Array.isArray(tool.category)) {
        tool.category.forEach((c) => set.add(c));
      } else if (tool.category) {
        set.add(tool.category);
      }
    });
    return Array.from(set);
  }, [meta]);
  useEffect(() => {
  if (meta && Object.keys(meta).length > 0) {
    setLoading(false);
  }
}, [meta]);


  /* ---------------- FILTER ---------------- */
  const filteredSlugs = useMemo(() => {
    const query = search.toLowerCase().trim();

    return slugs
      .filter((slug) => {
        const tool = meta[slug];
        if (!tool) return false;

        const matchesCategory =
          selectedCategory === "All" ||
          (Array.isArray(tool.category)
            ? tool.category.includes(selectedCategory)
            : tool.category === selectedCategory);

        const matchesSearch =
          !query ||
          slug.replace(/-/g, " ").toLowerCase().includes(query) ||
          tool.name?.toLowerCase().includes(query) ||
          (Array.isArray(tool.category)
            ? tool.category.some((c) => c.toLowerCase().includes(query))
            : tool.category?.toLowerCase().includes(query));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) =>
        a.replace(/-/g, " ").localeCompare(b.replace(/-/g, " "), "en", {
          sensitivity: "base",
        })
      );
  }, [slugs, meta, selectedCategory, search]);

  const visibleSlugs = injectAds(
  filteredSlugs.slice(0, visibleCount),
  toolAds,
  toolAds[0]?.interval || 6
);

  const hasMore = visibleCount < filteredSlugs.length;

  const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-md bg-[var(--color-muted)] ${className}`} />
);

const ToolCardSkeleton = () => (
  <div className="rounded-xl border border-[var(--color-border)] p-6 space-y-4">
    <div className="flex gap-4 items-center">
      <Skeleton className="h-12 w-12 rounded-xl" />
      <Skeleton className="h-4 w-40" />
    </div>
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-3/4" />
  </div>
);

const ToolsGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <ToolCardSkeleton key={i} />
    ))}
  </div>
);


  /* ---------------- UI ---------------- */
  return (
    <div className="bg-[var(--color-background)] text-[var(--color-background-foreground)]">
      {/* HERO */}
      <div className="text-center py-16 px-6">
        <h1 className="heading max-w-7xl mx-auto animate-fade-up">
          Think Less Do More
        </h1>

        <p className="description max-w-2xl mx-auto mt-4 animate-fade-up">
          Explore powerful micro tools to convert, calculate, analyze, and get
          things done faster — all in one place.
        </p>
        <CapabilitySlider />

        <div className="mt-8 max-w-xl mx-auto animate-fade-up">
          <input
            type="text"
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]"
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
        {/* SIDEBAR */}
        <aside className="space-y-8">
          {/* MOBILE CATEGORY */}
          <div className="lg:hidden relative">
            <label className="block mb-1 text-sm font-medium text-[var(--color-muted-foreground)]">
              Category
            </label>

            <button
              onClick={() => setOpen((v) => !v)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md bg-[var(--color-card)] border border-[var(--color-border)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            >
              {selectedCategory}
              <span className="text-xs opacity-70">▼</span>
            </button>

            {open && (
              <ul className="absolute z-20 mt-2 w-full max-h-60 overflow-auto rounded-md border border-[var(--color-border)] bg-[var(--color-card)] shadow-lg">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat);
                        setOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm ${
                        selectedCategory === cat
                          ? "bg-[var(--color-primary)] text-white"
                          : "hover:bg-[var(--color-muted)]"
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* DESKTOP CATEGORY */}
          <div className="hidden lg:block">
            <h4 className="font-semibold text-xl mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm transition ${
                      selectedCategory === cat
                        ? "bg-[var(--color-primary)] text-white shadow"
                        : "hover:bg-[var(--color-muted)] text-[var(--color-muted-foreground)]"
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* TOOLS */}
        <section>
          <h2 className="flex items-center gap-3 text-2xl font-semibold mb-6">
            Explore Tools
            <span className="px-2.5 py-0.5 text-sm font-semibold rounded-full bg-[var(--color-muted)] text-[var(--color-muted-foreground)]">
              {filteredSlugs.length}
            </span>
          </h2>

          {loading ? (
  <ToolsGridSkeleton />
) : filteredSlugs.length === 0 ? (

            <div className="py-24 text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-[var(--color-muted)] flex items-center justify-center">
                <Wrench className="h-6 w-6 text-[var(--color-muted-foreground)]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No tools found</h3>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Try a different keyword or category.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visibleSlugs.map((item) => {
  if (item?.type === "ad-pair") {
    return (
      <div key={item.id} className="md:col-span-2">
        <AdPairRow ads={item.ads} />
      </div>
    );
  }

  const slug = item;

                  const tool = meta[slug];
                  const name =
                    tool.name ||
                    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

                  return (
                    <Link
                      key={slug}
                      href={`/tools/${slug}`}
                      className="group relative flex flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)/40]"
                    >
                      {/* TOP */}
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-muted)]">
  <Icon
  name={tool.icon ?? "wrench"}
  className={`h-6 w-6 ${
    tool.iconColor ?? "text-[var(--color-muted-foreground)]"
  }`}
/>
</div>


                        <div className="flex-1">
                          <h3 className="text-lg font-semibold leading-tight group-hover:text-[var(--color-primary)] transition">
                            {name}
                          </h3>
                          <p className="mt-1 text-sm text-[var(--color-muted-foreground)] line-clamp-2">
                            {tool.description || "No description available."}
                          </p>
                        </div>
                      </div>

                      {/* BOTTOM */}
                      <div className="mt-6 flex items-center justify-between gap-4">
                        {tool.category && (
                          <div className="flex flex-wrap gap-1.5 max-h-[52px] overflow-hidden">
                            {(Array.isArray(tool.category)
                              ? tool.category
                              : [tool.category]
                            ).map((cat) => (
                              <span
                                key={cat}
                                className="text-[11px] font-medium rounded-full px-2.5 py-1 bg-[var(--color-muted)] text-[var(--color-muted-foreground)] group-hover:bg-[var(--color-primary)/10]"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        )}

                        <span className="shrink-0 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-muted-foreground)] group-hover:text-[var(--color-primary)]">
                          Open
                          <span className="group-hover:translate-x-1 transition-transform">
                            →
                          </span>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {hasMore && (
                <div className="mt-10 flex justify-center">
                  <CTAButton
                    text="Load More"
                    variant="outline"
                    onClick={() =>
                      setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
                    }
                  />
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
