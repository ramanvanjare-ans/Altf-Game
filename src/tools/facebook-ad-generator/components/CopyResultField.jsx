import React, { useState } from "react";
import { Copy, CheckCircle } from "lucide-react";
import { copyToClipboard } from "../utils/clipboard";

const CopyResultField = ({ title, content, isHeadline = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`
        p-4 rounded-xl border shadow-sm
        ${
          isHeadline
            ? "bg-(--muted) border-(--border)"
            : "bg-(--background) border-(--border) shadow-lg"
        }
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3
          className={`
            text-sm font-semibold
            ${isHeadline ? "text-(--muted-foreground)" : "text-(--primary)"}
          `}
        >
          {title}
        </h3>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          aria-label={`Copy ${title}`}
          className={`
            text-sm flex items-center px-2 py-1 rounded-full transition-colors
            ${
              copied
                ? "bg-green-200 text-green-800"
                : "text-(--muted-foreground) hover:bg-(--muted)"
            }
          `}
        >
          {copied ? (
            <>
              <CheckCircle size={14} className="mr-1" /> Copied!
            </>
          ) : (
            <>
              <Copy size={14} className="mr-1" /> Copy
            </>
          )}
        </button>
      </div>

      {/* Content */}
      <p
        className={`
          font-medium leading-relaxed
          ${isHeadline ? "text-(--foreground)" : "text-(--muted-foreground)"}
        `}
      >
        {content}
      </p>
    </div>
  );
};

export default CopyResultField;
