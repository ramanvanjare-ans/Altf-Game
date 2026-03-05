"use client";

import { useState } from "react";

export default function BlogComments({ comments, addComment, showCommentBox, setShowCommentBox }) {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment(newComment.trim());
    setNewComment("");
    setShowCommentBox(false);
  };

  return (
    <div
      className="mt-12 pt-6 border-t  border-[var(--border)]"
    >
      <h2
        className="text-lg font-semibold mb-4 text-[var(--foreground)]"
      >
        Comments
      </h2>

      {/* Comment input box */}
      {showCommentBox && (
        <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            placeholder="Write a comment..."
            className="w-full p-3 border rounded-md border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)]"
          />
          <button
            type="submit"
            className="self-end px-4 py-2 rounded transition-colors bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-9"
          >
            Post
          </button>
        </form>
      )}

      {/* Comment list */}
      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((c, index) => (
            <div
              key={index}
              className="rounded-lg border p-3 text-sm border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)]"
            >
              <p>{c.text}</p>
              <span
                className="text-xs text-[var(--muted-foreground)]"
              >
                {c.date}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[var(--muted-foreground)]">No comments yet.</p>
      )}
    </div>
  );
}
