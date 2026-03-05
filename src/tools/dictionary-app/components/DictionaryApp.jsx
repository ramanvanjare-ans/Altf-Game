

"use client";
import React from "react";
import {  useState, useEffect } from "react";


import { fetchDictionaryData } from "../utils/api.js";
import { speakWord } from "../utils/speech.js";





import SearchBar from "./SearchBar.jsx";
import ResultHeader from "./ResultHeader.jsx";
import MeaningCard from "./MeaningCard.jsx";





import Synonyms from "./Synonyms.jsx";
import Antonyms from "./Antonyms.jsx";
import ExplorePage from "./ExplorePage.jsx";

export default function DictionaryApp() {
  const [word, setWord] = React.useState("");
  const [results, setResults] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleSearch = async (searchWord) => {
    if (!searchWord) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDictionaryData(searchWord);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter") handleSearch(word);
    };
    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [word]);




  const handleRefresh = () => {
  setWord("");
  setResults(null);
  setError(null);
  setLoading(false);
};

  return (
   
     <div className="  bg-(--background) text-(--foreground) rounded-xl shadow-lg p-6 mb-8  items-center justify-center">
      <h1 className="heading text-center pt-5 mb-4 animate-fade-up">
        Dictionary App
      </h1>
      <p className="description text-center mb-6 animate-fade-up">Search for definitions, synonyms, and antonyms of any word.</p>

    <div className="m-20">
        <SearchBar
        word={word}
        setWord={setWord}
        loading={loading}
        onSearch={handleSearch}
      />

     {!results && !loading && !error && <ExplorePage />}

      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      {loading && <p className="text-blue-500 mb-4">Loading...</p>}

      {results && (
        <>
          <ResultHeader word={word} onSpeak={speakWord} />

          {results.dict.map((entry, idx) => (
            <MeaningCard key={idx} entry={entry} />
          ))}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Synonyms data={results.syn} setWord={setWord} onSearch={handleSearch} />
            <Antonyms data={results.ant} setWord={setWord} onSearch={handleSearch} />
          </div>

          {results && (
  <div className="flex justify-end mb-4 pt-4 ">
    <button
      onClick={handleRefresh}
      className="px-4 py-2 rounded-lg bg-(--primary) text-white font-semibold cursor-pointer   transition"
    >
       Refresh
    </button>
  </div>
)}


         

          
        </>
      )}
    </div>
    </div>
  
  );
}
