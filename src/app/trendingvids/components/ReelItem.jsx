"use client";
import { useState, useEffect, useRef } from "react";
import {
  Heart,
  Share2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ReelItem = ({ reel, isActive }) => {
  const [liked, setLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showMuteIndicator, setShowMuteIndicator] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Reset mute state when active slide changes
    if (!isActive) {
      setIsMuted(true);
    }
  }, [isActive]);

  const toggleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    setShowMuteIndicator(true);
    setTimeout(() => setShowMuteIndicator(false), 800);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`https://youtu.be/${reel.id}`);

    const toast = document.createElement("div");
    toast.textContent = "Link copied!";
    toast.className = "fixed bottom-10 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-bold z-50 animate-bounce";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black snap-center overflow-hidden"
    >
      {/* Video Layer */}
      {isActive ? (
        <div className="absolute inset-0 pointer-events-none transform scale-[1.02]">
          <iframe
            title={reel.title}
            className="w-full h-full object-cover"
            src={`https://www.youtube.com/embed/${reel.id}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=${reel.id}&showinfo=0&fs=0&iv_load_policy=3&disablekb=1`}
            allow="autoplay; encrypted-media; picture-in-picture"
            style={{ pointerEvents: "none" }}
          />
        </div>
      ) : (
        <div className="w-full h-full bg-slate-900 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-slate-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Click layer for muting */}
      <div
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={toggleMute}
      />

      {/* Grid Overlay for Texture */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/80 z-20" />

      {/* Mute Indicator */}
      <AnimatePresence>
        {showMuteIndicator && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
          >
            <div className="p-4 rounded-full bg-black/60 backdrop-blur-md">
              {isMuted ? <VolumeX className="w-8 h-8 text-white" /> : <Volume2 className="w-8 h-8 text-white" />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-28 flex flex-col gap-6 z-30 pointer-events-auto">
        <div className="flex flex-col items-center gap-1 group">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={toggleLike}
            className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 ${liked ? "bg-red-500/20 text-red-500" : "bg-black/30 text-white hover:bg-black/50"}`}
          >
            <Heart className={`w-7 h-7 ${liked ? "fill-current" : ""}`} />
          </motion.button>
          <span className="text-xs font-bold text-white shadow-black drop-shadow-md">1.2k</span>
        </div>

        <div className="flex flex-col items-center gap-1 group">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleShare}
            className="p-3 rounded-full backdrop-blur-md bg-black/30 text-white hover:bg-black/50 transition-all duration-300"
          >
            <Share2 className="w-7 h-7" />
          </motion.button>
          <span className="text-xs font-bold text-white shadow-black drop-shadow-md">Share</span>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-6 pt-12 text-white pointer-events-none">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-red-500 p-[2px]">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
              <span className="font-bold text-xs">YT</span>
            </div>
          </div>
          <div>
            <p className="font-bold text-sm shadow-black drop-shadow-md">AltF4 Tools</p>
            <span className="text-[10px] opacity-80 shadow-black drop-shadow-md">Official Channel</span>
          </div>

          {/* CATEGORY BADGE REMOVED FROM HERE */}
        </div>

        <h3 className="font-black text-xl leading-tight line-clamp-2 shadow-black drop-shadow-lg mb-2">
          {reel.title}
        </h3>

        <div className="flex items-center gap-2 opacity-80">
          <Volume2 className="w-3 h-3" />
          <p className="text-xs font-medium">Original Audio • AltF4 Tools</p>
        </div>
      </div>
    </div>
  );
};

export default ReelItem;