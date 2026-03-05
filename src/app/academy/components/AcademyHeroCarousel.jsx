"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const banners = [
  {
    title: "Learn from the world's best academies",
    subtitle: "Compare top platforms and start learning today",
    image: "/academy/hero/hero333.jpg",

  },
  {
    title: "Upgrade your skills for real jobs",
    subtitle: "Programming, design, business and more",
    image: "/academy/hero/hero222.png",
  },
  {
    title: "All learning platforms in one place",
    subtitle: "Discover, compare and choose easily",
        image: "/academy/hero/hero111.jpg",

  },
];

export default function AcademyHeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((p) => (p + 1) % banners.length);
    }, 4500);

    return () => clearInterval(t);
  }, []);

  const banner = banners[index];

  return (
    <div className="relative h-[560px] rounded-3xl">

      <AnimatePresence >
        <motion.div
          key={banner.image}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
        //   transition={{ duration: 0.6 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${banner.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </AnimatePresence>

      {/* <div className="absolute inset-0 bg-black/50" /> */}

      {/* <div className="relative z-10 h-full flex items-center px-10">
        <div className="max-w-xl text-white">
          <h1 className="text-4xl font-semibold leading-tight">
            {banner.title}
          </h1>
          <p className="mt-3 text-white/80">
            {banner.subtitle}
          </p>
        </div>
      </div> */}

      {/* dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            // className={`h-2 w-2 rounded-full ${
            //   i === index ? "bg-white" : "bg-white/40"
            // }`}
          />
        ))}
      </div>
    </div>
  );
}
