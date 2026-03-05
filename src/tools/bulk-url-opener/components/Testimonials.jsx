"use client";
import React from "react";

const testimonials = [
  {
    name: "Jane Doe",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    comment: "This tool saved me hours! So easy and fast. Highly recommended.",
  },
  {
    name: "John Smith",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    comment: "I love how it checks invalid URLs automatically. Super handy!",
  },
  {
    name: "Emily Johnson",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
    comment:
      "Safe, private, and works directly in the browser. Exactly what I needed.",
  },
];

export default function Testimonials() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 pb-10 text-center">
      {/* Section Heading */}
      <h2 className="heading text-(--foreground) md:text-5xl mb-12">What Our Users Say</h2>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="
              bg-(--card)
              border border-(--border)
              rounded-2xl
              p-6
              shadow-sm
              hover:shadow-md
              transition-all
              flex flex-col
              items-center
            "
          >
            {/* Comment */}
            <p className="description mb-6 text-center">{t.comment}</p>

            {/* User Info */}
            <div className="flex items-center gap-3 mt-auto">
              <img
                src={t.photo}
                alt={t.name}
                className="w-10 h-10 rounded-full object-cover border border-(--border)"
              />
              <span className="font-semibold text-(--foreground)">
                {t.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}