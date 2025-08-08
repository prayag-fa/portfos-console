"use client";

import React from "react";

const KPICard = ({ metric, colors }) => {
  return (
    <div 
      className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
      style={{ borderColor: colors.primary[200] }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{metric.name}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
          <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
        </div>
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colors.primary[50] }}
        >
          <metric.icon size={24} style={{ color: colors.primary[600] }} />
        </div>
      </div>
      <div className="flex items-center mt-4">
        <span className={`text-sm font-medium ${
          metric.changeType === "positive" ? "text-green-600" : "text-red-600"
        }`}>
          {metric.change}
        </span>
        <span className="text-sm text-gray-500 ml-2">vs last week</span>
      </div>
    </div>
  );
};

export default KPICard; 