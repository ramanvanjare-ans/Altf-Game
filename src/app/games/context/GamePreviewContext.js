// GamePreviewContext.js
import { createContext, useContext, useState } from "react";

const GamePreviewContext = createContext(null);

export function GamePreviewProvider({ children }) {
  const [preview, setPreview] = useState(null);
  return (
    <GamePreviewContext.Provider value={{ preview, setPreview }}>
      {children}
      {preview}
    </GamePreviewContext.Provider>
  );
}

export const useGamePreview = () => useContext(GamePreviewContext);
