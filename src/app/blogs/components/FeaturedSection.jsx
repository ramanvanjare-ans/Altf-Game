import BlogCard from "./BlogCard";

export default function FeaturedSection({ featured, sideBlogs }) {
  if (!featured) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
      <div className="md:col-span-2">
        <BlogCard blog={featured} height="h-[350px] sm:h-[450px] lg:h-[520px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-4">
        {sideBlogs.map((b) => (
          <BlogCard key={b.id} blog={b} height="h-[200px] sm:h-[240px]" />
        ))}
      </div>
    </div>
  );
}
