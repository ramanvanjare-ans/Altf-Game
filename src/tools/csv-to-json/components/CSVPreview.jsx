


import React from "react";

const CSVPreview = ({ csvData = [] }) => {
 
  if (!Array.isArray(csvData) || csvData.length === 0) {
    return (
      <p className="text-sm text-(--secondary) mb-4">
        No CSV data to display
      </p>
    );
  }

  const headers = Object.keys(csvData[0]);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2 text-(--primary)">
        CSV Data Preview
      </h3>

      <div className="relative overflow-x-auto border border-(--border) rounded-lg hide-scrollbar ">
        {/* height ≈ 10 rows */}
        <div className="max-h-[420px] overflow-y-auto ">
          <table className="min-w-full bg-(--background) border-collapse">
            <thead className="bg-(--background) sticky top-0 z-10 text-(--secondary)">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="py-2 px-4 border-b text-left text-sm font-semibold whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {csvData.map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  {headers.map((header) => (
                    <td
                      key={header}
                      className="py-2 px-4 border-b text-sm text-(--secondary) whitespace-nowrap bg-(--background)"
                    >
                      {row[header] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Total rows: {csvData.length}
      </p>
    </div>
  );
};

export default CSVPreview;


