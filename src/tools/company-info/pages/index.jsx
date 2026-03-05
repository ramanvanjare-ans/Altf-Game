"use client";

import React, { useState } from "react";
import {
  Building2,
  Search,
  Globe,
  ExternalLink,
  Loader2,
} from "lucide-react";



export default function ToolHome() {
  const [companyName, setCompanyName] = useState("");
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const safeValue = (value) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "string" || typeof value === "number") return value;
    return JSON.stringify(value, null, 2);
  };

  const searchCompany = async () => {
    if (!companyName.trim()) {
      setError("Please enter a company name");
      return;
    }

    setLoading(true);
    setError("");
    setCompanyInfo(null);

    try {
      const query = encodeURIComponent(companyName);
      const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
        `https://api.duckduckgo.com/?q=${query}&format=json&no_html=1&skip_disambig=1`
      )}`;

      const res = await fetch(apiUrl);
      const proxyData = await res.json();
      const data = JSON.parse(proxyData.contents);

      const info = {
        name: data.Heading || companyName,
        description:
          data.AbstractText || data.Abstract || "No description available",
        source: data.AbstractSource || "Unknown",
        url: data.AbstractURL || "",
        relatedTopics: [],
        infobox: null,
      };

      if (Array.isArray(data.RelatedTopics)) {
        info.relatedTopics = data.RelatedTopics.flatMap((item) => {
          if (item.Text) return [item];
          if (item.Topics) return item.Topics;
          return [];
        });
      }

      if (data.Infobox && Array.isArray(data.Infobox.content)) {
        info.infobox = {
          content: data.Infobox.content.map((i) => ({
            label: i.label || "Info",
            value: i.value,
          })),
        };
      }

      setCompanyInfo(info);
    } catch (e) {
      console.error(e);
      setError("Failed to fetch company information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className=" p-6  ">
        <h1 className="heading text-center animat-fade-up pt-5">Company Info Finder</h1>
        <p className="description text-center animate-fade-up pt-2">
          Search any company and get instant details.
        </p>
      </div>

      {/* Search */}
      <div className="border border-(--border) rounded-lg p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name (e.g. Google)"
            className="flex-1 border border-(--border) rounded-md px-4 py-2 "
          />

          <button
            onClick={searchCompany}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-2 rounded-md bg-(--primary) text-white "
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="border border-red-300 bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}

      {/* Result */}
      {companyInfo && (
        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <h2 className="text-2xl font-bold">{companyInfo.name}</h2>
            <p className="text-(--foreground)  mt-2">
              {companyInfo.description}
            </p>

            <p className="flex items-center gap-2 text-sm mt-4">
              <Globe className="w-4 h-4" />
              Source: {companyInfo.source}
            </p>

            {companyInfo.url && (
              <a
                href={companyInfo.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-(--primary) hover:underline"
              >
                Learn More <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Infobox */}
          {companyInfo.infobox?.content?.length > 0 && (
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                Company Details
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                {companyInfo.infobox.content.map((item, i) => (
                  <div key={i} className="bg-(--card) -4 rounded text-center">
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-sm text-(--muted-foreground)">
                      {safeValue(item.value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && !companyInfo && !error && (
        <div className="border border-(--border) rounded-lg p-10 text-center">
          <Building2 className="w-10 h-10 mx-auto mb-3 text-(--muted-foreground)" />
          <p className="text-(--foreground)">
            Enter a company name to search
          </p>
        </div>
      )}

    
    </div>
  );
};


