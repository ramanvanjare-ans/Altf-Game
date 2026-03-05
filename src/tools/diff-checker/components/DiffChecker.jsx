import { useState, useMemo } from "react";
import { AlertCircle } from "lucide-react";

import DiffHeader from "./DiffHeader";
import DiffInputs from "./DiffInputs";
import DiffOptions from "./DiffOptions";
import DiffStats from "./DiffStats";
import UnifiedView from "./UnifiedView";
import SplitView from "./SplitView";
import { computeDiffLogic } from "../utils/diffUtils";



const DiffChecker = () => {
  const [originalText, setOriginalText] = useState("");
  const [modifiedText, setModifiedText] = useState("");
  const [viewMode, setViewMode] = useState("split");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);

  const diff = useMemo(
    () =>
      computeDiffLogic(
        originalText,
        modifiedText,
        ignoreWhitespace,
        ignoreCase
      ),
    [originalText, modifiedText, ignoreWhitespace, ignoreCase]
  );

  const stats = useMemo(
    () => ({
      added: diff.filter((d) => d.type === "added").length,
      deleted: diff.filter((d) => d.type === "deleted").length,
      unchanged: diff.filter((d) => d.type === "equal").length,
    }),
    [diff]
  );

  const handleReset = () => {
    setOriginalText("");
    setModifiedText("");
  };

  const handleDownload = () => {
    const content = diff
      .map((line) =>
        line.type === "added"
          ? `+ ${line.modified}`
          : line.type === "deleted"
          ? `- ${line.original}`
          : `  ${line.original}`
      )
      .join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "diff-result.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-(--background) p-6">
       <DiffHeader />
      <div className="max-w-7xl mx-auto bg-(--background) rounded-xl shadow-lg p-6">
       
        <DiffInputs
          originalText={originalText}
          setOriginalText={setOriginalText}
          modifiedText={modifiedText}
          setModifiedText={setModifiedText}
        />

        <DiffOptions
          ignoreWhitespace={ignoreWhitespace}
          setIgnoreWhitespace={setIgnoreWhitespace}
          ignoreCase={ignoreCase}
          setIgnoreCase={setIgnoreCase}
          viewMode={viewMode}
          setViewMode={setViewMode}
          handleReset={handleReset}
          handleDownload={handleDownload}
        />

        <DiffStats stats={stats} />

        {originalText || modifiedText ? (
          viewMode === "split" ? (
            <SplitView diff={diff} />
          ) : (
            <UnifiedView diff={diff} />
          )
        ) : (
          <div className="bg-(--card) border border-blue-200 rounded-lg p-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <div className="text-sm text-(--foreground)">
              <p className="font-semibold mb-1">Get Started</p>
              <p>
                Paste your text to compare differences between original and
                modified content.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiffChecker;
