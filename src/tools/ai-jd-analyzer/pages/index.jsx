
"use client";

import React, { useState } from "react";
import { analyzeJobDescription } from "../services/aiService";
import JDInput from "../components/JDInput";
import ScoreCard from "../components/ScoreCard";
import ExtractionResults from "../components/ExtractionResults";
import RewrittenJD from "../components/RewrittenJD";
import SuggestionsPanel from "../components/SuggestionsPanel";




   export default function ToolHome(){
    

    const [jobDescription, setJobDescription] = useState("");
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAnalyze = async (jdText) => {
        setLoading(true);
        setError(null);
        setJobDescription(jdText);

        try {
            const result = await analyzeJobDescription(jdText);
            setAnalysisData(result);
        } catch (err) {
            setError(err.message || "Analysis failed.");
            setAnalysisData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setJobDescription("");
        setAnalysisData(null);
        setError(null);
    };

    return (
       


        <div className=" bg-(--background)">
  <div className="w-full  px-4 py-10">
    {/* MAIN GRID */}
    <div className="gap-6">

      {/* LEFT INPUT CARD */}
      <div className="md:col-span-4 lg:col-span-3">
        <div className="bg-(--background) text-(--foreground) ">
          <JDInput
            onAnalyze={handleAnalyze}
            onReset={handleReset}
            loading={loading}
          />
        </div>
      </div>

      {/* RIGHT ANALYZER SECTION */}
      <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-6 ">

        {/* LOADING CARD */}
        {loading && (
          <div className="flex flex-col items-center justify-center  bg-(--card) border border-dashed border-gray-400 dark:border-gray-600 rounded-2xl p-6">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-300 border-t-black dark:border-t-white"></div>
            <p className="mt-4 text-lg font-semibold text-(--foreground)">
              Analyzing your Job Description...
            </p>
          </div>
        )}

        {/* ERROR CARD */}
        {error && (
          <div className="bg-red-600 text-white rounded-2xl p-5 shadow">
            <h3 className="font-bold text-lg mb-1">Error</h3>
            <p>{error}</p>
          </div>
        )}

        {/* RESULTS */}
        {analysisData && !loading && (
          <>
            {/* SCORE CARD */}
            <div className=" m-12 border border-(--border) rounded-2xl p-5 shadow-sm">
              <ScoreCard scores={analysisData.scores} />
            </div>

            {/* EXTRACTION RESULTS */}
            <div className=" m-12 gap-6">
              <div className="bg-(--background)  border border-(--border) rounded-2xl p-5 shadow-sm">
                <ExtractionResults data={analysisData.extracted} />
              </div>
            </div>

            {/* REWRITTEN JD */}
            <div className="m-12  border border-(--border)  rounded-2xl p-5 shadow-sm">
              <RewrittenJD
                original={jobDescription}
                rewritten={analysisData.rewrittenJD}
              />
            </div>

            {/* SUGGESTIONS */}
            {/* <div className="mr-12 border border-(--border)  rounded-2xl p-5 shadow-sm">
              <SuggestionsPanel suggestions={analysisData.suggestions} />
            </div> */}
          </>
        )}
      </div>
    </div>
  </div>
</div>

    );
};

