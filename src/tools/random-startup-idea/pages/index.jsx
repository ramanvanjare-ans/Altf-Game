"use client";

import { useState, useEffect } from "react";
import IdeaGenerator from "../components/IdeaGenerator";
import SavedIdeas from "../components/SavedIdeas";

export default function RandomStartupIdea() {
  const [darkMode, setDarkMode] = useState(false);
  const [savedIdeas, setSavedIdeas] = useState([]);

  /* ---------------------------------------------
     Initialize from localStorage (safe for Next.js)
  --------------------------------------------- */
  useEffect(() => {
    const saved = localStorage.getItem("savedIdeas");
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSavedIdeas(JSON.parse(saved));
    }

    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  /* ---------------------------------------------
     Toggle Dark Mode
  --------------------------------------------- */
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  /* ---------------------------------------------
     Save Idea
  --------------------------------------------- */
  const saveIdea = (idea) => {
    const newSaved = [
      ...savedIdeas,
      { ...idea, savedAt: new Date().toISOString() },
    ];
    setSavedIdeas(newSaved);
    localStorage.setItem("savedIdeas", JSON.stringify(newSaved));
  };

  /* ---------------------------------------------
     Delete Idea
  --------------------------------------------- */
  const deleteIdea = (ideaId) => {
    const filtered = savedIdeas.filter((idea) => idea.id !== ideaId);
    setSavedIdeas(filtered);
    localStorage.setItem("savedIdeas", JSON.stringify(filtered));
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}

      {/* Main Content */}
      <main className="flex flex-col gap-20">
        <IdeaGenerator
          darkMode={darkMode}
          onSave={saveIdea}
          savedIdeas={savedIdeas}
        />

        <SavedIdeas ideas={savedIdeas} onDelete={deleteIdea} />
      </main>
    </div>
  );
}
