import React from "react";
import { getStatusColor, getStatusTextColor } from "@/lib/utils/formatters";

export default function StatusBadge({ status, showDot = true, size = "sm" }) {
  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "completed":
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "partial":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium capitalize border ${sizeClasses[size]} ${getStatusClasses(status)}`}
    >
      {showDot && (
        <div
          className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(status)}`}
        ></div>
      )}
      {status?.replace("_", " ")}
    </span>
  );
} 