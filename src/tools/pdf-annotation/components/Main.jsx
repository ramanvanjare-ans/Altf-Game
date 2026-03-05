"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload,
  Pen,
  Highlighter,
  Type,
  Download,
  Trash2,
  Palette,
  ZoomIn,
  ZoomOut,
  FileText,
  Save,
} from "lucide-react";

export default function MainComponent() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPages, setPdfPages] = useState([]);
  const [currentTool, setCurrentTool] = useState("pen");
  const [color, setColor] = useState("#3b82f6");
  const [isDrawing, setIsDrawing] = useState(false);
  const [annotations, setAnnotations] = useState([]);
  const [textInput, setTextInput] = useState({
    show: false,
    x: 0,
    y: 0,
    text: "",
  });
  const [zoom, setZoom] = useState(1);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const colors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#eab308",
    "#8b5cf6",
    "#000000",
    "#ffffff",
  ];

  /* ---------------- Load PDF.js ---------------- */
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    };

    return () => document.body.removeChild(script);
  }, []);

  /* ---------------- Canvas Redraw ---------------- */
  const redrawCanvas = useCallback(() => {
    if (!canvasRef.current || pdfPages.length === 0) return;

    const ctx = canvasRef.current.getContext("2d");
    const page = pdfPages[0];

    canvasRef.current.width = page.canvas.width * zoom;
    canvasRef.current.height = page.canvas.height * zoom;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    ctx.drawImage(
      page.canvas,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height,
    );

    annotations.forEach((ann) => {
      ctx.save();
      ctx.scale(zoom, zoom);

      if (ann.type === "pen") {
        ctx.strokeStyle = ann.color;
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ann.points.forEach((p, i) =>
          i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y),
        );
        ctx.stroke();
      }

      if (ann.type === "highlight") {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = ann.color;
        ctx.fillRect(
          Math.min(ann.x, ann.x + ann.width),
          Math.min(ann.y, ann.y + ann.height),
          Math.abs(ann.width),
          Math.abs(ann.height),
        );
        ctx.globalAlpha = 1;
      }

      if (ann.type === "text") {
        ctx.fillStyle = ann.color;
        ctx.font = "20px sans-serif";
        ctx.fillText(ann.text, ann.x, ann.y);
      }

      ctx.restore();
    });
  }, [pdfPages, annotations, zoom]);

  useEffect(() => {
    if (pdfPages.length > 0) redrawCanvas();
  }, [pdfPages, annotations, zoom, redrawCanvas]);

  /* ---------------- Upload ---------------- */
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      alert("Upload valid PDF");
      return;
    }

    setPdfFile(file);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const typedArray = new Uint8Array(event.target.result);
      const pdf = await window.pdfjsLib.getDocument({
        data: typedArray,
      }).promise;

      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.8 });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: context,
        viewport,
      }).promise;

      setPdfPages([{ canvas }]);
      setAnnotations([]);
      setZoom(1);
    };

    reader.readAsArrayBuffer(file);
  };

  /* ---------------- Drawing ---------------- */
  const getCoords = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom,
    };
  };

  const startDrawing = (e) => {
    if (currentTool === "text") {
      const { x, y } = getCoords(e);
      setTextInput({ show: true, x, y, text: "" });
      return;
    }

    setIsDrawing(true);
    const { x, y } = getCoords(e);

    if (currentTool === "pen") {
      setAnnotations((prev) => [
        ...prev,
        { type: "pen", color, points: [{ x, y }] },
      ]);
    }

    if (currentTool === "highlight") {
      setAnnotations((prev) => [
        ...prev,
        { type: "highlight", color, x, y, width: 0, height: 0 },
      ]);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getCoords(e);

    setAnnotations((prev) => {
      const copy = [...prev];
      const last = copy[copy.length - 1];
      if (!last) return prev;

      if (last.type === "pen") last.points.push({ x, y });
      if (last.type === "highlight") {
        last.width = x - last.x;
        last.height = y - last.y;
      }

      return copy;
    });
  };

  const stopDrawing = () => setIsDrawing(false);

  const addText = () => {
    if (!textInput.text.trim()) return;

    setAnnotations((prev) => [
      ...prev,
      {
        type: "text",
        color,
        x: textInput.x,
        y: textInput.y + 16,
        text: textInput.text,
      },
    ]);

    setTextInput({ show: false, x: 0, y: 0, text: "" });
  };

  const downloadAnnotated = () => {
    const link = document.createElement("a");
    link.download = `annotated-${pdfFile?.name || "file"}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const clearAnnotations = () => {
    if (confirm("Clear all annotations?")) setAnnotations([]);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="bg-(--card) border border-(--border) rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-(--foreground)">
            PDF Annotation Tool
          </h1>
          <p className="text-(--muted-foreground)">
            Upload PDF and annotate with drawing, highlights & text.
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-(--primary) text-(--primary-foreground) px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Upload size={16} />
          Upload PDF
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {pdfPages.length === 0 ? (
        <div className="bg-(--card) border border-(--border) rounded-2xl p-12 text-center">
          <FileText className="w-16 h-16 mx-auto text-(--muted-foreground)" />
          <p className="mt-4 text-(--muted-foreground)">
            Upload a PDF to start annotating
          </p>
        </div>
      ) : (
        <>
          {/* Toolbar */}
          <div className="bg-(--card) border border-(--border) rounded-2xl p-6 grid md:grid-cols-4 gap-6">
            {/* Tools */}
            <div>
              <p className="font-medium mb-2">Tools</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentTool("pen")}
                  className="tool-btn"
                >
                  <Pen size={16} />
                </button>
                <button
                  onClick={() => setCurrentTool("highlight")}
                  className="tool-btn"
                >
                  <Highlighter size={16} />
                </button>
                <button
                  onClick={() => setCurrentTool("text")}
                  className="tool-btn"
                >
                  <Type size={16} />
                </button>
              </div>
            </div>

            {/* Colors */}
            <div>
              <p className="font-medium mb-2">Color</p>
              <div className="flex gap-2 flex-wrap">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-8 h-8 rounded-full border ${
                      color === c
                        ? "ring-2 ring-(--primary)"
                        : "border-(--border)"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Zoom */}
            <div>
              <p className="font-medium mb-2">Zoom</p>
              <div className="flex gap-2 items-center">
                <button onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}>
                  <ZoomOut size={16} />
                </button>
                <span>{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(Math.min(2, zoom + 0.25))}>
                  <ZoomIn size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div>
              <p className="font-medium mb-2">Actions</p>
              <div className="flex gap-2">
                <button
                  onClick={clearAnnotations}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={downloadAnnotated}
                  className="bg-(--primary) text-(--primary-foreground) px-3 py-1 rounded"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="bg-(--card) border border-(--border) rounded-2xl p-6 overflow-auto">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="border rounded-lg bg-(--background)"
            />
          </div>
        </>
      )}

      {/* Text Input Modal */}
      {textInput.show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-(--card) p-6 rounded-xl space-y-4 w-80">
            <h3 className="font-semibold">Add Text</h3>
            <input
              value={textInput.text}
              onChange={(e) =>
                setTextInput({ ...textInput, text: e.target.value })
              }
              className="w-full border border-(--border) rounded p-2"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() =>
                  setTextInput({ show: false, x: 0, y: 0, text: "" })
                }
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={addText}
                className="bg-(--primary) text-(--primary-foreground) px-3 py-1 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
