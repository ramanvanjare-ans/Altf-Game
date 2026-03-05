"use client";

import { motion } from "framer-motion";
import { Award, ChevronRight } from "lucide-react";
import Image from "next/image";

const marqueeVariants = {
  animate: {
    x: [0, -1000],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 20,
        ease: "linear",
      },
    },
  },
};

export default function BrandShowcase({ brands }) {
  // Duplicate brands for seamless loop
  const duplicatedBrands = [...brands, ...brands];

  return (
    <section className="pb-20 bg-(--background) overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            {/* <div className="w-12 h-12 rounded-2xl bg-(--primary) flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-(--primary-foreground)" />
            </div> */}
            <h2 className="text-3xl md:text-4xl font-bold text-(--foreground)">
              Featured Brands
            </h2>
          </div>
          <p className="text-(--muted-foreground) max-w-2xl mx-auto">
            Shop exclusive deals from the world's top brands
          </p>
        </motion.div>

        {/* Marquee */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-(--muted)/30 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-(--muted)/30 to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex gap-8"
            variants={marqueeVariants}
            animate="animate"
          >
            {duplicatedBrands.map((brand, index) => (
              <motion.a
                key={`${brand.id}-${index}`}
                href={brand.link}
                target="_blank"
                whileHover={{ scale: 1.05 }}
                className="group shrink-0 w-48 h-32 bg-(--card) border border-(--border) rounded-2xl p-6 flex items-center justify-center hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-linear-to-br from-(--primary)/5 to-transparent opacity-0 group-hover:opacity-100 transition" />

                {/* Brand Logo */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={120}
                    height={60}
                    className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>

                {/* Discount Badge */}
                {brand.discount && (
                  <div className="absolute top-3 right-3 px-2 py-1 bg-(--primary) text-(--primary-foreground) text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition">
                    Up to {brand.discount}% OFF
                  </div>
                )}
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Featured Brand Spotlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {brands.slice(0, 3).map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative bg-(--card) border border-(--border) rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
            >
              {/* Background Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={brand.bannerImage}
                  alt={brand.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

                {/* Logo Overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-2xl p-4 shadow-xl flex items-center justify-center">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={80}
                    height={40}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-xl font-bold text-(--foreground) mb-2">
                  {brand.name}
                </h3>
                <p className="text-(--muted-foreground) text-sm mb-2">
                  {brand.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-green-600">
                      {brand.discount}%
                    </span>
                    <span className="text-sm text-(--muted-foreground)">
                      OFF
                    </span>
                  </div>

                  <a
                    href={brand.link}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-red-500 hover:gap-2 transition-all"
                  >
                    Shop Now
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Product Count */}
                <div className="mt-4 pt-4 border-t border-(--border)">
                  <span className="text-xs text-(--muted-foreground)">
                    {brand.productCount} products on sale
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}