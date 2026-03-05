"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { useState, useRef } from "react";
import { GamePreviewRegistry } from "@/platform/registry/GamePreviewRegistry";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Game Card Component (Bento Grid) with Visual-Only Live Preview
 * @param {Object} props
 * @param {Object} props.game - Game data object
 * @param {string} props.slug - Game slug
 * @param {Function} props.icon - Icon component
 */
export default function GameCard({ game, slug, icon: Icon }) {
    const { name, size = "small", color = "from-blue-400 to-blue-600", image } = game;
    const [isHovered, setIsHovered] = useState(false);
    const hoverTimeout = useRef(null);

    // Get the dynamic component for this game
    const GamePreviewComponent = GamePreviewRegistry[slug];

    // Handle Hover Delays (Prevent accidental triggers)
    const handleMouseEnter = () => {
        hoverTimeout.current = setTimeout(() => {
            setIsHovered(true);
        }, 600); // 600ms delay before loading heavy preview
    };

    const handleMouseLeave = () => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        setIsHovered(false);
    };

    // Size Classes
    const sizeClasses = {
        small: "col-span-1 row-span-1",
        medium: "col-span-1 sm:col-span-2 row-span-1",
        large: "col-span-1 sm:col-span-2 row-span-2",
    };

    // Scaling factors calculated to 'COVER' the card area
    const scaleClasses = {
        small: "scale-[0.25]",
        medium: "scale-[0.4]",
        large: "scale-[0.55]",
    };

    const handleCardClick = () => {
        // Mobile Fullscreen Auto-Trigger on Launch
        // "logo pr click karte he phone mey full screen pr open kar dena hai"
        const isMobile = typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);
        if (isMobile && !document.fullscreenElement) {
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen().catch(err => {
                    console.log("Fullscreen launch failed:", err);
                });
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            }
        }
    };

    return (
        <motion.div
            className={`group relative overflow-hidden rounded-3xl shadow-sm bg-neutral-900 h-full w-full`}
            whileHover={{ 
                scale: 1.02, 
                rotateX: 2,
                rotateY: 2,
                boxShadow: "0px 20px 40px rgba(0,0,0,0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: 1000 }}
        >
            <Link
                href={`/games/${slug}`}
                onClick={handleCardClick}
                className="block w-full h-full"
            >
                {/* --- IMAGE LAYER (FULL COVER FILL) --- */}
                {image ? (
                    <div className="absolute inset-0 z-0">
                        <motion.img
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover"
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.7 }}
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
                    </div>
                ) : (
                    // Fallback Gradient
                    <div className={`absolute inset-0 bg-gradient-to-br ${color} flex items-center justify-center`}>
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none"></div>
                        {/* Icon fallback */}
                        {Icon && (
                            <motion.div
                                initial={{ rotate: -12 }}
                                whileHover={{ rotate: 0, scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                            >
                                <Icon className="w-16 h-16 text-white/80 drop-shadow-lg" strokeWidth={1.5} />
                            </motion.div>
                        )}
                    </div>
                )}

                {/* --- LIVE PREVIEW CONTAINER (VISUAL ONLY) --- */}
                <AnimatePresence>
                    {isHovered && GamePreviewComponent && (
                        <motion.div 
                            initial={{ opacity: 0, rotateX: 90 }} // Flip in from top
                            animate={{ opacity: 1, rotateX: 0 }}
                            exit={{ opacity: 0, rotateX: -90 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0 z-20 bg-black pointer-events-none overflow-hidden flex items-center justify-center origin-top"
                        >
                            <div className={`transform origin-center ${scaleClasses[size]} w-[800px] h-[600px] flex items-center justify-center opacity-100`}>
                                <GamePreviewComponent isPreview={true} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- OVERLAYS --- */}

                {/* Gradient Scrim */}
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-20 pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                />

                {/* Play Button */}
                <motion.div 
                    className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ 
                        opacity: isHovered && GamePreviewComponent ? 0 : 1, // Hide if preview active
                        scale: isHovered && GamePreviewComponent ? 0.5 : 1
                    }}
                    whileHover={{ opacity: 1, scale: 1.1 }}
                >
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 text-white shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                </motion.div>

                {/* Title Bar */}
                <motion.div 
                    className="absolute bottom-0 left-0 right-0 z-30 p-4"
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <h3 className="text-white font-bold text-center text-lg drop-shadow-md">
                        {name}
                    </h3>
                </motion.div>

                {/* Shine Effect */}
                <div className="absolute inset-0 z-40 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:animate-shine pointer-events-none"></div>

            </Link>
        </motion.div>
    );
}
