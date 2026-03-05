
"use client";

import React, { useState, useEffect } from "react";
import {
 
  Sparkles,
  Loader2,
  
} from "lucide-react";
import { SearchBar } from "../components/SearchBar";
import { Toast } from "../components/Toast";
import { generateCaptionsAPI } from "../utils/api";
import { CaptionCard } from "../components/CaptionCard";
import { DUMMY_CAPTIONS } from "../utils/dummyCaption";

export default function ToolHome() {
  const [productName, setProductName] = useState("");
  const [captions, setCaptions] = useState(DUMMY_CAPTIONS);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [toast, setToast] = useState(null);
  const [isDummy, setIsDummy] = useState(true);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
  };

  const generateCaptions = async () => {
    if (!productName.trim()) {
      showToast("Please enter a product or ad name!", "error");
      return;
    }

    setLoading(true);
    setCaptions([]);

    try {
      const captionList = await generateCaptionsAPI(productName);
      setCaptions(captionList);
      setIsDummy(false);
      showToast("Captions generated successfully!", "success");
    } catch (error) {
      console.error("Error generating captions:", error);
      showToast("Error generating captions. Please try again.", "error");
      setCaptions(DUMMY_CAPTIONS);
      setIsDummy(true);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      showToast("Caption copied to clipboard!", "success");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      showToast("Failed to copy. Please try again.", "error");
    }
  };

  const handleRefresh = () => {
    setProductName("");
    setCaptions(DUMMY_CAPTIONS);
    setIsDummy(true);
    setCopiedIndex(null);
    showToast("Refreshed to default state!", "success");
  };

  return (
    <div className="min-h-screen bg-(--background) p-4 sm:p-6 lg:p-12">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            
            <h1 className="heading text-center pt-5 animate-fade-up">
              Ad Caption Generator
            </h1>
          </div>
          <p className="description text-center animate-fade-up">
            Transform your product into compelling stories with AI-powered
            captions that convert
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-10">
          <SearchBar
            value={productName}
            onChange={setProductName}
            onSearch={generateCaptions}
            loading={loading}
            onRefresh={handleRefresh}
          />
        </div>

        {/* Status Badge */}
        {isDummy && (
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Showing  captions - Try searching for your product!
            </span>
          </div>
        )}

        {/* Captions Grid */}
        {captions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {captions.map((caption, index) => (
              <CaptionCard
                key={index}
                caption={caption}
                index={index}
                onCopy={copyToClipboard}
                isCopied={copiedIndex === index}
              />
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && captions.length === 0 && (
          <div className="text-center py-20">
            <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">
              Crafting amazing captions for you...
            </p>
          </div>
        )}
      </div>

      {/* <style jsx>{`
@keyframes slideIn {
from {
transform: translateX(100%);
opacity: 0;
}
to {
transform: translateX(0);
opacity: 1;
}
}
.animate-slideIn {
animation: slideIn 0.3s ease-out;
}
`}</style> */}
    </div>
  );
}
