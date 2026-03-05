"use client";

import React, { useState } from "react";
import {
  PlusCircle,
  Trash2,
  Edit,
  Play,
  Share2,
  Move,
  Eye,
} from "lucide-react";

export default function QuizBuilder({ onStartQuiz }) {
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    timeLimit: 30,
    questions: [],
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);

  /* ================= ADD / UPDATE QUESTION ================= */

  const addQuestion = () => {
    if (
      currentQuestion.question.trim() &&
      currentQuestion.options.every((o) => o.trim())
    ) {
      if (isEditing) {
        const updated = [...quiz.questions];
        updated[editIndex] = currentQuestion;
        setQuiz({ ...quiz, questions: updated });
        setIsEditing(false);
        setEditIndex(-1);
      } else {
        setQuiz({
          ...quiz,
          questions: [...quiz.questions, currentQuestion],
        });
      }

      setCurrentQuestion({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      });
    }
  };

  const editQuestion = (index) => {
    setCurrentQuestion(quiz.questions[index]);
    setIsEditing(true);
    setEditIndex(index);
  };

  const deleteQuestion = (index) => {
    const updated = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions: updated });

    if (editIndex === index) {
      setIsEditing(false);
      setEditIndex(-1);
    }
  };

  const moveQuestion = (index, direction) => {
    const updated = [...quiz.questions];

    if (direction === "up" && index > 0) {
      [updated[index], updated[index - 1]] = [
        updated[index - 1],
        updated[index],
      ];
    }

    if (direction === "down" && index < updated.length - 1) {
      [updated[index], updated[index + 1]] = [
        updated[index + 1],
        updated[index],
      ];
    }

    setQuiz({ ...quiz, questions: updated });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const generateShareableLink = () => {
    const quizData = encodeURIComponent(JSON.stringify(quiz));
    return `${window.location.origin}?quiz=${quizData}`;
  };

  /* ========================================================= */

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">

      {/* HEADER */}
      <div className="text-center space-y-4">
        <h1 className="heading text-(--primary)">
          Quiz Builder
        </h1>
        <p className="description max-w-2xl mx-auto">
         Create interactive quizzes easily with customizable questions.
        </p>
      </div>

      {/* QUIZ SETTINGS */}
      <div className="bg-(--card) border border-(--border) rounded-3xl p-8 space-y-6 shadow-xl">

        <h2 className="subheading">Quiz Settings</h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="space-y-2">
            <label className="text-sm font-medium">Quiz Title</label>
            <input
              type="text"
              value={quiz.title}
              onChange={(e) =>
                setQuiz({ ...quiz, title: e.target.value })
              }
              className="w-full p-3 rounded-xl border border-(--border) bg-(--background)"
              placeholder="Enter title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Time Limit (sec per question)
            </label>
            <input
              type="number"
              min="10"
              max="300"
              value={quiz.timeLimit}
              onChange={(e) =>
                setQuiz({
                  ...quiz,
                  timeLimit: parseInt(e.target.value),
                })
              }
              className="w-full p-3 rounded-xl border border-(--border) bg-(--background)"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            value={quiz.description}
            onChange={(e) =>
              setQuiz({ ...quiz, description: e.target.value })
            }
            className="w-full p-3 rounded-xl border border-(--border) bg-(--background)"
            rows={3}
          />
        </div>
      </div>

      {/* QUESTION BUILDER */}
      <div className="bg-(--card) border border-(--border) rounded-3xl p-8 space-y-6 shadow-xl">

        <h2 className="subheading">
          {isEditing ? "Edit Question" : "Add Question"}
        </h2>

        <textarea
          value={currentQuestion.question}
          onChange={(e) =>
            setCurrentQuestion({
              ...currentQuestion,
              question: e.target.value,
            })
          }
          placeholder="Enter question..."
          className="w-full p-3 rounded-xl border border-(--border) bg-(--background)"
        />

        <div className="grid md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex gap-3">
              <input
                value={option}
                onChange={(e) =>
                  handleOptionChange(index, e.target.value)
                }
                placeholder={`Option ${String.fromCharCode(
                  65 + index
                )}`}
                className="flex-1 p-3 rounded-xl border border-(--border) bg-(--background)"
              />
              <button
                onClick={() =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    correctAnswer: index,
                  })
                }
                className={`px-4 rounded-xl border cursor-pointer ${
                  currentQuestion.correctAnswer === index
                    ? "bg-(--primary) text-(--primary-foreground)"
                    : "border-(--border)"
                }`}
              >
                ✓
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addQuestion}
          className="w-full py-3 rounded-xl bg-(--primary) text-(--primary-foreground) font-semibold hover:opacity-90 transition cursor-pointer"
        >
          {isEditing ? "Update Question" : "Add Question"}
        </button>
      </div>

      {/* QUESTIONS LIST */}
      {quiz.questions.length > 0 && (
        <div className="bg-(--card) border border-(--border) rounded-3xl p-8 shadow-xl space-y-6">

          <h2 className="subheading">
            Quiz Questions ({quiz.questions.length})
          </h2>

          {quiz.questions.map((q, index) => (
            <div
              key={index}
              className="border border-(--border) rounded-xl p-6 space-y-4"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-semibold">
                  Q{index + 1}: {q.question}
                </h4>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      moveQuestion(index, "up")
                    }
                    disabled={index === 0}
                    className="p-2 hover:bg-(--muted) rounded-lg disabled:opacity-30 cursor-pointer" 
                  >
                    <Move className="w-4 h-4 rotate-90" />
                  </button>

                  <button
                    onClick={() =>
                      moveQuestion(index, "down")
                    }
                    disabled={
                      index === quiz.questions.length - 1
                    }
                    className="p-2 hover:bg-(--muted) rounded-lg disabled:opacity-30 cursor-pointer"
                  >
                    <Move className="w-4 h-4 -rotate-90" />
                  </button>

                  <button
                    onClick={() => editQuestion(index)}
                    className="p-2 hover:bg-(--muted) rounded-lg cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteQuestion(index)}
                    className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                {q.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border ${
                      i === q.correctAnswer
                        ? "bg-(--primary)/10 border-(--primary)"
                        : "border-(--border)"
                    }`}
                  >
                    <strong>
                      {String.fromCharCode(65 + i)}:
                    </strong>{" "}
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ACTION BUTTONS */}
      {quiz.questions.length > 0 &&
        quiz.title.trim() && (
          <div className="flex flex-wrap justify-center gap-4">

            <button
              onClick={() => onStartQuiz(quiz)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-(--primary) text-(--primary-foreground) font-semibold hover:opacity-90 transition cursor-pointer"
            >
              <Play className="w-4 h-4" />
              Start Quiz
            </button>

            <button
              onClick={() => onStartQuiz(quiz)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-(--border) hover:bg-(--muted) transition cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  generateShareableLink()
                );
                alert("Quiz link copied!");
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-(--border) hover:bg-(--muted) transition cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>

          </div>
        )}
    </div>
  );
}
