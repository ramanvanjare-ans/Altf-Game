"use client";
import { useState } from "react";

export default function ReadingForm({ onAddReading }) {
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!systolic || !diastolic) {
      setError("Please enter both systolic and diastolic readings.");
      return;
    }

    const sys = parseInt(systolic);
    const dias = parseInt(diastolic);

    if (isNaN(sys) || isNaN(dias) || sys < 0 || dias < 0) {
      setError("Please enter valid positive numbers.");
      return;
    }

    onAddReading(sys, dias);
    setSystolic("");
    setDiastolic("");
  };

  return (
    <div className="bg-(--background)  border border-(--border) shadow-md rounded-lg p-4 space-y-4">
      <h2 className="text-lg font-semibold text-(--foreground)">New Reading</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-(--foreground)">
            Systolic (mmHg)
          </label>
          <input
            type="number"
            value={systolic}
            onChange={(e) => setSystolic(e.target.value)}
            placeholder="120"
            min="0"
            max="300"
            className="mt-1 block w-full  border border-(--border) rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
         
        </div>

        <div>
          <label className="block text-sm font-medium text-(--foreground)">
            Diastolic (mmHg)
          </label>
          <input
            type="number"
            value={diastolic}
            onChange={(e) => setDiastolic(e.target.value)}
            placeholder="80"
            min="0"
            max="300"
            className="mt-1 block w-full border border-(--border) rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
         
        </div>

        {error && <div className="text-red-600 text-sm font-medium">{error}</div>}

        <button className="w-full bg-blue-500 text-white cursor-pointer py-2 rounded-md hover:bg-blue-600 transition">
          Add Reading
        </button>
      </form>
    </div>
  );
}
