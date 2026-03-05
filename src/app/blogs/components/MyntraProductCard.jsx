"use client";
import { Flame, TrendingUp, Sparkles, Tag } from "lucide-react";

const badgeConfig = {
  Trending: {
    label: "Trending",
    className: "bg-black text-white",
    Icon: TrendingUp,
  },
  Hot: {
    label: "Hot",
    className: "bg-red-600 text-white",
    Icon: Flame,
  },
  New: {
    label: "New",
    className: "bg-green-600 text-white",
    Icon: Sparkles,
  },
  Deal: {
    label: "Deal",
    className: "bg-yellow-400 text-black",
    Icon: Tag,
  },
};

export default function MyntraProductCard({ product }) {
   const badge = badgeConfig[product.badge];
  return (
    <a
      href={product.link}
      target="_blank"
      rel="noopener noreferrer"
      className="
        flex-shrink-0
        rounded-xl overflow-hidden
        bg-[var(--card)]
        border border-[var(--border)]
        transition-all duration-300
        hover:shadow-lg
        transition-transform hover:-translate-y-1
        block
        w-[150px] sm:w-[200px] md:w-[220px] lg:w-[260px]
      "
    >
      <div className="relative w-full aspect-[3/4] bg-[var(--muted)]">
      {/* BADGE */}
        {badge && (
          <span
            className={`
              absolute top-3 left-3 z-10
              inline-flex items-center gap-1.5
              px-2 py-1
              rounded-full
              text-[11px] font-semibold
              ${badge.className}
            `}
          >
            <badge.Icon size={12} />
            {badge.label}
          </span>
        )}
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-2 text-center">
        <p className="text-sm font-medium text-[var(--foreground)] mb-3 line-clamp-2">
          {product.title}
        </p>

        <span
          className="
            inline-flex items-center justify-center
            w-full py-2 rounded-lg        
            text-sm font-semibold
            bg-[var(--primary)]            
            text-[var(--primary-foreground)]
            hover:opacity-90 transition
          "
        >
          Get Offers
        </span>
      </div>
    </a>
  );
}
