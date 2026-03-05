"use client";

import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { useState, forwardRef, useRef, useEffect } from "react";

const alphabets = ["0-9", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

const HEADER_HEIGHT = 65;

const AlphabetFilter = forwardRef(function AlphabetFilter(
  { onSelect, headerVisible },
  ref
) {
  const [active, setActive] = useState(null);
  const [hideHeading, setHideHeading] = useState(false);

  const stripRef = useRef(null);

  // 🔹 flag to know heading was hidden by timer
  const autoHiddenRef = useRef(false);

  const { scrollY } = useScroll();

  // ---------------------------------------
  // Auto hide heading after 3 seconds
  // ---------------------------------------
  useEffect(() => {
    const t = setTimeout(() => {
      autoHiddenRef.current = true;
      setHideHeading(true);
    }, 2000);

    return () => clearTimeout(t);
  }, []);

  // ---------------------------------------
  // Hide alphabet heading on scroll
  // (only if not auto-hidden)
  // ---------------------------------------
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (autoHiddenRef.current) return;

    setHideHeading((prev) => {
      if (!prev && latest > 4) return true;
      if (prev && latest < 8) return false;
      return prev;
    });
  });

  // ---------------------------------------
  // Mobile auto scroll
  // ---------------------------------------
  useEffect(() => {
    if (!stripRef.current || !active) return;

    const el = stripRef.current.querySelector(
      `[data-alpha="${active}"]`
    );

    el?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active]);

  return (
    <motion.div
      ref={ref}
      layout
      className="
        sticky
        z-40
        bg-[var(--card)]/90
        backdrop-blur-lg
        shadow-md
        border-b border-[var(--border)]
      "
      animate={{
        top: headerVisible ? HEADER_HEIGHT : 0,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{ position: "sticky" }}
    >
      {/* ---------- Heading (auto hide after 3s + hide on scroll) ---------- */}
      <AnimatePresence mode="popLayout" initial={false}>
        {!hideHeading && (
          <motion.div
            key="heading"
            layout
            initial={{ opacity: 0, y: -8, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden text-center px-3 sm:px-6"
          >
            <div className="py-6 sm:py-8 md:py-10">
              <h2 className="heading text-xl sm:text-2xl md:text-3xl lg:text-5xl">
                Browse Stores A–Z
              </h2>

              <p className="description mt-2 text-sm sm:text-base md:text-lg">
                Discover brands instantly with smart filtering
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- Alphabet strip ---------- */}
      <motion.div
        ref={stripRef}
        layout
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: { staggerChildren: 0.02 },
          },
        }}
        className="
          relative
          flex flex-nowrap sm:flex-wrap
          justify-start sm:justify-center
          gap-1.5 sm:gap-2 md:gap-2.5
          px-2 sm:px-4 md:px-6
          py-3 sm:py-4
          overflow-x-auto sm:overflow-visible
          scrollbar-none
          overscroll-x-contain
          scroll-smooth
        "
      >
        {alphabets.map((char) => {
          const isActive = active === char;

          return (
            <motion.button
              data-alpha={char}
              key={char}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActive(char);
                onSelect?.(char);
              }}
              className={`
                relative shrink-0
                flex items-center justify-center
                rounded-md font-semibold
                transition-all duration-300
                overflow-hidden
                border border-[var(--border)]
                text-sm sm:text-base md:text-lg lg:text-xl
                px-2.5 sm:px-3.5 md:px-4
                py-1 sm:py-1.5
                min-w-[36px] sm:min-w-[40px] md:min-w-[44px]
                ${
                  isActive
                    ? "text-[var(--primary-foreground)]"
                    : "bg-[var(--muted)] text-[var(--foreground)]"
                }
              `}
              style={{
                background: isActive ? "var(--primary)" : undefined,
              }}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    layoutId="activeGlow"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.25 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(90deg, var(--primary), transparent)",
                    }}
                  />
                )}
              </AnimatePresence>

              {!isActive && (
                <span
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--primary), transparent)",
                  }}
                />
              )}

              <span className="relative z-10">{char}</span>

              {isActive && (
                <motion.span
                  animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="absolute inset-0 rounded-md"
                  style={{
                    border: "1px solid var(--primary)",
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
});

export default AlphabetFilter;
