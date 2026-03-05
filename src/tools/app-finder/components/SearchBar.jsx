import { Search } from "lucide-react";

export const SearchBar = ({ query, setQuery, onSearch, loading }) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for apps... (e.g., Spotify, Instagram, WhatsApp)"
            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 placeholder-gray-400"
          />
        </div>
        <button
          onClick={onSearch}
          disabled={loading}
          className="px-8 py-3.5 bg-(--primary) text-white rounded-md hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Searching...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Search 
            </>
          )}
        </button>
      </div>
    </div>
  );
};
