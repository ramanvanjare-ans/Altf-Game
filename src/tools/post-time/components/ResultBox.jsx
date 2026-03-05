import { useState } from "react";

const ResultBox = ({ times }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!times.length) return null;

  return (
    <div className="mt-6 p-4 rounded-2xl bg-(--muted) transition">
      <h3 className="font-heading font-semibold mb-3">Best Time Slots</h3>

      <div className="flex flex-wrap gap-3">
        {times.map((time, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition transform
              ${
                activeIndex === i
                  ? "bg-(--primary) text-(--primary-foreground)"
                  : "bg-(--card) text-(--card-foreground) border-(--border)"
              }
              hover:scale-105`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ResultBox;
