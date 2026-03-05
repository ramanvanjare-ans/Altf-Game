"use client";
import Image from "next/image";

export default function BlogHeader({ blog }) {
  return (
    <div className="relative w-full h-[420px] overflow-hidden mb-12">

      <Image
        src={blog.image}
        alt={blog.title}
        fill
        className="object-cover"
        priority
      />


      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute bottom-10 left-10 right-10 text-[var(--card-foreground)]">
        <span className="inline-block mb-4 bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold px-3 py-1 rounded">
          {blog.category}
        </span>

        <h1 className="max-w-4xl
    text-3xl sm:text-4xl md:text-5xl
    font-extrabold
    leading-tight
    tracking-tight
    text-white
    drop-shadow-lg">
          {blog.title}
        </h1>

       
      </div>

    </div>
  );
}
