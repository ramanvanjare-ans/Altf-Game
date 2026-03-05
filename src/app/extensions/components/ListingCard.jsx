"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

export default function ListingCard({ extension, slug }) {

  // deterministic mock users
  const seed = slug
    ? slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
    : 0;

  const randomUsers = ((seed * 9301 + 49297) % 50) + 5;
  const usersCount = extension.users || `${randomUsers}K+`;

  return (
    <Link
      href={`/extensions/${slug}`}
      className="group block rounded-xl bg-(--card)
      hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]
      transition-all duration-300 h-[300px]"
    >
      <div className="p-4 h-full flex flex-col">

        {/* Thumbnail */}
        {/* Thumbnail */}
        <div className="relative w-full h-[150px] rounded-xl overflow-hidden bg-white mb-4">

          {extension?.image && extension.image.trim() !== "" ? (
            <Image
              src={extension.image}
              alt={extension.name || "extension"}
              fill
              sizes="(max-width: 640px) 100vw, 25vw"
              className="object-cover group-hover:scale-[1.04] transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
              No image
            </div>
          )}

        </div>


        {/* Title */}
        <h3 className="font-semibold text-[15px] leading-snug text-(--foreground) line-clamp-2">
          {extension.name}
        </h3>

        {/* Rating row */}
        <div className="flex items-center gap-2 text-sm mt-1">
          <span className="text-(--muted-foreground) font-medium">
            {extension.rating}
          </span>
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
        </div>

        {/* Description */}
        <p className="text-sm text-(--muted-foreground) mt-2 line-clamp-2">
          {extension.description}
        </p>

        {/* Footer (users) */}
        <div className="mt-auto pt-3 text-xs text-(--muted-foreground)">
          {usersCount} users
        </div>
      </div>
    </Link>
  );
}
