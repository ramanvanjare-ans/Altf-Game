 "use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";


const bannerImages = {
  hero: "/sale-locator/home-banner/hero-banner-1.webp",
  flash: "/sale-locator/home-banner/hero-banner-2.webp",
  deal: "/sale-locator/home-banner/hero-banner-3.webp",
  fashion: "/sale-locator/home-banner/hero-banner-4.webp",
};

/* 
   Hero Carousel Component
*/

export default function HeroCarousel({ banners }) {
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
    const timer = setInterval(nextSlide, 3500);
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
    <section className="mx-auto relative max-w-7xl h-120 md:h-125 overflow-hidden md:rounded-lg bg-white md:mt-7">

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
          {/* {currentBanner?.image && (
            <Image
              src={currentBanner.image}
              alt={currentBanner.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          )} */}
          <Image
            src={bannerImages[currentBanner.gradient] || hero1}
            alt="Hero Banner"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-5 z-20">
        {/* <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full bg-(--card) border border-(--border)
          flex items-center justify-center text-(--foreground)
          hover:opacity-90 transition cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button> */}

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
                  ? "w-8 bg-(--primary)"
                  : "w-2 bg-(--muted)"
              }`}
            />
          ))}
        </div>

        {/* <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full bg-(--card) border border-(--border)
          flex items-center justify-center text-(--foreground)
          hover:opacity-90 transition cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button> */}
      </div>
    </section>
  );
}
