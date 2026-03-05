"use client";

import { useRef, useState, useEffect } from "react";

import HeroBanner from "./components/HeroBanner";
import AlphabetFilter from "./components/AlphabetFilter";
import StoreGrid from "./components/StoreGrid";
import TrendingDeals from "./components/TrendingDeals";
import Categories from "./components/Categories";

const HEADER_HEIGHT = 72;

export default function Page() {
  const alphabetRef = useRef(null);
  const [headerVisible, setHeaderVisible] = useState(true);

  useEffect(() => {
    const header = document.getElementById("main-header");
    if (!header) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeaderVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
      }
    );

    observer.observe(header);

    return () => observer.disconnect();
  }, []);

  const handleSelect = (char) => {
    const id = char === "0-9" ? "letter-0-9" : `letter-${char}`;
    const section = document.getElementById(id);
    if (!section) return;

    const stickyHeight = alphabetRef.current?.offsetHeight || 0;

    const top =
      section.getBoundingClientRect().top +
      window.pageYOffset -
      stickyHeight -
      (headerVisible ? HEADER_HEIGHT : 0);

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <AlphabetFilter
        ref={alphabetRef}
        onSelect={handleSelect}
        headerVisible={headerVisible}
      />

      <HeroBanner />
      <StoreGrid />
      <TrendingDeals />
      <Categories />
    </div>
  );
}
