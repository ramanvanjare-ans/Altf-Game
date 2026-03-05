"use client";

import { useParams } from "next/navigation";
import { Heart, Share2, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import newsData from "../../../../public/data/newsdata.json";
import NewsCard from "../components/ui/NewsCard";

export default function NewsDetailPage() {
  const { slug } = useParams();

  const article = useMemo(() => {
    return newsData.news.find(
      (n) => n.slug === slug
    );
  }, [slug]);

  if (!article) {
    return <p>Article not found</p>;
  }

  const [likes, setLikes] = useState(article.likes);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const relatedNews = newsData.news
    .filter((n) => n.slug !== slug)
    .slice(0, 5);

  return (
    <article className="space-y-10">
      {/* HEADER */}
      <header className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold">
          {article.headline}
        </h1>

        <div className="text-sm text-[var(--muted-foreground)]">
          {article.source} · {article.published_hours_ago}h ago ·{" "}
          {article.location}
        </div>
      </header>

      {/* IMAGE */}
      {article.image_url && (
        <img
          src={article.image_url}
          alt={article.headline}
          className="w-full rounded-xl"
        />
      )}

      {/* CONTENT */}
      <div className="leading-relaxed">
        <p>{article.summary}</p>
      </div>

      {/* ACTIONS */}
<div className="flex items-center gap-6 border-y border-[var(--border)] py-4">
  {/* Like */}
  <button
    onClick={() => {
      setLiked(!liked);
      setLikes((l) => (liked ? l - 1 : l + 1));
    }}
    className={`flex items-center gap-2 text-sm font-medium transition
      ${
        liked
          ? "text-red-500"
          : "text-[var(--muted-foreground)] hover:text-red-500"
      }
    `}
  >
    <Heart
      size={18}
      className={liked ? "fill-red-500" : "fill-transparent"}
    />
    {likes}
  </button>

  {/* Comment */}
  <button
    className="flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition"
    onClick={() =>
      document
        .getElementById("comments-section")
        ?.scrollIntoView({ behavior: "smooth" })
    }
  >
    <MessageCircle size={18} />
    {comments.length}
  </button>

  {/* Share */}
  <button
    onClick={() =>
      navigator.share?.({
        title: article.headline,
        url: window.location.href,
      })
    }
    className="flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition"
  >
    <Share2 size={18} />
    Share
  </button>
</div>


      {/* COMMENTS */}
      <section className="space-y-4">
        <h2 className="font-bold">Comments</h2>

        <div className="flex gap-2">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 rounded-md border border-[var(--border)] px-3 py-2 text-sm"
          />
          <button
            onClick={() => {
              if (!commentText.trim()) return;
              setComments((c) => [...c, commentText]);
              setCommentText("");
            }}
            className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm text-white"
          >
            Post
          </button>
        </div>

        <ul className="space-y-2">
          {comments.map((c, i) => (
            <li
              key={i}
              className="rounded-md bg-[var(--muted)] p-3 text-sm"
            >
              {c}
            </li>
          ))}
        </ul>
      </section>

      {/* RELATED */}
      <section className="space-y-4">
        <h2 className="font-bold">You may also like</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {relatedNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </section>
    </article>
  );
}
