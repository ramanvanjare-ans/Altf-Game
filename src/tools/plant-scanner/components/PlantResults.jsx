"use client";

import { CheckCircle, Leaf, ExternalLink } from "lucide-react";

export default function PlantResults({ plants }) {
  return (
    <div className="w-full">
      {/* Heading */}
      <h2
        className="
          mb-8 font-extrabold
          text-2xl sm:text-3xl md:text-4xl
          leading-tight tracking-tight
          text-(--primary)
        "
      >
        Identification Results
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plants.map((plant, index) => {
          const probability = Math.round(plant.probability * 100);
          const details = plant.details || {};
          const taxonomy = details.taxonomy || {};
          const commonNames = details.common_names || [];

          const isHighConfidence = probability > 70;

          return (
            <div
              key={index}
              className="
                bg-(--card)
                border border-(--border)
                rounded-2xl
                shadow-sm
                hover:shadow-lg
                transition
                p-6
                flex flex-col
              "
            >
              {/* Top Row */}
              <div className="flex items-center justify-between mb-4">
                <Leaf className="w-7 h-7 text-(--primary)" />

                <div
                  className={`
                    flex items-center gap-1
                    text-xs font-semibold px-3 py-1 rounded-full
                    ${
                      isHighConfidence
                        ? "bg-green-500/10 text-green-600"
                        : "bg-yellow-500/10 text-yellow-600"
                    }
                  `}
                >
                  <CheckCircle className="w-3 h-3" />
                  {probability}% Match
                </div>
              </div>

              {/* Plant Name */}
              <h3 className="text-lg font-semibold text-(--foreground) mb-1">
                {plant.name}
              </h3>

              {/* Common Name */}
              {commonNames.length > 0 && (
                <p className="text-sm text-(--muted-foreground) mb-3">
                  Common Name: {commonNames[0]}
                </p>
              )}

              {/* Confidence Bar */}
              <div className="mb-4">
                <p className="text-xs text-(--muted-foreground) mb-1">
                  Confidence Level
                </p>
                <div className="w-full h-2 bg-(--muted) rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isHighConfidence ? "bg-green-500" : "bg-yellow-500"
                    }`}
                    style={{ width: `${probability}%` }}
                  />
                </div>
              </div>

              <div className="border-t border-(--border) my-4" />

              {/* Taxonomy Info */}
              <div className="space-y-1 text-sm text-(--foreground)">
                {taxonomy.family && (
                  <p>
                    <span className="font-semibold">Family:</span>{" "}
                    {taxonomy.family}
                  </p>
                )}
                {taxonomy.genus && (
                  <p>
                    <span className="font-semibold">Genus:</span>{" "}
                    {taxonomy.genus}
                  </p>
                )}
                {taxonomy.order && (
                  <p>
                    <span className="font-semibold">Order:</span>{" "}
                    {taxonomy.order}
                  </p>
                )}
              </div>

              {/* Description */}
              {details.description?.value && (
                <p className="text-sm text-(--muted-foreground) mt-4">
                  {details.description.value.substring(0, 150)}
                  {details.description.value.length > 150 ? "..." : ""}
                </p>
              )}

              {/* Learn More */}
              {details.url && (
                <a
                  href={details.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    mt-4 inline-flex items-center gap-1
                    text-sm font-medium
                    text-(--primary)
                    hover:underline
                  "
                >
                  Learn More
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
