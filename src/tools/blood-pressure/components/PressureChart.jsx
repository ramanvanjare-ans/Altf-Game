"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function PressureChart({ readings }) {
  if (!readings || readings.length === 0) return <p className="text-(--foreground) text-center mt-10">No readings yet</p>;

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={readings}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={{ fontSize: 12, fill: "#4B5563" }} />
          <YAxis domain={[60, 160]} tick={{ fontSize: 12, fill: "#4B5563" }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="systolic" stroke="#FF6B6B" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="diastolic" stroke="#4ECDC4" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
