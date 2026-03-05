"use client";

import React, { useState, useEffect } from "react";
import {
  Copy,
  Sparkles,
  Loader2,
  Check,
  RefreshCw,
  Search,
  Zap,
} from "lucide-react";

export const Toast = ({ message, type = "error", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "error"
      ? "bg-red-500"
      : type === "success"
        ? "bg-green-500"
        : "bg-blue-500";

  return (
    <div
      className={`fixed bottom-12 right-12 ${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slideIn z-50 max-w-md`}
    >
      <div className="flex-1">{message}</div>
      <button onClick={onClose} className="text-white hover:text-gray-200">
        ✕
      </button>
    </div>
  );
};
