import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

const SIDES = {
  bottom: 'left-1/2 top-full mt-2 -translate-x-1/2',
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  right: 'left-full top-1/2 ml-3 -translate-y-1/2',
};

interface HintProps {
  label: string;
  side?: keyof typeof SIDES;
  children: ReactNode;
  className?: string;
}

export const Hint = ({ label, side = 'bottom', children, className }: HintProps) => (
  <span className={cn('group/hint relative inline-flex', className)}>
    {children}
    <span
      role="tooltip"
      className={cn(
        'pointer-events-none absolute z-50 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover/hint:opacity-100 group-focus-within/hint:opacity-100',
        SIDES[side]
      )}
    >
      {label}
    </span>
  </span>
);
