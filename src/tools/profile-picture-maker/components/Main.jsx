"use client";

import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Upload, Download, Trash2 } from "lucide-react";

const REMOVE_BG_API_KEY = "CdKxHfEVe2pCn3UbSho2gskn";

export default function MainComponent() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [bgRemovedUrl, setBgRemovedUrl] = useState(null);
  const [size, setSize] = useState(256);
  const [zoom, setZoom] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [style, setStyle] = useState("round");
  const [bgType, setBgType] = useState("transparent");
  const [bgColor, setBgColor] = useState("#ffffff");

  const canvasRef = useRef(null);
  const imageRef = useRef(new Image());

  /* ---------------- Image Load ---------------- */
  useEffect(() => {
    const src = bgRemovedUrl || previewUrl;
    if (!src) return;

    const img = imageRef.current;
    img.crossOrigin = "anonymous";
    // eslint-disable-next-line react-hooks/immutability
    img.onload = drawToCanvas;
    img.src = src;
  }, [
    previewUrl,
    bgRemovedUrl,
    zoom,
    brightness,
    contrast,
    saturation,
    size,
    style,
    bgType,
    bgColor,
  ]);

  /* ---------------- Canvas Drawing ---------------- */
  function drawToCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const img = imageRef.current;
    const dSize = size;

    canvas.width = dSize;
    canvas.height = dSize;

    // Background
    if (bgType === "transparent") ctx.clearRect(0, 0, dSize, dSize);
    else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, dSize, dSize);
    }

    if (!img.width || !img.height) return;

    const scale = Math.max(dSize / img.width, dSize / img.height) * zoom;
    const dw = img.width * scale;
    const dh = img.height * scale;
    const dx = (dSize - dw) / 2;
    const dy = (dSize - dh) / 2;

    ctx.save();
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();

    if (style === "round") {
      const temp = document.createElement("canvas");
      temp.width = dSize;
      temp.height = dSize;
      const tctx = temp.getContext("2d");

      tctx.beginPath();
      tctx.arc(dSize / 2, dSize / 2, dSize / 2, 0, Math.PI * 2);
      tctx.clip();
      tctx.drawImage(canvas, 0, 0);

      ctx.clearRect(0, 0, dSize, dSize);
      if (bgType !== "transparent") {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, dSize, dSize);
      }
      ctx.drawImage(temp, 0, 0);
    }
  }

  /* ---------------- File Upload ---------------- */
  function handleFile(e) {
    const f = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!f) return;
    setFile(f);
    setBgRemovedUrl(null);
    setPreviewUrl(URL.createObjectURL(f));
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFile(e);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  /* ---------------- Remove BG ---------------- */
  async function removeBackground() {
    if (!file) return;

    setProcessing(true);

    try {
      const form = new FormData();
      form.append("image_file", file);
      form.append("size", "auto");

      const res = await axios.post(
        "https://api.remove.bg/v1.0/removebg",
        form,
        {
          headers: { "X-Api-Key": REMOVE_BG_API_KEY },
          responseType: "blob",
        },
      );

      setBgRemovedUrl(URL.createObjectURL(res.data));
    } catch (err) {
      alert("Background removal failed.");
    }

    setProcessing(false);
  }

  /* ---------------- Clear ---------------- */
  function clearAll() {
    setFile(null);
    setPreviewUrl(null);
    setBgRemovedUrl(null);
  }

  /* ---------------- Download ---------------- */
  function downloadPNG() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `avatar_${size}x${size}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <header className="text-center mb-12">
        <h2 className="heading">Profile Picture Maker</h2>
        <p className="text-center description">
          Create stunning profile pictures easily with custom styles
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Left Panel */}
        <div className="flex flex-col items-center gap-6">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="w-64 h-64 border-2 border-dashed border-(--primary) rounded-2xl flex items-center justify-center bg-(--card) cursor-pointer"
          >
            {!previewUrl && !bgRemovedUrl ? (
              <label className="text-center cursor-pointer">
                <Upload className="mx-auto w-10 h-10 text-(--primary)" />
                <p className="mt-2 text-(--muted-foreground)">
                  Drop or Upload Image
                </p>
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                />
              </label>
            ) : (
              <canvas ref={canvasRef} className="w-64 h-64 rounded-full" />
            )}
          </div>

          <div className="flex gap-3 flex-wrap justify-center">
            <label className="bg-(--primary) text-(--primary-foreground) px-4 py-2 rounded-lg cursor-pointer">
              Replace
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleFile}
              />
            </label>

            <button
              onClick={removeBackground}
              disabled={!file || processing}
              className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 cursor-pointer"
            >
              {processing ? "Processing..." : "Remove BG"}
            </button>

            <button
              onClick={clearAll}
              className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <Trash2 size={16} /> Clear
            </button>
          </div>
        </div>

        {/* Right Panel Controls */}
        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">
              Output Size: {size}px
            </label>
            <input
              type="range"
              min="64"
              max="512"
              step="32"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label>Zoom</label>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.01"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <label>Brightness</label>
            <input
              type="range"
              min="50"
              max="150"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full"
            />

            <label>Contrast</label>
            <input
              type="range"
              min="50"
              max="150"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full"
            />

            <label>Saturation</label>
            <input
              type="range"
              min="0"
              max="200"
              value={saturation}
              onChange={(e) => setSaturation(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2">Style</label>
            <div className="flex gap-3">
              <button
                onClick={() => setStyle("round")}
                className={`px-4 py-2 rounded-lg border cursor-pointer ${
                  style === "round"
                    ? "bg-(--primary) text-(--primary-foreground)"
                    : "border-(--border)"
                }`}
              >
                Round
              </button>
              <button
                onClick={() => setStyle("square")}
                className={`px-4 py-2 rounded-lg border cursor-pointer ${
                  style === "square"
                    ? "bg-(--primary) text-(--primary-foreground)"
                    : "border-(--border)"
                }`}
              >
                Square
              </button>
            </div>
          </div>

          <div>
            <label>Background</label>
            <select
              value={bgType}
              onChange={(e) => setBgType(e.target.value)}
              className="w-full border border-(--border) p-2 rounded-lg mt-2"
            >
              <option value="transparent">Transparent</option>
              <option value="solid">Solid</option>
            </select>

            {bgType === "solid" && (
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="mt-3"
              />
            )}
          </div>

          <button
            onClick={downloadPNG}
            className="w-full bg-(--primary) text-(--primary-foreground) py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download size={18} />
            Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}
