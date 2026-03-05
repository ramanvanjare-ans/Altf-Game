import React from "react";
import { CheckCircle } from "lucide-react";
import CopyResultField from "./CopyResultField";

const ResultsDisplay = ({ adCopy }) => {
  if (!adCopy) return null;

  return (
    <section className="bg-(--card) p-6 rounded-2xl shadow-xl mb-10 border border-(--border)">
      <h2 className="text-2xl font-bold text-(--foreground) mb-6 flex items-center">
        <CheckCircle size={24} className="text-green-500 mr-2" />
        Generated Ad Copy
      </h2>

      {/* Primary Text */}
      <div className="mb-6">
        <CopyResultField
          title="Primary Text (Ad Body)"
          content={adCopy.primaryText}
        />
      </div>

      {/* Headlines */}
      <h3 className="text-xl font-bold text-(--foreground) mb-4">
        Headlines (3 Options)
      </h3>

      <div className="space-y-4">
        {adCopy.headlines.map((headline, index) => (
          <CopyResultField
            key={index}
            title={`Headline ${index + 1}`}
            content={headline}
            isHeadline={true}
          />
        ))}
      </div>
    </section>
  );
};

export default ResultsDisplay;
