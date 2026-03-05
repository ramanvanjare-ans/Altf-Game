"use client";

import { Heart, MessageCircle, Share2 } from "lucide-react";

export default function BlogActions({
  likes,
  setLikes,
  liked,
  setLiked,
  commentsCount,
  showCommentBox,
  setShowCommentBox,
  newComment,
  setNewComment,
  onAddComment
}) {
  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(newComment.trim());
    setNewComment("");
    setShowCommentBox(false);
  };

  return (
    <div className="mt-12 pt-6 border-t border-[var(--border)]">
      <div className="flex items-center gap-6 text-sm text-[var(--muted-foreground)]">
        {/* LIKE */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 transition-colors ${
            liked ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"
          }`}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
          <span>{likes}</span>
        </button>

        {/* COMMENT */}
        <button
          onClick={() => setShowCommentBox(!showCommentBox)}
          className="flex items-center gap-1 transition-colors text-[var(--muted-foreground)] hover:text-[var(--primary)]"
        >
          <MessageCircle size={18} />
          <span>{commentsCount}</span>
        </button>

        {/* SHARE */}
        <button
          onClick={() => navigator.share?.({ url: window.location.href })}
          className="flex items-center gap-1 transition-colors text-[var(--muted-foreground)] hover:text-[var(--secondary)]"
        >
          <Share2 size={18} />
          Share
        </button>
      </div>

      {/* COMMENT BOX */}
      {showCommentBox && (
        <form onSubmit={handleCommentSubmit} className="mt-4 w-full max-w-2xl flex flex-col gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            placeholder="Write your comment..."
            className="w-full p-3 border rounded-md text-[var(--foreground)] bg-[var(--muted)] border-[var(--border)]"
           
          />
          <button
            type="submit"
            className="self-end px-4 py-2 rounded transition-colors text-[var(--primary-foreground)] bg-[var(--primary)] hover:brightness-90"
           
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}
