const SelectField = ({ label, value, options, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-3 rounded-xl border bg-(--muted) text-(--foreground) focus:outline-none focus:ring-2 focus:ring-(--primary) transition"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
