"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import BlogHeader from "../components/BlogHeader";
import BlogActions from "../components/BlogActions";
import BlogContent from "../components/BlogContent";
import BlogAds from "../components/BlogAds";
import BlogComments from "../components/BlogComments";
import { ArrowLeft } from "lucide-react";


export default function BlogDetailPage() {
  const pathname = usePathname();
  const router = useRouter();
  const slug = pathname.split("/").pop();

  const [blog, setBlog] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);

  const [showCommentBox, setShowCommentBox] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetch("/data/blogs.json")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((b) => b.slug === slug);
        if (!found) router.push("/blogs");
        else {
          setBlog(found);
          setLikes(found.likes || 0);
          setComments(found.comments || []);
        }
      });
  }, [slug, router]);

  const addComment = (text) => {
    const newC = {
      text,
      date: new Date().toLocaleString(),
    };
    setComments([newC, ...comments]);
  };

  if (!blog) {
    return (
      <div className="py-20 text-center text-gray-500">Loading blog...</div>
    );
  }

  return (
    <div
      className="py-16"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-6">
  <button
    onClick={() => router.push("/blogs")}
    aria-label="Back to all blogs"
    className="
      inline-flex items-center justify-center
      w-10 h-10
      rounded-full
    border border-[var(--border)]
    bg-[var(--card)]
    text-[var(--primary)]
    hover:bg-[var(--primary)]
    hover:text-[var(--primary-foreground)]
    transition-all duration-200
    "
  >
    <ArrowLeft size={18} />
      </button>
         </div>

        <BlogHeader blog={blog} />

        <BlogActions
          likes={likes}
          setLikes={setLikes}
          liked={liked}
          setLiked={setLiked}
          commentsCount={comments.length}
          showCommentBox={showCommentBox}
          setShowCommentBox={setShowCommentBox}
          newComment={newComment}
          setNewComment={setNewComment}
          onAddComment={addComment}
        />
    
        <div className="grid grid-cols-1 lg:grid-cols-[4fr_1fr] gap-12 mt-10">
          <div className="flex flex-col gap-10">
        
            <BlogContent content={blog.content} />

            <BlogComments comments={comments} addComment={addComment} showCommentBox={showCommentBox} setShowCommentBox={setShowCommentBox} />
          </div>

        
          <BlogAds ads={blog.ads || []} />
        </div>
      </div>
    </div>
  );
}
