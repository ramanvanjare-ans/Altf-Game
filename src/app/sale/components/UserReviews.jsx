"use client";

import { motion } from "framer-motion";
import { Star, Quote, ShoppingBag, ThumbsUp } from "lucide-react";
import Image from "next/image";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function UserReviews({ reviews }) {
  return (
    <section className="pb-20 bg-(--background) relative overflow-hidden">
      {/* Decorative Background */}
      {/* <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-(--primary) rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-(--primary) rounded-full blur-3xl" />
      </div> */}

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            {/* <div className="w-12 h-12 rounded-2xl bg-(--primary) flex items-center justify-center shadow-lg">
              <ThumbsUp className="w-6 h-6 text-(--primary-foreground)" />
            </div> */}
            <h2 className="text-3xl md:text-4xl font-bold text-(--foreground)">
              Happy Shoppers
            </h2>
          </div>
          <p className="text-(--muted-foreground) max-w-2xl mx-auto">
            Join thousands of satisfied customers who've saved big on their favorite products
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
            <div className="text-center">
              <div className="text-4xl font-bold text-(--primary) mb-1">
                4.9/5
              </div>
              <div className="text-sm text-(--muted-foreground)">
                Average Rating
              </div>
            </div>
            <div className="w-px h-12 bg-(--border)" />
            <div className="text-center">
              <div className="text-4xl font-bold text-(--primary) mb-1">
                50K+
              </div>
              <div className="text-sm text-(--muted-foreground)">
                Reviews
              </div>
            </div>
            <div className="w-px h-12 bg-(--border)" />
            <div className="text-center">
              <div className="text-4xl font-bold text-(--primary) mb-1">
                98%
              </div>
              <div className="text-sm text-(--muted-foreground)">
                Satisfaction
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              variants={item}
              whileHover={{ y: -8 }}
              className="group relative bg-(--background) border border-(--border) rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300"
            >
              {/* Quote Icon */}
              {/* <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition">
                <Quote className="w-16 h-16 text-(--primary)" />
              </div> */}

              {/* User Info */}
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-(--primary)">
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      width={56}
                      height={56}
                      className="object-cover"
                    />
                  </div>
                  {review.verified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-(--card) flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold text-(--foreground)">
                    {review.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-(--muted)"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-(--muted-foreground)">
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-(--muted-foreground) leading-relaxed mb-4 relative z-10">
                "{review.text}"
              </p>

              {/* Product Info */}
              {review.product && (
                <div className="flex items-center gap-3 pt-4 border-t border-(--border) relative z-10">
                  <ShoppingBag className="w-4 h-4 text-green-700" />
                  <span className="text-sm text-(--muted-foreground)">
                    Purchased: <span className="text-(--foreground) font-medium">{review.product}</span>
                  </span>
                </div>
              )}

              {/* Savings Badge */}
              {review.saved && (
                <div className="mt-3 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-(--primary)/10 rounded-full">
                    <span className="text-xs font-semibold text-(--primary)">
                      💰 Saved ${review.saved}
                    </span>
                  </div>
                </div>
              )}

              {/* Decorative Gradient */}
              {/* <div className="absolute bottom-0 right-0 w-32 h-32 bg-linear-to-tl from-(--primary)/5 to-transparent rounded-tl-full pointer-events-none" /> */}
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
            href="/reviews"
            className="inline-flex items-center gap-2 px-6 py-3 border border-(--border) rounded-xl text-sm font-medium text-(--foreground) hover:bg-(--muted) transition"
          >
            Read More Reviews
          </a>
        </motion.div> */}
      </div>
    </section>
  );
}