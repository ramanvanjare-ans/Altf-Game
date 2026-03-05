"use client";

import React, { useState, useEffect, useCallback } from "react";
import PageThumbnail from "./PageThumbnail";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import {
  Download,
  Upload,
  Undo2,
  Trash2,
  FileUp,
  Loader2,
  AlertCircle,
  FileText,
} from "lucide-react";

const ReorderPages = () => {
  const [pages, setPages] = useState([]); // { id: string, originalIndex: number, pageNumber: number, image: string | null }
  const [history, setHistory] = useState([]); // Array of pages arrays
  const [rawPdfBytes, setRawPdfBytes] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null); // PDF.js Proxy
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeId, setActiveId] = useState(null); // For DragOverlay
  const [librariesLoaded, setLibrariesLoaded] = useState(false);

  // Dynamically import pdfjs-dist only on client side
  useEffect(() => {
    let mounted = true;

    const loadPdfLibraries = async () => {
      try {
        // Dynamic import for pdfjs-dist
        const pdfjs = await import("pdfjs-dist");

        if (mounted) {
          // Set worker
          if (!pdfjs.GlobalWorkerOptions.workerSrc) {
            pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
          }

          // Store reference in window to avoid re-importing
          if (typeof window !== "undefined") {
            window.__pdfjsLib = pdfjs;
          }

          setLibrariesLoaded(true);
        }
      } catch (error) {
        console.error("Failed to load PDF libraries:", error);
      }
    };

    loadPdfLibraries();

    return () => {
      mounted = false;
    };
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // --- Undo Logic ---
  const saveHistory = useCallback(() => {
    setHistory((prev) => {
      // Limit history to last 20 states to save memory
      const newHistory = [...prev, pages];
      if (newHistory.length > 20) return newHistory.slice(1);
      return newHistory;
    });
  }, [pages]);

  const handleUndo = () => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setPages(previousState);
    setHistory((prev) => prev.slice(0, -1));
  };

  // --- File Upload ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    if (
      !librariesLoaded ||
      typeof window === "undefined" ||
      !window.__pdfjsLib
    ) {
      alert(
        "PDF library is still loading. Please wait a moment and try again.",
      );
      return;
    }

    setIsProcessing(true);
    setPages([]);
    setHistory([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const clonedBuffer = arrayBuffer.slice(0);
      setRawPdfBytes(clonedBuffer);

      const pdfjsLib = window.__pdfjsLib;
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);

      // Create initial page placeholders
      const newPages = Array.from({ length: pdf.numPages }, (_, i) => ({
        id: `page-${i}-${Date.now()}`,
        originalIndex: i, // 0-based index in original PDF
        pageNumber: i + 1,
        image: null, // Will be loaded lazily
      }));

      setPages(newPages);
    } catch (err) {
      console.error("PDF Load Error:", err);
      alert("Failed to load PDF. Please try another file.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Lazy Load Thumbnails ---
  useEffect(() => {
    if (!pdfDoc || pages.length === 0) return;

    // Find the first page that needs an image
    const nextPageIndex = pages.findIndex((p) => !p.image);
    if (nextPageIndex === -1) return; // All done

    let isMounted = true;
    const pageItem = pages[nextPageIndex];

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(pageItem.originalIndex + 1); // PDF.js uses 1-based index
        const viewport = page.getViewport({ scale: 0.25 }); // Small preview
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;
        const imgData = canvas.toDataURL("image/jpeg", 0.8);

        if (isMounted) {
          setPages((current) =>
            current.map((p, idx) =>
              idx === nextPageIndex ? { ...p, image: imgData } : p,
            ),
          );
        }
      } catch (error) {
        console.error("Error rendering page", pageItem.originalIndex, error);
        // Mark as failed/loaded to prevent infinite loop
        if (isMounted) {
          setPages((current) =>
            current.map((p, idx) =>
              idx === nextPageIndex ? { ...p, image: "error" } : p,
            ),
          );
        }
      }
    };

    // Render one by one with a small delay to keep UI responsive
    const timeoutId = setTimeout(renderPage, 10);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [pages, pdfDoc]);

  // --- Drag & Drop ---
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    saveHistory();
    setPages((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  // --- Actions ---
  const handleRemovePage = (id) => {
    saveHistory();
    setPages((items) => items.filter((p) => p.id !== id));
  };

  const handleDownload = async () => {
    if (!rawPdfBytes || pages.length === 0) return;

    if (!librariesLoaded) {
      alert(
        "PDF library is still loading. Please wait a moment and try again.",
      );
      return;
    }

    try {
      // Dynamically import pdf-lib only when needed for download
      const { PDFDocument } = await import("pdf-lib");

      const originalPdf = await PDFDocument.load(rawPdfBytes);
      const newPdf = await PDFDocument.create();

      const pageIndices = pages.map((p) => p.originalIndex);

      // Copy pages in the new order
      if (pageIndices.length > 0) {
        const copiedPages = await newPdf.copyPages(originalPdf, pageIndices);
        copiedPages.forEach((page) => newPdf.addPage(page));
      } else {
        alert("No pages to export!");
        return;
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "reordered-document.pdf";
      link.click();
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF");
    }
  };

  // --- Render ---
  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-(--card) p-4 rounded-xl border border-(--border) shadow-sm">
        <div className="flex items-center gap-4">
          <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg inline-flex items-center gap-2 font-medium transition-colors shadow-sm">
            <Upload size={18} />
            {pages.length > 0 ? "Upload New PDF" : "Upload PDF"}
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              hidden
            />
          </label>

          {pages.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-(--muted-foreground)">
              <FileText size={16} />
              <span>{pages.length} Pages</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="px-4 py-2.5 rounded-lg border border-(--border) bg-(--background) hover:bg-(--muted) disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors text-(--foreground)"
          >
            <Undo2 size={18} />
            Undo
          </button>

          <button
            onClick={handleDownload}
            disabled={pages.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg inline-flex items-center gap-2 font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-100 bg-(--background) rounded-xl border-2 border-dashed border-(--border) p-6">
        {isProcessing && (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            <p className="text-(--muted-foreground)">Processing PDF...</p>
          </div>
        )}

        {!isProcessing && pages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
            <div className="p-4 rounded-full bg-(--muted)">
              <FileUp className="w-12 h-12 text-(--muted-foreground)" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-(--foreground)">
                No PDF Uploaded
              </h3>
              <p className="text-(--muted-foreground)">
                Upload a PDF to start reordering pages.
              </p>
            </div>
          </div>
        )}

        {!isProcessing && pages.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={pages.map((p) => p.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {pages.map((page) => (
                  <PageThumbnail
                    key={page.id}
                    page={page}
                    onRemove={handleRemovePage}
                  />
                ))}
              </div>
            </SortableContext>

            {/* Drag Overlay for smooth visual */}
            <DragOverlay>
              {activeId ? (
                <div className="opacity-80 scale-105 cursor-grabbing">
                  {/* Simplified overlay - we just clone the thumbnail appearance roughly */}
                  <div className="border-2 border-blue-500 bg-(--card) p-2 rounded-lg shadow-xl w-40 h-52 flex items-center justify-center">
                    <span className="font-bold text-lg">Moving...</span>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default ReorderPages;
