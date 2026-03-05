// The common TLDs we will use to generate names
const TLD_EXTENSIONS = [
  ".com",
  ".net",
  ".io",
  ".in",
  ".org",
  ".app",
  ".tech",
  ".blog",
  ".cloud",
  ".space",
  ".co.in",
  ".fun",
  ".co",
  ".info",
  ".ai",
];

/**
 * Fetches synonyms and related words for a query using the WordsAPI (basic unauthenticated mode).
 * This simulates the "AI" ideation process.
 * @param {string} query - The keyword or phrase to search.
 * @returns {Promise<Array>} An array of generated domain suggestions (objects with domain and status).
 */
export const fetchWordSuggestions = async (query) => {
  if (!query.trim()) return [];
  const keyword = query
    .trim()
    .toLowerCase()
    .split(/\s+/)[0]
    .replace(/[^a-z0-9]/g, ""); // Clean keyword

  // WordsAPI endpoint for synonyms (free tier, no key required for simple lookups)
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${keyword}`;

  let suggestedWords = new Set([keyword]);
  let domainSuggestions = [];

  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        data.forEach((entry) => {
          entry.meanings?.forEach((meaning) => {
            meaning.definitions?.forEach((def) => {
              // Collect synonyms
              def.synonyms?.forEach((syn) =>
                suggestedWords.add(syn.toLowerCase().replace(/[^a-z0-9]/g, ""))
              );
            });
          });
        });
      }
    }
  } catch (error) {
    // If the API call fails (e.g., word not found or network error), we proceed with the original keyword only.
    console.warn(
      "WordsAPI call failed, proceeding with original keyword only.",
      error
    );
  }

  // --- Domain Name Generation Logic ---

  // 1. Add the base keyword + extensions (e.g., startup.com)
  TLD_EXTENSIONS.forEach((ext) => {
    domainSuggestions.push({
      domain: `${keyword}${ext}`,
      status: "suggestion",
    });
  });

  // 2. Add combinations of suggested words + extensions (e.g., founderstartup.io)
  suggestedWords.forEach((word) => {
    // Ensure the suggested word is reasonable length and not just the original keyword
    if (word !== keyword && word.length > 2 && word.length < 10) {
      TLD_EXTENSIONS.forEach((ext) => {
        // Combine synonym + keyword
        domainSuggestions.push({
          domain: `${word}${keyword}${ext}`,
          status: "suggestion",
        });
        // Combine keyword + synonym
        domainSuggestions.push({
          domain: `${keyword}${word}${ext}`,
          status: "suggestion",
        });
      });
    }
  });

  // Filter for uniqueness and limit results
  const uniqueDomains = Array.from(
    new Set(domainSuggestions.map((d) => JSON.stringify(d)))
  ).map((s) => JSON.parse(s));

  return uniqueDomains.slice(0, 15);
};
