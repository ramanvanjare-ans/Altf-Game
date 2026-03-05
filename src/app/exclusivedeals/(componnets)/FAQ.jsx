"use client";

import { useState } from "react";
import data from "../(data)/db.json";

const FAQ = () => {
  const { title, subtitle, items } = data.faq;
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="my-12 sm:my-16 bg-(--background) text-(--foreground) md:my-20 lg:my-24">
      {/* Heading */}
      <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-14 px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-(--foreground) mb-2 sm:mb-3 md:mb-4">
          {title}
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-(--muted-foreground)">
          {subtitle}
        </p>
      </div>

      {/* FAQ List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-3 sm:space-y-4 md:space-y-5">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="border border-(--muted-foreground) rounded-lg sm:rounded-xl 
                       transition-all duration-300
                       hover:border-gray-300 hover:shadow-sm"
          >
            {/* Question */}
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center 
                         px-4 sm:px-5 md:px-6 
                         py-3 sm:py-4 md:py-5 
                         text-left gap-3 sm:gap-4"
            >
              <span className="text-sm sm:text-base md:text-lg 
                             font-semibold text-(--foreground) 
                             leading-snug pr-2">
                {item.question}
              </span>

              <span
                className={`transform transition-transform duration-300 
                           flex-shrink-0 text-(--muted-foreground)
                           text-xs sm:text-sm ${
                  activeIndex === index ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {/* Answer */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                activeIndex === index 
                  ? "max-h-60 sm:max-h-48 md:max-h-40 opacity-100" 
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-4 sm:px-5 md:px-6 
                            pb-3 sm:pb-4 md:pb-5 
                            text-xs sm:text-sm md:text-base 
                            text-(--muted-foreground) leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;