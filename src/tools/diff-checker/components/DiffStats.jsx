// src/components/DiffChecker/DiffStats.jsx

const DiffStats = ({ stats }) => (
  <div className="grid grid-cols-3 gap-4 mb-6">
    <div className="bg-(--card) border border-green-200 rounded-lg p-4">
      <div className="text-2xl font-bold text-green-700">{stats.added}</div>
      <div className="text-sm text-green-600">Lines Added</div>
    </div>

    <div className="bg-(--card) border border-red-200 rounded-lg p-4">
      <div className="text-2xl font-bold text-red-700">{stats.deleted}</div>
      <div className="text-sm text-red-600">Lines Deleted</div>
    </div>

    <div className="bg-(--card) border border-gray-200 rounded-lg p-4">
      <div className="text-2xl font-bold text-gray-700">{stats.unchanged}</div>
      <div className="text-sm text-gray-600">Lines Unchanged</div>
    </div>
  </div>
);

export default DiffStats;
