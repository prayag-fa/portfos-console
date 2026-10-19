import { useState, useMemo } from 'react';
import { Award, ChevronDown, HeartPulse, Landmark, PieChart, Shield, TrendingUp } from 'lucide-react';
import type { UseQueryResult } from '@tanstack/react-query';
import type { FipPerformance } from '../../types/analytics';
import { SkeletonCard } from '../common/SkeletonCard';
import { QueryErrorCard } from '../common/QueryErrorCard';
import { CardHeader } from '../common/CardHeader';
import { ProgressBar } from '../common/ProgressBar';
import { formatIndianNumber, safePercentage } from '../../utils/formatters';
import { cn } from '../../utils/cn';
import { surface } from '../../utils/styles';

const CARD_HEIGHT = 'h-full min-h-[440px]';

interface FipLeaderboardSectionProps {
  query: UseQueryResult<FipPerformance[]>;
  className?: string;
}

export const FipLeaderboardSection = ({ query, className }: FipLeaderboardSectionProps) => {
  const [filter, setFilter] = useState<string>('ALL');

  const items = useMemo(() => query.data ?? [], [query.data]);

  const totalAccounts = useMemo(() => {
    return items.reduce((sum, f) => sum + f.accountCount, 0);
  }, [items]);

  const fiTypes = useMemo(() => {
    const set = new Set(items.map((i) => i.fiType));
    return Array.from(set);
  }, [items]);

  const filtered = useMemo(() => {
    if (filter === 'ALL') return items;
    return items.filter((f) => f.fiType === filter);
  }, [items, filter]);

  if (query.isLoading) return <SkeletonCard className={CARD_HEIGHT} lines={6} />;
  if (query.isError || !query.data) {
    return <QueryErrorCard resource="FIP directory" onRetry={() => query.refetch()} className={CARD_HEIGHT} />;
  }

  const getFiTypeIcon = (fiType: string) => {
    switch (fiType.toLowerCase()) {
      case 'deposit':
        return Landmark;
      case 'mutual funds':
        return PieChart;
      case 'equities':
        return TrendingUp;
      case 'nps':
        return Award;
      case 'general insurance':
      case 'insurance policies':
        return Shield;
      case 'life insurance':
        return HeartPulse;
      case 'gst (gstr 1/3b)':
      case 'gstr1_3b':
        return Shield;
      default:
        return Landmark;
    }
  };

  const getFiTypeBadgeColor = (fiType: string) => {
    switch (fiType.toLowerCase()) {
      case 'deposit':
        return 'bg-blue-50 text-blue-700 ring-blue-200/60';
      case 'mutual funds':
        return 'bg-emerald-50 text-emerald-700 ring-emerald-200/60';
      case 'equities':
        return 'bg-purple-50 text-purple-700 ring-purple-200/60';
      case 'nps':
        return 'bg-pink-50 text-pink-700 ring-pink-200/60';
      case 'general insurance':
      case 'insurance policies':
        return 'bg-teal-50 text-teal-700 ring-teal-200/60';
      case 'life insurance':
        return 'bg-rose-50 text-rose-700 ring-rose-200/60';
      case 'gst (gstr 1/3b)':
      case 'gstr1_3b':
        return 'bg-sky-50 text-sky-700 ring-sky-200/60';
      default:
        return 'bg-slate-100 text-slate-700 ring-slate-200/60';
    }
  };

  return (
    <div className={cn(surface, 'animate-fade-up p-5 flex flex-col justify-between', CARD_HEIGHT, className)}>
      <CardHeader
        title="Financial Information Providers (FIPs)"
        subtitle={`Distribution across ${new Set(items.map((i) => i.fipId)).size} FIPs`}
      >
        <div className="relative">
          <select
            aria-label="Filter by FI Type"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-[#0D1912]/40 focus:border-[#0D1912] focus:outline-none"
          >
            <option value="ALL">All FI Types ({items.length})</option>
            {fiTypes.map((t) => {
              const count = items.filter((i) => i.fiType === t).length;
              return (
                <option key={t} value={t}>
                  {t} ({count})
                </option>
              );
            })}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
      </CardHeader>

      <div className="mt-4 max-h-[300px] overflow-y-auto overflow-x-auto pr-1">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
              <th className="pb-2.5 font-medium">FIP</th>
              <th className="pb-2.5 font-medium">FI Type</th>
              <th className="pb-2.5 text-right font-medium">Linked Accounts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {filtered.map((fip) => {
              const Icon = getFiTypeIcon(fip.fiType);
              const share = safePercentage(fip.accountCount, totalAccounts);

              return (
                <tr key={`${fip.fipId}-${fip.fiType}`} className="group transition-colors hover:bg-slate-50/70">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-hover:bg-[#F3FDDB] group-hover:text-[#0D1912]">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="font-semibold text-slate-800">{fip.fipName}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1',
                        getFiTypeBadgeColor(fip.fiType)
                      )}
                    >
                      {fip.fiType}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="hidden w-24 sm:block">
                        <ProgressBar value={share} color="#6366f1" className="h-1.5" />
                      </div>
                      <span className="text-right tabular-nums font-semibold text-slate-800">
                        {formatIndianNumber(fip.accountCount)}
                      </span>
                      <span className="w-12 text-right tabular-nums text-[11px] text-slate-400">
                        {share.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
