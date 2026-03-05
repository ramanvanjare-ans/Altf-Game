import { statusColorMap, getStatusLabel } from "../utils/helpers";

export default function StatusCard({ reading }) {
  if (!reading) return null;
  const status = getStatusLabel(reading.systolic, reading.diastolic);
  const colorClass = statusColorMap[getStatusLabel(reading.systolic, reading.diastolic).toLowerCase()] || "bg-(--card) text-(--foreground)";

  return (
    <div className={`mt-4 p-4 rounded-lg ${colorClass} text-center`}>
      <p className="font-medium text-sm">Current Status</p>
      <p className="font-semibold text-lg">
        {getStatusLabel(reading.systolic, reading.diastolic)}
      </p>
      <p className="text-sm">
        {reading.systolic}/{reading.diastolic} mmHg
      </p>
    </div>
  );
}
