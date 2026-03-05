import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";


export default function ToolHome() {
  
  const [color1, setColor1] = useState("#6366f1");
  const [color2, setColor2] = useState("#0ea5e9");
  const [angle, setAngle] = useState(120);

  const presets = [
    ["#6366f1", "#0ea5e9"],
    ["#8b5cf6", "#ec4899"],
    ["#0f172a", "#1e293b"],
    ["#2563eb", "#9333ea"],
    ["#020617", "#0f172a"],
    ["#312e81", "#1d4ed8"],
  ];

  const gradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;

 const copyCSS = () => {
  navigator.clipboard.writeText(`${gradient};`);

  toast.success("CSS Copied!", {
    description: "Gradient CSS has been copied to your clipboard.",
  });
};


  const gradientDefinitions = [
    {
      type: "Linear Gradient",
      code: "linear-gradient(90deg, #6366f1, #0ea5e9)",
      desc: "Colors blend along a straight line from start to end.",
    },
    {
      type: "Radial Gradient",
      code: "radial-gradient(circle, #6366f1, #0ea5e9)",
      desc: "Colors radiate outward from a central point.",
    },
    {
      type: "Conic Gradient",
      code: "conic-gradient(#6366f1, #0ea5e9, #ec4899)",
      desc: "Colors rotate around a center point, like a pie chart.",
    },
    {
      type: "Repeating Gradient",
      code: "repeating-linear-gradient(45deg, #6366f1 0px, #6366f1 20px, #0ea5e9 20px, #0ea5e9 40px)",
      desc: "Gradient repeats infinitely to create patterns.",
    },
    {
      type: "Color Stops / Shades",
      code: "linear-gradient(90deg, #6366f1 0%, #3b82f6 50%, #0ea5e9 100%)",
      desc: "Multiple colors at specific positions for smooth transition.",
    },
  ];

  return (
    <div className="space-y-8 bg-(--background) text-(--foreground) p-6 ">
      {/* How to Use */}
      <div className="p-6 ">
        <h2 className="heading text-center pt-5 mb-2 animate-fade-up">
          Generate Gradients
        </h2>
        <p className="description text-center animate-fade-up ">
          Create beautiful CSS gradients for your projects. Select  colors, <br/> adjust the angle, and copy the CSS code.
        </p>
      </div>

      {/* Main Generator */}
      <div className=" m-8 grid lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="p-6 border border-(--border) rounded-xl shadow-sm animate-fade-up">
          <h3 className="text-lg font-semibold mb-4">
            Gradient Controls
          </h3>

          <div className="space-y-6">
            {/* Color 1 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                First Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="w-12 h-12 cursor-pointer rounded border"
                />
                <span className="text-sm font-mono bg-(--card) px-2 py-1 rounded">
                  {color1}
                </span>
              </div>
            </div>

            {/* Color 2 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Second Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="w-12 h-12 cursor-pointer rounded border"
                />
                <span className="text-sm font-mono bg-(--card) px-2 py-1 rounded">
                  {color2}
                </span>
              </div>
            </div>

            {/* Angle */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Angle: {angle}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* CSS Code */}
            <div className="p-4 bg-(--card) rounded-lg">
              <p className="text-xs font-mono mb-2">
                CSS Code:
              </p>
              <code className="text-sm">
                background: {gradient};
              </code>
            </div>

            {/* Button */}
            <button
              onClick={copyCSS}
              className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Copy CSS
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="p-6  border border-(--border) rounded-xl shadow-sm animate-fade-up">
          <h3 className="subheading">
            Live Preview
          </h3>
          <div
            className="w-full mt-8 sm:mt-16 md:mt-12 h-64  rounded-lg  border border(--border) item-center"
            style={{ background: gradient }}
          />
          {/* <p className="text-sm text-blue-500">
            Exact output you will get on a real website.
          </p> */}
        </div>
      </div>

      {/* Presets */}
      <div className=" m-8 p-6 border border-(--border) rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">
          Popular Presets
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {presets.map((p, i) => (
            <div
              key={i}
              onClick={() => {
                setColor1(p[0]);
                setColor2(p[1]);
              }}
              className="h-20 rounded-lg cursor-pointer border hover:shadow-md transition"
              style={{
                background: `linear-gradient(135deg, ${p[0]}, ${p[1]})`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Gradient Guide */}
      <div className=" m-8 p-6 border border-(--border) rounded-xl shadow-sm mb-4 ">
        <h3 className="text-lg font-semibold mb-4">
          CSS Gradients Guide
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gradientDefinitions.map((g, i) => (
            <div key={i} className="p-4 bg-(--card) rounded-lg">
              <div
                className="h-20 rounded mb-3"
                style={{ background: g.code }}
              />
              <h4 className="font-medium mb-1">
                {g.type}
              </h4>
              <p className="text-sm text-(--foreground) mb-2">
                {g.desc}
              </p>
              <code className="text-xs font-mono bg-(--card) p-2 rounded block">
                {g.code};
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
