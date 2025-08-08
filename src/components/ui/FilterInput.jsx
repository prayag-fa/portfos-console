"use client";

import React from "react";
import { Search, ChevronDown, Calendar as CalendarIcon } from "lucide-react";

export default function FilterInput({
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  icon = "search",
  options = [],
  className = "",
}) {
  const getIcon = () => {
    switch (icon) {
      case "search":
        return <Search className="h-5 w-5 text-gray-400" />;
      case "calendar":
        return <CalendarIcon className="h-5 w-5 text-gray-400" />;
      case "dropdown":
        return <ChevronDown className="h-5 w-5 text-gray-400" />;
      default:
        return <Search className="h-5 w-5 text-gray-400" />;
    }
  };

  if (type === "select") {
    return (
      <div className={`relative ${className}`}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="relative">
          <select
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white appearance-none"
            value={value}
            onChange={onChange}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {getIcon()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white"
          value={value}
          onChange={onChange}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {getIcon()}
        </div>
      </div>
    </div>
  );
} 