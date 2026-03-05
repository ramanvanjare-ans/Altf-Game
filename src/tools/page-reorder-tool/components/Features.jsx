"use client";
import React from "react";
import { Upload, Hand, Download } from "lucide-react";

const Features = () => (
  <section
    id="how-it-works"
    className="
      mt-12 p-6 rounded-xl shadow-lg border
      bg-(--card)
      border-(--border)
      text-(--card-foreground)
      transition-colors duration-300
    "
  >
    <h2
      className="
        text-2xl font-bold mb-6 border-b pb-2
        text-(--foreground)
        border-(--border)
      "
    >
      🚀 Features
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
      {/* STEP 1 */}
      <div className="flex flex-col items-center">
        <div className="p-3 rounded-full mb-3 bg-(--muted) text-(--primary) border border-(--border)">
          <Upload size={24} />
        </div>
        <h3 className="font-semibold text-lg text-(--foreground)">
          1. Upload Your PDF
        </h3>
        <p className="text-sm text-(--muted-foreground)">
          Click &apos;Upload PDF&apos; and select the file you wish to reorder.
        </p>
      </div>

      {/* STEP 2 */}
      <div className="flex flex-col items-center">
        <div className="p-3 rounded-full mb-3 bg-(--muted) text-(--primary) border border-(--border)">
          <Hand size={24} />
        </div>
        <h3 className="font-semibold text-lg text-(--foreground)">
          2. Drag & Drop
        </h3>
        <p className="text-sm text-(--muted-foreground)">
          Simply drag the page thumbnails to your desired position.
        </p>
      </div>

      {/* STEP 3 */}
      <div className="flex flex-col items-center">
        <div className="p-3 rounded-full mb-3 bg-(--muted) text-(--primary) border border-(--border)">
          <Download size={24} />
        </div>
        <h3 className="font-semibold text-lg text-(--foreground)">
          3. Download
        </h3>
        <p className="text-sm text-(--muted-foreground)">
          Click &apos;Export PDF&apos; to save your reordered file.
        </p>
      </div>
    </div>
  </section>
);

export default Features;
