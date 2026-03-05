"use client";

export default function WorldwideUpdatesStrip() {
  return (
    <section className="w-full my-10 md:my-16 bg-[var(--muted-foreground)]">
      <div className="content px-4 sm:px-6 md:px-8 py-10 md:py-16 text-center">
        {/* H2 with white color and responsive sizing */}
        <h2 className="heading mb-4 md:mb-6 text-white leading-tight md:leading-snug">
          Latest Worldwide Updates and Insights
        </h2>

        {/* Paragraph with better spacing, padding, and responsive font */}
        <p className="description text-[var(--foreground)] text-sm sm:text-base md:text-lg leading-relaxed md:leading-loose max-w-xl sm:max-w-2xl md:max-w-4xl mx-auto px-2 sm:px-0">
          Stay updated with the latest happenings around the world across multiple
          niches including insights, food, travel, sports, fashion, beauty and
          much more. Get details every hour, every minute, and every second.
        </p>
      </div>
    </section>
  );
}
