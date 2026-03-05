import React, { useState, useCallback } from "react";
import { Search, Globe, CheckCircle, XCircle, Loader2 } from "lucide-react";

import { fetchWordSuggestions } from "../utils/wordGeneratorApi";


const getStatusColor = () => {
  
  return {
    text: "text-indigo-600",
    bg: "bg-indigo-100",
    icon: Globe,
    label: "Creative Suggestion",
  };
};
// -------------------------------------------------------------------

const DomainGeneratorPage = () => {
  const [keyword, setKeyword] = useState("tech");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateDomains = useCallback(
    async (e) => {
      e.preventDefault();
      if (!keyword.trim()) {
        setError("Please enter a keyword to generate domains.");
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      setSuggestions([]);

      try {
       
        const results = await fetchWordSuggestions(keyword.trim());
        setSuggestions(results);

        if (results.length === 0) {
          setError(
            `Could not generate suggestions for "${keyword}". Try a common noun.`
          );
        }
      } catch (err) {
        setError(err.message || "Failed to fetch word suggestions.");
      } finally {
        setIsLoading(false);
      }
    },
    [keyword]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        
        <h1 className="heading text-center animate-fade-up mb-4">
          Domain  Generator
        </h1>
        <p className="description text-center animate-fade-up">
          Generates creative, brandable domain names  .
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-(--card) rounded-2xl shadow-xl p-6 sm:p-8 border border-(--border) mb-8">
        <form onSubmit={generateDomains} className="space-y-4">
          <label
            htmlFor="keyword"
            className="block text-sm font-semibold text-(--foreground)"
          >
            Enter Primary Keyword (e.g., smart, flow, cube)
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="keyword"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g., software, cloud, finance"
              className="grow p-4 border-2 border-(--border) rounded-xl  transition"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-4 text-foreground font-semibold rounded-xl shadow-lg flex items-center justify-center transition-all whitespace-nowrap ${
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Generate Names
                </>
              )}
            </button>
          </div>
        </form>

        {/* Results */}
        <div className="mt-8">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
              <p className="font-semibold">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {suggestions.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-foreground mb-4 mt-6">
                Creative Domain Ideas ({suggestions.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestions.map((suggestion, index) => {
                  const { text, bg, icon: Icon, label } = getStatusColor();
                  const domainName = suggestion.domain;

                  return (
                    <div
                      key={index}
                      className={`p-5 rounded-xl border-2 border-(--border)  flex flex-col space-y-2 transition-all hover:shadow-lg`}
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-xl font-bold break-all text-(--foreground)">
                          {domainName}
                        </p>
                        <div
                          className={`p-1 rounded-full text-(--foreground) flex items-center space-x-1 text-sm font-medium`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                        </div>
                      </div>
                      <div className="text-sm flex justify-between items-center pt-1  ">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-semibold text-(--muted-foreground)">{label}</span>
                      </div>

                      
                      {/* <a
                        href={`https://domains.google/search?q=${domainName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium mt-1 transition"
                      >
                        Check Real Availability &rarr;
                      </a> */}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {!isLoading && !error && suggestions.length === 0 && (
            <div className="text-center py-12">
              <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Enter a keyword above to find your perfect domain name
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Technical Explanation
      <div className="mt-12 bg-indigo-50 rounded-xl p-6 border border-indigo-200">
        <h2 className="text-xl font-bold text-foreground mb-2">
          Important Note on Availability
        </h2>
        <p className="text-foreground text-sm">
          This tool uses a **free, unauthenticated public API** (dictionary
          service) to find synonyms and related words for creative suggestions.
          Since we are not using a paid Domain Checking API, the status shown is
          a **creative label** and does **not** reflect real-time availability.
          Please click the link below each suggestion to verify the domain's
          status.
        </p>
      </div> */}
    </div>
  );
};

export default DomainGeneratorPage;
