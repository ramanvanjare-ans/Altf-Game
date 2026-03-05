"use client";

import { useState } from "react";
import { Trash2, Eye, ChevronDown, Copy, Bookmark, X } from "lucide-react";

export default function SavedIdeas({ ideas = [], onDelete }) {
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  if (!ideas.length) return null;

  const handleCopy = (idea) => {
    const text = `
${idea.title}
${idea.tagline}

Category: ${idea.category}
Target Users: ${idea.targetUser}
Problem: ${idea.painPoint}
Solution: ${idea.solution}

Revenue Model: ${idea.revenueModel}
Tech Stack: ${idea.techStack.join(", ")}

MVP Steps:
${idea.mvpSteps.map((step, i) => `${i + 1}. ${step}`).join("\n")}

Budget: ${idea.estimatedBudget}
Time: ${idea.timeToMVP}
    `.trim();

    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Bookmark className="w-8 h-8 text-(--primary)" />
        <div>
          <h2 className="text-3xl font-bold text-(--foreground)">
            Saved Ideas
          </h2>
          <p className="text-(--muted-foreground) text-sm">
            {ideas.length} idea{ideas.length !== 1 ? "s" : ""} saved
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="bg-(--card) border border-(--border) rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs bg-(--primary)/10 text-(--primary) px-2 py-1 rounded">
                {idea.category}
              </span>

              <div className="flex gap-2">
                <button
                  className="cursor-pointer"
                  onClick={() => setSelectedIdea(idea)}
                >
                  <Eye className="w-4 h-4 text-(--muted-foreground)" />
                </button>
                <button
                  className="cursor-pointer"
                  onClick={() => handleCopy(idea)}
                >
                  <Copy className="w-4 h-4 text-(--muted-foreground)" />
                </button>
                <button
                  className="cursor-pointer"
                  onClick={() => onDelete?.(idea.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>

            <h3 className="font-semibold text-(--foreground)">{idea.title}</h3>

            <p className="text-sm italic text-(--muted-foreground) mt-1">
              {idea.tagline}
            </p>

            {/* Quick Info */}
            <div className="mt-4 text-xs text-(--muted-foreground) space-y-1">
              <p>🎯 {idea.targetUser}</p>
              <p>💰 {idea.revenueModel}</p>
              <p>
                ⏱ {idea.timeToMVP} • {idea.estimatedBudget}
              </p>
            </div>

            {/* Expand */}
            <button
              onClick={() =>
                setExpandedId(expandedId === idea.id ? null : idea.id)
              }
              className="flex items-center justify-center gap-1 text-sm mt-4 w-full border-t border-(--border) pt-3 cursor-pointer"
            >
              {expandedId === idea.id ? "Show Less" : "Show More"}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  expandedId === idea.id ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedId === idea.id && (
              <div className="mt-4 text-xs space-y-3">
                <div>
                  <p className="font-semibold">Tech Stack:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {idea.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 border border-(--border) rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-semibold">MVP Steps:</p>
                  <ol className="list-decimal pl-4 mt-1 space-y-1">
                    {idea.mvpSteps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {idea.savedAt && (
              <p className="text-[10px] text-(--muted-foreground) mt-4">
                Saved: {new Date(idea.savedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedIdea && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-(--card) border border-(--border) rounded-2xl max-w-3xl w-full p-8 overflow-y-auto max-h-[90vh] relative">
            <button
              onClick={() => setSelectedIdea(null)}
              className="absolute top-4 right-4 cursor-pointer"
            >
              <X className="w-5 h-5 text-(--muted-foreground)" />
            </button>

            <span className="text-xs bg-(--primary)/10 text-(--primary) px-2 py-1 rounded">
              {selectedIdea.category}
            </span>

            <h2 className="text-2xl font-bold mt-4">{selectedIdea.title}</h2>

            <p className="italic text-(--muted-foreground) mt-1">
              {selectedIdea.tagline}
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-6 text-sm">
              <div>
                <h4 className="font-semibold text-(--primary)">
                  🎯 Target Users
                </h4>
                <p>{selectedIdea.targetUser}</p>

                <h4 className="font-semibold mt-4 text-red-500">⚠ Problem</h4>
                <p>{selectedIdea.painPoint}</p>

                <h4 className="font-semibold mt-4 text-green-600">
                  💡 Solution
                </h4>
                <p>{selectedIdea.solution}</p>
              </div>

              <div>
                <h4 className="font-semibold">💰 Revenue</h4>
                <p>{selectedIdea.revenueModel}</p>

                <h4 className="font-semibold mt-4">🛠 Tech Stack</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedIdea.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 border border-(--border) rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <h4 className="font-semibold mt-4">💵 Budget & Time</h4>
                <p>
                  {selectedIdea.estimatedBudget} • {selectedIdea.timeToMVP}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold mb-2">🚀 MVP Roadmap</h3>
              <ol className="list-decimal pl-5 space-y-1">
                {selectedIdea.mvpSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>

            {selectedIdea.tags?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {selectedIdea.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 border border-(--border) rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-3 mt-8 justify-end">
              <button
                onClick={() => handleCopy(selectedIdea)}
                className="px-4 py-2 border border-(--border) rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>

              <button
                onClick={() => onDelete?.(selectedIdea.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>

              <button
                onClick={() => setSelectedIdea(null)}
                className="px-4 py-2 bg-(--primary) text-(--primary-foreground) rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
