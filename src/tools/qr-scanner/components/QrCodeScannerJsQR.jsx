"use client";

import React, { useState, useRef, useEffect } from "react";
import jsQR from "jsqr";
import { Camera, Upload, Copy, StopCircle, QrCode, Check } from "lucide-react";

/* ---------------- Bounding Box ---------------- */

function drawBoundingBox(ctx, location) {
  const drawLine = (begin, end) => {
    ctx.beginPath();
    ctx.moveTo(begin.x, begin.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#2563eb"; // uses primary visually (cannot use CSS var inside canvas)
    ctx.stroke();
  };

  drawLine(location.topLeftCorner, location.topRightCorner);
  drawLine(location.topRightCorner, location.bottomRightCorner);
  drawLine(location.bottomRightCorner, location.bottomLeftCorner);
  drawLine(location.bottomLeftCorner, location.topLeftCorner);
}

/* ---------------- Component ---------------- */

const QrCodeScannerJsQR = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastDetectedRef = useRef(0);

  /* ---------------- Stop Camera ---------------- */

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);

    setIsScanning(false);
    setLoading(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  /* ---------------- Scan Loop ---------------- */

  const tick = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(tick);
      return;
    }

    const ctx = canvas.getContext("2d");

    if (
      canvas.width !== video.videoWidth ||
      canvas.height !== video.videoHeight
    ) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      // eslint-disable-next-line react-hooks/purity
      const now = Date.now();
      if (now - lastDetectedRef.current < 500) {
        drawBoundingBox(ctx, code.location);
        animationFrameRef.current = requestAnimationFrame(tick);
        return;
      }

      lastDetectedRef.current = now;
      drawBoundingBox(ctx, code.location);
      setResult(code.data.trim());
      stopCamera();
      return;
    }

    animationFrameRef.current = requestAnimationFrame(tick);
  };

  /* ---------------- Start Camera ---------------- */

  const startCamera = async () => {
    setError("");
    setResult("");
    setLoading(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      streamRef.current = stream;

      const video = videoRef.current;
      video.srcObject = stream;

      video.onloadedmetadata = () => {
        video.play();
        setIsScanning(true);
        setLoading(false);
        animationFrameRef.current = requestAnimationFrame(tick);
      };
    } catch (err) {
      setLoading(false);
      setError("Camera access denied or unavailable.");
    }
  };

  /* ---------------- Image Upload ---------------- */

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setResult("");
    stopCamera();

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);

        const code = jsQR(imageData.data, imageData.width, imageData.height);

        setLoading(false);

        if (code?.data) {
          setResult(code.data.trim());
        } else {
          setError("No QR code detected in the image.");
        }
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  };

  /* ---------------- Copy ---------------- */

  const copyToClipboard = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <QrCode className="w-14 h-14 mx-auto text-(--primary)" />
        <h1 className="heading">QR Code Scanner</h1>
        <p className="description">
          Scan QR codes from image upload or directly using your camera.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border border-(--border) rounded-xl overflow-hidden">
        <button
          onClick={() => setActiveTab("upload")}
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === "upload"
              ? "bg-(--primary) text-(--primary-foreground)"
              : "bg-(--card) text-(--foreground)"
          }`}
        >
          Upload Image
        </button>
        <button
          onClick={() => setActiveTab("camera")}
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === "camera"
              ? "bg-(--primary) text-(--primary-foreground)"
              : "bg-(--card) text-(--foreground)"
          }`}
        >
          Use Camera
        </button>
      </div>

      {/* Upload */}
      {activeTab === "upload" && (
        <div className="space-y-4">
          <input
            type="file"
            accept="image/png, image/jpeg"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 rounded-xl bg-(--primary) text-(--primary-foreground) font-semibold"
          >
            {loading ? "Processing..." : "Choose Image to Decode"}
          </button>
        </div>
      )}

      {/* Camera */}
      {activeTab === "camera" && (
        <div className="space-y-4">
          {!isScanning ? (
            <button
              onClick={startCamera}
              className="w-full py-3 rounded-xl bg-(--primary) text-(--primary-foreground) font-semibold"
            >
              {loading ? "Starting..." : "Start Camera Scan"}
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="w-full py-3 rounded-xl border border-(--border)"
            >
              Stop Camera
            </button>
          )}

          <div className="relative bg-(--card) border border-(--border) rounded-xl overflow-hidden">
            <video ref={videoRef} playsInline muted className="hidden" />
            <canvas ref={canvasRef} className="w-full h-72 object-contain" />

            {!isScanning && (
              <div className="absolute inset-0 flex items-center justify-center text-(--muted-foreground) text-sm text-center px-4">
                Camera preview will appear here.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-(--card) border border-(--border) text-(--muted-foreground)">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="p-6 rounded-2xl bg-(--card) border border-(--border) space-y-4">
          <p className="text-xs uppercase tracking-wide text-(--muted-foreground)">
            Scan Result:
          </p>

          <p className="font-mono font-bold text-lg text-(--foreground) break-all">
            {result}
          </p>

          <button
            onClick={copyToClipboard}
            className="px-4 py-2 rounded-xl bg-(--primary) text-(--primary-foreground)"
          >
            {copied ? "Copied ✔" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
};

export default QrCodeScannerJsQR;
