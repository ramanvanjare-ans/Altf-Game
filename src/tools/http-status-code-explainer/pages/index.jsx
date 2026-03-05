"use client";

import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import CodeGrid from "../components/CodeGrid";
import ExplanationPanel from "../components/ExplanationPanel";
import codes from "../data/statusCode.json";
import HowItWorks from "../components/HowItWorks";
import Header from "../components/Header";

export default function HttpStatus() {
  const [selectedCode, setSelectedCode] = useState(200);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    load(selectedCode);
  }, [selectedCode]);

  function load(code) {
    const num = Number(code);

    // ❗ Prevent unnecessary reloads
    if (info?.code === num) return;

    const data = codes[num];

    if (data) {
      setInfo({ ...data, code: num });
    } else {
      setInfo({
        code: num,
        short: "Unknown Status Code",
        detail: "No detailed explanation available.",
        category: "Unknown", // ❗ Corrected logic
      });
    }
  }

  // Category only for valid status codes
  function getCategory(code) {
    if (code >= 100 && code < 200) return "1xx Informational";
    if (code >= 200 && code < 300) return "2xx Success";
    if (code >= 300 && code < 400) return "3xx Redirection";
    if (code >= 400 && code < 500) return "4xx Client Error";
    if (code >= 500 && code < 600) return "5xx Server Error";
    return "Unknown";
  }

  return (
    <div
      className="
        max-w-8xl mx-auto px-4 py-4
        bg-(--background) text-(--foreground)
      "
    >
      {" "}
      <Header />
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <SearchBar onSelect={(c) => setSelectedCode(c)} />
          <CodeGrid onPick={(c) => setSelectedCode(c)} />
        </div>

        <ExplanationPanel info={info} />
      </div>
      <div className="max-w-8xl mx-auto px-4 py-6">
        <HowItWorks />
      </div>
      <footer className="text-center mt-10 text-(--muted-foreground) text-sm">
        Powered by HTTP Cats API — https://http.cat
      </footer>
    </div>
  );
}
