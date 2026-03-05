// src/components/DiffChecker/DiffOptions.jsx
import { RotateCcw, Download } from "lucide-react";

const DiffOptions = ({
  ignoreWhitespace,
  setIgnoreWhitespace,
  ignoreCase,
  setIgnoreCase,
  viewMode,
  setViewMode,
  handleReset,
  handleDownload,
}) => (
  <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-(--border)">
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={ignoreWhitespace}
        onChange={(e) => setIgnoreWhitespace(e.target.checked)}
        className="w-4 h-4 text-indigo-600 cursor-pointer"
      />
      <span className="text-sm text-(--muted-foreground)">Ignore Whitespace</span>
    </div>

    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={ignoreCase}
        onChange={(e) => setIgnoreCase(e.target.checked)}
        className="w-4 h-4 text-indigo-600"
      />
      <span className="text-sm text-(--muted-foreground)">Ignore Case</span>
    </div>

    <div className="flex gap-2 ml-auto">
      <button
        onClick={() => setViewMode("split")}
        className={`px-4 py-2 rounded-lg text-sm cursor-pointer ${
          viewMode === "split" ? "bg-indigo-600 text-(--foreground)" : "bg-(--card)"
        }`}
      >
        Split View
      </button>

      <button
        onClick={() => setViewMode("unified")}
        className={`px-4 py-2 rounded-lg text-sm ${
          viewMode === "unified" ? "bg-indigo-600 text-(--foreground)" : "bg-(--card)"
        }`}
      >
        Unified View
      </button>
    </div>

    <button
      onClick={handleReset}
      className="px-4 py-2 bg-(--card) rounded-lg flex items-center gap-2 text-sm cursor-pointer"
    >
      <RotateCcw className="w-4 h-4" /> Reset
    </button>

    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 text-sm cursor-pointer"
    >
      <Download className="w-4 h-4" /> Download Diff
    </button>
  </div>
);

export default DiffOptions;
