"use client";

import { useEffect } from "react";
import { animations } from "@/platform/registry/animationRegistry";

export default function GlobalAnimationProvider({ children }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const animatedClasses = Object.keys(animations);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;

          const animationClass = animatedClasses.find((cls) =>
            el.classList.contains(cls)
          );
          if (!animationClass) return;

          const { keyframes, options } = animations[animationClass];

          const resolvedOptions =
            typeof options === "function" ? options(el) : options;

          el.animate(keyframes, resolvedOptions);
          observer.unobserve(el);
        });
      },
      { threshold: 0.15 }
    );

    const observeElements = (root = document) => {
      animatedClasses.forEach((cls) => {
        root.querySelectorAll?.(`.${cls}`).forEach((el) => {
          observer.observe(el);
        });
      });
    };

    // Initial scan
    observeElements();

    // Watch for dynamically added nodes (loading, filtering, etc.)
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          observeElements(node);
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return children;
}
