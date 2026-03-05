"use client";

import { useState } from "react";
import { CloudUpload, Image as ImageIcon, Camera, Loader2 } from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function ImageUpload({ onUpload, loading }) {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileError("");

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setFileError("Please upload an image file (JPG, PNG, etc.)");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setFileError("Image size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!preview) return;

    fetch(preview)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], fileName, { type: "image/jpeg" });
        onUpload(file);
      });
  };

  const handleClear = () => {
    setPreview(null);
    setFileName("");
    setFileError("");
  };

  return (
    <div className="w-full bg-(--card) border border-(--border) rounded-2xl p-6 text-center text-(--foreground) shadow-xl">
      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-2">
        Upload Plant Image
      </h2>
      <p className="text-(--muted-foreground) mb-6 text-sm sm:text-base">
        Take or upload a clear photo of the plant for instant identification
      </p>

      {/* Error */}
      {fileError && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
          {fileError}
        </div>
      )}

      {/* Preview Box */}
      <div
        className="
          border-2 border-dashed border-(--primary)
          rounded-xl p-6 mb-4
          bg-(--background)
          min-h-50
          flex flex-col items-center justify-center
        "
      >
        {preview ? (
          <div className="w-full max-w-md">
            <img
              src={preview}
              alt="Plant preview"
              className="w-full max-h-75 object-contain rounded-lg"
            />
            <p className="mt-2 text-sm wrap-break-word text-(--muted-foreground)">
              {fileName}
            </p>
          </div>
        ) : (
          <>
            <ImageIcon className="w-16 h-16 text-(--primary) mb-3" />
            <p className="text-(--muted-foreground)">No image selected</p>
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {/* Camera Button - Mobile */}
        <label className="sm:hidden w-full">
          <input
            type="file"
            hidden
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            disabled={loading}
          />
          <div
            className="
              w-full py-3 rounded-xl
              bg-(--primary)
              text-(--primary-foreground)
              font-semibold
              flex items-center justify-center gap-2
              cursor-pointer hover:opacity-90 transition
            "
          >
            <Camera className="w-4 h-4" />
            Take Photo
          </div>
        </label>

        {/* Upload Button */}
        <label className="w-full sm:w-auto">
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
          />
          <div
            className={`
              w-full sm:w-auto px-6 py-3 rounded-xl
              font-semibold flex items-center justify-center gap-2
              cursor-pointer transition
              ${
                preview
                  ? "border border-(--border) bg-(--background)"
                  : "bg-(--primary) text-(--primary-foreground)"
              }
            `}
          >
            <CloudUpload className="w-4 h-4" />
            Choose Image
          </div>
        </label>

        {preview && (
          <>
            {/* Identify Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="
                w-full sm:w-auto px-6 py-3 rounded-xl
                bg-(--primary)
                text-(--primary-foreground)
                font-semibold
                flex items-center justify-center gap-2
                hover:opacity-90 transition
                disabled:opacity-50 cursor-pointer
              "
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Identify Plant"
              )}
            </button>

            {/* Clear Button */}
            <button
              onClick={handleClear}
              disabled={loading}
              className="
                w-full sm:w-auto px-6 py-3 rounded-xl
                border border-(--border)
                bg-(--background)
                text-(--foreground)
                font-semibold
                hover:bg-(--muted) transition cursor-pointer
              "
            >
              Clear
            </button>
          </>
        )}
      </div>
    </div>
  );
}
