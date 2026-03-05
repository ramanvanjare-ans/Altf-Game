import { useState } from 'react';

const questions = [
  {
    id: 1,
    question: "What is your natural hair type?",
    options: ["Straight", "Wavy", "Curly", "Coily/Kinky"]
  },
  {
    id: 2,
    question: "How would you describe your hair's current condition?",
    options: ["Healthy and shiny", "Dry and brittle", "Oily and greasy", "Frizzy and unmanageable"]
  },
  {
    id: 3,
    question: "What is your main hair concern?",
    options: ["Hair loss/thinning", "Dandruff/itchy scalp", "Split ends/breakage", "Lack of volume"]
  },
  {
    id: 4,
    question: "How often do you wash your hair?",
    options: ["Daily", "Every 2-3 days", "Once a week", "Less than once a week"]
  },
  {
    id: 5,
    question: "Do you use heat styling tools regularly?",
    options: ["Yes, almost daily", "A few times a week", "Occasionally", "Never"]
  },
  {
    id: 6,
    question: "What's your hair length?",
    options: ["Short (above shoulders)", "Medium (shoulder length)", "Long (below shoulders)", "Very long"]
  }
];

const hairCareSuggestions = {
  "Straight": {
    description: "Straight hair tends to get oily quickly at the roots but dry at the ends.",
    tips: [
      "Use a gentle, sulfate-free shampoo",
      "Focus conditioner on the ends of your hair",
      "Wash hair every 2-3 days to maintain natural oils",
      "Use lightweight products to avoid weighing hair down"
    ],
    products: ["Dry shampoo for oily roots", "Lightweight leave-in conditioner", "Heat protectant spray"]
  },
  "Wavy": {
    description: "Wavy hair needs balance between moisture and protein to maintain its wave pattern.",
    tips: [
      "Use a hydrating shampoo and conditioner",
      "Apply curl cream or mousse to enhance waves",
      "Scrunch hair while drying to encourage wave formation",
      "Deep condition once a week"
    ],
    products: ["Sea salt spray", "Curl enhancing cream", "Microfiber towel for scrunching"]
  },
  "Curly": {
    description: "Curly hair is naturally dry and needs lots of moisture and gentle handling.",
    tips: [
      "Co-wash (wash with conditioner) instead of shampoo",
      "Apply products to soaking wet hair",
      "Use the 'plopping' technique to dry hair",
      "Sleep with hair in a protective style like pineapple"
    ],
    products: ["Leave-in conditioner", "Curl gel", "Deep conditioning mask", "Silk/satin pillowcase"]
  },
  "Coily/Kinky": {
    description: "Coily hair is the most fragile and requires maximum moisture and protection.",
    tips: [
      "Seal moisture with oils after washing",
      "Protective styles are essential for length retention",
      "Detangle gently with fingers and wide-tooth comb",
      "Nighttime protection with silk/satin bonnet"
    ],
    products: ["Shea butter", "Coconut oil", "Wide-tooth comb", "Silk bonnet"]
  }
};

export default function ToolHome() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [hairProfile, setHairProfile] = useState(null);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      generateHairProfile(newAnswers);
      setShowResults(true);
    }
  };

  const generateHairProfile = (userAnswers) => {
    const hairType = userAnswers[0];
    const condition = userAnswers[1];
    const concern = userAnswers[2];
    const washingFrequency = userAnswers[3];
    const heatUsage = userAnswers[4];
    
    let routine = "Based on your answers, here's your personalized hair care routine:\n\n";
    
    if (washingFrequency === "Daily") {
      routine += "• Consider washing less frequently to preserve natural oils\n";
    } else if (washingFrequency === "Less than once a week") {
      routine += "• You might need to wash more regularly to prevent buildup\n";
    }
    
    if (heatUsage === "Yes, almost daily") {
      routine += "• Reduce heat styling to prevent damage\n";
      routine += "• Always use heat protectant products\n";
    }
    
    if (condition === "Dry and brittle") {
      routine += "• Focus on deep conditioning treatments\n";
      routine += "• Incorporate hair oils into your routine\n";
    } else if (condition === "Oily and greasy") {
      routine += "• Use clarifying shampoo occasionally\n";
      routine += "• Avoid over-conditioning roots\n";
    }

    setHairProfile({
      type: hairType,
      concerns: [concern, condition],
      routine
    });
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setHairProfile(null);
  };

  const getSuggestionForHairType = (hairType) => {
    return hairCareSuggestions[hairType] || hairCareSuggestions["Straight"];
  };

  return (
    <div className="min-h-screen bg-(--background ) text-(--foreground) p-4">
    <div>
      <h1 className="heading text-center mt-5 animate-fade-up">Hair Care </h1>
          <p className="description text-center animate-fade-up">Get personalized hair care recommendations</p>
      </div>


      <div className="max-w-2xl mx-auto mt-10">
        

        {!showResults ? (
          <div className="bg-(--card) rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-(--foregorund)">Question {currentQuestion + 1} of {questions.length}</span>
                <span className="text-sm text-(--foreground">{Math.round(((currentQuestion) / questions.length) * 100)}%</span>
              </div>
              <div className="w-full bg-(--card) rounded-full h-2">
                <div 
                  className="bg-
                  (--card) h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">
                {questions[currentQuestion].question}
              </h2>
              
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className="w-full text-left p-4 border-2 border-(--border) rounded-lg transition-all duration-200 focus:outline-none cursor-pointer "
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-(--card) rounded-lg shadow-lg p-8 space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Your Hair  Results</h2>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-(--primary) text-white rounded-full mb-4">
                <span className="text-2xl">✨</span>
              </div>
            </div>

            {hairProfile && (
              <div className="space-y-6">
                <div className="bg-(--card) p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Your Hair Type: {hairProfile.type}</h3>
                  <p className="text-(--foreground) mb-4">
                    {getSuggestionForHairType(hairProfile.type).description}
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Care Tips:</h4>
                      <ul className="list-disc list-inside space-y-1 text-(--foreground)">
                        {getSuggestionForHairType(hairProfile.type).tips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Recommended Products:</h4>
                      <div className="flex flex-wrap gap-2">
                        {getSuggestionForHairType(hairProfile.type).products.map((product, index) => (
                          <span key={index} className="bg-(--card) text-(--foreground) px-3 py-1 rounded-full text-sm">
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-(--card) p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Your Personalized Routine</h3>
                  <p className="text-(--foreground) whitespace-pre-line">{hairProfile.routine}</p>
                </div>

                <div className="text-center pt-4">
                  <button
                    onClick={restartQuiz}
                    className="bg-(--primary) text-white px-8 py-3 rounded-lg font-semibold  transition-colors duration-200 cursor-pointer"
                  >
                    Retake Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
