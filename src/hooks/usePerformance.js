import { useEffect, useRef, useCallback } from 'react';

export const usePerformance = (componentName, options = {}) => {
  const { enabled = process.env.NODE_ENV === 'development', logToConsole = true } = options;
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());
  const mountTime = useRef(performance.now());

  useEffect(() => {
    if (!enabled) return;

    renderCount.current += 1;
    const currentTime = performance.now();
    const renderDuration = currentTime - lastRenderTime.current;
    const totalDuration = currentTime - mountTime.current;

    if (logToConsole) {
      console.log(`[Performance] ${componentName}:`, {
        renderCount: renderCount.current,
        renderDuration: `${renderDuration.toFixed(2)}ms`,
        totalDuration: `${totalDuration.toFixed(2)}ms`,
        timestamp: new Date().toISOString()
      });
    }

    lastRenderTime.current = currentTime;
  });

  const getMetrics = useCallback(() => ({
    renderCount: renderCount.current,
    totalDuration: performance.now() - mountTime.current,
    avgRenderTime: renderCount.current > 1 
      ? (performance.now() - mountTime.current) / renderCount.current 
      : 0
  }), []);

  return { getMetrics };
};

export const useRenderCount = (componentName) => {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} rendered ${renderCount.current} times`);
    }
  });

  return renderCount.current;
};

export const useMeasurePerformance = (callback, dependencies = []) => {
  const startTime = useRef(performance.now());
  
  useEffect(() => {
    const endTime = performance.now();
    const duration = endTime - startTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance measurement: ${duration.toFixed(2)}ms`);
    }
    
    callback?.(duration);
    startTime.current = performance.now();
  }, dependencies);
}; 