import { useState } from "react";

export default function FocusForm({ onResult }) {
  // independent input states
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [breakTime, setBreakTime] = useState("");
  const [focusTime, setFocusTime] = useState("");

  const handleCalculate = (e) => {
    e.preventDefault();

    const h = Number(hours) || 0;
    const m = Number(minutes) || 0;
    const b = Number(breakTime) || 0;
    const f = Number(focusTime) || 0;

    const totalMinutes = h * 60 + m;

    // 1 session = focus + break (for calculation only)
    const sessionCycle = f + b;
    const sessions =
      sessionCycle > 0 ? Math.floor(totalMinutes / sessionCycle) : 0;

    // ✅ CORRECT USED TIME
    const usedTime =
      sessions * f + (sessions > 0 ? (sessions - 1) * b : 0);

    const remainingTime = totalMinutes - usedTime;

    onResult({
      totalMinutes,
      focusTime: f,
      breakTime: b,
      focusSessions: sessions,
      remainingTime,
    });
  };

  return (
    <form onSubmit={handleCalculate} className="focus-form">
      <div className="flex-1 bg-(--card) p-6 rounded-xl ">

        
        <div className="flex gap-8 mb-6">
          <h3 className="content">Hours</h3>

          <label className="text-(--foreground) font-semibold">Total Working Hours</label>
          <input
            type="number"
            placeholder="0"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />

          <label className="text-(--foreground) font-semibold">Break Time (minutes)</label>
          <input
            type="number"
            placeholder="0"
            value={breakTime}
            onChange={(e) => setBreakTime(e.target.value)}
          />

          <label className="text-(--foreground) font-semibold">Focus Time (minutes)</label>
          <input
            type="number"
            placeholder="0"
            value={focusTime}
            onChange={(e) => setFocusTime(e.target.value)}
          />
        </div>

        {/* MINUTES CARD */}
        <div className="flex-1 bg-(--card) p-6 rounded-xl border border-(--border)">
          <h3>Minutes</h3>

          <label className="text-(--foreground) font-semibold">Total Working Minutes</label>
          <input
            type="number"
            placeholder="0"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          />

          <label className="text-(--foreground) font-semibold">Break Time (minutes)</label>
          <input
            type="number"
            placeholder="0"
            value={breakTime}
            onChange={(e) => setBreakTime(e.target.value)}
          />

          <label className="text-(--foreground) font-semibold">Focus Time (minutes)</label>
          <input
            type="number"
            placeholder="0"
            value={focusTime}
            onChange={(e) => setFocusTime(e.target.value)}
          />
        </div>

      </div>

      <button type="submit">Calculate</button>
    </form>
  );
}
