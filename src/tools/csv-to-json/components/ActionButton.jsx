import React from 'react';

const ActionButtons = ({ onConvert, onDownload, onClear, hasData }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <button
        onClick={onConvert}
        disabled={!hasData}
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          hasData
            ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Convert to JSON
      </button>
      
      <button
        onClick={onDownload}
        disabled={!hasData}
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          hasData
            ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed '
        }`}
      >
        Download JSON
      </button>
      
      <button
        onClick={onClear}
        className="px-4 py-2 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition-colors cursor-pointer"
      >
        Clear All
      </button>
    </div>
  );
};

export default ActionButtons;