import React, { useState, useEffect } from "react";

export default function MainComponent() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [result, setResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState([]);
  const [count, setCount] = useState(1);

  const generateNumbers = () => {
    if (min > max) {
      alert("Minimum value cannot be greater than maximum value");
      return;
    }

    setIsGenerating(true);

    // Simulate animation delay
    setTimeout(() => {
      const numbers = [];
      for (let i = 0; i < count; i++) {
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        numbers.push(randomNum);
      }

      const newResult = count === 1 ? numbers[0] : numbers;
      setResult(newResult);

      // Add to history
      setHistory((prev) => [
        {
          value: newResult,
          timestamp: new Date().toLocaleTimeString(),
          range: `${min}-${max}`,
        },
        ...prev.slice(0, 9),
      ]);

      setIsGenerating(false);
    }, 500);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const quickSet = (minVal, maxVal) => {
    setMin(minVal);
    setMax(maxVal);
  };

  return (
    <div
      className="min-h-screen p-4 sm:p-8"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="heading mb-4">Random Number Generator</h1>
          <p className="description max-w-2xl mx-auto">
            Generate random numbers with customizable ranges. Perfect for games,
            raffles, and decision making.
          </p>
        </div>

        {/* Main Card */}
        <div
          className="rounded-2xl p-6 sm:p-8 mb-6 shadow-lg"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
            borderWidth: "1px",
          }}
        >
          {/* Result Display */}
          <div className="mb-8">
            <div
              className="text-center p-8 sm:p-12 rounded-xl"
              style={{ backgroundColor: "var(--muted)" }}
            >
              {result === null ? (
                <div
                  style={{ color: "var(--muted-foreground)" }}
                  className="text-2xl sm:text-3xl font-medium"
                >
                  Click generate to start
                </div>
              ) : (
                <div
                  className={`text-5xl sm:text-7xl font-bold transition-all duration-500 ${isGenerating ? "scale-110 opacity-50" : "scale-100 opacity-100"}`}
                  style={{
                    color: "var(--primary)",
                    fontFamily: "var(--font-primary)",
                  }}
                >
                  {Array.isArray(result) ? result.join(", ") : result}
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Range Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "var(--foreground)" }}
                >
                  Minimum Value
                </label>
                <input
                  type="number"
                  value={min}
                  onChange={(e) => setMin(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-lg font-medium transition-all focus:ring-2 focus:outline-none"
                  style={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                    borderWidth: "2px",
                    color: "var(--foreground)",
                    "--tw-ring-color": "var(--primary)",
                  }}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "var(--foreground)" }}
                >
                  Maximum Value
                </label>
                <input
                  type="number"
                  value={max}
                  onChange={(e) => setMax(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-lg font-medium transition-all focus:ring-2 focus:outline-none"
                  style={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                    borderWidth: "2px",
                    color: "var(--foreground)",
                    "--tw-ring-color": "var(--primary)",
                  }}
                />
              </div>
            </div>

            {/* Count Input */}
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--foreground)" }}
              >
                How many numbers?
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={count}
                onChange={(e) =>
                  setCount(
                    Math.min(20, Math.max(1, parseInt(e.target.value) || 1)),
                  )
                }
                className="w-full px-4 py-3 rounded-lg font-medium transition-all focus:ring-2 focus:outline-none"
                style={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  borderWidth: "2px",
                  color: "var(--foreground)",
                  "--tw-ring-color": "var(--primary)",
                }}
              />
            </div>

            {/* Quick Presets */}
            <div>
              <label
                className="block text-sm font-semibold mb-3"
                style={{ color: "var(--foreground)" }}
              >
                Quick Presets
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "1-10", min: 1, max: 10 },
                  { label: "1-100", min: 1, max: 100 },
                  { label: "1-1000", min: 1, max: 1000 },
                  { label: "Dice (1-6)", min: 1, max: 6 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => quickSet(preset.min, preset.max)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: "var(--muted)",
                      color: "var(--foreground)",
                      borderColor: "var(--border)",
                      borderWidth: "1px",
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateNumbers}
              disabled={isGenerating}
              className="w-full py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg cursor-pointer"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
                fontFamily: "var(--font-primary)",
              }}
            >
              {isGenerating ? "Generating..." : "Generate Random Number"}
            </button>
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
              borderWidth: "1px",
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2
                className="text-xl font-bold"
                style={{
                  color: "var(--foreground)",
                  fontFamily: "var(--font-primary)",
                }}
              >
                Recent History
              </h2>
              <button
                onClick={clearHistory}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80 cursor-pointer"
                style={{
                  backgroundColor: "var(--muted)",
                  color: "var(--foreground)",
                }}
              >
                Clear
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 rounded-lg transition-all"
                  style={{ backgroundColor: "var(--muted)" }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-2xl font-bold"
                      style={{
                        color: "var(--primary)",
                        fontFamily: "var(--font-primary)",
                      }}
                    >
                      {Array.isArray(item.value)
                        ? item.value.join(", ")
                        : item.value}
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      Range: {item.range}
                    </span>
                  </div>
                  <span
                    className="text-sm"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {item.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
