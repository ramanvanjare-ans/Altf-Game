
"use client";

import { useState } from "react";
import Generator from "../components/Generator";
import Landing from "../components/Landing";


export default function ToolHome(){
 
  const [showGenerator, setShowGenerator] = useState(false);

  return (
    <div
      style={{
        minHeight: '100vh',
      }}
       className="bg-(--background) text-(--foreground)"
    >
      

      {/* Main Content */}
      <main style={{ width: '100%' }}>
        {!showGenerator ? (
          <Landing setShowGenerator={setShowGenerator} />
        ) : (
          <Generator  />
        )}
      </main>


     
     
    </div>
  );
};


