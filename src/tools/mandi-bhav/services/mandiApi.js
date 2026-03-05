const API_URL =
  "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

const API_KEY = "579b464db66ec23bdd000001a96749eb8ea44e9e569839eccd6d13a0";

export async function fetchMarketData({ state, crop, limit = 100 }) {
  const params = new URLSearchParams({
    "api-key": API_KEY,
    format: "json",
    limit: limit.toString(),
    offset: "0",
  });

  if (state) params.append("filters[state]", state);
  if (crop) params.append("filters[commodity]", crop);

  const response = await fetch(`${API_URL}?${params}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

export function generateSampleData() {
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

  return sample;
}
