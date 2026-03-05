import React from "react";

export default function Features() {
  const features = [
    "Open multiple URLs in one click",
    "Automatic validation of invalid links",
    "100% frontend-only, no data sent anywhere",
    "Safe, private, and fast",
  ];

  return (
    <section className="w-full pb-20 bg-(--background) px-4">
      <div className="max-w-5xl mx-auto text-center">
        {/* Heading */}
        <h2 className="heading md:text-4xl mb-14 text-(--foreground)">
          Why You&apos;ll Love This Tool?
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="
                bg-(--card)
                border border-(--border)
                p-6
                rounded-2xl
                shadow-sm
                hover:shadow-md
                transition-all
                flex items-start gap-4
              "
            >
              {/* Icon */}
              <div className="text-(--primary) text-2xl mt-1">✔</div>

              {/* Text */}
              <p className="description font-medium text-left">
                {feature}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}