"use client";

import React, { useEffect, useState } from "react";
import BlogCard from "./components/BlogCard";
import AdCard from "./components/AdCard";
import CategoryFilter from "./components/CategoryFilter";
import FeaturedSection from "./components/FeaturedSection";
import CategoryStrip from "./components/CategoryStrip";
import MyntraFeaturedStrip from "./components/MyntraFeaturedStrip";
//import WorldwideUpdatesStrip from "./components/WorldwideUpdatesStrip";


export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetch("/data/blogs.json")
      .then((res) => res.json())
      .then(setBlogs)
      .catch(console.error);
  }, []);

  const categories = ["All", ...new Set(blogs.map((b) => b.category))];
  const filtered =
    activeCategory === "All"
      ? blogs
      : blogs.filter((b) => b.category === activeCategory);

  const featured = filtered[0];
  const sideBlogs = filtered.slice(1, 5);
  const remainingBlogs = filtered.slice(5);

  const categoryCards = [
  {
    name: "Tools",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
  },
  {
    name: "Finance",
    image:
      "https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=800&q=80", 
  },
  {
    name: "Utility",
    image:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80", 
  },
  {
    name: "Language",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Business",
    image:
      "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=800&q=80", 
  },
  {
    name: "Developer",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80", 
  },
];


  const ads = [
    "/images/adbanner.png",
    "/images/adbanner2.jpg",
    "/images/adbanner3.jpg",
    "/images/adbanner4.png",
    "/images/adbanner5.jpg",
    "/images/adbanner6.gif",
    "/images/adbanner7.jpg",
    "/images/adbanner8.png",
    "/images/adbanner5.jpg",
    "/images/adbanner10.jpg",
    "/images/adbanner11.jpg",
    "/images/adbanner12.jpg",
  ];

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <div id="blogs-container" className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-6 md:py-8">
        <div className="flex gap-3 md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
         {/* HEADER */}
        <h1 className="bg-gradient-to-r from-[#2D68C4] to-[#519CF1] bg-clip-text text-transparent font-bold text-2xl sm:text-3xl md:text-4xl">
          Latest Blogs
        </h1>
        <div className="flex-1">
          <div className="min-w-max">
          <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          blogs={blogs}
        />
        </div>
        </div>
        </div>
  
        {activeCategory === "All" ? (
          <>
           <div className="flex flex-col gap-6 md:gap-8">
            <FeaturedSection featured={featured} sideBlogs={sideBlogs} />
          </div>

           <CategoryStrip
            categories={categoryCards} 
             activeCategory={activeCategory}
             setActiveCategory={setActiveCategory}
            />

             {/* TOP ADS */}
            <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {ads.slice(0, 2).map((a, i) => (
                <AdCard key={i} src={a} height="h-20" />
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {ads.slice(4, 6).map((a, i) => (
                <AdCard key={i} src={a} height="h-20" />
              ))}
            </div>
            <MyntraFeaturedStrip />
            {/* < WorldwideUpdatesStrip/> */}
          
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-20">
              {remainingBlogs.map((b, idx) => (
                <React.Fragment key={b.id}>
                  {idx === 3 && <AdCard src={ads[2]} height="h-40 sm:h-48 md:h-56" />}
                  <BlogCard blog={b} />
                  {idx === 3 && <AdCard src={ads[3]} height="h-40 sm:h-48 md:h-56" />}
                </React.Fragment>
              ))}
            </div>

            {/* BOTTOM AD COLUMNS */}
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <AdCard src={ads[6]} height="h-[180px] sm:h-[220px] lg:h-[260px]" />
                {[ads[7], ads[8]].map((a, i) => (
                  <AdCard key={i} src={a} height="h-[90px] sm:h-[100px] lg:h-[120px]" />
                ))}
              </div>
              <div className="space-y-2">
                <AdCard src={ads[9]} height="h-[180px] sm:h-[220px] lg:h-[260px]" />
                {[ads[10], ads[11]].map((a, i) => (
                  <AdCard key={i} src={a} height="h-[90px] sm:h-[100px] lg:h-[120px]" />
                ))}
              </div>
            </div>
         
          <div className="mt-12">

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {remainingBlogs.slice(0, 3).map((blog, index) => (
        <BlogCard key={`${blog.id}-${index}`} blog={blog} height="h-[220px]" />
      ))}
      
       </div>
   </div>
        {/* HORIZONTAL BLOGS */}
        <section className="mt-12 md:mt-16">
         <div className="flex items-center gap-4 mb-6">
        <h2 className="text-lg md:text-xl font-bold text-[var(--foreground)] whitespace-nowrap">
           More Blogs You May Like
        </h2>
        <div className="flex-1 min-w-0 h-px bg-[var(--border)] opacity-60 translate-y-[1px]"/>
      
      </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {remainingBlogs.slice(2, 11).map((blog) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            variant="horizontal"
          />
         ))}
         </div>
       </section>


          </>
        ) : (
          /* CATEGORY VIEW*/
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

            
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>

         
            <div className="lg:col-span-1 space-y-6 sticky top-24">
              {ads.slice(2, 5).map((ad, i) => (
                <AdCard key={i} src={ad} height="h-48" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
