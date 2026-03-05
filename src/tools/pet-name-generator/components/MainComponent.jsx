"use client";

import React, { useState } from "react";
import { Heart, Copy, Sparkles, Zap, Check } from "lucide-react";

/* -------------------- DATA (UNCHANGED) -------------------- */
const petData = {
  dog: ["Buddy", "Rocky", "Max", "Charlie", "Leo", "Tiger", "Bruno", "Shadow"],
  cat: ["Luna", "Bella", "Milo", "Simba", "Kitty", "Coco", "Nala", "Oreo"],
  rabbit: ["Fluffy", "Snowy", "Bunny", "Cotton", "Hopper", "Cloud"],
  parrot: ["Mithu", "Rio", "Kiwi", "Sunny", "Peppy", "Coco"],
  hamster: ["Nibbles", "Peanut", "Hazel", "Cookie", "Marshmallow"],
};

const styles = ["Cute", "Royal", "Funny", "Cool", "Unique", "Traditional"];

const petEmojis = {
  dog: "🐕",
  cat: "🐈",
  rabbit: "🐰",
  parrot: "🦜",
  hamster: "🐹",
};

/* -------------------- NAME LOGIC (UNCHANGED) -------------------- */
const generateCreativeName = (base, style, keyword) => {
  const prefixes = {
    Cute: ["Little", "Sweet", "Baby", "Tiny", "Lovely"],
    Royal: ["Sir", "Lady", "Prince", "Princess", "Duke"],
    Funny: ["Mister", "Captain", "Professor", "Doctor", "Agent"],
    Cool: ["Shadow", "Blaze", "Storm", "Thunder", "Frost"],
    Unique: ["Cosmic", "Mystic", "Nova", "Echo", "Phoenix"],
    Traditional: ["Old", "Classic", "Vintage", "Timeless", "Heritage"],
  };

  const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

  let name = keyword ? keyword + base : base;
  if (prefixes[style] && Math.random() > 0.5) {
    name = random(prefixes[style]) + " " + name;
  }
  return name;
};

/* ==================== COMPONENT ==================== */
export default function PetNameGenerator() {
  const [petType, setPetType] = useState("dog");
  const [style, setStyle] = useState("Cute");
  const [keyword, setKeyword] = useState("");
  const [names, setNames] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [copiedName, setCopiedName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNames = () => {
    setIsGenerating(true);
    const base = petData[petType];
    const used = new Set();
    const result = [];

    while (result.length < 15) {
      const baseName = base[Math.floor(Math.random() * base.length)];
      const name = generateCreativeName(baseName, style, keyword);
      if (!used.has(name)) {
        used.add(name);
        result.push(name);
      }
    }

    setTimeout(() => {
      setNames(result);
      setIsGenerating(false);
      document
        .getElementById("results")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 600);
  };

  const toggleFavorite = (name) => {
    setFavorites((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  const copyName = (name) => {
    navigator.clipboard.writeText(name);
    setCopiedName(name);
    setTimeout(() => setCopiedName(""), 1500);
  };

  return (
    <div className="min-h-screen bg-(--background) text-(--foreground)">
      {/* HERO */}
      <section className="min-h-[40vh] flex items-center justify-center px-4 text-center">
        <div className="max-w-5xl">
          <h1 className="heading font-extrabold mb-4">
            Find The Perfect Pet Name
          </h1>

          <p className=" description mb-6">
            Generate unique, creative names instantly
          </p>

          <button
            onClick={() =>
              document.getElementById("generator")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className="
              inline-flex items-center gap-2 px-6 py-3 rounded-xl
              bg-(--primary) text-(--primary-foreground)
              font-semibold hover:opacity-90 cursor-pointer
            "
          >
            Start Generating <Zap size={18} />
          </button>
        </div>
      </section>

      {/* GENERATOR */}
      <section id="generator" className="py-16 px-4">
        <div className="max-w-6xl mx-auto bg-(--card) border border-(--border) rounded-2xl p-6 md:p-10">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2 mb-8">
            <Sparkles className="text-(--primary)" />
            Customize Your Pet Name
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* PET TYPE */}
            <div>
              <p className="font-semibold mb-3">Pet Type</p>
              {Object.keys(petData).map((pet) => (
                <button
                  key={pet}
                  onClick={() => setPetType(pet)}
                  className={`
                    w-full mb-2 px-4 py-2 rounded-lg border transition
                    ${
                      petType === pet
                        ? "bg-(--primary) text-(--primary-foreground) border-(--primary)"
                        : "bg-(--muted) border-(--border)"
                    }
                  `}
                >
                  {petEmojis[pet]} {pet}
                </button>
              ))}
            </div>

            {/* STYLE */}
            <div>
              <p className="font-semibold mb-3">Style</p>
              {styles.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`
                    w-full mb-2 px-4 py-2 rounded-lg border transition
                    ${
                      style === s
                        ? "bg-(--primary) text-(--primary-foreground) border-(--primary)"
                        : "bg-(--muted) border-(--border)"
                    }
                  `}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* KEYWORD */}
            <div>
              <p className="font-semibold mb-3">Custom Prefix</p>
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. Mr, Baby"
                className="
                  w-full px-4 py-2 rounded-lg
                  bg-(--background) border border-(--border)
                  text-(--foreground)
                  placeholder:text-(--muted-foreground)
                  focus:ring-2 focus:ring-(--primary)
                  outline-none
                "
              />
            </div>
          </div>

          <button
            onClick={generateNames}
            disabled={isGenerating}
            className="
              mt-8 w-full py-3 rounded-xl
              bg-(--primary) text-(--primary-foreground)
              font-semibold hover:opacity-90 cursor-pointer
            "
          >
            {isGenerating ? "Generating..." : "Generate Names"}
          </button>
        </div>
      </section>

      {/* RESULTS */}
      {names.length > 0 && (
        <section id="results" className="py-16 px-4">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {names.map((name) => (
                <div
                  key={name}
                  className="bg-(--card) border border-(--border) rounded-xl p-4 flex justify-between items-center"
                >
                  <span className="font-medium wrap-break-word">{name}</span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => copyName(name)}
                      className="p-1 rounded-md hover:bg-(--muted) transition cursor-pointer"
                    >
                      {copiedName === name ? (
                        <Check size={16} className="text-green-500" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>

                    <button
                      onClick={() => toggleFavorite(name)}
                      className="p-1 rounded-md hover:bg-(--muted) transition cursor-pointer"
                    >
                      <Heart
                        size={16}
                        className={
                          favorites.includes(name)
                            ? "fill-red-500 text-red-500"
                            : "text-(--muted-foreground)"
                        }
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* FAVORITES */}
            {favorites.length > 0 && (
              <div className="bg-(--card) border border-(--border) rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  Your Favorites ({favorites.length})
                </h3>

                <div className="flex flex-wrap gap-3">
                  {favorites.map((fav, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full bg-(--muted) border border-(--border) text-sm font-medium"
                    >
                      {fav}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
