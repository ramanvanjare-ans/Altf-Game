"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, ChevronDown, Filter, Navigation, Calendar } from "lucide-react";
import Image from "next/image";

/* ---------------- Haversine Distance ---------------- */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (val) => (val * Math.PI) / 180;
  const R = 6371; // KM

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/* ---------------- Deal Timer ---------------- */
const DealTimer = ({ durationMinutes }) => {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft <= 180;

  return (
    <motion.div
      animate={isUrgent ? { scale: [1, 1.08, 1] } : {}}
      transition={isUrgent ? { duration: 0.6, repeat: Infinity, ease: "easeInOut" } : {}}
      className="flex items-center gap-2 text-sm"
    >
      <Clock className={`w-4 h-4 ${isUrgent ? "text-red-500" : "text-(--muted-foreground)"}`} />
      <span className={`font-mono font-bold ${isUrgent ? "text-red-600" : "text-(--foreground)"}`}>
        {String(hours).padStart(2, "0")}:
        {String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </span>
    </motion.div>
  );
};

/* ---------------- Format Date ---------------- */
const formatSaleDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/* ---------------- Analytics Helper ---------------- */
const trackEvent = (eventName, data = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, data);
  }
  console.log(`[Analytics] ${eventName}:`, data);
};

/* ---------------- Flash Deals ---------------- */
export default function FlashDeals({ deals }) {
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [mode, setMode] = useState("nearby");
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [locationError, setLocationError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Track when nearby section is opened
  useEffect(() => {
    if (mode === "nearby") {
      trackEvent("nearby_section_opened");
    }
  }, [mode]);

  const cities = ["All Cities", ...new Set(deals.map((d) => d.location))];
  
  const getCategoriesForCity = () => {
    let filtered = selectedCity === "All Cities" ? deals : deals.filter((d) => d.location === selectedCity);
    return ["All Categories", ...new Set(filtered.map((d) => d.category))];
  };

  const categories = useMemo(() => getCategoriesForCity(), [deals, selectedCity]);

  const simulateLocation = () => {
    setUserLocation({ latitude: 28.4595, longitude: 77.0266 });
    setLocationStatus("success");
    setLocationError(null);
    setRetryCount(0);
    trackEvent("demo_location_used");
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setLocationError("Geolocation is not supported by your browser");
      trackEvent("location_error", { reason: "not_supported" });
      return;
    }

    setLocationStatus("loading");
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Store ONLY coordinates - no API call to external services
        setUserLocation({ latitude, longitude });
        setLocationStatus("success");
        setRetryCount(0);
        
        trackEvent("location_permission_granted");
        trackEvent("nearby_sales_loaded", { count: filteredDeals.length });
      },
      (error) => {
        setLocationError(error.message);

        if (error.code === 1) {
          setLocationStatus("denied");
          trackEvent("location_permission_denied");
        } else if (error.code === 2) {
          setLocationStatus("unavailable");
          trackEvent("location_unavailable");
        } else if (error.code === 3) {
          setLocationStatus("timeout");
          trackEvent("location_timeout");
        } else {
          setLocationStatus("error");
          trackEvent("location_error", { code: error.code });
        }
      },
      {
        maximumAge: 0,
        timeout: 7000,
        enableHighAccuracy: true,
      }
    );
  };

  const filteredDeals = useMemo(() => {
    if (mode === "city") {
      let filtered = selectedCity === "All Cities" ? deals : deals.filter((d) => d.location === selectedCity);
      if (selectedCategory !== "All Categories") filtered = filtered.filter((d) => d.category === selectedCategory);
      return filtered;
    }
    
    if (mode === "nearby" && userLocation) {
      const nearby = deals
        .map((deal) => ({ ...deal, distance: calculateDistance(
          userLocation.latitude, userLocation.longitude, deal.latitude, deal.longitude
        ) }))
        .filter((deal) => deal.distance <= 10)
        .sort((a, b) => a.distance - b.distance || new Date(b.saleDate) - new Date(a.saleDate));
      
      if (nearby.length === 0) {
        trackEvent("no_nearby_sales_found");
      }
      
      return nearby;
    }
    return [];
  }, [mode, selectedCity, selectedCategory, deals, userLocation]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isCityDropdownOpen && !e.target.closest(".city-dropdown")) setIsCityDropdownOpen(false);
      if (isCategoryDropdownOpen && !e.target.closest(".category-dropdown")) setIsCategoryDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCityDropdownOpen, isCategoryDropdownOpen]);

  useEffect(() => {
    setSelectedCategory("All Categories");
  }, [selectedCity]);

  // Auto-request location when component mounts
