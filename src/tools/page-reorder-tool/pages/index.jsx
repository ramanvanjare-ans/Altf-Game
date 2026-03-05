"use client";

import React, { useState } from "react";
import ReorderPages from "../components/ReorderPages";

import Features from "../components/Features";

function App() {
  const [showTool, setShowTool] = useState(true);

  return (
    <div className="min-h-screen bg-(--background) p-4 md:p-8">
      <div className="max-w-full mx-auto">
        <h2 className="heading text-center">PDF Reorder Tool</h2>

        <p className="description text-center ">
          Rearrange, remove, and organize PDF pages with an intuitive
          drag-and-drop interface.,
        </p>

        {/* Header */}

        {showTool ? (
          <>
            <ReorderPages />

            <Features />
          </>
        ) : (
          <div className="text-center py-20 bg-(--card) text-(--foreground) border border-(--border) rounded-xl shadow-lg mt-8">
            <p className="text-xl font-semibold opacity-70 mb-4">
              The Page Reorder Tool is currently hidden.
            </p>
            <button
              onClick={() => setShowTool(true)}
              className="mt-4 px-8 py-3 bg-(--primary) text-(--primary-foreground) rounded-xl font-bold hover:opacity-90 transition shadow-lg"
            >
              Show Reorder Tool
            </button>
          </div>
        )}
      </div>

      <footer className="mt-12 text-center text-sm text-(--muted-foreground) pb-4">
        <p>
          &copy; {new Date().getFullYear()} PDF Microtool. All Rights Reserved.
          Secure & client-side processing.
        </p>
      </footer>
    </div>
  );
}

export default App;
