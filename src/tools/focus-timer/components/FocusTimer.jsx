import { useEffect, useState } from "react";

export default function FocusTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Real-time count up: 1, 2, 3...
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex gap-3 mt-2.5">
      <h3 className="subheading">Focus Time</h3>

      <div className="mt-7 p-7 bg-(--card) rounded-xl text-center  font-semibold "
>
        ⏱ {formatTime(seconds)}
      </div>

      <div className="flex gap-3 mt-2.5 border border-(--border) rounded-xl p-4">
        <button className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-none bg-(--primary) text-white text-base font-semibold cursor-pointer   duration-150 ease-in-out" onClick={startTimer}>Start Focus</button>
        <button className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-none bg-(--primary) text-white text-base font-semibold cursor-pointer   duration-150 ease-in-out" onClick={stopTimer}>Stop</button>
        <button className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-none bg-(--primary) text-white text-base font-semibold cursor-pointer   duration-150 ease-in-out" onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
}
