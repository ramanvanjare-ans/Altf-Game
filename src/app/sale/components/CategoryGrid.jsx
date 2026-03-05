"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Laptop,
  Shirt,
  Home,
  Dumbbell,
  Sparkles,
  Gamepad2,
  BookOpen,
  Car,
} from "lucide-react";

const iconMap = {
  Laptop,
  Shirt,
  Home,
  Dumbbell,
  Sparkles,
  Gamepad2,
  BookOpen,
  Car,
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function CategoryGrid({ categories }) {

  const getBadgeColor = (badge) => {
  switch (badge?.toLowerCase()) {
    case "hot":
      return "bg-red-500 text-white";
    case "new":
      return "bg-green-500 text-white";
    case "sale":
      return "bg-blue-500 text-white";
    case "limited":
      return "bg-purple-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

  return (
    <section className="pt-20 bg-(--background)">
      <div className="max-w-7xl mx-auto px-6 md:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-(--foreground)">
            Shop by Category
          </h2>
          <p className="text-(--muted-foreground) mt-4 max-w-xl mx-auto">
            Explore curated collections with exclusive discounts
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
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || Laptop;

            return (
              <motion.a
  key={category.id}
  href={category.link}
  target="_blank"
  variants={item}
  whileHover={{ scale: 1.03 }}
  className="group rounded-2xl overflow-hidden cursor-pointer bg-(--card) shadow-sm hover:shadow-md transition"
>
  {/* Image */}
  <div className="relative h-48 w-full overflow-hidden">
    <Image
      src={category.image}
      alt={category.name}
      fill
      className="object-cover transition-transform duration-500 group-hover:scale-110"
    />
  </div>

  {/* Text Content Below Image */}
  <div className="p-5 flex justify-between items-center flex-row-reverse">
    <div>

    {category.badge && (
     <span
  className={`inline-block px-3 py-1 mb-3 text-xs font-semibold rounded-full ${getBadgeColor(category.badge)}`}
>
        {category.badge}
      </span>
    )}
</div>
<div>
    <h3 className="text-lg font-semibold text-(--foreground)">
      {category.name}
    </h3>

    <p className="text-sm text-(--muted-foreground) mt-1">
      {category.itemCount} items
    </p>
    </div>

  </div>
</motion.a>

            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