useEffect(() => {
  requestLocation();
}, []);

  return (
    <section className="pt-20 bg-(--background) min-h-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-(--foreground)">
              {mode === "city" ? `Flash Deals ${selectedCity !== "All Cities" ? `In ${selectedCity}` : ""}` : "Nearby Latest Sales"}
            </h2>
            <p className="text-(--muted-foreground) mt-2">
              {mode === "city" ? "Hurry! Limited time offers" : "Sales within 10 km of your location"}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-3">
            <button
              onClick={() => { setMode("city"); setLocationStatus("idle"); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
                mode === "city" 
                  ? "bg-red-500 text-white shadow-lg" 
                  : "bg-(--card) border border-(--border) text-(--foreground) hover:bg-(--muted)"
              }`}
              aria-label="Switch to city sales view"
            >
              City Sales
            </button>
            <button
              onClick={() => { setMode("nearby"); setUserLocation(null); setLocationStatus("idle"); setRetryCount(0); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
                mode === "nearby" 
                  ? "bg-red-500 text-white shadow-lg" 
                  : "bg-(--card) border border-(--border) text-(--foreground) hover:bg-(--muted)"
              }`}
              aria-label="Switch to nearby sales view"
            >
              Nearby Sales
            </button>
          </div>
        </div>

        {/* City Mode Filters */}
        {mode === "city" && (
          <div className="flex flex-wrap gap-4 mb-8">
            {/* City Dropdown */}
            <div className="relative city-dropdown">
              <button
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-(--card) border border-(--border) rounded-xl text-sm font-medium text-(--foreground)"
                aria-expanded={isCityDropdownOpen}
                aria-label="Select city"
              >
                <MapPin className="w-4 h-4 text-red-500" />
                {selectedCity}
                <ChevronDown className={`w-4 h-4 transition-transform ${isCityDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isCityDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 w-64 bg-(--card) border border-(--border) rounded-xl shadow-2xl z-50 overflow-hidden"
                    role="listbox"
                  >
                    {cities.map((city) => (
                      <button
                        key={city}
                        onClick={() => { setSelectedCity(city); setIsCityDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-sm transition cursor-pointer hover:bg-gray-200 ${
                          selectedCity === city 
                            ? "bg-red-500 text-white font-semibold" 
                            : "text-(--foreground) hover:bg-(--muted)"
                        }`}
                        role="option"
                        aria-selected={selectedCity === city}
                      > 
                        {city}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Category Dropdown */}
            <div className="relative category-dropdown">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-(--card) border border-(--border) rounded-xl text-sm font-medium text-(--foreground)"
                aria-expanded={isCategoryDropdownOpen}
                aria-label="Select category"
              >
                <Filter className="w-4 h-4 text-red-500" />
                {selectedCategory}
                <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isCategoryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 w-64 bg-(--card) border border-(--border) rounded-xl shadow-2xl z-50 overflow-hidden"
                    role="listbox"
                  >
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => { setSelectedCategory(category); setIsCategoryDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-sm transition cursor-pointer bg-gray-200 ${
                          selectedCategory === category 
                            ? "bg-red-500 text-white font-semibold" 
                            : "text-(--foreground) hover:bg-(--muted)"
                        }`}
                        role="option"
                        aria-selected={selectedCategory === category}
                      >
                        {category}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Results Count */}
            <div className="flex items-center px-4 py-2.5 bg-(--card) border border-(--border) rounded-xl">
              <span className="text-sm text-(--muted-foreground)">
                {filteredDeals.length} {filteredDeals.length === 1 ? 'deal' : 'deals'} found
              </span>
            </div>
          </div>
        )}

        {/* Nearby Mode States */}
        {mode === "nearby" && (
          <div className="mb-8">
            {locationStatus === "idle" && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-(--card) border border-(--border) rounded-xl">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-(--foreground) mb-1">Find Deals Near You</h3>
                  <p className="text-(--muted-foreground)">Enable location access to see sales nearby you.</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={requestLocation} 
                    className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl text-sm font-medium hover:opacity-90 cursor-pointer"
                    aria-label="Enable location access"
                  >
                    <Navigation className="w-4 h-4" /> Enable Location
                  </button>
                  <button 
                    onClick={simulateLocation} 
                    className="px-6 py-3 bg-(--muted) text-(--foreground) rounded-xl text-sm font-medium hover:opacity-90 cursor-pointer"
                    aria-label="Use demo location"
                  >
                    Use Demo
                  </button>
                </div>
              </div>
            )}

            {locationStatus === "loading" && (
              <div className="flex items-center gap-3 p-4 bg-(--card) border border-(--border) rounded-xl">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500" role="status" aria-label="Loading" />
                <p className="text-(--muted-foreground)">Getting your location... (Attempt {retryCount + 1})</p>
              </div>
            )}

            {locationStatus === "timeout" && (
              <div className="p-6 bg-(--card) border border-(--border) rounded-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-(--foreground) mb-1">⏱️ Request Timed Out</h3>
                    <p className="text-(--muted-foreground)">Try using demo location instead.</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => { setRetryCount(c => c + 1); requestLocation(); }} 
                      className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:opacity-90"
                      aria-label="Retry location request"
                    >
                      Retry ({3 - retryCount})
                    </button>
                    <button 
                      onClick={simulateLocation} 
                      className="px-4 py-2 bg-(--muted) text-(--foreground) rounded-xl text-sm font-medium hover:opacity-90"
                      aria-label="Use demo location"
                    >
                      Use Demo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {locationStatus === "denied" && (
              <div className="p-6 bg-(--card) border border-(--border) rounded-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-(--foreground) mb-1">⚠️ Location Access Denied</h3>
                    <p className="text-(--muted-foreground)">Please enable location or use demo.</p>
                  </div>
                  <button 
                    onClick={simulateLocation} 
                    className="px-4 py-2 bg-(--muted) text-(--foreground) rounded-xl text-sm font-medium hover:opacity-90"
                    aria-label="Use demo location"
                  >
                    Use Demo
                  </button>
                </div>
              </div>
            )}

            {locationStatus === "unavailable" && (
              <div className="p-6 bg-(--card) border border-(--border) rounded-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-(--foreground) mb-1">📍 Location Unavailable</h3>
                    <p className="text-(--muted-foreground)">Location services are not responding. Try demo or check your device settings.</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => { setRetryCount(c => c + 1); requestLocation(); }} 
                      className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:opacity-90"
                      aria-label="Retry location request"
                    >
                      Try Again
                    </button>
                    <button 
                      onClick={simulateLocation} 
                      className="px-4 py-2 bg-(--muted) text-(--foreground) rounded-xl text-sm font-medium hover:opacity-90"
                      aria-label="Use demo location"
                    >
                      Use Demo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {locationStatus === "error" && (
              <div className="p-6 bg-(--card) border border-(--border) rounded-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-(--foreground) mb-1">❌ Location Error</h3>
                    <p className="text-(--muted-foreground)">Something went wrong. Try demo instead.</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => { setRetryCount(c => c + 1); requestLocation(); }} 
                      className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:opacity-90"
                      aria-label="Retry location request"
                    >
                      Try Again
                    </button>
                    <button 
                      onClick={simulateLocation} 
                      className="px-4 py-2 bg-(--muted) text-(--foreground) rounded-xl text-sm font-medium hover:opacity-90"
                      aria-label="Use demo location"
                    >
                      Use Demo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {locationStatus === "success" && filteredDeals.length === 0 && (
              <div className="p-8 text-center bg-(--card) border border-(--border) rounded-xl">
                <MapPin className="w-12 h-12 text-(--muted-foreground) mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-(--foreground) mb-2">No Nearby Sales Found</h3>
                <p className="text-(--muted-foreground) mb-4">No active sales within 10 km.</p>
                <button 
                  onClick={() => setMode("city")} 
                  className="px-6 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:opacity-90"
                  aria-label="Browse city sales"
                >
                  Browse City Sales
                </button>
              </div>
            )}

            {locationStatus === "success" && filteredDeals.length > 0 && (
              <div className="mb-4 p-4 bg-(--card) border border-(--border) rounded-xl flex items-center justify-between">
                <p className="text-(--foreground)">Found {filteredDeals.length} {filteredDeals.length === 1 ? 'sale' : 'sales'} near you!</p>
                <p className="text-xs text-(--muted-foreground)">Using {locationError ? 'demo' : 'your'} location</p>
              </div>
            )} 
          </div>
        )}

        {/* City Mode Empty State */}
        {mode === "city" && filteredDeals.length === 0 && (
          <div className="p-8 text-center bg-(--card) border border-(--border) rounded-xl">
            <Filter className="w-12 h-12 text-(--muted-foreground) mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-(--foreground) mb-2">No Deals Found</h3>
            <p className="text-(--muted-foreground)">
              No {selectedCategory !== "All Categories" ? selectedCategory : ""} deals in {selectedCity}.
            </p>
          </div>
        )}

        {/* Deals Grid */}
        {filteredDeals.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDeals.map((deal) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                className="group bg-(--card) border border-(--border) rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
              >
                <div className="relative h-48">
                  <Image src={deal.image} alt={deal.title} fill className="object-cover group-hover:scale-110 transition duration-500" />
                  <span className="absolute top-4 left-4 bg-black/70 text-white font-bold text-sm px-3 py-1 rounded-lg shadow-md">
                    -{deal.discount}%
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="bg-(--muted) text-(--muted-foreground) px-2 py-1 rounded-full">{deal.category}</span>
                    <span className="flex items-center gap-1 text-(--muted-foreground)">
                      <MapPin className="w-3 h-3" /> {deal.location}
                    </span>
                  </div>

                  {/* Brand Name - Added */}
                  <p className="text-sm font-medium text-(--primary)">{deal.brand}</p>

                  {deal.distance && (
                    <p className="text-xs text-(--muted-foreground) flex items-center gap-1">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full" /> {deal.distance.toFixed(1)} km away
                    </p>
                  )}

                  <h3 className="font-semibold text-(--card-foreground) line-clamp-2">{deal.title}</h3>

                  {/* Sale Date - Added */}
                  <div className="flex items-center gap-1 text-xs text-(--muted-foreground)">
                    <Calendar className="w-3 h-3" />
                    <span>{formatSaleDate(deal.saleDate)}</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">${deal.salePrice.toFixed(2)}</span>
                    <span className="text-sm text-(--muted-foreground) line-through">${deal.originalPrice.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-(--border)">
                    <DealTimer durationMinutes={deal.durationMinutes} />
                    <a
                      href={deal.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:opacity-90 shadow-md"
                      aria-label={`Grab deal for ${deal.title}`}
                    >
                      Grab It
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}