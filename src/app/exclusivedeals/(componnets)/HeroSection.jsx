"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import banner5 from "../(assets)/bann2.png";
import banner6 from "../(assets)/1mg.png";
import banner8 from "../(assets)/skin.png";
import banner9 from "../(assets)/traveler.png";

export default function HeroSection() {
  const slides = [
    { id: 1, name: "Travel", img: banner9 },
    { id: 2, name: "Travel 2", img: "/images/1769153717.webp" },
    { id: 3, name: "Health", img: banner6 },
    { id: 4, name: "Skin", img: banner8 },
    { id: 5, name: "Shopping", img: banner5 },
    { id: 6, name: "Sport", img:"/images/1768995313.webp" },
    { id: 7, name: "Sksma", img:"/images/1769059974.webp" },
  ];

  const [active, setActive] = useState(0);

  // Auto scroll
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const prevIndex = (active - 1 + slides.length) % slides.length;
  const nextIndex = (active + 1) % slides.length;

  return (
    <section className="w-full overflow-hidden">
      <div className="relative w-full md:h-[30rem] h-36 flex items-center justify-center">
        
        {/* LEFT SLIDE */}
        <div
          className="absolute left-0 transition-all md:w-260  duration-1000 ease-in-out"
          style={{transform: "translateX(-81%)", zIndex: 5 }}
        >
          <SlideCard slide={slides[prevIndex]} />
        </div>

        {/* CENTER SLIDE */}
        <div
          className="absolute transition-all w-full md:w-260  z-20 duration-1000 ease-in-out"
        >
          <SlideCard slide={slides[active]} priority />
        </div>

        {/* RIGHT SLIDE */}
        <div
          className="absolute right-0 md:w-260  transition-all duration-1000 ease-in-out"
          style={{  transform: "translateX(81%)", zIndex: 5 }}
        >
          <SlideCard slide={slides[nextIndex]} />
        </div>

      </div>
    </section>
  );
}

/* =========================
   SLIDE CARD COMPONENT
========================= */

function SlideCard({ slide, priority = false }) {
  return (
    <div className="relative md:h-110 h-36 w-full overflow-hidden md:rounded-md shadow-lg">
      <Image
        src={slide.img}
        alt={slide.name}
        fill
        priority={priority}
        className=" overflow-hidden "
      />
      
    </div>
  );
}
