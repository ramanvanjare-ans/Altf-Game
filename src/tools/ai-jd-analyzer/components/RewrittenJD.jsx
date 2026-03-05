import { CopyIcon, DownloadIcon, EditIcon, Eye, RocketIcon } from 'lucide-react';
import React, { useState } from 'react';


const RewrittenJD = ({ original, rewritten }) => {
    
    const [activeTab, setActiveTab] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(rewritten);
    const [snackbarOpen, setSnackbarOpen] = useState(false);


    const currentText = activeTab === 0 ? original : editedText;

    const isImprovedTab = activeTab === 1;

    const handleCopy = () => {
        navigator.clipboard.writeText(currentText);
        setSnackbarOpen(true);
    };

    const handleDownload = () => {
        const textToDownload = currentText;
        const blob = new Blob([textToDownload], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `job-description-${activeTab === 0 ? 'original' : 'improved'}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setIsEditing(false);
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = () => {

        setIsEditing(false);

    };

    return (
        <div
  className="
    p-6 rounded-2xl bg-(--background)
    
  "
>
  {/* HEADER + ACTIONS */}
  <div className="mb-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
      {/* TITLE */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <RocketIcon className="text-indigo-700 w-8 h-8" />
        <h2 className="subheading">
          Job Description Editor
        </h2>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-wrap gap-3 w-full sm:w-auto">
        {isImprovedTab && (
          <button
            onClick={isEditing ? handleSave : toggleEdit}
            disabled={isEditing && editedText === rewritten}
            className={`
              px-4 py-2 rounded-lg text-sm font-semibold
              flex items-center gap-2 cursor-pointer
              transition
              ${
                isEditing
                  ? "bg-green-600 text-white disabled:bg-green-300"
                  : "border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
              }
              w-full sm:w-auto
            `}
          >
            {isEditing ? <SaveIcon className="w-4 h-4" /> : <EditIcon className="w-4 h-4" />}
            {isEditing ? "Save Changes" : "Edit"}
          </button>
        )}

        <button
          onClick={handleCopy}
          className="
            px-4 py-2 rounded-lg text-sm font-semibold
            bg-indigo-600 text-white
            flex items-center gap-2
            hover:bg-indigo-700 transition
            w-full sm:w-auto cursor-pointer
          "
        >
          <CopyIcon className="w-4 h-4" />
          Copy
        </button>

        <button
          onClick={handleDownload}
          className="
            px-4 py-2 rounded-lg text-sm font-semibold
            border border-indigo-600 text-indigo-600
            flex items-center gap-2
            hover:bg-indigo-50 transition
            w-full sm:w-auto cursor-pointer
          "
        >
          <DownloadIcon className="w-4 h-4" />
          Download
        </button>
      </div>
    </div>
  </div>

  {/* TABS */}
  <div className="flex border-b mb-6 bg-(--background)">
    {["Original JD", "AI Improved Version"].map((label, index) => (
      <button
        key={label}
        onClick={() => setActiveTab(index)}
        className={`
          px-5 py-3 text-sm font-bold flex items-center gap-2
          border-b-2 transition
          ${
            activeTab === index
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }
        `}
      >
        {index === 0 && !isImprovedTab && <Eye className="w-4 h-4" />}
        {index === 1 && (isEditing ? <EditIcon className="w-4 h-4" /> : <Eye className="w-4 h-4" />)}
        {label}
      </button>
    ))}
  </div>

  {/* CONTENT AREA */}
  <div
    className={`
      min-h-100 max-h-[70vh] overflow-y-auto
      p-6 rounded-xl transition text-(--foreground)
      ${
        isEditing
          ? "bg-(--background) border-2 border-green-400"
          : "bg-(--background) border border-(--border) "
      }
    `}
  >
    {isImprovedTab && isEditing ? (
      <textarea
        value={editedText}
        onChange={(e) => setEditedText(e.target.value)}
        className="
          w-full h-full resize-none
          bg-transparent outline-none
          font-mono text-base leading-relaxed text-(--foreground)
        "
      />
    ) : (
      <pre className="whitespace-pre-wrap text-(--foreground)leading-relaxed">
        {currentText}
      </pre>
    )}
  </div>

  {/* AI IMPROVEMENTS */}
  {isImprovedTab && (
    <div
      className="
        mt-6 p-6 rounded-xl
         border border-(--border)
      "
    >
      <h3 className="subheading mb-3">
         Key AI Improvements
      </h3>

      <ul className="list-disc pl-5 space-y-1 text-sm text-(--foreground)">
        <li><strong>Readability:</strong> Simplified complex language.</li>
        <li><strong>Inclusivity:</strong> Removed biased or gendered terms.</li>
        <li><strong>Clarity:</strong> Clear responsibilities & requirements.</li>
        <li><strong>SEO:</strong> Optimized keywords for visibility.</li>
      </ul>
    </div>
  )}

  {/* SNACKBAR */}
  {snackbarOpen && (
    <div
      className="
        fixed bottom-6 left-1/2 -translate-x-1/2
        bg-green-600 text-white
        px-6 py-3 rounded-lg shadow-lg
        text-sm font-semibold
        animate-fadeIn
      "
    >
      Content of <strong>{activeTab === 0 ? "Original" : "Improved"}</strong> JD copied!
    </div>
  )}
</div>

    );
};

export default RewrittenJD;