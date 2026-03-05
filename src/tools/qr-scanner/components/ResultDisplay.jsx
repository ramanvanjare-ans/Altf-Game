"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";

const ResultDisplay = ({ result, error, loading }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
    } catch {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = result;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
      } catch (err) {
        console.error("Copy failed:", err);
      }
    }
  };

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="flex justify-center my-6">
        <div className="w-10 h-10 border-4 border-(--primary) border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ---------------- ERROR ----------------
  if (error) {
    return (
      <div className="my-4 p-4 rounded-xl border border-(--border) bg-(--card)">
        <p className="text-sm text-(--muted-foreground)">{error}</p>
      </div>
    );
  }

  // ---------------- RESULT ----------------
  if (result) {
    return (
      <div className="relative my-6 space-y-4">
        {/* Result Card */}
        <div
          className="
            p-6 rounded-2xl 
            bg-(--card) 
            border border-(--border)
            transition
            hover:border-(--primary)
            hover:-translate-y-1
          "
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-(--muted-foreground) mb-2">
                Scan Result:
              </p>

              <p className="font-mono font-bold text-lg sm:text-2xl text-(--foreground) break-all">
                {result}
              </p>
            </div>

            <button
              onClick={copyToClipboard}
              className="
                p-3 rounded-xl
                bg-(--background)
                border border-(--border)
                transition
                hover:border-(--primary)
                hover:scale-105
              "
            >
              {copied ? (
                <Check className="w-5 h-5 text-(--primary)" />
              ) : (
                <Copy className="w-5 h-5 text-(--foreground)" />
              )}
            </button>
          </div>
        </div>

        {/* Toast */}
        {copied && (
          <div
            className="
              fixed bottom-6 left-1/2 -translate-x-1/2
              px-5 py-2 rounded-xl
              bg-(--foreground)
              text-(--background)
              text-sm font-medium
              shadow-lg
              animate-fadeIn
            "
          >
            Copied ✔
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default ResultDisplay;
