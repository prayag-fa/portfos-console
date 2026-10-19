import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface Option<T extends string | number> {
  value: T;
  label: ReactNode;
  ariaLabel?: string;
}

interface SegmentedControlProps<T extends string | number> {
  options: Option<T>[];
  value: T | null;
  onChange: (value: T) => void;
  ariaLabel: string;
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
}: SegmentedControlProps<T>) {
  const index = options.findIndex((o) => o.value === value);

  return (
    <div role="radiogroup" aria-label={ariaLabel} className="rounded-xl bg-slate-100/80 p-1">
      <div className="relative grid" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
        <span
          aria-hidden
          className={cn(
            'absolute inset-y-0 left-0 rounded-lg bg-white shadow-sm ring-1 ring-slate-900/5 transition-[transform,opacity] duration-300 ease-out',
            index < 0 && 'opacity-0'
          )}
          style={{
            width: `${100 / options.length}%`,
            transform: `translateX(${Math.max(index, 0) * 100}%)`,
          }}
        />
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={o.value === value}
            aria-label={o.ariaLabel}
            onClick={() => onChange(o.value)}
            className={cn(
              'relative z-10 flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              o.value === value ? 'text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
