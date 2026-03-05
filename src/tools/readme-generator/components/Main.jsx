"use client";

import { useState, useEffect } from "react";
import { FileText, Copy, Check, Download, History, Trash2 } from "lucide-react";

export default function Main() {
  const [userInput, setUserInput] = useState("");
  const [generatedReadme, setGeneratedReadme] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem("readme_history");
    if (savedHistory) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (input) => {
    const newHistory = [
      { text: input, timestamp: new Date().toISOString() },
      ...history,
    ].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem("readme_history", JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("readme_history");
  };

  //   const generateReadme = () => {
  //     if (!userInput.trim()) {
  //       alert("Please enter some text to generate README!");
  //       return;
  //     }

  //     saveToHistory(userInput);

  //     const lines = userInput.split("\n").filter((l) => l.trim());
  //     let readme = "";

  //     const titleLine = lines[0] || "Project Title";
  //     readme += `# ${titleLine}\n\n`;

  //     readme +=
  //       lines.length > 1
  //         ? `## Overview\n\n${lines.slice(1, 3).join("\n")}\n\n`
  //         : "";

  //     setGeneratedReadme(readme);
  //   };

  const generateReadme = () => {
    if (!userInput.trim()) {
      alert("Please enter some text to generate README!");
      return;
    }

    saveToHistory(userInput);

    const lines = userInput.split("\n").filter((line) => line.trim());
    let readme = "";

    // Extract title (first significant line or "Project Title")
    const titleLine = lines[0] || "Project Title";
    readme += `# ${titleLine}\n\n`;

    // Check for overview/description
    const overviewKeywords = [
      "overview",
      "description",
      "about",
      "what is",
      "introduction",
    ];
    const overviewLines = lines.filter((line) =>
      overviewKeywords.some((keyword) => line.toLowerCase().includes(keyword)),
    );
    if (overviewLines.length > 0 || lines.length > 1) {
      readme += `## Overview\n\n`;
      if (overviewLines.length > 0) {
        overviewLines.forEach((line) => {
          readme += `${line.replace(
            /^(overview|description|about|what is|introduction):?\s*/i,
            "",
          )}\n`;
        });
      } else {
        readme += `${lines.slice(1, 3).join("\n")}\n`;
      }
      readme += `\n`;
    }

    // Check for features
    const featureKeywords = [
      "feature",
      "features",
      "functionality",
      "capabilities",
    ];
    const featureLines = lines.filter(
      (line) =>
        featureKeywords.some((keyword) =>
          line.toLowerCase().includes(keyword),
        ) ||
        line.trim().startsWith("-") ||
        line.trim().startsWith("*"),
    );
    if (featureLines.length > 0) {
      readme += `## Features\n\n`;
      featureLines.forEach((line) => {
        const cleaned = line
          .replace(/^(feature|features|functionality|capabilities):?\s*/i, "")
          .trim();
        if (cleaned.startsWith("-") || cleaned.startsWith("*")) {
          readme += `${cleaned}\n`;
        } else {
          readme += `- ${cleaned}\n`;
        }
      });
      readme += `\n`;
    }

    // Check for tech stack
    const techKeywords = [
      "tech",
      "technology",
      "stack",
      "built with",
      "using",
      "framework",
      "library",
    ];
    const techLines = lines.filter((line) =>
      techKeywords.some((keyword) => line.toLowerCase().includes(keyword)),
    );
    if (techLines.length > 0) {
      readme += `## Tech Stack\n\n`;
      techLines.forEach((line) => {
        const cleaned = line
          .replace(
            /^(tech|technology|stack|built with|using|framework|library):?\s*/i,
            "",
          )
          .trim();
        readme += `- ${cleaned}\n`;
      });
      readme += `\n`;
    }

    // Check for installation
    const installKeywords = [
      "install",
      "installation",
      "setup",
      "getting started",
    ];
    const installLines = lines.filter((line) =>
      installKeywords.some((keyword) => line.toLowerCase().includes(keyword)),
    );
    if (installLines.length > 0) {
      readme += `## Installation\n\n`;
      readme += `\`\`\`bash\n`;
      installLines.forEach((line) => {
        const cleaned = line
          .replace(/^(install|installation|setup|getting started):?\s*/i, "")
          .trim();
        readme += `${cleaned}\n`;
      });
      readme += `\`\`\`\n\n`;
    }

    // Check for usage
    const usageKeywords = ["usage", "how to use", "run", "start", "execute"];
    const usageLines = lines.filter((line) =>
      usageKeywords.some((keyword) => line.toLowerCase().includes(keyword)),
    );
    if (usageLines.length > 0) {
      readme += `## Usage\n\n`;
      usageLines.forEach((line) => {
        const cleaned = line
          .replace(/^(usage|how to use|run|start|execute):?\s*/i, "")
          .trim();
        readme += `${cleaned}\n\n`;
      });
    }

    // Check for API endpoints
    const apiKeywords = ["api", "endpoint", "route", "rest"];
    const apiLines = lines.filter((line) =>
      apiKeywords.some((keyword) => line.toLowerCase().includes(keyword)),
    );
    if (apiLines.length > 0) {
      readme += `## API Endpoints\n\n`;
      apiLines.forEach((line) => {
        readme += `${line}\n`;
      });
      readme += `\n`;
    }

    // Check for folder structure
    const folderKeywords = [
      "folder",
      "structure",
      "directory",
      "file structure",
    ];
    const folderLines = lines.filter((line) =>
      folderKeywords.some((keyword) => line.toLowerCase().includes(keyword)),
    );
    if (folderLines.length > 0) {
      readme += `## Folder Structure\n\n`;
      readme += `\`\`\`\n`;
      folderLines.forEach((line) => {
        const cleaned = line
          .replace(/^(folder|structure|directory|file structure):?\s*/i, "")
          .trim();
        readme += `${cleaned}\n`;
      });
      readme += `\`\`\`\n\n`;
    }

    // Check for contributing
    const contributingKeywords = [
      "contribut",
      "pull request",
      "pr",
      "contribution",
    ];
    if (
      lines.some((line) =>
        contributingKeywords.some((keyword) =>
          line.toLowerCase().includes(keyword),
        ),
      )
    ) {
      readme += `## Contributing\n\n`;
      readme += `Contributions are welcome! Please feel free to submit a Pull Request.\n\n`;
    }

    // Check for license
    const licenseKeywords = ["license", "mit", "apache", "gpl"];
    const licenseLines = lines.filter((line) =>
      licenseKeywords.some((keyword) => line.toLowerCase().includes(keyword)),
    );
    if (licenseLines.length > 0) {
      readme += `## License\n\n`;
      licenseLines.forEach((line) => {
        readme += `${line}\n`;
      });
    }

    setGeneratedReadme(
      readme ||
        "# Project Title\n\nNo sufficient information to generate README. Please provide more details.",
    );
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReadme);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReadme = () => {
    const blob = new Blob([generatedReadme], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 text-(--foreground)">
      {/* HERO */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-(--primary)/10 border border-(--primary)/30 rounded-full px-4 py-2 mb-6">
          <FileText className="w-4 h-4 text-(--primary)" />
          <span className="text-(--primary) text-sm font-semibold">
            Local & Private
          </span>
        </div>

        <h1 className="heading font-bold mb-6">
          Generate Professional
          <br />
          <span className="text-(--foreground)">README Files</span>
        </h1>

        <p className="description text-(--muted-foreground) max-w-2xl mx-auto">
          Create clean, accurate README.md files directly in your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* INPUT */}
        <div className="bg-(--card) border border-(--border) rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-(--primary)/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-(--primary)" />
              </div>
              <h2 className="text-2xl font-bold">Project Details</h2>
            </div>

            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 rounded-lg hover:bg-(--muted) cursor-pointer "
            >
              <History className="w-5 h-5" />
            </button>
          </div>

          {showHistory && history.length > 0 && (
            <div className="mb-4 bg-(--muted) rounded-lg p-4 max-h-48 overflow-y-auto">
              <div className="flex justify-between mb-3">
                <span className="text-sm text-(--muted-foreground)">
                  Recent
                </span>
                <button
                  onClick={clearHistory}
                  className="text-red-500 text-xs flex items-center gap-1 cursor-pointer p-2 rounded-lg hover:bg-(--background)"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              </div>

              {history.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setUserInput(item.text)}
                  className="w-full text-left p-2 rounded hover:bg-(--background) cursor-pointer"
                >
                  <div className="truncate text-sm">{item.text}</div>
                  <div className="text-xs text-(--muted-foreground)">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          )}

          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter your project details... 
            
            
            Example:
My Project
This is a web application for task management
Features: Create tasks, Set deadlines, Mark as complete
Tech: React, Node.js, MongoDB
Installation: npm install
Usage: npm start"
            className="
              w-full h-96 bg-(--background)
              border border-(--border)
              rounded-lg p-4
              text-sm font-mono
              placeholder:text-(--muted-foreground)
              focus:ring-2 focus:ring-(--primary)
              outline-none resize-none
            "
          />

          <div className="flex gap-3 mt-4">
            <button
              onClick={generateReadme}
              className="
                flex-1 bg-(--primary) text-(--primary-foreground)
                font-semibold py-3 rounded-lg hover:opacity-90 cursor-pointer hover:shadow-2xl
              "
            >
              Generate README
            </button>
            <button
              onClick={() => {
                setUserInput("");
                setGeneratedReadme("");
              }}
              className="bg-(--muted) px-6 py-3 rounded-lg cursor-pointer border-(--border) shadow-2xl hover:shadow-none"
            >
              Clear
            </button>
          </div>
        </div>

        {/* OUTPUT */}
        <div className="bg-(--card) border border-(--border) rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-bold">Generated README</h2>

            {generatedReadme && (
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="p-2 rounded-lg hover:bg-(--muted) cursor-pointer"
                >
                  {copied ? <Check className="text-green-500" /> : <Copy />}
                </button>
                <button
                  onClick={downloadReadme}
                  className="p-2 rounded-lg hover:bg-(--muted) cursor-pointer"
                >
                  <Download />
                </button>
              </div>
            )}
          </div>

          <div className="bg-(--background) border border-(--border) rounded-lg p-4 h-96 overflow-y-auto">
            {generatedReadme ? (
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {generatedReadme}
              </pre>
            ) : (
              <p className="text-(--muted-foreground) text-center mt-24">
                No README generated yet
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
