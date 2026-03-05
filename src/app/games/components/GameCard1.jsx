"use client";

import Link from "next/link";
import { useRef } from "react";
import Icon from "@/shared/ui/Icon";
import { GamePreviewRegistry } from "@/platform/registry/GamePreviewRegistry";

/**
 * Game Card (Bento Grid)
 * - Virtualization-safe
 * - No heavy hover previews
 * - Intent-based prefetch
 */
export default function GameCard({ game, slug, icon }) {
  const {
    name,
    size = "small",
    color = "from-blue-400 to-blue-600",
    image,
  } = game;

  const hoverTimeout = useRef(null);
  const prefetched = useRef(false);

  // 🔥 Intent-based prefetch (NO MOUNTING)
  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => {
      if (!prefetched.current) {
        const loader = GamePreviewRegistry[slug];
        if (loader?.preload) {
          loader.preload(); // Next.js dynamic preload
        }
        prefetched.current = true;
      }
    }, 500); // intent delay
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
  };

  // Size classes (unchanged layout)
  const sizeClasses = {
    small: "col-span-1 row-span-1",
    medium: "col-span-1 sm:col-span-2 row-span-1",
    large: "col-span-1 sm:col-span-2 row-span-2",
  };

  return (
    <div
      className={`group relative h-full w-full overflow-hidden rounded-3xl bg-neutral-900 shadow-sm transition-transform duration-300 hover:scale-[1.02]`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={`/games/${slug}`}
        className="block w-full h-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {/* IMAGE / BACKGROUND */}
        {image ? (
          <div className="absolute inset-0">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
          </div>
        ) : (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${color} flex items-center justify-center`}
          >
            {icon && (
              <Icon
                name={icon}
                className="w-16 h-16 text-white/80 drop-shadow-lg"
              />
            )}
          </div>
        )}

        {/* GRADIENT SCRIM */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* TITLE */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 text-center">
          <h3 className="text-white font-bold text-lg drop-shadow-md translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            {name}
          </h3>
        </div>

        {/* SHINE EFFECT */}
        <div className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:animate-shine" />
      </Link>
    </div>
  );
}
