"use client";

import React from "react";
import { getStatusColor, getStatusTextColor } from "@/lib/utils/formatters";

export default function StatusBadge({ status, showDot = true, size = "md" }) {
  const getStatusClasses = (status) => {
    switch (status) {
      case "completed":
      case "success":
        return "bg-green-50 text-green-700 border-green-200";
      case "in_progress":
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "failed":
      case "error":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm"
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClasses[size]} ${getStatusClasses(status)}`}
    >
      {showDot && (
        <div
          className={`w-1.5 h-1.5 rounded-full ${getStatusColor(status)}`}
        />
      )}
      {status}
    </span>
  );
} 