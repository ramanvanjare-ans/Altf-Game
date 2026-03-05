"use client";
import React from "react";
import { Loader2, Search, RefreshCw } from "lucide-react";

export const SearchBar = ({
  value,
  onChange,
  onSearch,
  loading,
  onRefresh,
}) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="bg-(--card) rounded-2xl shadow-2xl p-4 sm:p-6 border border-(--border) w-full">
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        
        {/* Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-(--foreground)" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter product or ad name..."
            className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg border border-(--border) rounded-xl focus:outline-none focus:ring-2 focus:ring-(--primary) transition-all"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={onSearch}
          disabled={loading}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-(--primary) text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <span>Generate</span>
          )}
        </button>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          title="Refresh"
          className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-red-500 border border-red-500 text-white rounded-xl shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
