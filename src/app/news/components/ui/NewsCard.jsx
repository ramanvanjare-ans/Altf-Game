"use client";

import Link from "next/link";
import { Heart, Share2, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function NewsCard({ news }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(news.likes);

  return (
    <Link href={`/news/${news.slug}`} className="block">
      <article
        className="
          w-full overflow-hidden rounded-xl
          border border-[var(--border)]
          bg-[var(--card)]
          transition hover:bg-[var(--muted)]
        "
      >
        {/* Image */}
        {news.image_url && (
          <div className="relative h-100 w-full overflow-hidden">
            <img
              src={news.image_url}
              alt={news.headline}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          {/* Source */}
          <div className="mb-2 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
            <span className="font-semibold text-[var(--foreground)]">
              {news.source}
            </span>
            <span>•</span>
            <span>{news.published_hours_ago}h ago</span>
          </div>

          {/* Headline */}
          <h2 className="mb-2 text-lg font-bold leading-snug text-[var(--foreground)]">
            {news.headline}
          </h2>

          {/* Summary */}
          <p className="mb-4 line-clamp-3 text-sm text-[var(--muted-foreground)]">
            {news.summary}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-[var(--muted-foreground)]">
            <span>{news.location}</span>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Like */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setLiked(!liked);
                  setLikes((l) => (liked ? l - 1 : l + 1));
                }}
                className={`flex items-center gap-1 transition
                  ${
                    liked
                      ? "text-red-500"
                      : "hover:text-red-500"
                  }
                `}
              >
                <Heart
                  size={16}
                  className={liked ? "fill-red-500" : "fill-transparent"}
                />
                {likes}
              </button>

              {/* Comment */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="flex items-center gap-1 hover:text-[var(--foreground)] transition"
              >
                <MessageCircle size={16} />
                {news.comments}
              </button>

              {/* Share */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigator.share?.({
                    title: news.headline,
                    url: `${window.location.origin}/news/${news.slug}`,
                  });
                }}
                className="flex items-center gap-1 hover:text-[var(--foreground)] transition"
              >
                <Share2 size={16} />
                {news.shares}
              </button>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
