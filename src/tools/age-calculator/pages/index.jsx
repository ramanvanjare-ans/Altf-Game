

"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import DateForm from "../components/DateForm";
import TodayInfo from "../components/TodayInfo";
import AgeCards from "../components/AgeCards";
import TimeLived from "../components/TimeLived";
import NextBirthday from "../components/NextBirthday";
import { calculateAgeData } from "../utils/dateUtils.js"; 


export default function ToolHome() {
  const [birthDate, setBirthDate] = useState("");
  const [age, setAge] = useState(null);
  const [nextBirthday, setNextBirthday] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [error, setError] = useState("");
  const [today] = useState(new Date());

  const todayString = today.toISOString().split("T")[0];

 const handleCalculate = (e) => {
  e.preventDefault();

  if (!birthDate) {
    setError("Please enter your date of birth.");
    return;
  }

  const birth = new Date(birthDate);

  if (isNaN(birth)) {
    setError("Invalid date entered.");
    return;
  }

  if (birth >= today) {
    setError("Date of birth must be in the past.");
    return;
  }

  setError("");

  const result = calculateAgeData(birth);
  setAge(result.age);
  setTotalMinutes(result.totalMinutes);
  setTotalSeconds(result.totalSeconds);
  setNextBirthday(result.nextBirthday);
};


  
useEffect(() => {
  if (!birthDate || error) return;

  const interval = setInterval(() => {
    const birth = new Date(birthDate);
    const result = calculateAgeData(birth);

    setAge(result.age);
    setTotalMinutes(result.totalMinutes);
    setTotalSeconds(result.totalSeconds);
    setNextBirthday(result.nextBirthday);
  }, 1000);

  return () => clearInterval(interval);
}, [birthDate, error]);

  return (
    <div className="min-h-screen  px-4 py-8">

           <Header />

      <div className="max-w-4xl mx-auto bg-(--card) rounded-xl shadow-lg overflow-hidden pt">
       

        <div className="p-6 space-y-6 ">
          <DateForm
            birthDate={birthDate}
            todayString={todayString}
            setBirthDate={setBirthDate}
            handleCalculate={handleCalculate}
          />

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-center">
              ❌ {error}
            </div>
          )}

          <TodayInfo today={today} />

          {age && (
            <>
              <AgeCards age={age} />
              <TimeLived minutes={totalMinutes} seconds={totalSeconds} />
              <NextBirthday data={nextBirthday} />
            </>
          )}
        </div>

      
      </div>
    </div>
  );
}
