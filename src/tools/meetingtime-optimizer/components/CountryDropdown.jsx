"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const timezones = Intl.supportedValuesOf("timeZone");

export default function CountryDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-sm">

      {/* Selected Box */}
      <div
        onClick={() => setOpen(!open)}
        className="
          flex items-center justify-between
          px-4 py-3
          rounded-xl
          cursor-pointer
          bg-(--card)
          border border-(--border)
          text-(--foreground)
          hover:border-(--primary)
          transition
        "
      >
        <span className="truncate">
          {value || "Select Timezone"}
        </span>

        <ChevronDown
          className={`w-4 h-4 text-(--muted-foreground) transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute z-50 mt-2 w-full
            max-h-64 overflow-y-auto
            rounded-xl
            bg-(--card)
            border border-(--border)
            shadow-lg
            animate-fadeIn
          "
        >
          {timezones.map((tz) => (
            <div
              key={tz}
              onClick={() => {
                onChange(tz);
                setOpen(false);
              }}
              className="
                px-4 py-2
                text-sm
                cursor-pointer
                text-(--foreground)
                hover:bg-(--muted)
                transition
              "
            >
              {tz}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
