"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import BlogCard from "./BlogCard";

export default function CategoryFilter({ 
  categories, 
  activeCategory,
   setActiveCategory,
  blogs=[]
 }) {
  const scrollRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

   const whatsHotBlogs = blogs.length > 0 
    ? [...blogs].sort(() => 0.5 - Math.random()).slice(0, 3)
    : [];
  
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
  }, [sidebarOpen]);


  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkSidebar = () => {
      const mobile = window.innerWidth < 1024;
      const overflow = el.scrollWidth > el.clientWidth;
      setIsMobile(mobile);
      setShowSidebar(mobile || overflow);
    };

    checkSidebar();
    window.addEventListener("resize", checkSidebar);
    return () => window.removeEventListener("resize", checkSidebar);
  }, [categories]);

   const randomBlogs = [...blogs]
    .sort(() => 0.5 - Math.random()) 
    .slice(0, 5); 

  if (showSidebar && isMobile) {
    return (
      <>
        <button
          onClick={() => setSidebarOpen(true)}
          className="mb-4 flex items-center justify-end ml-auto text-sm font-medium"
          style={{ color: "var(--foreground)" }}
        >
          <Menu className="w-5 h-5" />
        </button>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSidebarOpen(false)}
            />
            <aside
              className="relative w-100 max-w-full h-full p-4 overflow-y-auto transition-transform duration-300 translate-x-0"
              style={{ backgroundColor: "var(--background)" }}
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="mb-4 text-lg font-semibold">Categories</h3>
              <div className="flex flex-col gap-3">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setSidebarOpen(false);
                      }}
                      className="text-left py-2 px-3 rounded-md transition"
                      style={{
                        backgroundColor: isActive ? "var(--primary)" : "transparent",
                        color: isActive ? "var(--primary-foreground)" : "var(--foreground)",
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
              <h3 className="mt-6 mb-2 text-lg font-semibold">What's Hot</h3>
              <div className="flex flex-col gap-4">
             {whatsHotBlogs.length > 0 ? (
              whatsHotBlogs.map((blog) => (
                <div key={blog.slug} className="w-full">
            <BlogCard
             blog={blog}
             variant="horizontal"
             showExcerpt={true}
             className="w-full flex items-start gap-3"
            style={{ minHeight: "60px" }}
            />
      </div>

            ))
            ) : (
              <p className="text-sm text-[var(--muted-foreground)]">
                 No blogs available.
              </p>
             )}
            </div>
            </aside>
          </div>
        )}
      </>
    );
  }

  return (
    <div
      ref={scrollRef}
      className={`flex gap-6 mb-4 justify-end ml-auto whitespace-nowrap py-1 ${
        showSidebar ? "overflow-x-auto no-scrollbar" : ""
      }`}
    >
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <button
  key={cat}
  onClick={() => setActiveCategory(cat)}
  className="relative text-lg font-medium pb-2 flex-shrink-0
             transition-all duration-300 group hover:-translate-y-[1px]" // ⬅️ NEW
  style={{
    color: isActive ? "var(--primary)" : "var(--muted-foreground)",
  }}
>
  {cat}

  {/* ⬅️ NEW: Hover + Active underline */}
  <span
    className={`absolute left-0 -bottom-0.5 h-[2px] w-full
                transition-all duration-300
                ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
    style={{
      backgroundColor: "var(--primary)",
      transform: isActive ? "scaleX(1)" : "scaleX(0)",
      transformOrigin: "left",
    }}
  />
</button>

            
     
        );
      })}
    </div>
  );
}
