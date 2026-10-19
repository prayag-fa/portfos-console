import type { ReactNode } from 'react';
import { TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { surface, surfaceHover } from '../../utils/styles';
import { formatIndianNumber } from '../../utils/formatters';
import { AnimatedNumber } from './AnimatedNumber';
import { ProgressBar } from './ProgressBar';

export const ACCENTS = {
  violet: { tile: 'bg-[#F3FDDB] text-[#0D1912] ring-1 ring-[#DDF882]', color: '#65A30D' },
  orange: { tile: 'bg-orange-50 text-orange-500 ring-orange-100', color: '#fb923c' },
  teal: { tile: 'bg-teal-50 text-teal-600 ring-teal-100', color: '#2dd4bf' },
  sky: { tile: 'bg-sky-50 text-sky-600 ring-sky-100', color: '#38bdf8' },
} as const;

export type Accent = keyof typeof ACCENTS;

export const DeltaBadge = ({ value }: { value?: number | null }) => {
  const v = Number.isFinite(value) ? (value as number) : 0;
  const positive = v >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn('inline-flex items-center gap-1 text-xs font-semibold', positive ? 'text-emerald-600' : 'text-rose-600')}
      title="vs prior period"
    >
      <Icon className="h-3.5 w-3.5" />
      {Math.abs(v).toFixed(1)}%
    </span>
  );
};

export interface BreakdownItem {
  label: string;
  value: number;
  color: string;
  inBar?: boolean;
  inLegend?: boolean;
}

const Breakdown = ({ items }: { items: BreakdownItem[] }) => {
  const barItems = items.filter((i) => i.inBar !== false);
  const legendItems = items.filter((i) => i.inLegend !== false);
  const sum = barItems.reduce((s, i) => s + i.value, 0);
  return (
    <>
      <div className="mt-4 flex h-1.5 gap-0.5 overflow-hidden rounded-full bg-slate-100">
        {barItems.map((i) => (
          <div
            key={i.label}
            title={`${i.label}: ${formatIndianNumber(i.value)}`}
            className="h-full transition-[width] duration-700"
            style={{ width: `${sum ? (i.value / sum) * 100 : 0}%`, backgroundColor: i.color }}
          />
        ))}
      </div>
      <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1">
        {legendItems.map((i) => (
          <span key={i.label} className="inline-flex items-center gap-1 text-[11px] text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: i.color }} />
            {i.label}
            <span className="font-semibold tabular-nums text-slate-700">{formatIndianNumber(i.value)}</span>
          </span>
        ))}
      </div>
    </>
  );
};

interface MetricCardProps {
  title: string;
  icon: LucideIcon;
  accent: Accent;
  value: number;
  isEmpty?: boolean;
  delta?: number | null;
  progress?: { value: number; label: ReactNode };
  breakdown?: BreakdownItem[];
  footer?: ReactNode;
  index?: number;
}

export const MetricCard = ({
  title,
  icon: Icon,
  accent,
  value,
  isEmpty,
  delta,
  progress,
  breakdown,
  footer,
  index = 0,
}: MetricCardProps) => {
  const a = ACCENTS[accent];
  const showDelta = !isEmpty && delta !== undefined && delta !== null;

  return (
    <div
      className={cn(surface, surfaceHover, 'group flex h-full min-h-[148px] animate-fade-up flex-col p-5')}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-xs font-medium text-slate-500">{title}</h3>
          <div className="mt-1.5 flex items-baseline gap-2">
            <p className="text-2xl font-bold tracking-tight text-slate-900">
              <AnimatedNumber value={value} />
            </p>
            {breakdown && showDelta && <DeltaBadge value={delta} />}
          </div>
        </div>
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-110',
            a.tile
          )}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>

      {breakdown ? (
        <Breakdown items={breakdown} />
      ) : (
        <>
          <ProgressBar value={progress?.value ?? 0} color={a.color} className="mt-4 h-1.5" />
          <div className="mt-2.5 flex items-center justify-between gap-2 text-[11px]">
            <span className="truncate text-slate-400">
              {isEmpty ? 'No activity in this period' : progress?.label ?? footer ?? 'vs prior period'}
            </span>
            {showDelta && <DeltaBadge value={delta} />}
          </div>
        </>
      )}
    </div>
  );
};
