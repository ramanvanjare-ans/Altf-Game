

"use client"

import React from "react";

const InputArea = ({ value, onChange, onClear }) => {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange({ target: { value: text } });
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium">Input Text</label>

      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        <textarea
          className="flex-1  p-3 border border-(--border)  rounded-md bg-(--card)  text-sm text-(--foreground) "
          placeholder="Enter text here..."
          value={value}
          onChange={onChange}
        />

        <div className="flex flex-row sm:flex-col gap-2 mt-1 sm:mt-0 justify-center items-center">
          <button
            type="button"
            onClick={handlePaste}
            title="Paste from clipboard"
            className="p-2 rounded-md bg-(--primary)  border border-(--border) "
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
                d="M8 16h8M8 12h8m-6 8h6a2 2 0 002-2V8a2 2 0 00-2-2h-6l-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h2z"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={onClear}
            title="Clear text"
            className="p-2 rounded-md bg-(--card) border border-(--border)   text-red-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="text-xs text-(--muted-foreground) text-right">
        {value.length} characters
      </div>
    </div>
  );
};

export default InputArea;
