export default function SearchBar({ word, setWord, loading, onSearch }) {
  return (
   <div className="m-8 border border-(--border) rounded-lg p-6 shadow-md item-center justify-center">
     <div className="flex gap-3  item-center">
      <input
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Search for a word..."
        className="flex-1 p-4 border border-(border) rounded-md"
      />
      <button
        onClick={() => onSearch(word)}
        disabled={loading}
        className="px-6 py-4 bg-(--primary) text-white rounded-md cursor-pointer transition"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
   </div>
  );
}
