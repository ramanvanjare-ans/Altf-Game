"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gameMap } from "@/platform/registry/gameMap";
import GameCard from "@/app/games/components/GameCard1";
import GameIcon from "@/app/games/components/GameIcon";
// import {
//   Car,
//   Gamepad2,
//   Trophy,
//   Sword,
//   Bird,
//   LayoutGrid,
//   Grid,
//   Activity,
//   Flame,
//   Hash,
//   Bomb,
//   CircleDot,
//   Crown,
//   Grid3x3,
//   Dice5,
//   Circle,
//   Scissors,
//   Hammer,
//   Monitor,
//   BoxSelect,
//   HelpCircle,
//   Brain,
// } from "lucide-react";
import { useAds } from "@/ads/AdsProvider";
import { injectAds } from "@/ads/adInjector";
import useDevice from "@/hooks/useDevice";
import AdGameCard from "@/ads/layouts/games/AdGameCard";

// Helper to get icon component (Expanded map)
// const getIcon = (iconName) => {
//   const icons = {
//     Car,
//     Gamepad2,
//     Trophy,
//     Sword,
//     Bird,
//     LayoutGrid,
//     Grid,
//     Activity,
//     Hash,
//     Bomb,
//     CircleDot,
//     Crown,
//     Grid3x3,
//     Dice5,
//     Circle,
//     Scissors,
//     Hammer,
//     Monitor,
//     BoxSelect,
//     HelpCircle,
//     Brain,
//   };
//   return icons[iconName] || Gamepad2;
// };

// Fisher-Yates Shuffle Algorithm for "Proper" Randomization
// Ensures O(n) time complexity and unbiased permutation
const properShuffle = (array, seed = null) => {
  const newArray = [...array];

  // If a seed is provided, use a seeded PRNG (Linear Congruential Generator)
  // Otherwise use Math.random()
  const random = seed
    ? (() => {
        let s = seed;
        return () => {
          s = (s * 1664525 + 1013904223) % 4294967296;
          return s / 4294967296;
        };
      })()
    : Math.random;

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function GamesPage() {
  // Convert gameMap to array
  const rawGames = useMemo(
    () =>
      Object.entries(gameMap).map(([slug, data]) => ({
        slug,
        ...data,
      })),
    [],
  );

  const [games, setGames] = useState([]);

  // Initialize with a sophisticated shuffle on mount
  // This ensures "Fair distribution" and "Prevents repetitive patterns"
  useEffect(() => {
    // Use current timestamp as seed for pseudo-randomness or null for true random
    // We use true random here for maximum variety as requested
    const shuffled = properShuffle(rawGames);
    setGames(shuffled);
  }, [rawGames]);

  // Animation Variants for Staggered "Dealing" Effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1,
      },
    },
  };

  const device = useDevice();

  const gameAds = useAds({
    placement: "games_listing",
    layout: "game_card",
    device,
  });
  const dynamicInterval = Math.max(
    2,
    Math.floor(games.length / (gameAds.length + 1)),
  );
  const gamesWithAds = useMemo(() => {
    if (games.length === 0) return [];

    return injectAds(games, gameAds, {
      interval: dynamicInterval,
      mode: "single",
    });
  }, [games, gameAds]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans transition-colors duration-300">
      {/* Poki-style Container */}
      <div className="mx-auto max-w-[1600px] px-4 py-8">
        {/* Header (Minimal for Game Focus) */}
        <div className="flex items-center gap-3 mb-8 ml-2">
          {/* <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white shadow-lg"
          >
            <Flame className="w-6 h-6 fill-yellow-300 stroke-yellow-300 animate-pulse" />
          </motion.div> */}
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-black tracking-tight text-[var(--foreground)] uppercase font-display italic"
          >
            Popular Games
          </motion.h1>
        </div>

        {/* THE BENTO GRID */}
        {/* 
                    Grid System:
                    - Uses auto-fill/minmax for responsiveness.
                    - 'grid-auto-flow: dense' is CRITICAL to fill gaps left by larger items.
                    - auto-rows ensures consistent height for the bento effect.
                */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 auto-rows-[140px] gap-4 grid-flow-dense pb-20"
        >
          <AnimatePresence>
            {gamesWithAds.map((item) => {
              // 🔥 AD TILE
              if (item.type === "ad-single") {
                return (
                  <div
                    key={item.id}
                    className="col-span-1 row-span-1"
                    style={{ minHeight: "140px" }} // 🔥 CRITICAL
                  >
                    <AdGameCard ad={item.ad} />
                  </div>
                );
              }

              // 🎮 GAME TILE
              const game = item;

              return (
                <motion.div
                  key={game.slug}
                  variants={cardVariants}
                  layoutId={game.slug}
                  className={
                    game.size === "large"
                      ? "col-span-1 sm:col-span-2 row-span-2"
                      : game.size === "medium"
                        ? "col-span-1 sm:col-span-2 row-span-1"
                        : "col-span-1 row-span-1"
                  }
                >
                  <GameCard
                    game={game}
                    slug={game.slug}
                    icon={<GameIcon name={game.icon} className="w-6 h-6" />}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
