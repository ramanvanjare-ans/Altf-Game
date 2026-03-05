"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DEMO_CONDITIONS, DEMO_SYMPTOMS } from "../utils/demoData";
import { API_CONFIG, apiHeaders, isApiConfigured } from "../utils/api";
import { CONDITION_SUGGESTIONS } from "../utils/suggestion";

export default function ToolHome() {
  const [symptomInput, setSymptomInput] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [diagnosis, setDiagnosis] = useState([]);
  const [followUpQuestion, setFollowUpQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [age, setAge] = useState(30);
  const [sex, setSex] = useState("male");
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [evidence, setEvidence] = useState([]);
  const [demoMode, setDemoMode] = useState(!isApiConfigured());
  const [expandedCondition, setExpandedCondition] = useState(null);
  const [activeTab, setActiveTab] = useState("reasons");

  const searchSymptoms = useCallback(
    async (text) => {
      if (text.length < 2) {
        setSearchResults([]);
        return;
      }

      setSearching(true);

      if (demoMode) {
        const filtered = DEMO_SYMPTOMS.filter(
          (s) =>
            s.name.toLowerCase().includes(text.toLowerCase()) ||
            s.common_name.toLowerCase().includes(text.toLowerCase()),
        );
        setSearchResults(filtered);
        setSearching(false);
        return;
      }

      try {
        const response = await fetch(`${API_CONFIG.baseUrl}/parse`, {
          method: "POST",
          headers: apiHeaders,
          body: JSON.stringify({
            text: text,
            age: { value: age },
            sex: sex,
          }),
        });

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const data = await response.json();
        const mentions = data.mentions || [];

        const searchResponse = await fetch(
          `${API_CONFIG.baseUrl}/search?phrase=${encodeURIComponent(text)}&max_results=10&types=symptom`,
          {
            headers: apiHeaders,
          },
        );

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          const combined = [
            ...mentions,
            ...searchData.filter((s) => !mentions.find((m) => m.id === s.id)),
          ];
          setSearchResults(combined.slice(0, 10));
        } else {
          setSearchResults(mentions);
        }
      } catch (err) {
        console.error("Search error:", err);

        const filtered = DEMO_SYMPTOMS.filter(
          (s) =>
            s.name.toLowerCase().includes(text.toLowerCase()) ||
            s.common_name.toLowerCase().includes(text.toLowerCase()),
        );
        setSearchResults(filtered);
      } finally {
        setSearching(false);
      }
    },
    [age, sex, demoMode],
  );

  useEffect(() => {
    const debounce = setTimeout(() => {
      searchSymptoms(symptomInput);
    }, 300);
    return () => clearTimeout(debounce);
  }, [symptomInput, searchSymptoms]);

  const addSymptom = (symptom) => {
    if (!selectedSymptoms.find((s) => s.id === symptom.id)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
      setEvidence([
        ...evidence,
        { id: symptom.id, choice_id: "present", source: "initial" },
      ]);
    }
    setSymptomInput("");
    setSearchResults([]);
  };

  // Remove symptom
  const removeSymptom = (symptomId) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s.id !== symptomId));
    setEvidence(evidence.filter((e) => e.id !== symptomId));
  };

  // Get diagnosis
  const getDiagnosis = async () => {
    if (selectedSymptoms.length === 0) {
      setError(
        "Please select at least one symptom / Kam se kam ek symptom select karein",
      );
      return;
    }

    setLoading(true);
    setError("");
    setShowResults(false);

    if (demoMode) {
      // Demo  response
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const symptomIds = selectedSymptoms
        .map((s) => s.id)
        .sort()
        .join(",");
      const conditions = DEMO_CONDITIONS[symptomIds] || DEMO_CONDITIONS.default;

      setDiagnosis(conditions);
      setFollowUpQuestion({
        text: "Do you have this symptom as well?",
        type: "single",
        items: [
          {
            id: "s_156",
            name: "Nausea",
            choices: [
              { id: "present", label: "Haan" },
              { id: "absent", label: "Nahi" },
              { id: "unknown", label: "Pata nahi" },
            ],
          },
        ],
      });
      setShowResults(true);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/diagnosis`, {
        method: "POST",
        headers: apiHeaders,
        body: JSON.stringify({
          sex: sex,
          age: { value: age },
          evidence: evidence,
        }),
      });

      if (!response.ok) {
        throw new Error("Diagnosis request failed");
      }

      const data = await response.json();
      setDiagnosis(data.conditions || []);
      setFollowUpQuestion(data.question || null);
      setShowResults(true);
    } catch (err) {
      console.error("Diagnosis error:", err);
      setError(
        "Failed to get diagnosis. Using demo mode. / Diagnosis mein error aaya. Demo mode use ho raha hai.",
      );
      setDemoMode(true);
      // Retry with demo mode
      const symptomIds = selectedSymptoms
        .map((s) => s.id)
        .sort()
        .join(",");
      const conditions = DEMO_CONDITIONS[symptomIds] || DEMO_CONDITIONS.default;
      setDiagnosis(conditions);
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };

  //  follow-up question  answer
  const answerFollowUp = async (symptomId, choiceId) => {
    const newEvidence = [...evidence, { id: symptomId, choice_id: choiceId }];
    setEvidence(newEvidence);

    if (choiceId === "present") {
      const symptom = followUpQuestion?.items?.find((i) => i.id === symptomId);
      if (symptom && !selectedSymptoms.find((s) => s.id === symptomId)) {
        setSelectedSymptoms([
          ...selectedSymptoms,
          { id: symptomId, name: symptom.name, common_name: symptom.name },
        ]);
      }
    }

    setFollowUpQuestion(null);

    // Get updated diagnosis
    if (!demoMode) {
      try {
        const response = await fetch(`${API_CONFIG.baseUrl}/diagnosis`, {
          method: "POST",
          headers: apiHeaders,
          body: JSON.stringify({
            sex: sex,
            age: { value: age },
            evidence: newEvidence,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setDiagnosis(data.conditions || []);
          if (!data.should_stop) {
            setFollowUpQuestion(data.question || null);
          }
        }
      } catch (err) {
        console.error("Follow-up error:", err);
      }
    }
  };

  // Get condition info
  const getConditionInfo = (conditionName) => {
    const normalizedName = Object.keys(CONDITION_SUGGESTIONS).find(
      (key) =>
        conditionName.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(conditionName.toLowerCase()),
    );
    return (
      CONDITION_SUGGESTIONS[normalizedName || "default"] ||
      CONDITION_SUGGESTIONS.default
    );
  };

  // Reset
  const resetAll = () => {
    setSelectedSymptoms([]);
    setEvidence([]);
    setDiagnosis([]);
    setFollowUpQuestion(null);
    setShowResults(false);
    setError("");
    setSymptomInput("");
  };

  // Get severity color
  const getSeverityColor = (probability) => {
    if (probability > 0.7) return "from-red-500 to-red-600";
    if (probability > 0.4) return "from-yellow-500 to-orange-500";
    return "from-green-500 to-emerald-500";
  };

  const getSeverityBg = (probability) => {
    if (probability > 0.7) return "bg-red-50 border-red-200";
    if (probability > 0.4) return "bg-yellow-50 border-yellow-200";
    return "bg-green-50 border-green-200";
  };

  return (
    <div className="min-h-screen bg-(--card)">
      <div className="relative z-10 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 pt-8">
            <h1 className="heading text-center animate-fade-up mb-3">
              Health Symptom 
            </h1>
            <p className="description  text-center animate-fade-up">
              Tell us your symptoms and we'll tell you what's going on & we will suggest .
            </p>

            {/* {demoMode && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-(--card) border border-(--border) rounded-full text-(--foreground) text-sm">
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                Demo Mode Active - Configure API for full features
              </div>
            )} */}
          </div>

          {/* Main Card */}
          <div className="bg-(--background)  rounded-3xl shadow-2xl border border-(--border) overflow-hidden">
            {/* User Info Section */}
            <div className="p-6 border-b border-(--border)">
              <h2 className="text-xl font-semibold text-(--foreground) mb-4 flex items-center gap-2">
                <span className="text-2xl">👤</span> Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block content mb-2">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) =>
                      setAge(Math.max(0, Math.min(120, Number(e.target.value))))
                    }
                    className="w-full px-4 py-3 bg-(--card) border border-(--border) rounded-xl text-(--muted-foreground)  transition-all"
                    min={0}
                    max={120}
                  />
                </div>
                <div>
                  <label className="block content mb-2">Gender</label>
                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    className="w-full px-4 py-3 bg-(--card) border border-(--border) rounded-xl text-(--foreground)  focus:border-transparent transition-all appearance-none cursor-pointer"
                  >
                    <option
                      value="male"
                      className="bg-(--card) text-(--muted-foreground)"
                    >
                      Male
                    </option>
                    <option
                      value="female"
                      className="bg-(--card) text-(--muted-foreground)"
                    >
                      Female
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Symptom Input Section */}
            <div className="p-6 border-b border-(--border)">
              <h2 className="text-xl font-semibold text-(--foreground) mb-4 flex items-center gap-2">
                Write your symptoms
              </h2>

              <div className="relative">
                <input
                  type="text"
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  placeholder="Type your symptoms (e.g., headache, fever, cough...)"
                  className="w-full px-5 py-4 bg-(--card) border-2 border-(--border) rounded-xl text-(--muted-foreground) transition-all text-lg"
                />
                {searching && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <svg
                      className="animate-spin h-6 w-6 text-(--muted-foreground)"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                  </div>
                )}

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute z-20 w-full mt-2 bg-(--card)  border border-(--border) rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                    {searchResults.map((symptom, index) => (
                      <button
                        key={`${symptom.id}-${index}`}
                        onClick={() => addSymptom(symptom)}
                        className="w-full px-5 py-4 text-left  border-b border-(--border) last:border-b-0 transition-colors flex items-center gap-3 group"
                      >
                        <span className="w-8 h-8 bg-(--card) rounded-lg flex items-center justify-center  transition-colors">
                          <span className="text-(--muted-foreground)">+</span>
                        </span>
                        <span className="text-(--foreground) font-medium">
                          {symptom.common_name || symptom.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Symptoms */}
              {selectedSymptoms.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-300 mb-3">
                    Selected Symptoms:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map((symptom) => (
                      <span
                        key={symptom.id}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-(--card) border border-(--border) text-(--muted-foreground) rounded-full text-sm font-medium  transition-all"
                      >
                        <span className="w-2 h-2 bg-(-muted-foreground) rounded-full"></span>
                        {symptom.common_name || symptom.name}
                        <button
                          onClick={() => removeSymptom(symptom.id)}
                          className="hover:text-red-400 transition-colors font-bold text-lg leading-none"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Add Symptoms */}
              <div className="mt-4">
                <p className=" text-md text-(--foreground) mb-2  ">Quick add common symptoms:</p>
                <div className="flex flex-wrap gap-2 cursor-pointer">
                  {DEMO_SYMPTOMS.slice(0, 6).map((symptom) => (
                    <button
                      key={symptom.id}
                      onClick={() => addSymptom(symptom)}
                      disabled={selectedSymptoms.some(
                        (s) => s.id === symptom.id,
                      )}
                      className="px-3 py-1.5 bg-(--card) border border-(--border) rounded-xl text-sm text-(--muted-foreground) hover:bg-(--card) disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      + {symptom.common_name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={getDiagnosis}
                  disabled={loading || selectedSymptoms.length === 0}
                  className="flex-1 py-4 px-6 bg-(--primary) text-(--foreground) font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform  shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      {/* <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg> */}
                      <span>Analyzing Symptoms...</span>
                    </>
                  ) : (
                    <>
                      <span>Check Diagnosis</span>
                    </>
                  )}
                </button>

                {selectedSymptoms.length > 0 && (
                  <button
                    onClick={resetAll}
                    className="py-4 px-6 bg-(--card)  text-(--foreground) font-semibold rounded-xl transition-all border border-(--border) cursor-pointer"
                  >
                    🔄 Reset
                  </button>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-500 border border-red-500/30 rounded-xl text-red-200 flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  {error}
                </div>
              )}
            </div>

            {/* Results Section */}
            {showResults && diagnosis.length > 0 && (
              <div className="p-6">
                <h2 className="subheading mb-6 flex items-center gap-3">
                  Diagnosis Results
                </h2>

                <div className="space-y-4">
                  {diagnosis.slice(0, 5).map((condition, index) => {
                    const info = getConditionInfo(
                      condition.common_name || condition.name,
                    );
                    const isExpanded = expandedCondition === condition.id;

                    return (
                      <div
                        key={condition.id}
                        className={`rounded-2xl overflow-hidden border transition-all ${
                          isExpanded ? "border-(--border)" : "border-(--border)"
                        }`}
                      >
                        {/* Condition Header */}
                        <button
                          onClick={() =>
                            setExpandedCondition(
                              isExpanded ? null : condition.id,
                            )
                          }
                          className="w-full p-5 bg-(--card) transition-colors flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-xl bg-(--card) ${getSeverityColor(condition.probability)} flex items-center justify-center text-(--foreground) font-bold text-lg shadow-lg`}
                            >
                              {index + 1}
                            </div>
                            <div className="text-left">
                              <h3 className="text-xl font-semibold text-(--foreground)">
                                {condition.common_name || condition.name}
                              </h3>
                              <p className="content">{condition.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                                  condition.probability > 0.7
                                    ? "bg-red-500/20 text-red-300"
                                    : condition.probability > 0.4
                                      ? "bg-yellow-500/20 text-yellow-300"
                                      : "bg-green-500/20 text-green-300"
                                }`}
                              >
                                {(condition.probability * 100).toFixed(0)}%
                                match
                              </div>
                            </div>
                            {/* <svg
                              className={`w-6 h-6 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg> */}
                          </div>
                        </button>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="p-5 bg-(--card) border-t border-(--border)">
                            {/* Tabs */}
                            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                              <button
                                onClick={() => setActiveTab("reasons")}
                                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                                  activeTab === "reasons"
                                    ? "bg-(--primary) text-(--foreground) border border-(--border)"
                                    : "bg-(--card) text-(--foregorund) "
                                }`}
                              >
                                what happend?
                              </button>
                              <button
                                onClick={() => setActiveTab("suggestions")}
                                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                                  activeTab === "suggestions"
                                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                                }`}
                              >
                                What to do?
                              </button>
                              <button
                                onClick={() => setActiveTab("remedies")}
                                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                                  activeTab === "remedies"
                                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                    : "bg-(--card) text-(--foregorund) "
                                }`}
                              >
                                Remedies
                              </button>
                            </div>

                            {/* Tab Content */}
                            <div className="min-h-20">
                              {activeTab === "reasons" && (
                                <div className="p-4 bg-(--card) border border-(--border) rounded-xl">
                                  <h4 className="font-semibold text-(--foreground) mb-3 flex items-center gap-2">
                                    <span className="text-xl">🤔</span>
                                    Why this happened?
                                  </h4>
                                  <ul className="space-y-3">
                                    {info.reasons.map((reason, idx) => (
                                      <li
                                        key={idx}
                                        className="flex items-start gap-3 text-(--muted-foreground)"
                                      >
                                        <span className="w-6 h-6 bg-(--card) rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                          <span className="content">
                                            {idx + 1}
                                          </span>
                                        </span>
                                        <span>{reason}</span>
                                      </li>
                                    ))}
                                  </ul>

                                  <div className="mt-4 p-3 bg-(--card) rounded-lg">
                                    <p className="text-(-foreground) text-sm">
                                      <strong>Note:</strong> Your symptoms (
                                      {selectedSymptoms
                                        .map((s) => s.common_name)
                                        .join(", ")}
                                      ) according to your symptoms, this condition is happening, so doctor will suggest you to take medicine.
                                    </p>
                                  </div>
                                </div>
                              )}

                              {activeTab === "suggestions" && (
                                <div className="p-4 bg-(--card) border border-(--border) rounded-xl">
                                  <h4 className="font-semibold text-(--foreground) mb-3 flex items-center gap-2">
                                    <span className="text-xl">✅</span>
                                    You can do this:
                                  </h4>
                                  <ul className="space-y-3">
                                    {info.suggestions.map((suggestion, idx) => (
                                      <li
                                        key={idx}
                                        className="flex items-start gap-3 text-blue-100/90"
                                      >
                                        <span className="w-6 h-6 bg-(--card) rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                          <span className="text-(--foreground) text-sm">
                                            ✓
                                          </span>
                                        </span>
                                        <span>{suggestion}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {activeTab === "remedies" && (
                                <div className="p-4 bg-(--card) border border-(--border) rounded-xl">
                                  <h4 className="font-semibold text-(--foreground) mb-3 flex items-center gap-2">
                                    <span className="text-xl">🏠</span>
                                    Try this at home.:
                                  </h4>
                                  <ul className="space-y-3">
                                    {info.homeRemedies.map((remedy, idx) => (
                                      <li
                                        key={idx}
                                        className="flex items-start gap-3 text-(--foreground)"
                                      >
                                        <span className="w-6 h-6 bg-(--card) rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                          <span className="text-green-300 text-sm">
                                            🌿
                                          </span>
                                        </span>
                                        <span>{remedy}</span>
                                      </li>
                                    ))}
                                  </ul>

                                  <div className="mt-4 p-3 bg-(--card) rounded-lg">
                                    <p className="text-(--foreground) text-sm">
                                      <strong>Important:</strong> This is only supportive care. If the symptoms do not improve or get worse, be sure to consult a doctor.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Follow-up Question */}
                {followUpQuestion && (
                  <div className="mt-6 p-5 bg-(--card) border border-(--border) rounded-2xl">
                    <h3 className="font-semibold text-(--foreground) mb-3 flex items-center gap-2">
                      <span className="text-xl">🤔</span>
                      For better diagnosis:
                    </h3>
                    <p className="text-(--foreground) mb-4">{followUpQuestion.text}</p>

                    {followUpQuestion.items?.map((item) => (
                      <div key={item.id} className="mb-3">
                        <p className="text-(--muted-foreground) mb-2 font-medium">
                          {item.name}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.choices?.map((choice) => (
                            <button
                              key={choice.id}
                              onClick={() => answerFollowUp(item.id, choice.id)}
                              className="px-5 py-2.5 bg-(--card)  border border-(--border) rounded-xl text-(--muted-foreground) transition-all"
                            >
                              {choice.label === "Yes"
                                ? " ✓"
                                : choice.label === "No"
                                  ? " ✗"
                                  : "No Idea ?"}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Disclaimer */}
                <div className="mt-6 p-5 bg-(--card) border border-(--border) rounded-2xl">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h4 className="font-semibold text-(--muted-foreground) mb-1">
                        Important Disclaimer 
                      </h4>
                      <p className="text-(--muted-foreground) text-sm">
                        This is for informational purposes only and cannot replace professional medical advice. Please consult a certified doctor before starting any treatment. In case of an emergency, go to the hospital immediately
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* API Setup Card */}
          {/* <div className="mt-6 bg-(--card) border border-(--border) rounded-2xl p-6">
            <h3 className="font-semibold text-(--foreground) mb-3 flex items-center gap-2">
              <span className="text-xl">🔧</span>
              API Setup Instructions
            </h3>
            <div className="text-gray-300 text-sm space-y-2">
              <p>To use real-time Infermedica API:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>
                  Visit{" "}
                  <a
                    href="https://developer.infermedica.com"
                    className="text-purple-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    developer.infermedica.com
                  </a>
                </li>
                <li>Create a free account and get your App-Id and App-Key</li>
                <li>
                  Replace{" "}
                  <code className="bg-white/10 px-1 rounded">YOUR_APP_ID</code>{" "}
                  and{" "}
                  <code className="bg-white/10 px-1 rounded">YOUR_APP_KEY</code>{" "}
                  in the code
                </li>
              </ol>
              <p className="mt-3 text-yellow-300">
                Currently running in Demo Mode with sample data.
              </p>
            </div>
          </div> */}

        
        </div>
      </div>
    </div>
  );
}
