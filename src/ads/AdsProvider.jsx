"use client";

import { createContext, useContext, useEffect, useState } from "react";
import adsData from "./data";

const AdsContext = createContext([]);

export function AdsProvider({ children }) {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    setAds(adsData.ads.filter(a => a.status === "active"));
  }, []);

  return (
    <AdsContext.Provider value={ads}>
      {children}
    </AdsContext.Provider>
  );
}

export function useAds({ placement, layout, device }) {
  const ads = useContext(AdsContext);

  if (!device) return []; // ⬅️ CRITICAL GUARD

  return ads.filter(
    (ad) =>
      ad.placements.includes(placement) &&
      ad.layout === layout &&
      ad.devices?.[device] === true
  );
}

