'use client';

import React, { useState, useEffect } from 'react';

const RefreshChart = ({ data, title }) => {
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, data: null });
  const [visibility, setVisibility] = useState({
    successRate: true
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const containerRef = React.useRef(null);
  const [dimensions, setDimensions] = React.useState({ width: 400, height: 200 });

  React.useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDimensions({ width: rect.width, height: 200 });
    }
  }, [isClient]);

  const { width, height } = dimensions;
  const padding = Math.min(40, width * 0.1); // Responsive padding
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  const stepX = chartWidth / (data.length - 1);

  const createPath = () => {
    return data
      .map((point, index) => {
        const x = padding + index * stepX;
        const y = padding + chartHeight - (point.successRate / 100) * chartHeight;
        return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
      })
      .join(' ');
  };

  const handleMouseMove = e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const index = Math.round((x - padding) / stepX);

    if (index >= 0 && index < data.length) {
      setTooltip({
        show: true,
        x: x,
        y: e.clientY - rect.top,
        data: data[index]
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, x: 0, y: 0, data: null });
  };

  const toggleVisibility = () => {
    setVisibility(prev => ({
      successRate: !prev.successRate
    }));
  };

  // Don't render chart until client-side to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h4 className='text-sm font-medium text-gray-700'>{title}</h4>
          <div className='text-xs text-gray-500'>...</div>
        </div>
        <div className='text-2xl font-bold text-green-600'>+12%</div>
        <div className='text-xs text-gray-500'>last week</div>
        <div className='h-48 animate-pulse rounded bg-gray-100' />
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h4 className='text-sm font-medium text-gray-700'>{title}</h4>
        <div className='text-xs text-gray-500'>...</div>
      </div>
      <div className='text-2xl font-bold text-green-600'>+12%</div>
      <div className='text-xs text-gray-500'>last week</div>

      <div ref={containerRef} className='relative w-full' style={{ height: height }}>
        <svg
          width={width}
          height={height}
          className='w-full cursor-crosshair'
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
              stroke='#E5E7EB'
              strokeWidth='1'
            />
          ))}

          {/* Smooth curve */}
          {visibility.successRate && (
            <path d={createPath()} stroke='#8B5CF6' strokeWidth='2' fill='none' opacity='0.8' />
          )}
        </svg>

        {/* Tooltip */}
        {tooltip.show && tooltip.data && (
          <div
            className='absolute z-10 rounded-lg border border-gray-200 bg-white p-3 text-xs shadow-lg'
            style={{
              left: tooltip.x + 10 > width - 120 ? tooltip.x - 130 : tooltip.x + 10,
              top: tooltip.y - 40 < 10 ? tooltip.y + 10 : tooltip.y - 40,
              pointerEvents: 'none',
              maxWidth: '120px'
            }}
          >
            <div className='mb-1 font-medium'>{tooltip.data.day}</div>
            <div className='flex items-center gap-2'>
              <div className='size-3 rounded bg-purple-500' />
              <span>Success Rate: {tooltip.data.successRate}%</span>
            </div>
          </div>
        )}
      </div>

      <div className='flex justify-center'>
        <button
          onClick={toggleVisibility}
          className={`flex items-center gap-1 text-xs text-gray-500 transition-opacity ${
            visibility.successRate ? 'opacity-100' : 'opacity-40'
          }`}
        >
          <div className='size-3 rounded bg-purple-500' />
          <span>Success Rate (%)</span>
        </button>
      </div>
    </div>
  );
};

export default RefreshChart;
