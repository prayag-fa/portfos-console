import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

const TONES = {
  slate: 'bg-slate-100 text-slate-700',
  amber: 'bg-amber-100 text-amber-800',
  indigo: 'bg-[#F3FDDB] text-[#0D1912] ring-1 ring-[#DDF882]',
  emerald: 'bg-emerald-50 text-emerald-700',
};

interface ChipProps {
  children: ReactNode;
  tone?: keyof typeof TONES;
  className?: string;
}

export const Chip = ({ children, tone = 'slate', className }: ChipProps) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
      TONES[tone],
      className
    )}
  >
    {children}
  </span>
);
