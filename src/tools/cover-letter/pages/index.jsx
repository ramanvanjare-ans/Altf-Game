
"use client";


import React, { useState } from "react";

import Generator from "../components/Generator";
import Landing from "../components/LandingPage";

const App = () => {
  const [isDark, setIsDark] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  return (
    <div
     className="bg-(--background) text-(--foreground)"
    >
      
      <main style={{ padding: "56px 16px" }}>
        {!showGenerator ? (
          <Landing onGetStarted={() => setShowGenerator(true)}  />
        ) : (
          <Generator />
        )}
      </main>

    
      
    </div>
  );
};

export default App;
