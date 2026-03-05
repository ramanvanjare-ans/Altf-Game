"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const CATEGORIES = [
  {
    title: "Electronics",
    image: "/trending/toolist/bg.png",
    coupons: 319,
    offers: 379,
  },
  {
    title: "Electronics",
    image: "/trending/toolist/agc.png",
    coupons: 319,
    offers: 379,
  },
  {
    title: "Mobile Recharge",
    image: "/trending/toolist/hrs.jpg",
    coupons: 319,
    offers: 379,
  },
  {
    title: "Travel",
    image: "/trending/toolist/imgcr.png",
    coupons: 319,
    offers: 379,
  },
  {
    title: "Travel",
    image: "/trending/toolist/imtovid.png",
    coupons: 319,
    offers: 379,
  },
  {
    title: "Travel",
    image: "/trending/toolist/pfp.png",
    coupons: 319,
    offers: 379,
  },
  {
    title: "Travel",
    image: "/trending/toolist/sr.png",
    coupons: 319,
    offers: 379,
  },
];

export default function CategorySlider() {
  const trackRef = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let raf;
    const speed = 0.5;

    const loop = () => {
      if (!paused) {
        el.scrollLeft += speed;

        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }

      raf = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  const list = [...CATEGORIES, ...CATEGORIES];

  return (
    <div
      className="relative mt-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* left fade */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white to-transparent" />

      {/* right fade */}
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white to-transparent" />

      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto no-scrollbar py-4"
      >
        {list.map((item, i) => (
          <div
            key={item.title + i}
            className="
              shrink-0
              w-[360px]
              rounded-2xl
              bg-white
              shadow-md
              overflow-hidden
              transition
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            {/* Image area */}
            <div className="relative h-[200px] w-full">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Bottom content */}
            {/* <div className="px-4 py-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {item.title}
              </h3>

              <div className="mt-2 flex items-center justify-center gap-4 text-sm text-gray-600">
                <span>{item.coupons} Coupons</span>
                <span className="h-4 w-px bg-gray-300" />
                <span>{item.offers} Offers</span>
              </div>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
}
