import { useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Sector, Tooltip, type PieSectorShapeProps } from 'recharts';
import type { UseQueryResult } from '@tanstack/react-query';
import type { DimensionBreakdownResponse } from '../../types/analytics';
import { getFiMetadata } from '../../config/fiMetadata';
import { SkeletonCard } from '../common/SkeletonCard';
import { QueryErrorCard } from '../common/QueryErrorCard';
import { EmptyState } from '../common/EmptyState';
import { CardHeader } from '../common/CardHeader';
import { ProgressBar } from '../common/ProgressBar';
import { cn } from '../../utils/cn';
import { surface } from '../../utils/styles';
import { formatIndianNumber, safePercentage } from '../../utils/formatters';

const CARD_HEIGHT = 'h-full min-h-[440px]';

interface FiTypeDistributionSectionProps {
  query: UseQueryResult<DimensionBreakdownResponse | any>;
  className?: string;
}

export const FiTypeDistributionSection = ({ query, className }: FiTypeDistributionSectionProps) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const rawData = query.data;
  const items: { key: string; count: number }[] = useMemo(() => {
    if (!rawData) return [];
    if (Array.isArray(rawData.data)) {
      return rawData.data.map((i: any) => ({
        key: i.key ?? i.fiType ?? 'OTHER',
        count: i.count ?? i.accountCount ?? 0,
      }));
    }
    if (Array.isArray(rawData.data?.breakupByFiType)) {
      return rawData.data.breakupByFiType.map((i: any) => ({
        key: i.fiType ?? 'OTHER',
        count: i.accountCount ?? 0,
      }));
    }
    return [];
  }, [rawData]);

  const totalAccounts = useMemo(() => {
    return items.reduce((sum, item) => sum + item.count, 0);
  }, [items]);

  const chartData = useMemo(() => {
    return items.map((r) => {
      const meta = getFiMetadata(r.key);
      const share = safePercentage(r.count, totalAccounts);
      return {
        key: r.key,
        accountCount: r.count,
        share,
        name: meta.label,
        color: meta.color,
        meta,
      };
    });
  }, [items, totalAccounts]);

  if (query.isLoading) {
    return <SkeletonCard className={CARD_HEIGHT} lines={7} />;
  }
  if (query.isError || !query.data) {
    return <QueryErrorCard resource="FI type breakdown" onRetry={() => query.refetch()} className={CARD_HEIGHT} />;
  }

  const isEmpty = items.length === 0 || totalAccounts === 0;
  const focus = chartData[activeIndex ?? 0] ?? chartData[0];

  return (
    <div className={cn(surface, 'animate-fade-up p-5 flex flex-col justify-between', CARD_HEIGHT, className)}>
      <div>
        <CardHeader
          title="FI Types"
          subtitle={`${formatIndianNumber(totalAccounts)} linked accounts across ${items.length} types`}
        />

        {isEmpty ? (
          <EmptyState message="No linked accounts found for this period." />
        ) : (
          <>
            {/* Split layout: Donut on Left, Ranked Accounts list on Right */}
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-12 md:items-center">
              {/* Donut Chart */}
              <div className="flex flex-col items-center md:col-span-5">
                <div className="relative h-[180px] w-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="accountCount"
                        nameKey="name"
                        innerRadius="68%"
                        outerRadius="92%"
                        paddingAngle={3}
                        cornerRadius={7}
                        shape={(props: PieSectorShapeProps) => (
                          <Sector
                            cx={props.cx}
                            cy={props.cy}
                            innerRadius={props.innerRadius}
                            outerRadius={(props.outerRadius ?? 0) + (props.index === activeIndex ? 6 : 0)}
                            startAngle={props.startAngle}
                            endAngle={props.endAngle}
                            cornerRadius={7}
                            fill={props.fill}
                            fillOpacity={activeIndex === undefined || props.index === activeIndex ? 1 : 0.35}
                            stroke="none"
                            className="cursor-pointer transition-opacity duration-200"
                          />
                        )}
                        onMouseEnter={(_, i) => setActiveIndex(i)}
                        onMouseLeave={() => setActiveIndex(undefined)}
                        animationDuration={800}
                      >
                        {chartData.map((d) => (
                          <Cell key={d.key} fill={d.color} />
                        ))}
                      </Pie>
                      <Tooltip content={() => null} />
                    </PieChart>
                  </ResponsiveContainer>
                  {focus && (
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                      <span className="text-lg font-bold text-slate-900">{focus.share.toFixed(1)}%</span>
                      <span className="mt-0.5 line-clamp-1 text-[11px] font-medium text-slate-500">{focus.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Accounts list */}
              <div className="max-h-[280px] overflow-y-auto pr-1 md:col-span-7">
                <ul className="divide-y divide-slate-100">
                  {chartData.map((d, i) => {
                    const Icon = d.meta.icon;
                    const isHovered = activeIndex === i;
                    return (
                      <li
                        key={d.key}
                        onMouseEnter={() => setActiveIndex(i)}
                        onMouseLeave={() => setActiveIndex(undefined)}
                        className={cn(
                          '-mx-2 flex cursor-default items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors',
                          isHovered && 'bg-slate-50'
                        )}
                      >
                        <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-lg', d.meta.bgClass)}>
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="truncate font-medium text-slate-800">{d.name}</span>
                            <span className="tabular-nums font-semibold text-slate-900 ml-2">
                              {formatIndianNumber(d.accountCount)}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <div className="w-full">
                              <ProgressBar value={d.share} color={d.color} className="h-1" />
                            </div>
                            <span className="w-9 text-right text-[10px] tabular-nums text-slate-400">
                              {d.share.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
