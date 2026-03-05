 "use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Timer } from "lucide-react";
import Image from "next/image";

/* ---------------------------
   Countdown Timer Component
---------------------------- */

const CountdownTimer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference =
        new Date(endDate).getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex items-center gap-3 mt-6">
      <Timer className="w-5 h-5 text-(--primary-foreground)" />
      <div className="flex gap-3">
        {["Days", "Hrs", "Min", "Sec"].map((label, i) => {
          const values = [
            timeLeft.days,
            timeLeft.hours,
            timeLeft.minutes,
            timeLeft.seconds,
          ];
          return (
            <div key={label} className="text-center">
              <div className="bg-(--card) rounded-xl px-3 py-2 min-w-13.75 border border-(--border)">
                <span className="text-xl font-bold text-(--foreground)">
                  {String(values[i]).padStart(2, "0")}
                </span>
              </div>
              <span className="text-xs text-(--muted-foreground) mt-1 block">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------------------
   FlashDeal Carousel Component
---------------------------- */

export default function FlashDealCarousel({ banners }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 4500);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const currentBanner = banners[currentIndex];

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 400 : -400,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir < 0 ? 400 : -400,
      opacity: 0,
    }),
  };

  return (
    <section className="relative max-w-7xl mx-auto h-135 md:h-142 overflow-hidden rounded-3xl bg-white ">

      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentBanner.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image from JSON */}
          {currentBanner?.image && (
            <Image
              src={currentBanner.image}
              alt={currentBanner.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          )}

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/10" />

          {/* Content */}
          <div className="relative z-10 container mx-auto h-full flex items-center px-6 md:px-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl"
            >
              <span className="inline-block px-4 py-1.5 bg-(--card) rounded-full text-sm font-medium text-(--foreground) mb-5 border border-(--border)">
                Limited Time Offer
              </span>

              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white leading-tight">
                {currentBanner.title}
              </h1>

              <p className="text-2xl md:text-3xl font-semibold text-white mt-2">
                {currentBanner.subtitle}
              </p>

              <p className="text-lg text-white/80  max-w-lg">
                {currentBanner.description}
              </p>

              {currentBanner.countdown?.enabled &&
                currentBanner.countdown?.endDate && (
                  <CountdownTimer
                    endDate={currentBanner.countdown.endDate}
                  />
                )}

              <div className="mt-6">
                <a
                  href={currentBanner.ctaLink}
                  target="_blank"
                  className="inline-flex items-center justify-center 
                  bg-red-500 text-(--primary-foreground)
                  hover:opacity-90
                  text-lg px-8 py-4 rounded-2xl font-semibold
                  shadow-xl transition-all duration-300"
                >
                  {currentBanner.ctaText}
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-5 z-20">
        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full bg-(--card)  border border-(--border)
          flex items-center justify-center text-(--foreground)
          hover:opacity-90 transition cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 hover:scale-125 transition-transform duration-300" />
        </button>

        <div className="flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-red-700"
                  : "w-2 bg-(--muted)"
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full bg-(--card)  border border-(--border)
          flex items-center justify-center text-(--foreground)
          hover:opacity-90 transition cursor-pointer"
        >
          <ChevronRight className="w-6 h-6 hover:scale-125 transition-transform duration-300" />
        </button>
      </div>
    </section>
  );
}
