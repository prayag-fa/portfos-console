import { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';

interface ProgressBarProps {
  value: number;
  className?: string;
  barClassName?: string;
  color?: string;
}

export const ProgressBar = ({ value, className, barClassName, color }: ProgressBarProps) => {
  const pct = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(pct));
    return () => cancelAnimationFrame(id);
  }, [pct]);

  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-100', className)}>
      <div
        className={cn('h-full rounded-full transition-[width] duration-700 ease-out', barClassName)}
        style={{ width: `${width}%`, backgroundColor: color }}
      />
    </div>
  );
};
