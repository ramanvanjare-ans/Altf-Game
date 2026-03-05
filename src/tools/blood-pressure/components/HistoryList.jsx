import { getStatusColor, statusColorMap } from "../utils/helpers";

export default function HistoryList({ readings, onClear }) {
  return (
    <div className="bg-(--background)  border border-(--border) shadow-md rounded-lg p-4 space-y-2">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-(--foreground)">Reading History</h2>
        <button
          onClick={onClear}
          className="bg-(--background) text-red-500 px-3 py-1 rounded-md border border-red-500 transition cursor-pointer"
        >
          Clear History
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {readings.length > 0 ? (
          readings.map((r, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b border-(--border) pb-2"
            >
              <div className="text-(--foreground) text-sm">
                <div>{r.time}</div>
                <div>{r.date}</div>
              </div>
              <div
                className={`px-3 py-1 rounded-md font-medium ${
                  statusColorMap[getStatusColor(r.systolic, r.diastolic)]
                }`}
              >
                {r.systolic}/{r.diastolic} mmHg
              </div>
            </div>
          ))
        ) : (
          <p className="text-(--foreground) text-center mt-2">No readings yet</p>
        )}
      </div>
    </div>
  );
}
