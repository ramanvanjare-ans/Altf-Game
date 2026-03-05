"use client";

import React, { useState, useEffect } from "react";
import QuizBuilder from "./QuizBuilder";
import QuizTaker from "./QuizTaker";

export default function QuizApp({ isStandalone = false }) {
  const [currentView, setCurrentView] = useState("loading");
  const [currentQuiz, setCurrentQuiz] = useState(null);

  useEffect(() => {
    if (isStandalone) {
      const urlParams = new URLSearchParams(window.location.search);
      const sharedQuiz = urlParams.get("quiz");

      if (sharedQuiz) {
        try {
          const quizData = JSON.parse(
            decodeURIComponent(sharedQuiz)
          );

          setCurrentQuiz(quizData);
          setCurrentView("taker");

          // Clean URL
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        } catch (error) {
          console.error("Failed to load shared quiz:", error);
          setCurrentView("builder");
        }
      } else {
        setCurrentView("builder");
      }
    } else {
      setCurrentView("builder");
    }
  }, [isStandalone]);

  const startQuiz = (quiz) => {
    const quizWithId = {
      ...quiz,
      id: quiz.id || "quiz-" + Date.now(),
    };

    setCurrentQuiz(quizWithId);
    setCurrentView("taker");
  };

  const backToBuilder = () => {
    setCurrentView("builder");
    setCurrentQuiz(null);
  };

  const finishQuiz = (results) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Quiz finished:", results);
    }
  };

  if (currentView === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--background) text-(--foreground)">
        <div className="animate-pulse text-lg font-semibold">
          Loading Quiz...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--background) text-(--foreground) transition-colors duration-300">

      {currentView === "builder" ? (
        <QuizBuilder onStartQuiz={startQuiz} />
      ) : (
        <QuizTaker
          quiz={currentQuiz}
          onFinish={finishQuiz}
          onBackToBuilder={backToBuilder}
        />
      )}

    </div>
  );
}
