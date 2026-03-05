

"use client";
import { useState } from "react";
import ReadingForm from "../components/ReadingForm";
import StatusCard from "../components/StatusCard";
import PressureChart from "../components/PressureChart";
import HistoryList from "../components/HistoryList";


export default function ToolHome() {
  const [readings, setReadings] = useState([
  ]);

  const addReading = (sys, dias) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setReadings([...readings, { time: timeString, systolic: sys, diastolic: dias, date: "Today" }]);
  };

  const clearHistory = () => setReadings([]);

  const lastReading = readings.length > 0 ? readings[readings.length - 1] : null;

  return (
   <div className="bg-(--background) text-(--foreground)">

     <div className="max-w-6xl mx-auto p-4 space-y-6 bg-(--background) text-(--foreground)">
      {/* Header */}
      <div className="   flex  flex-col space-x-4">
        
        <h1 className=" heading text-center mt-5 animate-fade-up">
          Blood Pressure <br/>Checker
        </h1>
        <p className="description text-center animate-fade-up">Track your blood pressure</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 pt-5">
        <div className="space-y-4">
          <ReadingForm onAddReading={addReading} />
          <StatusCard reading={lastReading} />
        </div>

        <div className="space-y-4">
          <div className="bg-(--background)  border border-(--border) shadow-md rounded-lg p-4 space-y-4">
            <h2 className="text-lg font-semibold text-(--foreground) mb-2">
              Pressure Trend
            </h2>
            <PressureChart readings={readings} />
          </div>

          <HistoryList readings={readings} onClear={clearHistory} />
        </div>
      </div>
    </div>
   </div>
  );
}
