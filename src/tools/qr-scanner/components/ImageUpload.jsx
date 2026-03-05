"use client";

import React, { useRef, useState } from "react";
import jsQR from "jsqr";
import { Upload } from "lucide-react";

const ImageUpload = ({ onResult, onError }) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    onError?.("");
    onResult?.("");

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        context.drawImage(img, 0, 0, img.width, img.height);

        try {
          const imageData = context.getImageData(0, 0, img.width, img.height);

          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          setLoading(false);

          if (code?.data) {
            onResult?.(code.data.trim());
            onError?.("");
          } else {
            onError?.(
              "No QR code detected in the uploaded image. Please ensure the code is clear.",
            );
          }
        } catch (err) {
          setLoading(false);
          console.error(err);
          onError?.("Error processing image data.");
        }
      };

      img.onerror = () => {
        setLoading(false);
        onError?.("Failed to load the image.");
      };

      img.src = e.target.result;
      event.target.value = "";
    };

    reader.onerror = () => {
      setLoading(false);
      onError?.("Failed to read the image file.");
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Hidden Input */}
      <input
        type="file"
        accept="image/png, image/jpeg"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Upload Button */}
      <button
        onClick={() => !loading && fileInputRef.current?.click()}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl
        bg-(--primary) text-(--primary-foreground)
        font-semibold transition hover:opacity-90
        disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-(--primary-foreground) border-t-transparent rounded-full animate-spin"></div>
            Processing Image...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            Choose Image to Decode
          </>
        )}
      </button>

      {/* Helper Text */}
      <p className="text-center text-sm text-(--muted-foreground)">
        Supported format: PNG, JPG (QR Code)
      </p>
    </div>
  );
};

export default ImageUpload;
