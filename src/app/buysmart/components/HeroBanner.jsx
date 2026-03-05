"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const offers = [
  { id: 1, title: "Flat 40% Off", image: "https://img.freepik.com/free-psd/mega-sale-banner-template-instagram-stories_69286-184.jpg?semt=ais_user_personalization&w=740&q=80" },
  { id: 2, title: "Top Brands", image: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/online-shopping-fashion-ad-design-template-4f9694fecd7ca9e399cc4c74bf497e3d_screen.jpg?ts=1637028719" },
  { id: 3, title: "New Arrivals", image: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/dark-background-minimalist-men-fashion-sale-design-template-cbc7bb83f64a7847957e42bb3bcdbe09_screen.jpg?ts=1696419138" },
  { id: 4, title: "Mega Deals", image: "https://cdn.create.vista.com/downloads/3998c430-18fb-4f83-bd28-98b373d650b4_1024.jpeg" },
  { id: 5, title: "Black Friday", image: "https://m.media-amazon.com/images/G/31/img22/amazon-luxe/nov/black-friday/top-banner_2.gif" },
  { id: 6, title: "Trending", image: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/6561df91978661.5e3ff5bb32ef9.jpg" },
];

export default function HeroBanner() {
  const [index, setIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(240);

  const GAP = 14;

  const track = useMemo(() => [...offers, ...offers], []);

  // ✅ responsive card width (main mobile fix)
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setCardWidth(170);
      else if (window.innerWidth < 1024) setCardWidth(200);
      else setCardWidth(240);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((p) => p + 1);
    }, 2600);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (index === offers.length) {
      setTimeout(() => setIndex(0), 600);
    }
  }, [index]);

  return (
    <section className="w-full px-3 sm:px-6 py-5">
      <div
        className="
          relative
          w-full
          rounded-2xl
          overflow-hidden
          grid
          grid-cols-1
          md:grid-cols-[1.15fr_1fr]
        "
      >
        {/* ---------------- LEFT ---------------- */}
        <div className="relative h-[240px] sm:h-[260px] md:h-[340px] lg:h-[420px]">
          <img
            src="amaz.png"
            className="absolute inset-0 h-full w-full object-cover"
            alt=""
          />

          {/* better overlay for mobile text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent md:from-black/60" />

          <div className="relative z-10 h-full flex items-center mt-8">
            <div className="px-4 sm:px-10 max-w-xl text-center md:text-left w-full">
              <p className="text-white/80 text-xs font-semibold mb-2">
                Limited period
              </p>

              <h2 className="text-white font-bold text-lg sm:text-2xl md:text-3xl leading-snug">
                Mega Sale – Handpicked Deals
                <br className="hidden sm:block" />
                From Leading Brands & Stores
              </h2>

              <p className="text-white/80 mt-2 text-xs sm:text-sm">
                Explore verified stores and trusted brands with exciting
                discounts.
              </p>

              <div className="mt-4 flex justify-center md:justify-start">
                <button className="bg-white text-black text-sm font-semibold px-6 py-2 rounded-md">
                  Explore
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT ---------------- */}
        <div className="relative">

          {/* ✅ mobile top preview image */}
          <div className="md:hidden relative h-[180px] overflow-hidden">
            <img
              src={offers[index % offers.length].image}
              className="absolute inset-0 h-full w-full object-cover"
              alt=""
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

            <div className="absolute bottom-3 left-3 right-3 text-white text-sm font-semibold truncate">
              {offers[index % offers.length].title}
            </div>
          </div>

          {/* slider row */}
          <div className="relative h-[150px] sm:h-[180px] md:h-full overflow-hidden">

            <motion.div
              animate={{
                x: -(index * (cardWidth + GAP)),
              }}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 flex"
              style={{ gap: GAP, paddingLeft: 12, paddingRight: 12 }}
            >
              {track.map((item, i) => (
                <div
                  key={i}
                  style={{ width: cardWidth }}
                  className="
                    relative
                    h-[110px]
                    sm:h-[140px]
                    md:h-[420px]
                    shrink-0
                    rounded-xl
                    overflow-hidden
                  "
                >
                  <img
                    src={item.image}
                    className="absolute inset-0 h-full w-full object-cover"
                    alt=""
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  <div className="absolute bottom-2 left-2 right-2 text-white text-[11px] sm:text-xs font-semibold truncate">
                    {item.title}
                  </div>
                </div>
              ))}
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
