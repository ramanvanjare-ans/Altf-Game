"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  TrendingUp,
  Calendar,
  MapPin,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const MainComponent = () => {
  const [searchCity, setSearchCity] = useState("");
  const [searchCrop, setSearchCrop] = useState("");
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const states = [
    "Delhi",
    "Maharashtra",
    "Punjab",
    "Haryana",
    "Uttar Pradesh",
    "Karnataka",
    "Tamil Nadu",
    "Gujarat",
    "Rajasthan",
    "Madhya Pradesh",
    "Bihar",
  ];

  const popularCrops = [
    "Wheat",
    "Rice",
    "Potato",
    "Onion",
    "Tomato",
    "Cotton",
    "Sugarcane",
    "Maize",
  ];
  //Real API endpoint for data.gov.in
  const API_URL =
    "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";
  // Public API key
  const API_KEY = "579b464db66ec23bdd000001a96749eb8ea44e9e569839eccd6d13a0";

  // Fetch real market data from data.gov.in API
  const fetchRealMarketData = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        "api-key": API_KEY,
        format: "json",
        limit: "100",
        offset: "0",
      });

      if (selectedState) {
        params.append("filters[state]", selectedState);
      }
      if (searchCrop) {
        params.append("filters[commodity]", searchCrop);
      }

      const response = await fetch(`${API_URL}?${params}`);

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();

      if (data.records && data.records.length > 0) {
        setMarketData(data.records);
        setLastUpdated(new Date());
        setError("");
      } else {
        setError(
          "No data found for the selected filters. Try different search criteria.",
        );
        setMarketData([]);
      }
    } catch (err) {
      console.error("API Error:", err);
      setError(
        `Unable to fetch real-time data: ${err.message}. Showing sample data.`,
      );
      generateSampleData();
    } finally {
      setLoading(false);
    }
  };

  const generateSampleData = () => {
    const sampleCrops = [
      "Wheat",
      "Rice",
      "Potato",
      "Onion",
      "Tomato",
      "Cotton",
      "Bajra",
      "Maize",
    ];
    const sampleMarkets = ["APMC Market", "Mandi Samiti", "Krishi Upaj Mandi"];
    const sampleStates = ["Delhi", "Maharashtra", "Punjab", "Haryana"];

    const sample = [];
    for (let i = 0; i < 12; i++) {
      const minPrice = Math.floor(Math.random() * 1000) + 500;
      const maxPrice = minPrice + Math.floor(Math.random() * 500) + 200;
      const modalPrice = Math.floor((minPrice + maxPrice) / 2);

      sample.push({
        state: sampleStates[i % sampleStates.length],
        district: "Sample District",
        market: sampleMarkets[i % sampleMarkets.length],
        commodity: sampleCrops[i % sampleCrops.length],
        variety: "Local",
        min_price: minPrice.toString(),
        max_price: maxPrice.toString(),
        modal_price: modalPrice.toString(),
        arrival_date: new Date().toISOString().split("T")[0],
      });
    }
    setMarketData(sample);
    setLastUpdated(new Date());
  };

  useEffect(() => {
    fetchRealMarketData();
  }, [selectedState]);

  const filteredData = marketData.filter((item) => {
    const cityMatch =
      !searchCity ||
      item.market?.toLowerCase().includes(searchCity.toLowerCase()) ||
      item.district?.toLowerCase().includes(searchCity.toLowerCase()) ||
      item.state?.toLowerCase().includes(searchCity.toLowerCase());

    const cropMatch =
      !searchCrop ||
      item.commodity?.toLowerCase().includes(searchCrop.toLowerCase());

    return cityMatch && cropMatch;
  });

  return (
    <div className="min-h-screen bg-(--background) text-(--foreground)">
      {/* Header */}
      <div className="container mx-auto px-4 py-10">
        {/* Title Section */}
        <header className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-(--primary)" />
            <h2 className="heading">Mandi Bhav</h2>
          </div>

          <p className="description">
            Daily Crop & Vegetable Market Rates — Live from AGMARKNET
          </p>
        </header>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
          {/* Refresh Button */}
          <button
            onClick={fetchRealMarketData}
            disabled={loading}
            className="
        flex items-center gap-2
        px-6 py-2.5
        rounded-xl
        bg-(--primary)
        text-(--primary-foreground)
        font-semibold
        transition
        hover:opacity-90
        disabled:opacity-50
      "
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>

          {/* Last Updated */}
          {lastUpdated && (
            <p className="text-sm text-(--muted-foreground)">
              Last updated:{" "}
              <span className="font-medium text-(--foreground)">
                {lastUpdated.toLocaleString("en-IN")}
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="bg-(--card) border border-(--border) rounded-2xl p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-(--background) border border-(--border) focus:outline-none focus:ring-2 focus:ring-(--primary)"
              >
                <option value="">All States</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                City / Market
              </label>
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Search location"
                className="w-full px-4 py-2 rounded-lg bg-(--background) border border-(--border) focus:outline-none focus:ring-2 focus:ring-(--primary)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Crop / Commodity
              </label>
              <input
                type="text"
                value={searchCrop}
                onChange={(e) => setSearchCrop(e.target.value)}
                placeholder="Search commodity"
                className="w-full px-4 py-2 rounded-lg bg-(--background) border border-(--border) focus:outline-none focus:ring-2 focus:ring-(--primary)"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchRealMarketData}
                disabled={loading}
                className="w-full bg-(--primary) text-(--primary-foreground) px-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                Search
              </button>
            </div>
          </div>

          {/* Quick Crops */}
          <div className="mt-4">
            <p className="text-sm text-(--muted-foreground) mb-2">
              Popular Crops:
            </p>
            <div className="flex flex-wrap gap-2">
              {popularCrops.map((crop) => (
                <button
                  key={crop}
                  onClick={() => {
                    setSearchCrop(crop);
                    fetchRealMarketData();
                  }}
                  className="px-3 py-1 rounded-full text-sm border border-(--border) bg-(--muted) hover:bg-(--primary) hover:text-(--primary-foreground) transition"
                >
                  {crop}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-(--card) border border-(--border) rounded-xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-(--primary)/10">
              <AlertCircle className="w-5 h-5 text-(--primary)" />
            </div>

            <div className="text-sm">
              <p className="font-semibold text-(--foreground)">
                Real-Time Data from AGMARKNET Portal
              </p>

              <p className="mt-1 text-(--muted-foreground)">
                This app fetches live market prices from India&apos;s official
                agricultural marketing portal (data.gov.in). Data is updated
                daily by market officials across the country.
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="border border-(--border) bg-(--muted) rounded-lg p-4 mb-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-(--primary)" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-(--primary)" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item, index) => {
              const minPrice = parseFloat(item.min_price) || 0;
              const maxPrice = parseFloat(item.max_price) || 0;
              const modalPrice = parseFloat(item.modal_price) || 0;

              return (
                <div
                  key={index}
                  className="bg-(--card) border  border-l-4 border-blue-500 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-bold mb-2">{item.commodity}</h3>

                  <div className="flex items-center gap-2 text-sm text-(--muted-foreground) mb-4">
                    <MapPin className="w-4 h-4" />
                    {item.market}, {item.state}
                  </div>

                  <div className="bg-(--muted) rounded-lg p-4 mb-4">
                    <div className="text-sm text-(--muted-foreground)">
                      Modal Price
                    </div>
                    <div className="text-2xl font-bold text-(--primary)">
                      ₹{modalPrice.toLocaleString("en-IN")}
                    </div>
                  </div>

                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Min:</span>
                      <span>₹{minPrice.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max:</span>
                      <span>₹{maxPrice.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {item.arrival_date && (
                    <div className="flex items-center gap-2 text-xs text-(--muted-foreground) mt-4 border-t border-(--border) pt-3">
                      <Calendar className="w-4 h-4" />
                      {new Date(item.arrival_date).toLocaleDateString("en-IN")}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredData.length === 0 && (
          <div className="text-center py-20 text-(--muted-foreground)">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-40" />
            <p className="text-lg">No market data found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainComponent;
