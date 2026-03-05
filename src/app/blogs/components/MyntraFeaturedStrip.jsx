"use client";

import { useEffect, useRef,useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MyntraProductCard from "./MyntraProductCard";
import myntraProducts from "./myntraProducts";

const AUTO_SCROLL_DELAY = 1500;

export default function MyntraFeaturedStrip() {
  const scrollRef = useRef(null);
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const [cardWidth, setCardWidth] = useState(0);
   const [visibleCards, setVisibleCards] = useState(1);

   useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);

      if (cardRef.current && scrollRef.current) {
        const width = cardRef.current.offsetWidth + 24;
        setCardWidth(width); 

        const containerWidth = scrollRef.current.offsetWidth;
          setVisibleCards(Math.max(1, Math.floor(containerWidth / width))); 
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


   const totalDots = Math.max(
    myntraProducts.length - visibleCards + 1,
    1
  );

 useEffect(() => {
    const el = scrollRef.current;
    if (!el || !cardWidth) return;

    const onScroll = () => {
      const index = Math.floor(el.scrollLeft / cardWidth);

      const clampedIndex = Math.min(
        Math.max(index, 0),
        totalDots - 1 
      );

      setActiveIndex(clampedIndex);
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [cardWidth, totalDots]);

  useEffect(() => {
    if (isHovered || !cardWidth || !scrollRef.current || isMobile) return;

    const interval = setInterval(() => {
      const next = (activeIndex + 1) % totalDots;

      scrollRef.current.scrollTo({
        left: next * cardWidth,
        behavior: "smooth",
      });
    }, AUTO_SCROLL_DELAY);

    return () => clearInterval(interval);
  }, [isHovered, activeIndex, cardWidth, totalDots,isMobile]);

    const scroll = (direction) => {
    const next =
      direction === "left"
        ? Math.max(activeIndex - 1, 0)
        : Math.min(activeIndex + 1, totalDots - 1); 

    scrollRef.current.scrollTo({
      left: next * cardWidth,
      behavior: "smooth",
    });
  };



  return (
    <section className="my-20 relative">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-lg md:text-xl font-bold text-[var(--foreground)] whitespace-nowrap">
           Trending Picks For You
        </h2>
        <div className="flex-1 min-w-0 h-px bg-[var(--border)] opacity-60 translate-y-[1px]"/>
      
      </div>

      <div
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* LEFT ARROW */}
        
          <button
            onClick={() => scroll("left")}
            className="
              absolute -left-2 top-1/2 -translate-y-1/2 z-10
              hidden group-hover:flex
              items-center justify-center
              w-10 h-10 rounded-full
              bg-[var(--background)]
              text-[var(--foreground)]
              border border-[var(--border)] shadow-md
            "
          >
            <ChevronLeft />
          </button>
      
     

      {/* VIEWPORT */}
      <div
        ref={scrollRef}
        className="
          flex gap-4 sm:gap-6
          overflow-x-hidden
           px-4 sm:px-12
           snap-x snap-mandatory
          whitespace-nowrap
          scroll-smooth
        "
      >
        {myntraProducts.map((product, index) => (
          <div key={product.id} ref={index === 0 ? cardRef : null}>
            <MyntraProductCard key={product.id} product={product} />
             </div>
          ))}
       

      </div>


      {/* RIGHT ARROW */}
          <button
            onClick={() => scroll("right")}
            className="
              absolute -right-2 top-1/2 -translate-y-1/2 z-10
              hidden group-hover:flex
              items-center justify-center
              w-10 h-10 rounded-full
              bg-[var(--background)]
             text-[var(--foreground)]
             border border-[var(--border)]
             shadow-md
            "
          >
            <ChevronRight />
          </button>
      
        </div>
          {/* DOTS */}
       <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalDots }).map((_, i) => ( 
          <span
            key={i}
            className={`h-2 w-2 rounded-full transition ${
              activeIndex === i ? "bg-[var(--foreground)] scale-110" : "bg-[var(--border)] opacity-60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}