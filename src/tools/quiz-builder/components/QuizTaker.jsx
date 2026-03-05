"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  ArrowLeft,
  Trophy,
  Timer
} from "lucide-react";

export default function QuizTaker({ quiz, onFinish, onBackToBuilder }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [startTime, setStartTime] = useState(null);


  /* ================= TIMER ================= */
  useEffect(() => {
    let timer;

    if (quizStarted && !quizFinished && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0 && quizStarted && !quizFinished) {
      handleNextQuestion();
    }

    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, quizFinished]);

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(quiz.timeLimit);
    setStartTime(Date.now());
  };

  const selectAnswer = (index) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion]: index,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTimeLeft(quiz.timeLimit);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    let correct = 0;

    quiz.questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctAnswer) correct++;
    });

    const endTime = Date.now();
  const timeUsed = Math.floor((endTime - startTime) / 1000);

    setScore(correct);
    setTimeTaken(timeUsed)
    setQuizFinished(true);
    setQuizStarted(false);

    onFinish({
      score: correct,
      totalQuestions: quiz.questions.length,
      timeTaken: timeUsed,
      correctAnswers: correct,
      selectedAnswers,
      quizId: quiz.id,
    });
  };

//   const restartQuiz = () => {
//     setCurrentQuestion(0);
//     setSelectedAnswers({});
//     setTimeLeft(quiz.timeLimit);
//     setQuizStarted(false);
//     setQuizFinished(false);
//     setScore(0);
//     setTimeTaken(0);
//   };
const restartQuiz = () => {
  setCurrentQuestion(0);
  setSelectedAnswers({});
  setTimeLeft(quiz.timeLimit);
  setQuizStarted(false);
  setQuizFinished(false);
  setScore(0);
  setTimeTaken(0);
  setStartTime(null);
};


  const progress =
    ((currentQuestion + 1) / quiz.questions.length) * 100;

  /*
     RESULT SCREEN
*/
  if (quizFinished) {
    const percentage = Math.round(
      (score / quiz.questions.length) * 100
    );

    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-(--card) border border-(--border) rounded-3xl p-10 shadow-xl text-center">

          <div className="mx-auto w-20 h-20 bg-(--primary) rounded-full flex items-center justify-center mb-6">
            <Trophy className="w-10 h-10 text-(--primary-foreground)" />
          </div>

          <h2 className="text-3xl font-bold mb-4">
            Quiz Complete!
          </h2>

          <p className="text-6xl font-bold text-(--primary) mb-4">
            {score}/{quiz.questions.length}
          </p>

          <p className="text-muted-foreground mb-8">
            {percentage}% Correct
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatBox title="Correct">{score}</StatBox>
            <StatBox title="Time Taken">{timeTaken}s</StatBox>
            <StatBox title="Performance">
              {percentage >= 80
                ? "Expert"
                : percentage >= 60
                ? "Intermediate"
                : "Beginner"}
            </StatBox>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PrimaryBtn onClick={restartQuiz}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </PrimaryBtn>

            <OutlineBtn onClick={onBackToBuilder}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Create New Quiz
            </OutlineBtn>
          </div>

        </div>
      </div>
    );
  }

  /* 
     START SCREEN
 */
  if (!quizStarted) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-(--card) border border-(--border) rounded-3xl p-10 text-center shadow-xl">

          <h1 className="text-4xl font-bold text-(--primary)">
            {quiz.title}
          </h1>

          {quiz.description && (
            <p className="text-muted-foreground mt-4">
              {quiz.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-6 my-8">
            <StatBox title="Questions">
              {quiz.questions.length}
            </StatBox>
            <StatBox title="Time Per Question">
              {quiz.timeLimit}s
            </StatBox>
          </div>

          <PrimaryBtn onClick={startQuiz} className="mt-10">
            Start Quiz
          </PrimaryBtn>

        </div>
      </div>
    );
  }

  /*
     QUESTION SCREEN
   */

  const question = quiz.questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-(--card) border border-(--border) rounded-3xl p-8 shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of{" "}
            {quiz.questions.length}
          </span>

          <div className="flex items-center gap-2 text-(--primary) font-semibold">
            <Timer className="w-4 h-4" />
            {timeLeft}s
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-(--border) rounded-full mb-6">
          <div
            className="h-2 bg-(--primary) rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <h2 className="text-xl font-semibold mb-6">
          {question.question}
        </h2>

        <div className="space-y-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => selectAnswer(index)}
              className={`w-full p-4 rounded-xl border transition text-left
                ${
                  selectedAnswers[currentQuestion] === index
                    ? "bg-(--primary) text-(--primary-foreground)"
                    : "border-(--border) hover:bg-(--muted)"
                }`}
            >
              <span className="font-bold mr-3">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <OutlineBtn onClick={onBackToBuilder}>
            Exit Quiz
          </OutlineBtn>

          <PrimaryBtn
            onClick={handleNextQuestion}
            disabled={
              selectedAnswers[currentQuestion] === undefined
            }
          >
            {currentQuestion <
            quiz.questions.length - 1
              ? "Next"
              : "Finish"}
          </PrimaryBtn>
        </div>

      </div>
    </div>
  );
}

/* REUSABLE Button UI */

function PrimaryBtn({ children, ...props }) {
  return (
    <button
      {...props}
      className="px-6 py-3 rounded-xl bg-(--primary) text-(--primary-foreground) font-semibold hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
    >
      {children}
    </button>
  );
}

function OutlineBtn({ children, ...props }) {
  return (
    <button
      {...props}
      className="px-6 py-3 rounded-xl border border-(--border) hover:bg-(--muted) transition cursor-pointer"
    >
      {children}
    </button>
  );
}

function StatBox({ title, children }) {
  return (
    <div className="bg-(--background) border border-(--border) rounded-xl p-4">
      <p className="text-2xl font-bold text-(--primary)">
        {children}
      </p>
      <p className="text-sm text-(--muted-foreground)">
        {title}
      </p>
    </div>
  );
}
