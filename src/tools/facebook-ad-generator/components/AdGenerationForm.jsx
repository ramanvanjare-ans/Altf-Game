import React, { useMemo } from "react";
import { Sparkles, Loader } from "lucide-react";
import ToneSelector from "./ToneSelector";
import { TONE_OPTIONS } from "../utils/constants";

const AdGenerationForm = ({
  productDetails,
  setProductDetails,
  selectedTone,
  setSelectedTone,
  generateAdCopy,
  isLoading,
  error,
}) => {
  const selectedToneObject = useMemo(
    () => TONE_OPTIONS.find((t) => t.value === selectedTone) || TONE_OPTIONS[0],
    [selectedTone],
  );

  return (
    <section className="bg-(--card) p-6 rounded-2xl shadow-xl mb-10 border border-(--border)">
      {/* PRODUCT DETAILS */}
      <h2 className="text-2xl font-bold text-(--card-foreground) mb-4 border-b border-(--border) pb-2">
        1. Product Details
      </h2>

      <textarea
        value={productDetails}
        onChange={(e) => setProductDetails(e.target.value)}
        rows="5"
        placeholder="e.g., A lightweight, noise-cancelling wireless headphone with 40-hour battery life..."
        className={`w-full p-4 border border-(--border) rounded-lg 
                   bg-(--background) text-(--card--foreground)
                   focus:ring-2 focus:ring-(--primary) focus:border-(--primary)
                   transition duration-150`}
        disabled={isLoading}
      />

      {/* TONE SELECTOR */}
      <h2 className="text-2xl font-bold text-((--card-foreground) mt-6 mb-4 border-b border-(--border) pb-2">
        2. Select Tone
      </h2>

      <ToneSelector
        selectedTone={selectedTone}
        setSelectedTone={setSelectedTone}
        isLoading={isLoading}
      />

      {/* GENERATE BUTTON */}
      <div className="mt-8">
        <button
          onClick={generateAdCopy}
          disabled={isLoading || !productDetails.trim()}
          className={`w-full py-3 px-4 rounded-xl text-lg font-bold flex items-center justify-center
                      transition-all duration-300 shadow-lg cursor-pointer
                      ${
                        isLoading || !productDetails.trim()
                          ? "bg(--muted) text-(--muted-foreground) cursor-not-allowed"
                          : `${selectedToneObject.color} text-(--primary-foreground)
                             hover:shadow-xl hover:scale-[1.01] active:scale-100`
                      }`}
        >
          {isLoading ? (
            <>
              <Loader size={20} className="animate-spin mr-3" />
              Generating Copy...
            </>
          ) : (
            <>
              <Sparkles size={20} className="mr-2" />
              Generate Ad Copy
            </>
          )}
        </button>
      </div>

      {/* ERROR MESSAGE (Theme Safe) */}
      {error && (
        <div className="mt-4 p-3 rounded-lg border-l-4 bg-(--muted) text-(--foreground) border-red-500">
          <p className="font-medium">{error}</p>
        </div>
      )}
    </section>
  );
};

export default AdGenerationForm;
