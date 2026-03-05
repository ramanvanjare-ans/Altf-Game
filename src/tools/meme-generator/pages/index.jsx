import { useState, useRef, useCallback } from "react";
import html2canvas from "html2canvas";
// import { GoogleGenerativeAI } from "@google/generative-ai";



const FONT_OPTIONS = [
  { name: "Impact", value: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" },
  { name: "Arial", value: "Arial, Helvetica, sans-serif" },
  { name: "Comic Sans", value: "'Comic Sans MS', cursive, sans-serif" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Courier", value: "'Courier New', monospace" },
  { name: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { name: "Times New Roman", value: "'Times New Roman', Times, serif" },
];

export default function ToolHome() {
  const [meme, setMeme] = useState({
    image: null,
    topText: "",
    bottomText: "",
    fontFamily: FONT_OPTIONS[0].value,
    fontSize: 40,
    textColor: "#ffffff",
    textStroke: true,
  });
  
  const memeRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMeme((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleReset = useCallback(() => {
    setMeme({
      image: null,
      topText: "",
      bottomText: "",
      fontFamily: FONT_OPTIONS[0].value,
      fontSize: 40,
      textColor: "#ffffff",
      textStroke: true,
    });
    setAiSuggestions([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleDownload = useCallback(async () => {
    if (!memeRef.current || !meme.image) return;

    try {
      const canvas = await html2canvas(memeRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        backgroundColor: null,
      });

      const link = document.createElement("a");
      link.download = `meme-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      alert("Download failed. Please try again.");
    }
  }, [meme.image]);

   
 
  return (
    <div className="min-h-screen bg-(--background) text-(--foreground)">  

     
        
          <h1 className="heading text-center animate-fade-up pt-5">  Meme Generator</h1>
          <p className="description text-center animate-fade-up pt-2">Create hilarious memes </p>
       
      

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          
          <div className="space-y-6">
            
            <div className="rounded-lg border border-(--border) bg-(--card) text-(--foreground) p-4 sm:p-6">
              <h2 className="mb-4 text-lg font-semibold text-(--foreground)">1. Upload Image</h2>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full cursor-pointer rounded-lg border border-(--border) px-3 py-2 text-sm text-(--foreground) file:mr-4 file:rounded-lg file:border-0 file:bg-(--primary) file:px-4 file:py-2 file:text-sm file:font-medium file:text-white "
              />
            </div>

            {/* Text Controls */}
            <div className="rounded-lg border border-(--border) bg-(--card) text-(--foreground) p-4 sm:p-6">
              <h2 className="mb-4 text-lg font-semibold text-(--foreground)">2. Add Text</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-(--foreground)">Top Text</label>
                  <input
                    type="text"
                    value={meme.topText}
                    onChange={(e) => setMeme((prev) => ({ ...prev, topText: e.target.value }))}
                    placeholder="Enter top text..."
                    className="w-full rounded-lg border border-(--border) px-4 py-2 text-(--foreground) focus:border-(--primary) focus:outline-none focus:ring-1 focus:ring-(--primary)"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-(--foreground)">Bottom Text</label>
                  <input
                    type="text"
                    value={meme.bottomText}
                    onChange={(e) => setMeme((prev) => ({ ...prev, bottomText: e.target.value }))}
                    placeholder="Enter bottom text..."
                    className="w-full rounded-lg border border-(--border) px-4 py-2 text-(--foreground) focus:border-(--primary) focus:outline-none focus:ring-1 focus:ring-(--primary)"
                  />
                </div>

                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-(--foreground)">Font Family</label>
                    <select
                      value={meme.fontFamily}
                      onChange={(e) => setMeme((prev) => ({ ...prev, fontFamily: e.target.value }))}
                      className="w-full rounded-lg border border-(--border) px-4 py-2 bg-(--card) text-(--foreground) focus:border-(--primary) focus:outline-none focus:ring-1 focus:ring-(--primary) "
                    >
                      {FONT_OPTIONS.map((font) => (
                        <option key={font.value} value={font.value}>
                          {font.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-(--foreground)">Font Size: {meme.fontSize}px</label>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={meme.fontSize}
                      onChange={(e) => setMeme((prev) => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                      className="h-2 w-full cursor-pointer rounded-lg bg-(--card)"  
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-(--foreground)">Text Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={meme.textColor}
                        onChange={(e) => setMeme((prev) => ({ ...prev, textColor: e.target.value }))}
                        className="h-10 w-16 cursor-pointer rounded border border-(--border)"
                      />
                      <span className="text-sm text-(--foreground)">{meme.textColor}</span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={meme.textStroke}
                        onChange={(e) => setMeme((prev) => ({ ...prev, textStroke: e.target.checked }))}
                        className="h-4 w-4 rounded border-(--border) text-(--foreground) focus:ring-(--primary)"
                      />
                      <span className="text-sm font-medium text-(--foreground)  ">Black Outline</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Suggestions */}
            {/* <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
              <h2 className="mb-4 text-lg font-semibold text-black">3. AI Meme Suggestions</h2>
              
              {showApiInput && (
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700">Gemini API Key</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key..."
                    className="mb-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <p className="text-xs text-gray-500">Get your API key from Google AI Studio</p>
                </div>
              )}

              <button
                onClick={generateAiSuggestions}
                disabled={isLoadingAi}
                className="w-full rounded-lg bg-black px-4 py-2 font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoadingAi ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  " Generate AI Suggestions"
                )}
              </button>

              {aiSuggestions.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Click to apply:</p>
                  {aiSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2"
                    >
                      <span className="flex-1 text-sm text-black">{suggestion}</span>
                      <button
                        onClick={() => applySuggestion(suggestion, "top")}
                        className="rounded bg-gray-200 px-2 py-1 text-xs font-medium text-black hover:bg-gray-300"
                      >
                        Top
                      </button>
                      <button
                        onClick={() => applySuggestion(suggestion, "bottom")}
                        className="rounded bg-gray-200 px-2 py-1 text-xs font-medium text-black hover:bg-gray-300"
                      >
                        Bottom
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div> */}

          
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleDownload}
                disabled={!meme.image}
                className="flex-1 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                ⬇ Download Meme
              </button>
              <button
                onClick={handleReset}
                className="rounded-lg border-2 border-red-300 px-6 py-3 font-semibold text-red-500 transition-colors hover:bg-red-100"
              >
                 Reset
              </button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="rounded-lg border border-(--border) bg-(--card) text-(--foreground) p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-(--foreground)">Preview</h2>
            
            <div className="flex items-center justify-center rounded-lg bg-(--card) p-4">
              {meme.image ? (
                <div
                  ref={memeRef}
                  className="relative inline-block max-w-full overflow-hidden"
                >
                  <img
                    src={meme.image}
                    alt="Meme"
                    className="max-h-125 max-w-full object-contain"
                    crossOrigin="anonymous"
                  />
                  
                  {/* Top Text */}
                  {meme.topText && (
                    <div
                      className="absolute left-0 right-0 top-0 px-4 py-2 text-center"
                      style={{
                        fontFamily: meme.fontFamily,
                        fontSize: `${meme.fontSize}px`,
                        color: meme.textColor,
                        textShadow: meme.textStroke
                          ? "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000"
                          : "none",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        lineHeight: 1.2,
                        wordBreak: "break-word",
                      }}
                    >
                      {meme.topText}
                    </div>
                  )}
                  
                  {/* Bottom Text */}
                  {meme.bottomText && (
                    <div
                      className="absolute bottom-0 left-0 right-0 px-4 py-2 text-center"
                      style={{
                        fontFamily: meme.fontFamily,
                        fontSize: `${meme.fontSize}px`,
                        color: meme.textColor,
                        textShadow: meme.textStroke
                          ? "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000"
                          : "none",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        lineHeight: 1.2,
                        wordBreak: "break-word",
                      }}
                    >
                      {meme.bottomText}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-64 w-full flex-col items-center justify-center text-(--muted-foreground)">
                  <svg className="mb-4 h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm text-(--muted-foreground)">Upload an image to start creating your meme</p>
                </div>
              )}
            </div>

           
          </div>
        </div>
      </main>
    </div>
  );
}
