"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export default function FeaturedAcademies({ items }) {
  const scrollerRef = useRef(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let rafId;
    let paused = false;
    const speed = 0.35; // auto scroll speed

    const animate = () => {
      if (!paused) {
        scroller.scrollLeft += speed;

        // seamless loop (because we duplicate the list)
        if (scroller.scrollLeft >= scroller.scrollWidth / 2) {
          scroller.scrollLeft = 0;
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();

    const onEnter = () => (paused = true);
    const onLeave = () => (paused = false);

    scroller.addEventListener("mouseenter", onEnter);
    scroller.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(rafId);
      scroller.removeEventListener("mouseenter", onEnter);
      scroller.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // duplicate for infinite scroll illusion
  const list = [...items, ...items];

  return (
    <section>
      <h3 className="text-xl font-medium mb-4">Featured academies</h3>

     <div
  ref={scrollerRef}
  className="
    flex gap-6 overflow-x-auto pb-3
    no-scrollbar
  "
>
        {list.map((academy, index) => (
          <a
            key={`${academy.name}-${index}`}
            href={academy.url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              min-w-[280px] shrink-0
              rounded-xl border border-(--border) bg-(--card) p-5
              transition
            "
          >
            <div className="h-10 mb-4 flex items-center">
              <Image
                src={academy.image}
                alt={academy.name}
                width={120}
                height={40}
                className="object-contain"
              />
            </div>

            <div className="text-sm text-(--muted-foreground) mb-1">
              {academy.category}
            </div>

            <div className="font-medium text-(--foreground)">{academy.name}</div>
          </a>
        ))}
      </div>
    </section>
  );
}
