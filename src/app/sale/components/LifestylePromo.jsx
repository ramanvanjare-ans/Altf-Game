"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import Link from "next/link";
const promoData = [
  {
    id: 1,
    image: "/sale-locator/lifestyle-promo/model-1.webp",
    title: "New Collection",
    description: "Discover trending styles",
    buttonText: "Shop Now",
    link: "https://www.vogue.com/fashion/trends",
  },
  {
    id: 2,
    image: "/sale-locator/lifestyle-promo/model-2.webp",
    title: "Limited Drop",
    description: "Exclusive pieces available now",
    buttonText: "Explore",
    link: "https://sephora.in/collection/makeup",
  },
  {
    id: 3,
    image: "/sale-locator/lifestyle-promo/model-3.webp",
    title: "Limited Drop",
    description: "Exclusive pieces available now",
    buttonText: "Explore",
    link: "https://www.yoursclothing.com/limited-collection",
  },
  {
    id: 4,
    image: "/sale-locator/lifestyle-promo/model-4.webp",
    title: "New Collection",
    description: "Discover trending styles",
    buttonText: "Shop Now",
    link: "https://lakshmiboutique.co.in/collections/new-arrivals",
  },
];

export default function LifestylePromo() {


  return (
    <section className=" py-20 bg-(--background)">

      <div className="max-w-7xl mx-auto px-6 md:px-8">

        <div className="flex items-center gap-4 mb-10 ">
          {/* <div className="w-12 h-12 rounded-2xl bg-(--primary) flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-(--primary-foreground)" />
            </div> */}
          <div className="">
            <h2 className="text-3xl md:text-4xl font-bold text-(--foreground) mb-2" >
              Lifestyle Promo
            </h2>
            <p className="text-(--muted-foreground) text-md">
              Hurry! Limited time offers
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {promoData.map((promo) => (
            <motion.div
              key={promo.id}
              whileHover={{ scale: 1.02 }}
              className="relative h-70 rounded-3xl overflow-hidden group cursor-pointer"
            >
              <Image
                src={promo.image}
                alt={promo.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority
              />
              {/* Overlay  */}
              {/* <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" /> */}

              <div className="absolute bottom-10 left-10 text-white">
                <h2 className="text-4xl font-bold mb-3">
                  {promo.title}
                </h2>

                <p className="text-lg text-white/80 mb-5">
                  {promo.description}
                </p>

                <Link href={promo.link} target="_blank">
                  <span className="inline-block px-6 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition">
                    {promo.buttonText}
                  </span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
