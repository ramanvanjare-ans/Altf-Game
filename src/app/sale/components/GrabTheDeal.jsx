"use client";

import { motion } from "framer-motion";
// import { Gift, ArrowRight } from "lucide-react";
import Image from "next/image";

/* 
   Animation Variants
*/

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

const badgeBg = {
  "Best Seller": "bg-amber-400",
  "Limited": "bg-red-500",
  "Top Pick": "bg-emerald-600",
  "New Arrival": "bg-blue-500",
  default: "bg-gray-400",
};


export default function GrabTheDeal({ offers }) {
  return (
    <section className="pb-20 bg-(--background)">
      <div className="max-w-7xl mx-auto px-6 md:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-14"
        >
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-(--foreground)">
                Grab The Deal
              </h2>
              <p className="text-(--muted-foreground) text-md">
                Premium offers at unbelievable prices
              </p>
            </div>
          </div>

          {/* <a
            href="/sale"
            className="hidden md:inline-flex items-center gap-2 text-(--primary) font-medium hover:opacity-80 transition"
          >
            See All Offers
            <ArrowRight className="w-4 h-4" />
          </a> */}
        </motion.div>


        {/* Scroll / Grid */}
        <div className="overflow-x-auto pb-4 md:overflow-visible">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="
      flex gap-6 min-w-max
      md:grid md:grid-cols-2 lg:grid-cols-3
     
    "
          >

            {offers.map((offer) => (
              <motion.div
                key={offer.id}
                variants={item}
                whileHover={{ y: -10 }}
                className="
                group relative rounded-3xl overflow-hidden
                border border-(--border)
                bg-(--card)
                shadow-lg hover:shadow-2xl
                transition-all duration-500
              "
              >


                {/* Top Image Section */}

                <div className="relative h-52 w-full overflow-hidden">

                  <Image
                    src={offer.image}
                    alt={offer.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="
                    object-cover
                    transition-transform duration-700
                    group-hover:scale-110
                  "
                  />

                  {/* Gradient Overlay */}
                  {/* <div className="absolute inset-0 bg-linear-to-t from-black/30 via-black/10 to-transparent" /> */}

                  {/* Badge */}
                  {offer.badge && (
                    <span
                      className={`
      absolute top-4 right-4
      px-3 py-1
      text-white
      text-xs font-bold
      rounded-full shadow
      ${badgeBg[offer.badge] || badgeBg.default}
    `}
                    >
                      {offer.badge}
                    </span>
                  )}


                  {/* Discount Circle */}
                  <div className="absolute top-4 left-4">
                    <motion.div
                      animate={{ rotate: [0, 6, -6, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="
                      w-20 h-20 rounded-full
                      bg-(--background)
                      border border-(--border)
                      flex flex-col items-center justify-center
                      shadow-xl
                    "
                    >
                      <span className="text-xl font-bold text-(--primary)">
                        {offer.discount}%
                      </span>
                      <span className="text-xs text-(--muted-foreground)">
                        OFF
                      </span>
                    </motion.div>
                  </div>

                </div>


                {/* Content Section */}

                <div className="p-5 pt-2 space-y-2">

                  <h3 className="text-xl font-bold text-(--foreground)">
                    {offer.title}
                  </h3>

                  <p className="text-(--muted-foreground) text-sm line-clamp-2 wrap-break-word">
                    {offer.description}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-green-600">
                        ${offer.salePrice.toFixed(0)}
                      </span>
                      <span className="text-sm text-(--muted-foreground) line-through">
                        ${offer.originalPrice.toFixed(0)}
                      </span>
                    </div>

                    <a
                      href={offer.ctaLink}
                      target="_blank"
                      className="
                      inline-flex items-center justify-center
                      px-4 py-2 rounded-xl
                      bg-red-500
                      text-(--primary-foreground)
                      text-sm font-semibold
                      hover:opacity-90
                      transition
                    "
                    >
                      Shop Now
                    </a>
                  </div>

                </div>

                {/* Decorative Glow */}
                {/* <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="
                  absolute -bottom-20 -right-20
                  w-48 h-48 rounded-full
                  bg-red-200
                  opacity-10 blur-3xl
                  pointer-events-none
                "
                /> */}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mobile Button */}
        {/* <div className="mt-10 text-center md:hidden">
          <a
            href="/sale"
            className="
              inline-flex items-center
              px-6 py-3
              border border-(--border)
              rounded-xl
              text-sm font-medium
              text-(--foreground)
              hover:bg-(--muted)
              transition
            "
          >
            See All Offers
          </a>
        </div> */}

      </div>
    </section>
  );
}
