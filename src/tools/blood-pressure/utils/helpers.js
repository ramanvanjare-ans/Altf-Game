export const getStatusColor = (systolic, diastolic) => {
  if (systolic < 120 && diastolic < 80) return "green";
  if (systolic < 130 && diastolic < 80) return "yellow";
  if (systolic < 140 || diastolic < 90) return "orange";
  return "red";
};

export const getStatusLabel = (systolic, diastolic) => {
  if (systolic < 120 && diastolic < 80) return "Normal";
  if (systolic < 130 && diastolic < 80) return "Elevated";
  if (systolic < 140 || diastolic < 90) return "Stage 1 Hypertension";
  return "Stage 2 Hypertension";
};

export const statusColorMap = {
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  orange: "bg-orange-100 text-orange-700",
  red: "bg-red-100 text-red-700",
};
