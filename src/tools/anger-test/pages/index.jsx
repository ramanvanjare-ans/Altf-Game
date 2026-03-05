"use client";



import { useState } from 'react';
import { questions } from '../utils/question';
import { angerLevels } from '../utils/level';




// Calculate anger level based on answers
const calculateAngerLevel = (answers) => {
  const totalScore = answers.reduce((sum, ans) => sum + ans.value, 0);
  
  if (totalScore <= 15) return angerLevels.minimal;
  if (totalScore <= 25) return angerLevels.low;
  if (totalScore <= 35) return angerLevels.moderate;
  if (totalScore <= 42) return angerLevels.elevated;
  return angerLevels.high;
};

// Progress Bar Component
const ProgressBar = ({ current, total }) => {
  const progress = (current / total) * 100;
  return (
    <div className="w-full bg-(--card) rounded-full h-3 mb-8">
     
      <div 
        className="bg-(--primary) h-3 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
      <p className="text-sm text-(--muted-foreground) mt-2  mb-8 text-center">
        Question {current} of {total}
      </p>
    </div>
  );
};

// Result Card Component
const ResultCard = ({ levelData, score }) => (
  <div className="max-w-4xl mx-auto">
    <div className="text-center mb-8">
      <div className="text-8xl mb-4">{levelData.icon}</div>
      <h2 className="text-4xl font-bold mb-2">
        {levelData.level}
      </h2>
      <p className="text-xl text-(--foreground) mb-4">
        Score: {score} points ({levelData.range})
      </p>
      <p className="text-lg text-(--foreground) leading-relaxed max-w-2xl mx-auto">
        {levelData.description}
      </p>
    </div>

    {/* Suggestions Section */}
    <div className="rounded-2xl p-6 mb-6 border-2 border-(--border)">
      <h3 className="subheading mb-4 flex items-center gap-2">
        💡 Suggestions for You
      </h3>
      <ul className="space-y-3">
        {levelData.suggestions.map((suggestion, index) => (
          <li key={index} className="flex items-start gap-3 text-(--muted-foreground)">
            <span className="shrink-0 w-6 h-6 bg-(--card) text-(--foreground) rounded-full flex items-center justify-center text-sm font-bold">
              {index + 1}
            </span>
            {suggestion}
          </li>
        ))}
      </ul>
    </div>

    {/* Personalized Tips Section */}
    <div className="grid md:grid-cols-3 gap-6">
      {/* Immediate Actions */}
      <div className="bg-(--card) rounded-2xl p-5 border-2 border-(--border)">
        <h3 className="text-xl font-bold text-(--foreground) mb-4 flex items-center gap-2">
          ⚡ Immediate Actions
        </h3>
        <ul className="space-y-3">
          {levelData.tips.immediate.map((tip, index) => (
            <li key={index} className="flex items-start gap-2 text-(--muted-foreground) text-sm">
              <span className="shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                ✓
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Long Term Strategies */}
      <div className="bg-(--card) rounded-2xl p-5 border-2 border-(--border)">
        <h3 className="text-xl font-bold text-(--foreground) mb-4 flex items-center gap-2">
          🎯 Long-term Strategies
        </h3>
        <ul className="space-y-3">
          {levelData.tips.longTerm.map((tip, index) => (
            <li key={index} className="flex items-start gap-2 text-(--muted-foreground) text-sm">
              <span className="shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                ✓
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Lifestyle Changes */}
      <div className="bg-(--card) rounded-2xl p-5 border-2 border-(--border)">
        <h3 className="text-xl font-bold text-(--foreground) mb-4 flex items-center gap-2">
          🌿 Lifestyle Changes
        </h3>
        <ul className="space-y-3">
          {levelData.tips.lifestyle.map((tip, index) => (
            <li key={index} className="flex items-start gap-2 text-(--muted-foreground) text-sm">
              <span className="shrink-0 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">
                ✓
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* Disclaimer */}
    <div className="mt-8 p-4 bg-(--card) rounded-xl border-l-4 border-gray-400">
      <p className="text-sm text-(--muted-foreground)">
        <strong>Important Disclaimer:</strong> This assessment is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. If you're experiencing persistent anger issues or thoughts of self-harm, please consult a qualified mental health professional.
      </p>
    </div>

    {/* Restart Button */}
    <button
      onClick={() => window.location.reload()}
      className="mt-8 px-8 py-4 bg-(--primary) text-white rounded-xl font-semibold text-lg  transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
    >
      🔄 Take Assessment Again
    </button>
  </div>
);

// Question Card Component
const QuestionCard = ({ 
  question, 
  onAnswer, 
  questionNumber,
  totalQuestions 
}) => (
  <div className="max-w-2xl mx-auto pt-16">
    <h1 className=" subheading text-center pb-5">Give Your Answers</h1>


    <ProgressBar current={questionNumber} total={totalQuestions}  />
    
    <div className="bg-(--card) rounded-2xl p-8 shadow-lg border-2 border-(--border) pt-5 mt-15">
      <h2 className="text-2xl font-bold text-(--foreground) mb-6 leading-relaxed">
        {question.text}
      </h2>
      
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option.value)}
            className="w-full p-4 text-left rounded-xl border-2 border-(--border)  transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <span className="shrink-0 w-8 h-8 bg-(--card)  rounded-lg flex items-center justify-center font-semibold transition-colors ">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-(--muted-foreground)  font-medium">
                {option.text}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
);

// Start Screen Component
const StartScreen = ({ onStart }) => (
  <div className="max-w-2xl mx-auto text-center">
    <div className="mb-8">
      
      <h1 className="heading text-center animate-fade-up mb-4">
        Anger  Test
      </h1>
      <p className="description text-center animate-fade-up">
        Understand your anger responses and get personalized suggestions for better emotional health.
      </p>
    </div>

    <div className="bg-(--card) rounded-2xl p-8 mb-8 border-2 border-(--border)">
      <h2 className="subheading mb-6">How It Works</h2>
      <div className="grid gap-6">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 bg-(--card) text-(--foreground) rounded-xl flex items-center justify-center font-bold text-xl">
            1
          </div>
          <div>
            <h3 className="font-bold (--foreground)">Answer 10 Questions</h3>
            <p className="text-(--muted-foreground)">Simple questions about your typical reactions</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 bg-(--card) text-(--foreground) rounded-xl flex items-center justify-center font-bold text-xl">
            2
          </div>
          <div>
            <h3 className="font-bold text-foreground">Get Your Score</h3>
            <p className="text-(--muted-foreground)">Receive your personalized anger level analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 bg-(--card) text-(--foreground) rounded-xl flex items-center justify-center font-bold text-xl">
            3
          </div>
          <div>
            <h3 className="font-bold text-(--foreground)">Receive Personalized Tips</h3>
            <p className="text-(--muted-foreground)">Get suggestions tailored to your anger level</p>
          </div>
        </div>
      </div>
    </div>

    <button
      onClick={onStart}
      className="px-10 py-5 bg-(--primary) text-white rounded-xl font-semibold text-xl  transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
    >
      Start Assessment →
    </button>

    <p className="mt-6 text-(--muted-foreground) text-sm">
      Takes approximately 2-3 minutes • 100% private and confidential
    </p>
  </div>
);

// Main App Component
export default  function ToolHome() {
  const [currentStep, setCurrentStep] = useState('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const handleStart = () => {
    setCurrentStep('question');
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const handleAnswer = (value) => {
    const newAnswers = [...answers, { questionId: questions[currentQuestion].id, value }];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate result
      const levelData = calculateAngerLevel(newAnswers);
      const score = newAnswers.reduce((sum, ans) => sum + ans.value, 0);
      setResult({ levelData, score });
      setCurrentStep('result');
    }
  };

  return (
    <div className="min-h-screen bg-(--background)">
      

      {/* Main Content */}
      <main className="py-12 px-4">
        {currentStep === 'start' && (
          <StartScreen onStart={handleStart} />
        )}

        {currentStep === 'question' && (
          <QuestionCard
            question={questions[currentQuestion]}
            onAnswer={handleAnswer}
            questionNumber={currentQuestion + 1}
            totalQuestions={questions.length}
          />
        )}

        {currentStep === 'result' && result && (
          <ResultCard levelData={result.levelData} score={result.score} />
        )}
      </main>

     
    </div>
  );
}
