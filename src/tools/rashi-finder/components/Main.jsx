"use client";

import { useState } from "react";
import Header from "./Header";

const rashis = [
  {
    name: "Mesha (Aries)",
    start: "03-21",
    end: "04-19",
    desc: "Energetic, confident, leader.",
  },
  {
    name: "Vrishabh (Taurus)",
    start: "04-20",
    end: "05-20",
    desc: "Stable, loyal, practical.",
  },
  {
    name: "Mithun (Gemini)",
    start: "05-21",
    end: "06-20",
    desc: "Smart, curious, talkative.",
  },
  {
    name: "Karka (Cancer)",
    start: "06-21",
    end: "07-22",
    desc: "Emotional, caring, family lover.",
  },
  {
    name: "Singh (Leo)",
    start: "07-23",
    end: "08-22",
    desc: "Bold, powerful, confident.",
  },
  {
    name: "Kanya (Virgo)",
    start: "08-23",
    end: "09-22",
    desc: "Intelligent, organized, kind.",
  },
  {
    name: "Tula (Libra)",
    start: "09-23",
    end: "10-22",
    desc: "Balanced, romantic, peaceful.",
  },
  {
    name: "Vrishchik (Scorpio)",
    start: "10-23",
    end: "11-21",
    desc: "Strong, mysterious, focused.",
  },
  {
    name: "Dhanu (Sagittarius)",
    start: "11-22",
    end: "12-21",
    desc: "Adventurous, honest, optimistic.",
  },
  {
    name: "Makar (Capricorn)",
    start: "12-22",
    end: "01-19",
    desc: "Hard-working, ambitious.",
  },
  {
    name: "Kumbh (Aquarius)",
    start: "01-20",
    end: "02-18",
    desc: "Creative, modern, independent.",
  },
  {
    name: "Meen (Pisces)",
    start: "02-19",
    end: "03-20",
    desc: "Emotional, artistic, gentle.",
  },
];

export default function MainComponent() {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState(null);

  const findRashi = () => {
    if (!dob) return;

    const date = new Date(dob);
    const md = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate(),
    ).padStart(2, "0")}`;

    const found = rashis.find(
      (r) =>
        (r.start <= md && md <= r.end) ||
        (r.start > r.end && (md >= r.start || md <= r.end)),
    );

    setResult(found || null);
  };

  return (
    <div className="min-h-screen bg-(--background) text-(--foreground)">
      {/* HEADER */}
      <Header />

      {/* HERO */}
      <section className="py-16 px-4">
        <div className="max-w-xl mx-auto bg-(--card) border border-(--border) rounded-2xl p-8 shadow-lg text-center">
          <h2 className="text-xl font-semibold mb-4 text-(--primary)">
            Discover Your Moon Sign
          </h2>

          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="
              w-full mb-4 px-4 py-2 rounded-lg
              bg-(--background) border border-(--border)
              text-(--foreground)
              focus:ring-2 focus:ring-(--primary) outline-none
            "
          />

          <button
            onClick={findRashi}
            className="
              w-full py-3 rounded-xl
              bg-(--primary) text-(--primary-foreground)
              font-semibold hover:opacity-90 transition
            "
          >
            Find Rashi
          </button>

          {result && (
            <div className="mt-6 bg-(--muted) border border-(--border) rounded-xl p-4">
              <h3 className="text-lg font-bold text-(--primary)">
                {result.name}
              </h3>
              <p className="text-(--muted-foreground) mt-1">{result.desc}</p>
            </div>
          )}
        </div>
      </section>

      {/* TOOLS */}
      <section className="py-14 px-4 bg-(--muted)">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">Explore Astrology Tools</h2>
          <p className="text-(--muted-foreground)">
            Everything about Rashi & Kundali in one place
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {[
            "Janma Lagna Calculator",
            "Horoscope Matching",
            "Janma Kundali",
            "Mangal Dosha",
            "Daily Rashi",
            "Compatibility",
            "Nakshatra Finder",
            "Lucky Numbers",
          ].map((tool) => (
            <div
              key={tool}
              className="bg-(--card) border border-(--border) rounded-xl p-4 text-center hover:shadow-md transition"
            >
              <h4 className="font-semibold">{tool}</h4>
              <p className="text-sm text-(--muted-foreground) mt-1">
                Astrology based insights
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ZODIAC INSIGHTS */}
      <section className="py-14 px-4">
        <h2 className="text-center text-2xl font-bold mb-8">Zodiac Insights</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {rashis.map((r) => (
            <div
              key={r.name}
              className="bg-(--card) border border-(--border) rounded-xl p-4 hover:shadow-md transition"
            >
              <h4 className="font-semibold text-(--primary)">{r.name}</h4>
              <p className="text-sm text-(--muted-foreground) mt-1">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TIPS */}
      <section className="py-14 px-4 bg-(--muted)">
        <h2 className="text-center text-2xl font-bold mb-8">Astrology Tips</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {[
            "🌙 Start your day with meditation",
            "🌟 Use lucky colors",
            "🔮 Check daily horoscope",
            "📅 Plan events on auspicious days",
          ].map((tip) => (
            <div
              key={tip}
              className="bg-(--card) border border-(--border) rounded-xl p-4 text-center hover:shadow-md transition"
            >
              {tip}
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-14 px-4">
        <h2 className="text-center text-2xl font-bold mb-8">What Users Say</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {[
            "Amazing UI & fast results!",
            "Accurate kundali tools",
            "Very easy to use",
          ].map((review, i) => (
            <div
              key={i}
              className="bg-(--card) border border-(--border) rounded-xl p-6 text-center hover:shadow-md transition"
            >
              <p className="text-(--muted-foreground)">“{review}”</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
