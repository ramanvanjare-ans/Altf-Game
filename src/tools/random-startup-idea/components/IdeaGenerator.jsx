"use client";

import { useState } from "react";
import {
  Sparkles,
  RefreshCw,
  Heart,
  Copy,
  Download,
  TrendingUp,
  Bookmark,
} from "lucide-react";

import {
  seeds,
  mvpTemplates,
  titleTemplates,
  taglineTemplates,
} from "../data/seeds";

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const generateId = () =>
  `idea_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const fillTemplate = (template, vars) => {
  let result = template;
  Object.keys(vars).forEach((key) => {
    result = result.replace(new RegExp(`{${key}}`, "g"), vars[key]);
  });
  return result;
};

export default function IdeaGenerator({ onSave, savedIdeas = [] }) {
  const [currentIdea, setCurrentIdea] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [message, setMessage] = useState("");

  const generateIdea = () => {
    const category = selectedCategory || pick(seeds.categories);
    const persona = pick(seeds.personas);
    const pain = pick(seeds.painPoints);
    const solution = pick(seeds.solutions);
    const tech = pick(seeds.techStacks);
    const revenue = pick(seeds.revenueModels);
    const modifier = pick(seeds.noveltyModifiers);
    const budget = pick(seeds.budgetRanges);
    const time = pick(seeds.timeToMVP);
    const geography = pick(seeds.geographies);
    const mvpSteps = pick(mvpTemplates);

    const title = fillTemplate(pick(titleTemplates), {
      category,
      persona,
      modifier,
    });

    const benefit = pain
      .replace(/hard to |difficult to |struggle with |can't |lack of /gi, "")
      .trim();

    const tagline = fillTemplate(pick(taglineTemplates), {
      persona,
      pain,
      solution,
      benefit,
    });
    // Generate MVP steps
    const filledMVP = mvpSteps.map((step) =>
      fillTemplate(step, {
        feature: solution.toLowerCase(),
        tech: tech[0],
        core_feature: solution.toLowerCase(),
        revenue: revenue.split(" ")[0].toLowerCase(),
        integration: "payment processing",
        product: category.toLowerCase(),
      }),
    );

    const idea = {
      id: generateId(),
      title,
      tagline,
      category,
      painPoint: pain,
      targetUser: persona,
      solution: `Build a ${modifier} ${category.toLowerCase()} that helps ${persona} overcome "${pain}" through ${solution.toLowerCase()}.`,
      revenueModel: revenue,
      techStack: tech,
      mvpSteps: filledMVP,
      estimatedBudget: budget,
      timeToMVP: time,
      geography,
      tags: seeds.tags.filter(() => Math.random() > 0.6).slice(0, 5),
    };

    setCurrentIdea(idea);
  };

  const handleSave = () => {
    if (!currentIdea) return;

    if (!savedIdeas.find((i) => i.id === currentIdea.id)) {
      onSave?.(currentIdea);
      setMessage("💾 Idea saved successfully!");
    } else {
      setMessage("⚠️ Idea already saved!");
    }

    setTimeout(() => setMessage(""), 2500);
  };

  const handleCopy = () => {
    if (!currentIdea) return;

    const text = `
${currentIdea.title}
${currentIdea.tagline}

Category: ${currentIdea.category}
Target Users: ${currentIdea.targetUser}

Problem: ${currentIdea.painPoint}

Solution: ${currentIdea.solution}

Revenue: ${currentIdea.revenueModel}
Tech: ${currentIdea.techStack.join(", ")}

