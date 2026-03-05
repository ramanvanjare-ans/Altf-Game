
"use client"


import React, { useState, useEffect } from "react";

const ResultView = ({ value, error }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    let t;
    if (snackbar.open) {
      t = setTimeout(() => setSnackbar((s) => ({ ...s, open: false })), 2000);
    }
    return () => clearTimeout(t);
  }, [snackbar.open]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setSnackbar({
        open: true,
        message: "Copied to clipboard!",
        severity: "success",
      });
    } catch {
      setSnackbar({ open: true, message: "Failed to copy", severity: "error" });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "encoded-decoded-result.txt";
    a.click();
    URL.revokeObjectURL(url);
    setSnackbar({
      open: true,
      message: "Downloaded successfully!",
      severity: "success",
    });
  };

  return (
    <div className="w-full">
      <div className="text-sm font-medium mb-1">Result</div>

      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
        <textarea
          readOnly
          value={value}
          placeholder="Result will appear here..."
          className={`w-full min-h-25 p-3 rounded-md text-sm bg-(--card)  border border-(--border) ${error ? "border-red-500" : "border-(--border) "} text-(--foreground)  focus:outline-none`}
        />

        <div className="flex flex-row sm:flex-col gap-2 justify-center items-center">
          <button
            onClick={handleCopy}
            title="Copy to clipboard"
            className="p-2 rounded-md bg-(--card) border border-(--border)  "
          >
            <svg
              className="h-5 w-5 text-gray-600 dark:text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M16 3h5v5M21 3l-8 8"
              />
            </svg>
          </button>

          <button
            onClick={handleDownload}
            title="Download as TXT"
            className="p-2 rounded-md bg-(--card) border border-(--border) "
          >
            <svg
              className="h-5 w-5 text-gray-600 dark:text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v14m7-7H5"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-2 text-xs text-right text-(--foreground)">
        {error ? "Error occurred" : `${value.length} characters`}
      </div>

      {snackbar.open && (
        <div className="fixed left-1/2 bottom-6 transform -translate-x-1/2 z-50">
          <div
            className={`px-4 py-2 rounded-md text-sm text-(--foreground) ${snackbar.severity === "success" ? "bg-green-600" : "bg-red-600"}`}
          >
            {snackbar.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultView;
