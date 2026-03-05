"use client";

import React from "react";
import { Check, Copy } from "lucide-react";

export const CaptionCard = ({ caption, index, onCopy, isCopied }) => {
  return (
    <div className=" bg-(--card) text-(--foreground) rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-(--border) ">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <span className="inline-block px-3 py-1  text-(--primary) text-xs font-bold rounded-full mb-3">
            #{index + 1}
          </span>
          <p className="description">
            {caption}
          </p>
        </div>
        <button
          onClick={() => onCopy(caption, index)}
          className="shrink-0 p-3 bg-(--card)  rounded-xl transition-all duration-300 group-hover:scale-110 cursor-pointer"
          title="Copy to clipboard"
        >
          {isCopied ? (
            <Check className="w-5 h-5 text-green-600" />
          ) : (
            <Copy className="w-5 h-5 text-(--foreground)" />
          )}
        </button>
      </div>
    </div>
  );
};
