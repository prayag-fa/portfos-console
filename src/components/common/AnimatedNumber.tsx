import { useEffect, useRef, useState } from 'react';
import { formatIndianNumber } from '../../utils/formatters';

const DURATION_MS = 900;

interface AnimatedNumberProps {
  value: number;
  format?: (n: number) => string;
}

const defaultFormat = (n: number) => formatIndianNumber(Math.round(n));

export const AnimatedNumber = ({ value, format = defaultFormat }: AnimatedNumberProps) => {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const target = Number.isFinite(value) ? value : 0;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      fromRef.current = target;
      setDisplay(target);
      return;
    }
    const from = fromRef.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = from + (target - from) * eased;
      fromRef.current = current;
      setDisplay(current);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <span className="tabular-nums">{format(display)}</span>;
};
