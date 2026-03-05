import { BarChart, FileText, RefreshCcw, Upload } from "lucide-react";
import React, { useState } from "react";

const JDInput = ({ onAnalyze, onReset, loading }) => {
  const [jdText, setJdText] = useState("");
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      setJdText(text);
    };

    if (file.type === "text/plain") {
      reader.readAsText(file);
    } else if (file.type === "application/pdf") {
      alert(
        "PDF parsing requires additional library. Please paste text for now.",
      );
    } else {
      alert("Please upload .txt files for now");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "text/plain") {
      handleFileUpload({ target: { files: [file] } });
    }
  };

  const handleAnalyze = () => {
    if (jdText.trim()) {
      onAnalyze(jdText);
    }
  };

  const handleReset = () => {
    setJdText("");
    setFileName("");
    onReset();
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center ">
      <div
        className="
      w-full 
      p-6 md:p-10
      rounded-2xl
     
      animate-fadeIn
    "
      >
        {/* HEADER */}
        <div className="text-center mb-6">
          <h1
            className="
          heading animate-fade-up
        "
          >
            Job Description Analyzer
          </h1>

          <p className="description animate-fade-up">
            Analyze job descriptions with AI-powered insights
          </p>
        </div>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-gray-200" />
          <span
            className="
          px-3 py-1 content 
          rounded-full text-white
          bg-(--primary)
          flex items-center gap-1
         
        "
          >
            {/* <AutoAwesome className="w-4 h-4" /> */}
            Smart Analysis
          </span>
          <div className="flex-1 h-px bg-gray-200 " />
        </div>

        {/* FILE UPLOAD */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
        mb-6 p-6 rounded-xl text-center
        border-2 border-dashed
        transition-all duration-300 bg-(--card)
        ${
          isDragging
            ? "border-orange-500 bg-(--card)"
            : "border-gray-300 bg-(--card)"
        }
      `}
        >
          <input
            type="file"
            accept=".txt"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
          />

          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center "
          >
            <Upload
              className={`w-12 h-12 mb-2 transition ${
                isDragging ? "text-orange-500" : "text-gray-400"
              }`}
            />
            <p className="content">Drop your file here or click to upload</p>
            <span className="content">Supports .txt files</span>
          </label>

          {fileName && (
            <div
              className="
            inline-flex items-center gap-2
            mt-4 px-3 py-1
            rounded-full bg-green-500 text-white
            font-bold text-sm
            shadow-[0_4px_12px_rgba(76,175,80,0.3)]
          "
            >
              <FileText className="w-4 h-4" />
              {fileName}
              <button onClick={handleReset} className="ml-1">
                ✕
              </button>
            </div>
          )}
        </div>

        {/* OR */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-xs font-semibold text-(--muted-foreground)">
            OR PASTE BELOW
          </span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* TEXTAREA */}
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste your job description here..."
          className="
        w-full mb-6 p-4 rounded-xl
        bg-(--card)
        text-(--foreground)
        border border-(--border)
       
      "
        />

        {/* ACTION BUTTONS */}
        <div
          className="flex gap-4
    "
        >
          <button
            onClick={handleAnalyze}
            disabled={!jdText.trim() || loading}
            className="
          flex-1 py-4 rounded-xl
          font-bold text-lg text-white
          flex items-center justify-center gap-2 cursor-pointer
          bg-(--primary)
          
        "
          >
            {/* <Analytics /> */}
            {loading ? "Analyzing..." : "Analyze JD"}
          </button>

          <button
            onClick={handleReset}
            disabled={loading}
            className="
          px-6 py-4 rounded-xl
          border-2 
          transition-all
         bg-(--card) text-red-500 cursor-pointer
        "
          >
            <RefreshCcw />
          </button>
        </div>

        {/* TIP */}
        <div
          className="
       
      "
        ></div>
      </div>
    </div>
  );
};

export default JDInput;
