"use client";

import { useState } from "react";
import {
  Quote,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Share2,
  Twitter,
  Heart,
} from "lucide-react";
import Header from "./Header";

export default function Main() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchQuote = async () => {
    setLoading(true);

    try {
      const response = await fetch("https://api.adviceslip.com/advice", {
        cache: "no-store",
      });
      const data = await response.json();

      setQuote({
        text: data.slip.advice,
        author: "Anonymous",
        tags: [],
      });
    } catch (error) {
      const fallbackQuotes = [
        {
          text: "The only way to do great work is to love what you do.",
          author: "Steve Jobs",
        },
        {
          text: "Believe you can and you're halfway there.",
          author: "Theodore Roosevelt",
        },
      ];
      const random =
        fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      setQuote(random);
    } finally {
      setLoading(false);
    }
  };

  const copyQuote = () => {
    if (!quote) return;

    const text = `"${quote.text}"\n- ${quote.author}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    if (!quote) return;

    const text = `"${quote.text}" - ${quote.author}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text,
    )}`;
    window.open(url, "_blank");
  };

  const shareQuote = async () => {
    if (!quote || !navigator.share) return;

    try {
      await navigator.share({
        title: "Inspiring Quote",
        text: `"${quote.text}" - ${quote.author}`,
      });
    } catch {}
  };

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-16 flex flex-col items-center">
      <Header />

      {/* Quote Card */}
      <div className="w-full max-w-3xl">
        <div className="relative overflow-hidden rounded-3xl bg-(--card) border border-(--border) shadow-xl p-8 sm:p-10 md:p-12 mb-10 min-h -95 flex flex-col justify-center transition-all duration-300 hover:shadow-2xl">
          {/* Decorative Blur */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-(--primary)/10 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-(--secondary)/10 rounded-full blur-3xl opacity-60 translate-y-1/2 -translate-x-1/2" />

          {/* Opening Quote Mark */}
          {/* <div className="absolute top-6 left-6 text-(--muted-foreground)/30 text-8xl font-serif">
            "
          </div> */}

          {!quote ? (
            <div className="text-center relative z-10 py-8">
              <div className="w-24 h-24 bg-(--primary)/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-(--border)">
                <Quote className="w-12 h-12 text-(--primary)" />
              </div>

              <h2 className="text-3xl font-bold text-(--foreground) mb-4">
                Ready for Inspiration?
              </h2>

              <p className="text-(--muted-foreground)">
                Click below to discover a motivational quote!
              </p>
            </div>
          ) : loading ? (
            <div className="text-center relative z-10 py-12">
              <div className="w-20 h-20 border-4 border-(--border) border-t-(--primary) rounded-full animate-spin mx-auto mb-6" />
              <p className="text-(--muted-foreground)">
                Finding the perfect quote...
              </p>
            </div>
          ) : (
            <div className="relative z-10 space-y-8">
              <blockquote className="text-2xl sm:text-3xl italic text-(--foreground) leading-relaxed">
                {`  " ${quote.text}  " `}
              </blockquote>

              <div className="flex items-center justify-between pt-6 border-t border-(--border)">
                <p className="text-xl font-bold text-(--primary)">
                  — {quote.author}
                </p>

                <Heart className="w-8 h-8 text-(--primary)" />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center pt-6">
                <button
                  onClick={copyQuote}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-(--card) border border-(--border) hover:bg-(--muted) transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 text-green-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy
                    </>
                  )}
                </button>

                <button
                  onClick={shareOnTwitter}
                  className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl bg-(--primary) text-(--primary-foreground) hover:opacity-90 transition-all"
                >
                  <Twitter className="w-5 h-5" />
                  Tweet
                </button>

                <button
                  onClick={shareQuote}
                  className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl bg-(--card) border border-(--border) hover:bg-(--muted) transition-all"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>
          )}

          {/* Closing Quote Mark */}
          {/* {quote && !loading && (
            <div className="absolute bottom-6 right-6 text-(--muted-foreground)/30 text-8xl font-serif">
              "
            </div>
          )} */}
        </div>

        {/* Generate Button */}
        <button
          onClick={fetchQuote}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-bold text-lg bg-(--primary) text-(--primary-foreground) hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-6 h-6 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Loading..." : quote ? "Get New Quote" : "Get Inspired"}
        </button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-4xl">
        {[
          {
            icon: Sparkles,
            title: "Fresh Quotes",
            desc: "Thousands of inspiring quotes",
          },
          {
            icon: Heart,
            title: "Motivational",
            desc: "Carefully curated motivation",
          },
          {
            icon: Share2,
            title: "Easy Sharing",
            desc: "Share inspiration instantly",
          },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="bg-(--card) border border-(--border) rounded-2xl p-7 text-center hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="w-14 h-14 bg-(--primary)/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <Icon className="w-7 h-7 text-(--primary)" />
              </div>
              <h3 className="font-bold text-xl text-(--foreground) mb-2">
                {item.title}
              </h3>
              <p className="text-(--muted-foreground)">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
