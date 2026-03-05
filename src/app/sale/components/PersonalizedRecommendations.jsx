"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Heart } from "lucide-react";
import Image from "next/image";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1 },
};

export default function PersonalizedRecommendations({ recommendations }) {
  const [liked, setLiked] = useState({});

  const toggleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="py-20 bg-(background)">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-3 mb-4">
           
            <h2 className="text-3xl md:text-4xl font-bold text-(--foreground)">
              Picked Just For You
            </h2>
          </div>
          <p className="text-(--muted-foreground) max-w-2xl mx-auto">
            Based on your browsing history and preferences, we've curated these exclusive deals
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {recommendations.map((product) => (
            <motion.div
              key={product.id}
              variants={item}
              whileHover={{ y: -8 }}
              className="group relative bg-(--card) border border-(--border) rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
            >
              {/* Product Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

                {/* Match Score Badge */}
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-1 bg-(--background) backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                    <TrendingUp className="w-3.5 h-3.5 text-(--primary)" />
                    <span className="text-xs font-bold text-(--foreground)">
                      {product.matchScore}% Match
                    </span>
                  </div>
                </div>

                {/* Like Button */}
                <button
                  onClick={() => toggleLike(product.id)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-(--background)/80 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition cursor-pointer"
                >
                  <Heart
                    className={`w-5 h-5 transition ${
                      liked[product.id]
                        ? "fill-red-500 text-red-500"
                        : "text-(--muted-foreground)"
                    }`}
                  />
                </button>

                {/* Discount Badge */}
                {product.discount && (
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-block px-3 py-1 bg-green-600 text-(--primary-foreground) text-xs font-bold rounded-xl shadow-md">
                      Save {product.discount}%
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-(--primary) uppercase tracking-wide">
                    {product.category}
                  </span>
                  {product.isNew && (
                    <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-xl">
                      New
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-(--card-foreground) line-clamp-2 min-h-6 mb-2">
                  {product.title}
                </h3>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-green-600">
                      ${product.salePrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-(--muted-foreground) line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-(--muted)"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-(--muted-foreground)">
                    ({product.reviews})
                  </span>
                </div>

                <a
                  href={product.ctaLink}
                  target="_blank"
                  className="block w-full text-center px-4 py-2.5 rounded-xl bg-(--primary) text-(--primary-foreground) text-sm font-semibold hover:opacity-90 transition"
                >
                  Add to Cart
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="/recommendations"
            className="inline-flex items-center gap-2 px-6 py-3 border border-(--border) rounded-xl text-sm font-medium text-(--foreground) hover:bg-(--muted) transition"
          >
            View All Recommendations
          </a>
        </motion.div> */}
      </div>
    </section>
  );
}