MVP:
${currentIdea.mvpSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")}
 
Budget: ${currentIdea.estimatedBudget}
Time to MVP: ${currentIdea.timeToMVP}
Geography: ${currentIdea.geography}
    `.trim();

    navigator.clipboard.writeText(text);
    setMessage("📋 Copied to clipboard!");
    setTimeout(() => setMessage(""), 2500);
  };

  const handleDownload = () => {
    if (!currentIdea) return;

    const blob = new Blob([JSON.stringify(currentIdea, null, 2)], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentIdea.title.replace(/[^a-z0-9]/gi, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setMessage("⬇️ Idea downloaded!");
    setTimeout(() => setMessage(""), 2500);
  };

  const isSaved =
    currentIdea && savedIdeas.find((i) => i.id === currentIdea.id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-(--primary)/10 border border-(--primary)">
          <TrendingUp className="w-4 h-4 text-(--primary)" />
          <span className="text-sm font-semibold text-(--primary)">
            Startup Ideas
          </span>
        </div>

        <h1 className="heading mt-6 ">Generate Your Next Big Idea</h1>

        <p className="text-(--muted-foreground) description">
          AI-powered startup ideas with tech stack, revenue model & MVP roadmap.
        </p>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-full border text-sm ${
              selectedCategory === null
                ? "bg-(--primary) text-(--primary-foreground)"
                : "border-(--border)"
            }`}
          >
            All
          </button>

          {seeds.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full border text-sm ${
                selectedCategory === cat
                  ? "bg-(--primary) text-(--primary-foreground)"
                  : "border-(--border)"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={generateIdea}
          className="mt-8 px-6 py-3 rounded-xl bg-(--primary) text-(--primary-foreground) flex items-center gap-2 mx-auto cursor-pointer"
        >
          <Sparkles className="w-5 h-5" />
          Generate Idea
        </button>
      </div>

      {/* Idea Display */}
      {currentIdea ? (
        <div className="bg-(--card) border border-(--border) rounded-2xl p-8 shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-xs bg-(--primary)/10 text-(--primary) px-2 py-1 rounded">
                {currentIdea.category}
              </span>
              <h2 className="text-2xl font-bold mt-3 text-(--foreground)">
                {currentIdea.title}
              </h2>
              <p className="italic text-(--muted-foreground)">
                {currentIdea.tagline}
              </p>
            </div>

            <div className="flex gap-2">
              <button onClick={handleSave}>
                <Bookmark
                  className={`w-6 h-6  cursor-pointer ${
                    isSaved ? "text-red-500" : "text-(--muted-foreground)"
                  }`}
                />
              </button>
              <button onClick={generateIdea}>
                <RefreshCw className="w-6 h-6 text-(--muted-foreground) cursor-pointer" />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-(--primary)">🎯 Target</h4>
              <p>{currentIdea.targetUser}</p>

              <h4 className="font-semibold mt-4 text-red-500">⚠ Problem</h4>
              <p>{currentIdea.painPoint}</p>

              <h4 className="font-semibold mt-4 text-green-600">💡 Solution</h4>
              <p>{currentIdea.solution}</p>
            </div>
            <div>
              <h4 className="font-semibold text-(--primary)">
                💰 Revenue Model
              </h4>
              <p>{currentIdea.revenueModel}</p>

              <h4 className="font-semibold mt-4 text-(--primary)">
                🛠 Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {currentIdea.techStack.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 text-xs border border-(--border) rounded bg-(--card)"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <h4 className="font-semibold mt-4 text-(--primary)">
                💵 Estimated Budget
              </h4>
              <p>{currentIdea.estimatedBudget}</p>

              <h4 className="font-semibold mt-4 text-(--primary)">
                ⏱️ Time to MVP
              </h4>
              <p>{currentIdea.timeToMVP}</p>

              <h4 className="font-semibold mt-4 text-(--primary)">
                🌍 Geography
              </h4>
              <p>{currentIdea.geography}</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-lg mb-3">
              <Sparkles className="inline w-5 h-5 text-(--primary)" /> MVP
              Roadmap
            </h3>
            <ol className="list-decimal pl-5 space-y-2">
              {currentIdea.mvpSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="flex flex-wrap gap-3 mt-8 justify-center">
            <button
              onClick={handleCopy}
              className="px-4 py-2 border border-(--border) rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2 border border-(--border) rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download
            </button>

            <button
              onClick={generateIdea}
              className="px-4 py-2 bg-(--primary) text-(--primary-foreground) rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              New Idea
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-(--border) rounded-2xl p-12 text-center">
          <Sparkles className="w-12 h-12 text-(--primary) mx-auto mb-4" />
          <h3 className="font-semibold text-lg text-(--foreground)">
            Ready to discover your next big idea?
          </h3>
          <p className="text-(--muted-foreground)">
            Click generate to get started.
          </p>
        </div>
      )}

      {/* Toast */}
      {message && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-(--card) border border-(--border) px-6 py-3 rounded-xl shadow-lg">
          {message}
        </div>
      )}
    </div>
  );
}
