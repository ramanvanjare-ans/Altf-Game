"use client";

import { useEffect, useRef } from "react";
import stores from "../data/stores.json";

export default function StoreGrid({ filter }) {
  const filtered = filter
    ? stores.filter((s) =>
        filter === "0-9" ? /^[0-9]/.test(s.name) : s.name.startsWith(filter)
      )
    : stores;

  const containerRef = useRef(null);
  const pauseRef = useRef(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const speed = 0.35;

    const animate = () => {
      if (!pauseRef.current) {
        el.scrollLeft += speed;

        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    const pause = () => (pauseRef.current = true);
    const resume = () => (pauseRef.current = false);

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume);

    return () => {
      cancelAnimationFrame(rafRef.current);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
    };
  }, [filtered.length]);

  return (
    <div className="mt-5 px-2 sm:px-6 md:px-8">
      <div
        ref={containerRef}
        className="w-full overflow-x-hidden"
      >
        <div className="flex gap-5 w-max">
          {[...filtered, ...filtered].map((store, index) => (
            <div
              key={store.slug + "-" + index}
              className="relative flex-shrink-0
                         w-[90vw] sm:w-[520px] lg:w-[500px]
                         h-[250px]
                         rounded-3xl
                         overflow-hidden
                         shadow-lg"
            >
              {/* full image background */}
              <img
                src={store.logo}
                alt={store.name}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* dark gradient overlay like your screenshot */}
              {/* <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10" /> */}

              {/* <div className="relative z-10 h-full flex flex-col justify-end px-5 pb-4 text-white">
                <span className="text-[11px] font-semibold bg-white/20 px-2 py-[2px] rounded-full w-fit mb-1">
                  Special Sale
                </span>

                <h3 className="text-lg sm:text-xl font-semibold leading-tight line-clamp-1">
                  {store.name}
                </h3>

                <p className="text-sm opacity-90 line-clamp-1">
                  {store.highlight}
                </p>

                <p className="text-sm sm:text-base font-semibold mt-0.5">
                  {store.offers} Offers
                </p>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
