"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import PollChart from "./PollChart";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

export default function PollMaker() {
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [votes, setVotes] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleOptionChange = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const addOption = () => setPollOptions([...pollOptions, ""]);

  const createPoll = () => {
    if (
      pollQuestion.trim() === "" ||
      pollOptions.some((opt) => opt.trim() === "")
    ) {
      alert("Please enter question and all options!");
      return;
    }
    setVotes(new Array(pollOptions.length).fill(0));
  };

  const handleVote = (index) => {
    const newVotes = [...votes];
    newVotes[index] += 1;
    setVotes(newVotes);

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1500);
  };

  return (
    <div className="min-h-screen bg-(--background) text-(--foreground) px-4 py-10">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={80}
        />
      )}

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Title */}
        <h1 className="heading text-center">Poll Maker</h1>
        <p className="description mt-5 max-w-2xl mx-auto">
          Create interactive polls quickly and collect real-time responses.
        </p>
        {/* Create Poll Card */}
        <div className="bg-(--card) border border-(--border) rounded-2xl p-6 shadow-md space-y-4">
          <input
            type="text"
            placeholder="Enter your question"
            value={pollQuestion}
            onChange={(e) => setPollQuestion(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-(--background) border border-(--border) focus:ring-2 focus:ring-(--primary) outline-none transition"
          />

          {pollOptions.map((option, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-(--background) border border-(--border) focus:ring-2 focus:ring-(--primary) outline-none transition"
            />
          ))}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={addOption}
              className="flex-1 px-4 py-3 rounded-xl bg-(--primary) text-white font-medium hover:opacity-90 transition cursor-pointer"
            >
              <span className="text-2xl"> + </span> Add Option
            </button>

            <button
              onClick={createPoll}
              className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-green-600 to-emerald-600 text-white font-medium hover:opacity-90 transition cursor-pointer"
            >
              ✅ Create Poll
            </button>
          </div>
        </div>

        {/* Voting Card */}
        {votes.length > 0 && (
          <div className="bg-(--card) border border-(--border) rounded-2xl p-6 shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-center">
              {pollQuestion}
            </h2>

            <div className="flex flex-col gap-3">
              {pollOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleVote(index)}
                  className="px-4 py-3 rounded-xl bg-(--muted) hover:bg-(--primary) hover:text-white transition font-medium cursor-pointer"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chart */}
        {votes.length > 0 && <PollChart options={pollOptions} votes={votes} />}
      </div>
    </div>
  );
}
