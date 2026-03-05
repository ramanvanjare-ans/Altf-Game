"use client";

import { useState } from "react";

import Header from "../components/Header";
import ImageUpload from "../components/ImageUpload";
import PlantResults from "../components/PlantResults";
import Features from "../components/FeaturesSection";
// import FAQ from "./components/FAQ";

export default function PlantScanner() {
  const [loading, setLoading] = useState(false);
  const [plantData, setPlantData] = useState(null);
  const [error, setError] = useState(null);

  const handleImageUpload = async (imageFile) => {
    setLoading(true);
    setError(null);
    setPlantData(null);

    try {
      // Convert image to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      // Next.js env variable (IMPORTANT)
      //   const apiKey = process.env.NEXT_PUBLIC_PLANT_ID_API_KEY;
      const apiKey = "RWcEEQ1ykUZmWSHxekdfw5rGJQm2SuVDfbrodpDUUL2cf6WTny";

      if (!apiKey) {
        throw new Error(
          "API key not configured. Please add NEXT_PUBLIC_PLANT_ID_API_KEY to your .env.local file.",
        );
      }

      const apiUrl = new URL("https://api.plant.id/v3/identification");
      apiUrl.searchParams.append(
        "details",
        "common_names,url,description,taxonomy,rank,gbif_id,inaturalist_id,image,synonyms,edible_parts,watering,propagation_methods",
      );

      const response = await fetch(apiUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": apiKey,
        },
        body: JSON.stringify({
          images: [base64],
          similar_images: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            "Failed to identify plant. Please check your API key.",
        );
      }

      const data = await response.json();

      if (data.result?.is_plant?.binary) {
        const suggestions = data.result.classification?.suggestions || [];

        if (suggestions.length > 0) {
          setPlantData(suggestions.slice(0, 3));
        } else {
          setError(
            "No plant identified. Try a clearer image with the plant clearly visible.",
          );
        }
      } else {
        setError(
          "The image does not appear to contain a plant. Please upload a clear photo of a plant.",
        );
      }
    } catch (err) {
      setError(err.message || "An error occurred while identifying the plant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-(--background) text-(--foreground)">
      {/* Hero */}
      <section id="home">
        <Header />
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 md:py-10 space-y-6">
        <ImageUpload onUpload={handleImageUpload} loading={loading} />

        {/* Error Alert */}
        {error && (
          <div className="relative p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-600">
            <button
              onClick={() => setError(null)}
              className="absolute top-2 right-3 text-sm opacity-70 hover:opacity-100"
            >
              ✕
            </button>
            {error}
          </div>
        )}

        {/* Results */}
        {plantData && <PlantResults plants={plantData} />}
      </main>

      {/* Extra Sections */}
      <Features />
      {/* <FAQ /> */}
    </div>
  );
}
