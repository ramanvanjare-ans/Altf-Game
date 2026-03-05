

"use client"

import React, { useState, useRef, useEffect } from "react";
import { encodingTypes } from "../utils/encodeDecode";

const DropdownSelector = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const selected = encodingTypes.find((t) => t.value === value);

  return (
    <div className="w-full" ref={ref}>
      <label className="block text-sm font-medium text-(--foreground) mb-1">
        Encoding Type
      </label>

      <div className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
          className="w-full text-left bg-(--card)  border border-(--border) rounded-md px-3 py-2 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <div className="truncate">
            <div className="text-sm text-gray-900 dark:text-gray-100">
              {selected ? selected.label : "Select encoding type"}
            </div>
            {selected && selected.description && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {selected.description}
              </div>
            )}
          </div>
          <svg
            className={`ml-2 h-5 w-5 text-gray-400 transform ${open ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 8l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {open && (
          <ul
            role="listbox"
            tabIndex={-1}
            className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-(--border) rounded-md shadow-lg overflow-auto max-h-60 sm:max-h-72 md:max-h-96"
          >
            {encodingTypes.map((type) => (
              <li
                key={type.value}
                role="option"
                aria-selected={type.value === value}
                onClick={() => {
                  onChange(type.value);
                  setOpen(false);
                }}
                className="px-3 py-2  cursor-pointer"
              >
                <div className="text-sm text-(--foreground)">
                  {type.label}
                </div>
                {type.description && (
                  <div className="text-xs text-(--muted-foreground)">
                    {type.description}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DropdownSelector;
