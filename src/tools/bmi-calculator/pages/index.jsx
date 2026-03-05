
import React, { useState, useEffect } from 'react';
import { Activity, Heart, Droplet, Flame, TrendingDown, TrendingUp, Download, RotateCcw, AlertCircle } from 'lucide-react';

export default function ToolHome() {
  const [heightUnit, setHeightUnit] = useState('cm');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [history, setHistory] = useState([]);

  // Load history from memory on mount

  useEffect(() => {
    const saved = localStorage.getItem('bmiHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load history');
      }
    }
  }, []);

  const getHeightInCm = () => {
    if (heightUnit === 'cm') {
      return parseFloat(heightCm);
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      return (ft * 30.48) + (inches * 2.54);
    }
  };

  const getWeightInKg = () => {
    if (weightUnit === 'kg') {
      return parseFloat(weight);
    } else {
      return parseFloat(weight) * 0.453592;
    }
  };

  const validateInputs = () => {
    const newErrors = {};
    const heightValue = getHeightInCm();
    const weightValue = getWeightInKg();

    if (heightUnit === 'cm' && !heightCm) {
      newErrors.height = 'Please enter your height';
    } else if (heightUnit === 'ft' && (!heightFt || !heightIn)) {
      newErrors.height = 'Please enter both feet and inches';
    } else if (isNaN(heightValue) || heightValue < 50 || heightValue > 300) {
      newErrors.height = 'Height must be between 50-300 cm';
    }

    if (!weight) {
      newErrors.weight = 'Please enter your weight';
    } else if (isNaN(weightValue) || weightValue < 10 || weightValue > 500) {
      newErrors.weight = 'Weight must be between 10-500 kg';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { name: 'Underweight', color: '#3B82F6', zone: 0 };
    if (bmi < 25) return { name: 'Normal', color: '#10B981', zone: 1 };
    if (bmi < 30) return { name: 'Overweight', color: '#F59E0B', zone: 2 };
    return { name: 'Obese', color: '#EF4444', zone: 3 };
  };

  const calculateBMR = (weight, height, age, gender) => {
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };

  const estimateBodyFat = (bmi, age, gender) => {
    if (age < 18) return null;
    const genderFactor = gender === 'male' ? 1 : 0;
    return (1.20 * bmi) + (0.23 * age) - (10.8 * genderFactor) - 5.4;
  };

  const calculate = () => {
    if (!validateInputs()) return;

    const heightValue = getHeightInCm();
    const weightValue = getWeightInKg();
    const heightM = heightValue / 100;
    const bmi = weightValue / (heightM * heightM);

    if (bmi < 10 || bmi > 60) {
      setErrors({ general: 'Unrealistic input - please check your values' });
      return;
    }

    const category = getBMICategory(bmi);
    const waterIntake = weightValue * 0.033;
    
    const idealWeightMin = 18.5 * heightM * heightM;
    const idealWeightMax = 24.9 * heightM * heightM;

    let calories = null;
    let bmr = null;
    let bodyFat = null;

    if (age && gender) {
      const ageNum = parseInt(age);
      if (ageNum >= 1 && ageNum <= 120) {
        bmr = calculateBMR(weightValue, heightValue, ageNum, gender);
        calories = {
          maintenance: Math.round(bmr * 1.55),
          loss: Math.round(bmr * 1.55 - 500),
          gain: Math.round(bmr * 1.55 + 500)
        };
        bodyFat = estimateBodyFat(bmi, ageNum, gender);
      }
    }

    let goalPlan = null;
    if (targetWeight) {
      const targetKg = weightUnit === 'kg' ? parseFloat(targetWeight) : parseFloat(targetWeight) * 0.453592;
      const diff = Math.abs(targetKg - weightValue);
      
      if (diff > 40) {
        setErrors({ target: 'Caution: Target weight difference exceeds 40 kg' });
      } else if (targetKg === weightValue) {
        setErrors({ target: 'Target weight must be different from current weight' });
      } else {
        const weeks = Math.ceil(diff / 0.5);
        goalPlan = {
          target: targetKg,
          difference: targetKg - weightValue,
          weeks,
          weeklyChange: 0.5
        };
      }
    }

    const newResult = {
      bmi: bmi.toFixed(2),
      category,
      height: heightValue,
      weight: weightValue,
      waterIntake: waterIntake.toFixed(2),
      idealWeight: {
        min: idealWeightMin.toFixed(1),
        max: idealWeightMax.toFixed(1)
      },
      calories,
      bmr: bmr ? bmr.toFixed(0) : null,
      bodyFat: bodyFat ? bodyFat.toFixed(1) : null,
      goalPlan,
      date: new Date().toISOString()
    };

    setResult(newResult);

    // Save to history (max 10 records)
    const newHistory = [newResult, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('bmiHistory', JSON.stringify(newHistory));
  };

  const reset = () => {
    setHeightCm('');
    setHeightFt('');
    setHeightIn('');
    setWeight('');
    setAge('');
    setGender('');
    setTargetWeight('');
    setResult(null);
    setErrors({});
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('bmiHistory');
  };

  const getSuggestions = (category) => {
    const suggestions = {
      'Underweight': {
        diet: 'Increase calorie intake with nutrient-dense foods, protein shakes, and healthy fats',
        exercise: 'Focus on strength training to build muscle mass'
      },
      'Normal': {
        diet: 'Maintain balanced diet with whole foods, lean proteins, and vegetables',
        exercise: 'Mix of cardio and strength training 3-5 times per week'
      },
      'Overweight': {
        diet: 'Reduce portion sizes, limit processed foods, increase vegetables and lean proteins',
        exercise: 'Regular cardio 4-5 times per week combined with strength training'
      },
      'Obese': {
        diet: 'Consult a nutritionist for a personalized meal plan, focus on calorie deficit',
        exercise: 'Start with low-impact activities like walking, swimming, gradually increase intensity'
      }
    };
    return suggestions[category] || suggestions['Normal'];
  };

  const generatePDF = () => {
    if (!result) return;

    const content = `
      BMI HEALTH REPORT
      Generated: ${new Date().toLocaleDateString()}
      
      MEASUREMENTS
      Height: ${result.height.toFixed(1)} cm
      Weight: ${result.weight.toFixed(1)} kg
      Age: ${age || 'N/A'}
      Gender: ${gender || 'N/A'}
      
      BMI ANALYSIS
      BMI: ${result.bmi}
      Category: ${result.category.name}
      
      IDEAL WEIGHT RANGE
      ${result.idealWeight.min} - ${result.idealWeight.max} kg
      
      DAILY RECOMMENDATIONS
      Water Intake: ${result.waterIntake} liters
      ${result.bmr ? `BMR: ${result.bmr} calories` : ''}
      ${result.calories ? `Maintenance: ${result.calories.maintenance} cal/day` : ''}
      ${result.calories ? `Weight Loss: ${result.calories.loss} cal/day` : ''}
      ${result.calories ? `Weight Gain: ${result.calories.gain} cal/day` : ''}
      ${result.bodyFat ? `Estimated Body Fat: ${result.bodyFat}%` : ''}
      
      RECOMMENDATIONS
      Diet: ${getSuggestions(result.category.name).diet}
      Exercise: ${getSuggestions(result.category.name).exercise}
      
      Disclaimer: This is an estimate only. Consult healthcare professionals for medical advice.
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bmi-health-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const isCalculateDisabled = () => {
    if (heightUnit === 'cm' && (!heightCm || parseFloat(heightCm) < 50 || parseFloat(heightCm) > 300)) return true;
    if (heightUnit === 'ft' && (!heightFt || !heightIn)) return true;
    if (!weight || parseFloat(getWeightInKg()) < 10 || parseFloat(getWeightInKg()) > 500) return true;
    return false;
  };

  const BMIGauge = ({ bmi, category }) => {
    const zones = [
      { name: 'Underweight', color: '#3B82F6', start: 0, end: 18.5 },
      { name: 'Normal', color: '#10B981', start: 18.5, end: 25 },
      { name: 'Overweight', color: '#F59E0B', start: 25, end: 30 },
      { name: 'Obese', color: '#EF4444', start: 30, end: 40 }
    ];

    const angle = Math.min(Math.max((parseFloat(bmi) - 10) / 30 * 180, 0), 180);

    return (
      <div className="relative w-64 h-32 mx-auto">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {zones.map((zone, i) => {
            const startAngle = ((zone.start - 10) / 30 * 180);
            const endAngle = ((zone.end - 10) / 30 * 180);
            const x1 = 100 + 80 * Math.cos((180 - startAngle) * Math.PI / 180);
            const y1 = 100 - 80 * Math.sin((180 - startAngle) * Math.PI / 180);
            const x2 = 100 + 80 * Math.cos((180 - endAngle) * Math.PI / 180);
            const y2 = 100 - 80 * Math.sin((180 - endAngle) * Math.PI / 180);
            const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;
            
            return (
              <path
                key={i}
                d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={zone.color}
                opacity="0.8"
              />
            );
          })}
          <line
            x1="100"
            y1="100"
            x2={100 + 70 * Math.cos((180 - angle) * Math.PI / 180)}
            y2={100 - 70 * Math.sin((180 - angle) * Math.PI / 180)}
            stroke="#1F2937"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="5" fill="#1F2937" />
        </svg>
        <div className="text-center mt-2">
          <div className="text-3xl font-bold" style={{ color: category.color }}>{bmi}</div>
          <div className="text-sm text-gray-600">{category.name}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-(--background) p-5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="heading animate-fade-up mb-1"> BMI Calculator</h1>
          <p className="description animate-fade-up">Comprehensive health metrics and personalized recommendations</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-(--card) rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Your Measurements
            </h2>

            {/* Height Input */}
            <div className="mb-4">
              <label className="block subheading mb-2">Height</label>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => setHeightUnit('cm')}
                  className={`px-4 py-2 cursor-pointer rounded-lg ${heightUnit === 'cm' ? 'bg-blue-600 text-white' : 'bg-(--card)'}`}
                >
                  cm
                </button>
                <button
                  onClick={() => setHeightUnit('ft')}
                  className={`px-4 py-2  cursor-pointer rounded-lg ${heightUnit === 'ft' ? 'bg-blue-600 text-white' : 'bg-(--card)'}`}
                >
                  ft/in
                </button>
              </div>
              {heightUnit === 'cm' ? (
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="Enter height in cm"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                    placeholder="Feet"
                    className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                    placeholder="Inches"
                    className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
            </div>

            {/* Weight Input */}
            <div className="mb-4">
              <label className="block subheading mb-2">Weight</label>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => setWeightUnit('kg')}
                  className={`px-4 py-2 cursor-pointer rounded-lg ${weightUnit === 'kg' ? 'bg-blue-600 text-white' : 'bg-(--card)'}`}
                >
                  kg
                </button>
                <button
                  onClick={() => setWeightUnit('lbs')}
                  className={`px-4 py-2 cursor-pointer rounded-lg ${weightUnit === 'lbs' ? 'bg-blue-600 text-white' : 'bg-(--card)'}`}
                >
                  lbs
                </button>
              </div>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={`Enter weight in ${weightUnit}`}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
            </div>

            {/* Age and Gender */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block content mb-2">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Age"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block content mb-2">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-2 bg-(--card) border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            {/* Target Weight */}
            <div className="mb-4">
              <label className="block content mb-2">Target Weight (Optional)</label>
              <input
                type="number"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                placeholder={`Target weight in ${weightUnit}`}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.target && <p className="text-yellow-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {errors.target}
              </p>}
            </div>

            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {errors.general}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={calculate}
                disabled={isCalculateDisabled()}
                className="flex-1 bg-(--primary) text-white py-3 rounded-lg font-semibold hover:bg-blue-700  disabled:cursor-not-allowed transition cursor-pointer"
              >
                Calculate
              </button>
              <button
                onClick={reset}
                className="px-6 py-3 bg-red-500  text-white  cursor-pointer  rounded-lg font-semibold  transition flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result && (
              <>
                {/* BMI Gauge */}
                <div className="bg-(--card) rounded-xl shadow-lg p-6  min-h-70
                ">
  <h2 className="subheading mb-4">Your BMI Result</h2>

  <BMIGauge bmi={result.bmi} category={result.category} />
</div>

                {/* Ideal Weight */}
                <div className="bg-(--card) rounded-xl shadow-lg p-6">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-green-600" />
                    Ideal Weight Range
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {result.idealWeight.min} - {result.idealWeight.max} kg
                  </p>
                </div>

                {/* Water Intake */}
                <div className="bg-(--card) rounded-xl shadow-lg p-6">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-blue-600" />
                    Daily Water Intake
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">{result.waterIntake} liters</p>
                </div>

                {/* Calorie Needs */}
                {result.calories && (
                  <div className="bg-(--card) rounded-xl shadow-lg p-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-600" />
                      Daily Calorie Needs
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Maintenance:</span>
                        <span className="font-semibold">{result.calories.maintenance} cal</span>
                      </div>
                      <div className="flex justify-between text-blue-600">
                        <span className="flex items-center gap-1">
                          <TrendingDown className="w-4 h-4" /> Weight Loss:
                        </span>
                        <span className="font-semibold">{result.calories.loss} cal</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" /> Weight Gain:
                        </span>
                        <span className="font-semibold">{result.calories.gain} cal</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* BMR and Body Fat */}
                {result.bmr && (
                  <div className="bg-(--card) rounded-xl shadow-lg p-6">
                    <h3 className="font-semibold mb-3">Metabolic Metrics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>BMR (Basal Metabolic Rate):</span>
                        <span className="font-semibold">{result.bmr} cal/day</span>
                      </div>
                      {result.bodyFat && (
                        <div className="flex justify-between">
                          <span>Estimated Body Fat:</span>
                          <span className="font-semibold">{result.bodyFat}%</span>
                        </div>
                      )}
                    </div>
                    {result.bodyFat && (
                      <p className="text-xs text-gray-500 mt-2">* Estimate only - consult professionals for accurate measurement</p>
                    )}
                  </div>
                )}

                {/* Goal Plan */}
                {result.goalPlan && (
                  <div className="bg-(--card) rounded-xl shadow-lg p-6">
                    <h3 className="font-semibold mb-3">Goal Weight Planner</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Target Weight:</span>
                        <span className="font-semibold">{result.goalPlan.target.toFixed(1)} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Weight Change Needed:</span>
                        <span className="font-semibold">{Math.abs(result.goalPlan.difference).toFixed(1)} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Time:</span>
                        <span className="font-semibold">{result.goalPlan.weeks} weeks</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Weekly Change:</span>
                        <span className="font-semibold">±{result.goalPlan.weeklyChange} kg</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                <div className="bg-(--card) rounded-xl shadow-lg p-6">
                  <h3 className="font-semibold mb-3">Personalized Recommendations</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-sm text-gray-600 mb-1">Diet:</p>
                      <p className="text-sm">{getSuggestions(result.category.name).diet}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-600 mb-1">Exercise:</p>
                      <p className="text-sm">{getSuggestions(result.category.name).exercise}</p>
                    </div>
                  </div>
                </div>

                {/* Download Report */}
                <button
                  onClick={generatePDF}
                  className="w-full bg-(--primary)  py-3 rounded-lg font-semibold  transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  Download  Report
                </button>
              </>
            )}
          </div>
        </div>

        {/* History Section */}
        {history.length > 0 && (
          <div className="mt-8 bg-(--card) rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Calculation History</h2>
              <button
                onClick={clearHistory}
                className="text-sm text-red-600 hover:text-red-700 cursor-pointer"
              >
                Clear History
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-(--card)">
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">BMI</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Weight</th>
                    <th className="px-4 py-2 text-left">Height</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-4 py-2">{new Date(entry.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2 font-semibold">{entry.bmi}</td>
                      <td className="px-4 py-2">
                        <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: entry.category.color + '20', color: entry.category.color }}>
                          {entry.category.name}
                        </span>
                      </td>
                      <td className="px-4 py-2">{entry.weight.toFixed(1)} kg</td>
                      <td className="px-4 py-2">{entry.height.toFixed(1)} cm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

