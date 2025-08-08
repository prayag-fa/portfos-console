"use client";

import React, { useState } from "react";

const JourneyMetricsChart = ({ data, title }) => {
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, data: null });
  const [visibility, setVisibility] = useState({
    avgTime: true,
    successRate: true
  });

  const width = 400;
  const height = 200;
  const padding = 40;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  const stepX = chartWidth / (data.length - 1);

  const createPath = (key) => {
    return data.map((point, index) => {
      const x = padding + index * stepX;
      const y = padding + chartHeight - (point[key] / (key === 'avgTime' ? 20 : 100)) * chartHeight;
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const index = Math.round((x - padding) / stepX);
    
    if (index >= 0 && index < data.length) {
      setTooltip({
        show: true,
        x: e.clientX,
        y: e.clientY,
        data: data[index]
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, x: 0, y: 0, data: null });
  };

  const toggleVisibility = (key) => {
    setVisibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">{title}</h4>
        <div className="text-xs text-gray-500">...</div>
      </div>
      <div className="text-2xl font-bold text-blue-600">-4%</div>
      <div className="text-xs text-gray-500">last week</div>
      
      <div className="relative">
        <svg 
          width={width} 
          height={height} 
          className="w-full cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Grid lines */}
          {[...Array(5)].map((_, i) => (
            <line
              key={i}
              x1={padding}
              y1={padding + (i * chartHeight) / 4}
              x2={width - padding}
              y2={padding + (i * chartHeight) / 4}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          ))}
          
          {/* Average Time Line */}
          {visibility.avgTime && (
            <path
              d={createPath('avgTime')}
              stroke="#8B5CF6"
              strokeWidth="2"
              fill="none"
              opacity="0.8"
            />
          )}
          
          {/* Success Rate Line */}
          {visibility.successRate && (
            <path
              d={createPath('successRate')}
              stroke="#3B82F6"
              strokeWidth="2"
              fill="none"
              opacity="0.8"
            />
          )}
        </svg>
        
        {/* Tooltip */}
        {tooltip.show && tooltip.data && (
          <div 
            className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs z-10"
            style={{ 
              left: tooltip.x + 10, 
              top: tooltip.y - 60,
              pointerEvents: 'none'
            }}
          >
            <div className="font-medium mb-1">{tooltip.data.day}</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span>Avg Time: {tooltip.data.avgTime} min</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Success Rate: {tooltip.data.successRate}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-center gap-4 text-xs">
        <button 
          onClick={() => toggleVisibility('avgTime')}
          className={`flex items-center gap-1 transition-opacity ${
            visibility.avgTime ? 'opacity-100' : 'opacity-40'
          }`}
        >
          <div className="w-3 h-3 bg-purple-500 rounded"></div>
          <span>Avg Time (min)</span>
        </button>
        <button 
          onClick={() => toggleVisibility('successRate')}
          className={`flex items-center gap-1 transition-opacity ${
            visibility.successRate ? 'opacity-100' : 'opacity-40'
          }`}
        >
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Success Rate (%)</span>
        </button>
      </div>
    </div>
  );
};

export default JourneyMetricsChart; 