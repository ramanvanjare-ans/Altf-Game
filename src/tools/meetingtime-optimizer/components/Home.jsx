"use client";

import { Zap, Globe, Brain } from "lucide-react";

export default function Home() {
  return (
    <section className="w-full bg-(--background) text-(--foreground)">

      {/* HERO */}
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <h1 className="heading mb-6">
          Schedule Meetings{" "}
          <span className="text-(--primary)">
            Without Time Zone Headaches
          </span>
        </h1>

        <p className="description max-w-2xl mx-auto mb-10">
          Find the best overlapping time for global teams in seconds.
          Simple, accurate, and built for modern remote work.
        </p>

        {/* Buttons (Scroll Based) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

          <a
            href="#optimizer"
            className="
              px-8 py-3 rounded-xl
              bg-(--primary)
              text-(--primary-foreground)
              font-semibold
              hover:opacity-90
              transition
            "
          >
            Try Optimizer
          </a>

          <a
            href="#features"
            className="
              px-8 py-3 rounded-xl
              border border-(--border)
              bg-(--card)
              text-(--foreground)
              hover:bg-(--muted)
              transition
            "
          >
            Explore Features
          </a>

        </div>
      </div>

      {/* TRUST / STATS */}
      <div>
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          
          <div>
            <h3 className="text-3xl font-bold text-(--primary)">10K+</h3>
            <p className="text-(--muted-foreground) mt-2">
              Meetings Scheduled
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-(--primary)">50+</h3>
            <p className="text-(--muted-foreground) mt-2">
              Countries Supported
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-(--primary)">99.9%</h3>
            <p className="text-(--muted-foreground) mt-2">
              Accuracy
            </p>
          </div>

        </div>
      </div>

      {/* VALUE SECTION */}
      <div className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="subheading mb-4">
          Built for Remote Teams
        </h2>

        <p className="description max-w-2xl mx-auto mb-14">
          Designed for founders, developers, and global teams who want
          clarity—not confusion—when scheduling meetings.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Fast */}
          <div className="bg-(--card) border border-(--border) rounded-2xl p-8 hover:shadow-lg transition">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-(--primary) text-(--primary-foreground) mx-auto mb-5">
              <Zap size={22} />
            </div>
            <h4 className="text-lg font-semibold mb-2">Fast</h4>
            <p className="text-(--muted-foreground) text-sm">
              Instant results with real timezone logic.
            </p>
          </div>

          {/* Global */}
          <div className="bg-(--card) border border-(--border) rounded-2xl p-8 hover:shadow-lg transition">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-(--primary) text-(--primary-foreground) mx-auto mb-5">
              <Globe size={22} />
            </div>
            <h4 className="text-lg font-semibold mb-2">Global</h4>
            <p className="text-(--muted-foreground) text-sm">
              Supports all timezones with daylight handling.
            </p>
          </div>

          {/* Smart */}
          <div className="bg-(--card) border border-(--border) rounded-2xl p-8 hover:shadow-lg transition">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-(--primary) text-(--primary-foreground) mx-auto mb-5">
              <Brain size={22} />
            </div>
            <h4 className="text-lg font-semibold mb-2">Smart</h4>
            <p className="text-(--muted-foreground) text-sm">
              Finds overlapping availability automatically.
            </p>
          </div>

        </div>
      </div>

    </section>
  );
}
