"use-client";
import React, { useState, useCallback } from "react";
import AdGenerationForm from "../components/AdGenerationForm";
import ResultsDisplay from "../components/ResultsDisplay";
import HowItWorks from "../components/HowItWorks";
import { TONE_OPTIONS } from "../utils/constants";
import { fetchAdCopy } from "../utils/api";

export default function FacebookAdCopy() {
  const [productDetails, setProductDetails] = useState("");
  const [selectedTone, setSelectedTone] = useState(TONE_OPTIONS[0].value);
  const [adCopy, setAdCopy] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const generateAdCopy = useCallback(async () => {
    if (!productDetails.trim()) {
      setError("Please enter product details before generating copy.");
      return;
    }

    setIsLoading(true);
    setError("");
    setAdCopy(null);

    try {
      const result = await fetchAdCopy(productDetails, selectedTone);
      setAdCopy(result);
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [productDetails, selectedTone]);

  return (
    <div className="min-h-screen bg-(--background) text-(--foreground) font-inter antialiased py-5 ">
      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto p-4 sm:p-0">
        {/* Page Description */}
        <div className="text-center mb-10">
          <h1 className="heading">Ad Copy Generator</h1>
          <p className="mt-2 text-lg text-(--muted-foreground)">
            Generate high-converting Facebook ad primary text and headlines
            instantly.
          </p>
        </div>

        {/* Ad Generation Section */}
        <AdGenerationForm
          productDetails={productDetails}
          setProductDetails={setProductDetails}
          selectedTone={selectedTone}
          setSelectedTone={setSelectedTone}
          generateAdCopy={generateAdCopy}
          isLoading={isLoading}
          error={error}
        />

        {/* Generated Ad Copy Results */}
        <ResultsDisplay adCopy={adCopy} />

        {/* Informational Sections */}
        <HowItWorks />
      </div>
    </div>
  );
}
