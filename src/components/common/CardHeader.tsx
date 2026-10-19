import type { ReactNode } from 'react';

export const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
    {label}
  </span>
);

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export const CardHeader = ({ title, subtitle, children }: CardHeaderProps) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
      <h3 className="text-[15px] font-semibold text-slate-900">{title}</h3>
      {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
    </div>
    {children && <div className="flex flex-wrap items-center gap-4">{children}</div>}
  </div>
);
