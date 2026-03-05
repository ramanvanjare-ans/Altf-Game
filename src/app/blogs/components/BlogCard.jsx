"use client";
import Link from "next/link";
import Image from "next/image";

export default function BlogCard({ 
  blog,
  variant="vertical",
 height = "h-64", 
 showExcerpt = false, 
 className = "" }) {

  if(variant==="horizontal"){
    return(
      <Link href={`/blogs/${blog.slug}`} className="group">
        <article className={`flex flex-col sm:flex-row rounded-lg overflow-hidden border border-[var(--border)]
          bg-[var(--card)] text-[var(--card-foreground)]
          hover:shadow-md transition ${className}`}
          >
            {/*Image*/}
            <div className="relative w-full h-48 sm:w-60 sm:h-48  shrink-0">
              <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
              />
               <span
              className="absolute bottom-2 left-2 px-2 py-0.5 text-xs rounded
              font-secondary bg-[var(--primary)] text-[var(--primary-foreground)]"
            >
              {blog.category}
            </span>
           </div>
            
          {/* CONTENT */}
          <div className="p-4 flex flex-col justify-center">
            <h3
              className="text-sm md:text-base font-semibold font-primary
              leading-snug line-clamp-2 group-hover:text-[var(--primary)]"
            >
              {blog.title}
            </h3>

            <p className="text-xs mt-2 text-[var(--muted-foreground)] line-clamp-2">
              {blog.excerpt}
            </p>
            </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/blogs/${blog.slug}`} className="group">
      <article className={`relative overflow-hidden shadow hover:shadow-xl transition ${height} ${className}`}>
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className="object-cover group-hover:scale-105 transition"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <span className="inline-block mb-2 px-3 py-1 text-xs font-semibold rounded-full
            bg-[var(--primary)] text-[var(--primary-foreground)]">
            {blog.category}
          </span>
          <h3 className="text-lg font-bold line-clamp-2 text-white-200">{blog.title}</h3>
          {showExcerpt && <p className="text-sm mt-2 line-clamp-3 text-[var(--muted-foreground)]">{blog.excerpt}</p>}
        </div>
      </article>
    </Link>
  );
}
