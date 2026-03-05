"use client";

import { motion, LayoutGroup } from "framer-motion";

export default function AcademyFilter({ categories, active, onChange }) {
  const all = ["All", ...categories];

  return (
    <LayoutGroup>
      <div
        className="inline-flex flex-wrap gap-2 rounded-2xl border border-(--border) bg-(--card) backdrop-blur p-2"
      >
        {all.map((item) => {
          const isActive = active === item;

          return (
            <button
              key={item}
              onClick={() => onChange(item)}
              className="
                relative isolate overflow-hidden
                px-4 py-1.5 text-sm font-medium
                rounded-xl transition-colors text-(--muted-foreground)
              "
            >
              {/* animated active pill */}
              {isActive && (
                <motion.span
                  layoutId="academy-filter-active"
                  className="
                    absolute inset-0 -z-10 rounded-xl
                    bg-gradient-to-r
                    from-indigo-500 via-blue-500 to-cyan-400
                  "
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}

              <span
                className={
                  isActive
                    ? "text-white"
                    : "text-(--muted-foreground) hover:text-(--muted-foreground)/80"
                }
              >
                {item}
              </span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
