"use client";

import React from "react";

const TrendCard = ({ trend }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <trend.icon 
          size={20} 
          className={trend.changeType === "positive" ? "text-green-600" : "text-red-600"} 
        />
        <span className="text-gray-700 font-medium">{trend.name}</span>
      </div>
      <div className="text-right">
        <div className="text-lg font-semibold text-gray-900">{trend.value}</div>
        <div className={`text-sm font-medium ${
          trend.changeType === "positive" ? "text-green-600" : "text-red-600"
        }`}>
          {trend.change}
        </div>
      </div>
    </div>
  );
};

export default TrendCard; 