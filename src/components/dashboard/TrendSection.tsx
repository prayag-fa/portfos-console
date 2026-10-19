import { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import type { UseQueryResult } from '@tanstack/react-query';
import type { Trend, TrendGroupBy, TrendPoint } from '../../types/analytics';
import { SkeletonCard } from '../common/SkeletonCard';
import { QueryErrorCard } from '../common/QueryErrorCard';
import { EmptyState } from '../common/EmptyState';
import { CardHeader, LegendDot } from '../common/CardHeader';
import { cn } from '../../utils/cn';
import { surface } from '../../utils/styles';
import { formatIndianNumber } from '../../utils/formatters';

const CARD_HEIGHT = 'h-full min-h-[360px]';
const AXIS_TICK = { fontSize: 11, fill: '#94a3b8' };

interface TrendSectionProps<T extends Trend> {
  title: string;
  unit: string;
  resource: string;
  emptyMessage: string;
  gradientId: string;
  color: string;
  variant: 'bar' | 'area';
  isAllTime?: boolean;
  useTrend: (groupBy: TrendGroupBy) => UseQueryResult<T>;
  totalOf: (data: T) => number | undefined;
}

const TrendTooltip = ({
  active,
  payload,
  unit,
  color,
}: {
  active?: boolean;
  payload?: { payload: TrendPoint }[];
  unit: string;
  color: string;
}) => {
  const p = payload?.[0]?.payload;
  if (!active || !p) return null;
  return (
    <div className="min-w-36 rounded-xl border border-slate-100 bg-white px-3 py-2.5 shadow-xl shadow-slate-900/10">
      <p className="text-[11px] font-medium text-slate-400">
        {p.startDate === p.endDate ? p.startDate : `${p.startDate} – ${p.endDate}`}
      </p>
      <p className="mt-1 text-base font-bold text-slate-900">{formatIndianNumber(p.count)}</p>
      <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
        {unit}
      </p>
    </div>
  );
};

const GroupBySelect = ({ value, onChange }: { value: TrendGroupBy; onChange: (v: TrendGroupBy) => void }) => (
  <div className="relative">
    <select
      aria-label="Group by"
      value={value}
      onChange={(e) => onChange(e.target.value as TrendGroupBy)}
      className="cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-medium text-slate-600 transition hover:border-[#0D1912]/40 hover:text-slate-900 focus:border-[#0D1912] focus:outline-none"
    >
      <option value="daily">Daily</option>
      <option value="weekly">Weekly</option>
    </select>
    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
  </div>
);

export function TrendSection<T extends Trend>({
  title,
  unit,
  resource,
  emptyMessage,
  gradientId,
  color,
  variant,
  isAllTime = false,
  useTrend,
  totalOf,
}: TrendSectionProps<T>) {
  const [groupBy, setGroupBy] = useState<TrendGroupBy>('weekly');
  const query = useTrend(groupBy);

  if (query.isLoading) return <SkeletonCard className={CARD_HEIGHT} lines={5} />;
  if (query.isError || !query.data) {
    return <QueryErrorCard resource={resource} onRetry={() => query.refetch()} className={CARD_HEIGHT} />;
  }

  const points = query.data.data ?? [];
  const isEmpty = points.length === 0 || points.every((p) => !p.count);
  const total = totalOf(query.data) ?? 0;

  return (
    <div className={cn(surface, 'animate-fade-up p-5 transition-opacity flex flex-col justify-between', CARD_HEIGHT, query.isFetching && 'opacity-80')}>
      <CardHeader
        title={title}
        subtitle={`${formatIndianNumber(total)} ${unit} ${isAllTime ? 'all-time' : 'in this period'}`}
      >
        <LegendDot color={color} label={unit.charAt(0).toUpperCase() + unit.slice(1)} />
        <GroupBySelect value={groupBy} onChange={setGroupBy} />
      </CardHeader>

      {isEmpty ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <div className="mt-5 h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            {variant === 'bar' ? (
              <BarChart data={points} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={false} minTickGap={16} />
                <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} width={44} />
                <Tooltip content={<TrendTooltip unit={unit} color={color} />} cursor={false} />
                <Bar
                  dataKey="count"
                  fill={`${color}33`}
                  activeBar={{ fill: color }}
                  radius={[6, 6, 6, 6]}
                  maxBarSize={36}
                  animationDuration={800}
                />
              </BarChart>
            ) : (
              <AreaChart data={points} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={false} minTickGap={24} />
                <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} width={44} />
                <Tooltip
                  content={<TrendTooltip unit={unit} color={color} />}
                  cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke={color}
                  strokeWidth={2.5}
                  fill={`url(#${gradientId})`}
                  activeDot={{ r: 6, fill: '#fff', stroke: color, strokeWidth: 3 }}
                  animationDuration={900}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
