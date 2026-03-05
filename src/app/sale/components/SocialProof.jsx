"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, MapPin, Clock } from "lucide-react";
import Image from "next/image";

export default function SocialProof({ activities }) {
    const [currentActivities, setCurrentActivities] = useState(
        activities.slice(0, 4)
    );
    const [peopleCount, setPeopleCount] = useState(null);

    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Simulate real-time activity updates
        const interval = setInterval(() => {
            setCurrentActivities((prev) => {
                const randomActivity =
                    activities[Math.floor(Math.random() * activities.length)];
                const updated = [randomActivity, ...prev.slice(0, 3)];
                return updated;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [activities]);

    useEffect(() => {
        setPeopleCount(Math.floor(Math.random() * 50) + 20);
    }, []);


    return (
        <>
            {/* Floating Notification Widget */}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        className="fixed bottom-6 left-6 z-50 max-w-sm"
                    >
                        <div className="bg-(--card) border border-(--border) rounded-2xl shadow-2xl overflow-hidden backdrop-blur-lg">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-(--border)">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-sm font-semibold text-(--foreground)">
                                        Live Activity
                                    </span>
                                </div>
                                <button
                                    onClick={() => setIsVisible(false)}
                                    className="text-(--muted-foreground) hover:text-(--foreground) transition cursor-pointer"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Activities */}
                            <div className="max-h-80 overflow-y-auto">
                                <AnimatePresence mode="popLayout">
                                    {currentActivities.map((activity, index) => (
                                        <motion.div
                                            key={`${activity.id}-${index}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.3 }}
                                            className="p-4 border-b border-(--border) last:border-b-0 hover:bg-(--muted)/30 transition"
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* User Avatar */}
                                                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-(--primary)">
                                                    <Image
                                                        src={activity.avatar}
                                                        alt={activity.userName}
                                                        width={40}
                                                        height={40}
                                                        className="object-cover"
                                                    />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-(--foreground)">
                                                        <span className="font-semibold">
                                                            {activity.userName}
                                                        </span>{" "}
                                                        {activity.action === "purchased" && "just purchased"}
                                                        {activity.action === "saved" && "saved"}
                                                        {activity.action === "viewing" && "is viewing"}
                                                    </p>

                                                    <p className="text-sm text-(--muted-foreground) mt-1 line-clamp-1">
                                                        {activity.productName}
                                                    </p>

                                                    <div className="flex items-center gap-3 mt-2">
                                                        <div className="flex items-center gap-1 text-xs text-(--muted-foreground)">
                                                            <MapPin className="w-3 h-3" />
                                                            <span>{activity.location}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs text-(--muted-foreground)">
                                                            <Clock className="w-3 h-3" />
                                                            <span>{activity.timeAgo}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Icon */}
                                                <div className="shrink-0">
                                                    {activity.action === "purchased" && (
                                                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                                                            <ShoppingCart className="w-4 h-4 text-green-600" />
                                                        </div>
                                                    )}
                                                    {activity.action === "saved" && (
                                                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                                            <svg
                                                                className="w-4 h-4 text-blue-600"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    {activity.action === "viewing" && (
                                                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                                                            <svg
                                                                className="w-4 h-4 text-purple-600"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Footer */}
                            <div className="p-3 bg-(--muted)/30 text-center">
                                <p className="text-xs text-(--muted-foreground)">
                                    <span className="font-semibold text-(--primary)">
                                        {peopleCount ?? "—"}
                                    </span>{" "}
                                    people shopping right now
                                </p>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reopen Button */}
            {!isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setIsVisible(true)}
                    className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-(--primary) text-(--primary-foreground) shadow-2xl flex items-center justify-center hover:scale-110 transition cursor-pointer"
                >
                    <div className="relative">
                        <ShoppingCart className="w-6 h-6" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                    </div>
                </motion.button>
            )}
        </>
    );
}