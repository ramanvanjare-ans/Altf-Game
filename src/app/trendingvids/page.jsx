"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import InformativeVideos from "./components/InformativeVideos";
import TrendingReels from "./components/TrendingReels";
import { Instagram, Youtube, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WatchPage() {
  const [activeTab, setActiveTab] = useState("videos");
  const contentRef = useRef(null);

  useEffect(() => {
    const header = document.querySelector("header");
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    if (activeTab === "reels" && isMobile) {
      if (header) header.style.display = "none";
    } else {
      if (header) header.style.display = "flex";
    }
    return () => { if (header) header.style.display = "flex"; };
  }, [activeTab]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    if (tab === "reels") {
      setTimeout(() => {
        contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [activeTab]);

  // Transition Variants
  const slideVariants = {
    initial: { opacity: 0, y: 40, scale: 0.98 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    },
    exit: {
      opacity: 0,
      y: -40,
      scale: 0.98,
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* HERO SECTION */}
      <section className={`${activeTab === 'reels' ? 'hidden md:block' : 'block'} relative z-10 pt-16 md:pt-28 pb-12 px-4 sm:px-6 lg:px-16`}>
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="text-5xl sm:text-7xl xl:text-8xl font-black mb-6">
              Content <span className="text-blue-600">Library</span>
            </h1>

            {/* TOGGLE SWITCHER */}
            <div className="relative flex p-1.5 rounded-full bg-white border border-gray-200 shadow-xl mb-8">
              <motion.div
                className="absolute inset-y-1.5 rounded-full bg-blue-600 shadow-lg shadow-blue-500/20"
                animate={{ left: activeTab === "videos" ? "6px" : "50%", width: "calc(50% - 6px)" }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
              <button onClick={() => handleTabChange("videos")} className={`relative z-10 px-8 py-3 text-xs font-bold uppercase transition-colors duration-300 ${activeTab === "videos" ? "text-white" : "text-gray-500"}`}>
                Videos
              </button>
              <button onClick={() => handleTabChange("reels")} className={`relative z-10 px-8 py-3 text-xs font-bold uppercase transition-colors duration-300 ${activeTab === "reels" ? "text-white" : "text-gray-500"}`}>
                Reels
              </button>
            </div>
          </div>

          {/* YT VIDEO (Desktop Only) */}
          <div className="hidden lg:block relative w-full aspect-video rounded-[2rem] overflow-hidden shadow-2xl bg-black border border-white/10">
            <iframe
              className="absolute inset-0 w-full h-full object-cover"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=0&loop=1&playlist=dQw4w9WgXcQ"
              title="Hero Video"
              allow="autoplay"
            />
          </div>
        </div>
      </section>

      {/* DYNAMIC CONTENT AREA */}
      <main ref={contentRef} className="relative z-20">
        <AnimatePresence mode="wait">
          {activeTab === "videos" ? (
            <motion.div
              key="videos"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="px-4 sm:px-6 lg:px-16"
            >
              <InformativeVideos />
            </motion.div>
          ) : (
            <motion.div
              key="reels"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <TrendingReels onBack={() => setActiveTab("videos")} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}