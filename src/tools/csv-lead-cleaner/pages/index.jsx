import React, { useState } from "react";

// Components
import LeadPreviewTable from "../components/LeadPreviewTable";
import Cards from "../components/Cards";
import Privacy from "../components/Privacy";
import CsvLeadCleaner from "../components/CsvLeadCleaner";

// Utilities
import * as helpers from "../utils/helpers";

export default function App() {
  const [csvData, setCsvData] = useState([]);

  return (
    <div className="min-h-screen bg-(--background) text-(--foreground) font-secondary">

      {/* ================= HERO ================= */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-12 text-center">
        <h1 className="heading text-(--primary)">
          CSV Lead Cleaner
        </h1>

        <p className="description max-w-3xl mx-auto mt-6">
          Clean your lead lists instantly. Remove duplicates, normalize columns,
          and download a CRM-ready CSV — all inside your browser.
          <span className="block mt-2 font-medium text-(--primary)">
            No login. No server. Fully offline.
          </span>
        </p>
      </section>

      {/* ================= UPLOAD + PREVIEW ================= */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <h2 className="subheading text-center mb-10">
          Upload Your CSV
        </h2>

        <div className="
          w-full
          bg-(--card)
          border border-(--border)
          rounded-3xl
          shadow-xl
          p-8
          max-w-4xl
          mx-auto
          space-y-8
        ">
          {/* Cleaner Tool */}
          <CsvLeadCleaner
            csvText={csvDataToText(csvData)}
            helpers={helpers}
          />

          {/* Preview Table */}
          <LeadPreviewTable data={csvData} />
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="subheading">
            Key Features
          </h2>
          <p className="description mt-3">
            Everything you need to prepare CRM-ready lead files.
          </p>
        </div>

        <Cards />
      </section>

      {/* ================= PRIVACY ================= */}
      <section className="py-20 border-t border-(--border)">
        <div className="max-w-5xl mx-auto px-6">
          <Privacy />
        </div>
      </section>

    </div>
  );
}

/* ================================
   Helper: convert csvData array to CSV string
================================ */
function csvDataToText(data) {
  if (!data || !data.length) return "";

  const headers = Object.keys(data[0]);
  const rows = data
    .map((row) => headers.map((h) => row[h]).join(","))
    .join("\n");

  return [headers.join(","), rows].join("\n");
}
