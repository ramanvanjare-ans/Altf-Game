"use client";
import React, { useState, useRef, useEffect } from "react";
import { CURRENCY_NAMES } from "../constants/currencies";
import { FLAG_MAP } from "../constants/flagMap";
import { ChevronDown } from "lucide-react";

export default function CurrencySelect({
  label,
  value,
  onChange,
  loading,
  rates,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const currencyOptions = Object.keys(rates).sort();
  const selected = currencyOptions.find((c) => c === value);

  // Outside click handler
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getFlag = (code) =>
    `https://flagcdn.com/w40/${FLAG_MAP[code]?.toLowerCase() || "un"}.png`;

  return (
    <div ref={ref} className="relative flex grow flex-col space-y-2">
      {/* Label */}
      <label className="text-sm font-medium text-(--muted-foreground)">
        {label}
      </label>

      {/* Select Button */}
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="w-full rounded-xl border border-(--border) bg-(--card) px-4 py-3 shadow-lg flex items-center justify-between text-(--foreground) transition-all focus:ring-2 focus:ring-(--primary)"
      >
        <div className="flex items-center gap-3">
          <img
            src={getFlag(selected)}
            alt=""
            className="h-6 w-6 rounded object-cover shadow"
          />

          <span className="truncate">
            {selected} - {CURRENCY_NAMES[selected]}
          </span>
        </div>

        <ChevronDown
          className={`h-5 w-5 text-(--primary) transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="animate-dropdown absolute top-full mt-2 w-full max-h-60 overflow-auto rounded-xl border border-(--border) bg-(--card) shadow-2xl z-40">
          {currencyOptions.map((code) => (
            <button
              key={code}
              onClick={() => {
                onChange({ target: { value: code } });
                setOpen(false);
              }}
              className={`w-full px-4 py-2 flex items-center gap-3 text-left text-(--foreground) transition-colors hover:bg-(--muted)/40 ${
                code === value ? "bg-(--primary)/20 font-semibold" : ""
              }`}
            >
              <img
                src={getFlag(code)}
                alt=""
                className="h-6 w-6 rounded object-cover shadow"
              />
              {code} — {CURRENCY_NAMES[code]}
            </button>
          ))}
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes dropdown {
          0% {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-dropdown {
          animation: dropdown 0.18s ease-out;
        }
        .max-h-60::-webkit-scrollbar {
          width: 6px;
        }
        .max-h-60::-webkit-scrollbar-thumb {
          background: var(--primary);
          border-radius: 8px;
        }
        .max-h-60::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
