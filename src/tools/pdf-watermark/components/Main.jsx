"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  FileText,
  Download,
  FileQuestionIcon,
  Settings,
  Eye,
} from "lucide-react";
import { File } from "buffer";

export default function MainComponent() {
  const [text, setText] = useState("WATERMARK");
  const [opacity, setOpacity] = useState(50);
  const [fontSize, setFontSize] = useState(40);
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  const canvasRef = useRef(null);

  const generateWatermark = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 500;
    canvas.height = 250;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Text
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const alpha = Math.floor(opacity * 2.55)
      .toString(16)
      .padStart(2, "0");

    ctx.fillStyle = `${textColor}${alpha}`;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 4);
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }, [text, opacity, fontSize, textColor, backgroundColor]);

  useEffect(() => {
    generateWatermark();
  }, [generateWatermark]);

  const downloadWatermark = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "watermark.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-10 p-7">
      {/* Header */}
      <div className=" p-8 text-center">
        {/* <div className="inline-flex items-center justify-center rounded-full bg-(--primary)/10 p-4 mb-6">
          <FileText className="h-6 w-6 text-(--primary)" />
        </div> */}

        <h1 className="heading">Create Professional Watermarks</h1>

        <p className="description mt-5 max-w-2xl mx-auto">
          Customize text, opacity, font size and colors to generate watermark
          PNG files for your PDFs and images.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Settings */}
        <div className="bg-(--card) border border-(--border) rounded-2xl p-8 space-y-6 shadow-sm">
          <h2 className="text-xl font-semibold text-(--foreground)">
            Watermark Settings
          </h2>

          {/* Text */}
          <div>
            <label className="block mb-2 font-medium text-(--foreground)">
              Watermark Text
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-(--background) border border-(--border) text-(--foreground) focus:outline-none focus:ring-2 focus:ring-(--primary)"
            />
          </div>

          {/* Opacity */}
          <div>
            <label className="block mb-2 font-medium text-(--foreground)">
              Opacity: {opacity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Font Size */}
          <div>
            <label className="block mb-2 font-medium text-(--foreground)">
              Font Size: {fontSize}px
            </label>
            <input
              type="range"
              min="10"
              max="120"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium text-(--foreground)">
                Text Color
              </label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-(--foreground)">
                Background Color
              </label>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Download */}
          <button
            onClick={downloadWatermark}
            className="cursor-pointer w-full py-3 rounded-xl bg-(--primary) text-(--primary-foreground) font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
          >
            <Download className="w-4 h-4" />
            Download Watermark PNG
          </button>
        </div>

        {/* Preview */}
        <div className="bg-(--card) border border-(--border) rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-(--foreground) mb-6">
            Preview
          </h2>

          <div className="border border-dashed border-(--border) rounded-xl bg-(--muted) p-6 flex items-center justify-center min-h-75">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto border border-(--border) rounded"
            />
          </div>

          <p className="text-sm text-(--muted-foreground) mt-4">
            The watermark will be downloaded as a PNG file that you can use in
            PDF editors or image tools.
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-(--card) border border-(--border) rounded-2xl p-8 shadow-sm">
        {/* Header */}
        <div className="flex justify-center sm:justify-start items-center gap-3 mb-8">
          <div className="p-2 rounded-xl bg-(--primary) text-(--primary-foreground)">
            <FileQuestionIcon className="w-5 h-5" />
          </div>
          <h2 className="subheading font-bold text-(--foreground) ">
            How to Use
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="group bg-(--background) border border-(--border) rounded-xl p-5 transition hover:shadow-md hover:-translate-y-1">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-(--muted) text-(--primary) group-hover:scale-110 transition">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-(--foreground)">
                  Customize Settings
                </p>
                <p className="text-sm text-(--muted-foreground) mt-1">
                  Adjust text, size, opacity, and colors to match your needs.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group bg-(--background) border border-(--border) rounded-xl p-5 transition hover:shadow-md hover:-translate-y-1">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-(--muted) text-(--primary) group-hover:scale-110 transition">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-(--foreground)">
                  Preview in Real-Time
                </p>
                <p className="text-sm text-(--muted-foreground) mt-1">
                  Instantly see changes as you adjust settings.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group bg-(--background) border border-(--border) rounded-xl p-5 transition hover:shadow-md hover:-translate-y-1">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-(--muted) text-(--primary) group-hover:scale-110 transition">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-(--foreground) ">
                  Download PNG
                </p>
                <p className="text-sm text-(--muted-foreground) mt-1">
                  Click download to save the generated watermark as a PNG file.
                </p>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="group bg-(--background) border border-(--border) rounded-xl p-5 transition hover:shadow-md hover:-translate-y-1">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-(--muted) text-(--primary) group-hover:scale-110 transition">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-(--foreground)">
                  Insert into PDF
                </p>
                <p className="text-sm text-(--muted-foreground) mt-1">
                  Open your PDF editor and add the PNG as a watermark layer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
