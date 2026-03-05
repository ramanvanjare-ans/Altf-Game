import React from "react";
import { TONE_OPTIONS } from "../utils/constants";

const ToneSelector = ({ selectedTone, setSelectedTone, isLoading }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {TONE_OPTIONS.map((tone) => {
        const Icon = tone.icon;
        const isSelected = selectedTone === tone.value;

        return (
          <button
            key={tone.value}
            onClick={() => setSelectedTone(tone.value)}
            disabled={isLoading}
            className={`
              flex flex-col items-center justify-center p-4 rounded-xl border-2
              transition-all duration-200 cursor-pointer

              ${
                isSelected
                  ? `
                    text-(--primary-foreground)
                    ${tone.color} 
                    shadow-lg scale-105
                  `
                  : `
                    bg-(--muted)
                    border-(--border)
                    text(--muted-foreground)
                    hover:bg-(--secondary)
                  `
              }
            `}
          >
            <Icon size={24} className="mb-2" />

            <span className="text-sm font-semibold text-center">
              {tone.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ToneSelector;
