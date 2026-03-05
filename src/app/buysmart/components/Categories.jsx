"use client";

import { useMemo } from "react";
import categories from "../data/categories.json";

const groupByAlphabet = (items) => {
  return items.reduce((acc, item) => {
    const firstChar = item.name[0].toUpperCase();
    const letter = /[A-Z]/.test(firstChar) ? firstChar : "0-9";
    acc[letter] = acc[letter] || [];
    acc[letter].push(item);
    return acc;
  }, {});
};

export default function CategoriesAZ() {
  const grouped = useMemo(() => groupByAlphabet(categories), []);

  const handleClick = (url) => {
    window.open(
      `/buysmart/redirect?url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12 lg:py-14 bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <div className="mb-8 sm:mb-10 md:mb-12 text-center sm:text-left">
        <h2 className="heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
          Browse Categories A–Z
        </h2>
        <p className="description mt-2 text-sm sm:text-base md:text-lg">
          Explore all shopping categories alphabetically
        </p>
      </div>

      {/* Groups */}
      <div className="space-y-8 sm:space-y-10 md:space-y-12">
        {Object.keys(grouped)
          .sort()
          .map((letter) => (
            <div
              key={letter}
              id={`letter-${letter}`}
              className="
                grid grid-cols-[40px_1fr] sm:grid-cols-[50px_1fr] gap-6 sm:gap-8 py-6 sm:py-8 border-b border-[var(--border)]
              "
            >
              {/* Letter */}
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold font-primary text-[var(--foreground)]">
                {letter}
              </div>

              {/* Categories */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                {grouped[letter].map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => handleClick(cat.url)}
                    className="
                      text-left text-sm sm:text-base md:text-lg lg:text-xl
                      font-secondary
                      text-[var(--primary)]
                      hover:text-[var(--foreground)]
                      transition-colors
                      truncate
                    "
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
