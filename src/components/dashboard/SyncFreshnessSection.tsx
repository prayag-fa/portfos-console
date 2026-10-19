import { CheckCircle2 } from 'lucide-react';
import type { UseQueryResult } from '@tanstack/react-query';
import type { SyncFreshnessMetrics } from '../../types/analytics';
import { SkeletonCard } from '../common/SkeletonCard';
import { QueryErrorCard } from '../common/QueryErrorCard';
import { CardHeader } from '../common/CardHeader';
import { RingProgress } from '../common/RingProgress';
import { ProgressBar } from '../common/ProgressBar';
import { formatIndianNumber } from '../../utils/formatters';
import { cn } from '../../utils/cn';
import { surface } from '../../utils/styles';

const CARD_HEIGHT = 'h-full min-h-[440px]';

interface SyncFreshnessSectionProps {
  query: UseQueryResult<SyncFreshnessMetrics>;
}

export const SyncFreshnessSection = ({ query }: SyncFreshnessSectionProps) => {
  if (query.isLoading) return <SkeletonCard className={CARD_HEIGHT} lines={5} />;
  if (query.isError || !query.data) {
    return <QueryErrorCard resource="sync freshness" onRetry={() => query.refetch()} className={CARD_HEIGHT} />;
  }

  const {
    syncedLast24Hours,
    syncedLast24HoursPct,
    syncedLast7Days,
    syncedLast7DaysPct,
    staleAccounts,
    staleAccountsPct,
    totalSyncAttempts,
    successfulSyncRate,
    failedSyncRate,
  } = query.data;

  const totalFreshPct = syncedLast24HoursPct + syncedLast7DaysPct;

  return (
    <div className={cn(surface, 'animate-fade-up p-5 flex flex-col justify-between', CARD_HEIGHT)}>
      <CardHeader
        title="FI Data Fetch & Freshness"
        subtitle={`${formatIndianNumber(totalSyncAttempts)} FI data fetches · ${successfulSyncRate.toFixed(1)}% fetch success`}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/70">
          <CheckCircle2 className="h-3.5 w-3.5" />
          FI Fetch Active
        </span>
      </CardHeader>

      <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="flex flex-col items-center justify-center text-center">
          <RingProgress value={totalFreshPct} color="#10b981" size={104} stroke={10} />
          <span className="mt-2 text-[11px] font-semibold text-slate-500">Fresh Fetches (&lt;7d)</span>
        </div>

        <div className="min-w-0 flex-1 space-y-3.5 w-full">
          <div>
            <div className="mb-1 flex items-baseline justify-between text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Fetched &lt;24 hours
              </span>
              <span className="tabular-nums text-slate-500">
                <strong className="text-slate-900">{formatIndianNumber(syncedLast24Hours)}</strong> ({syncedLast24HoursPct.toFixed(1)}%)
              </span>
            </div>
            <ProgressBar value={syncedLast24HoursPct} color="#10b981" className="h-2" />
          </div>

          <div>
            <div className="mb-1 flex items-baseline justify-between text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Fetched 1–7 days
              </span>
              <span className="tabular-nums text-slate-500">
                <strong className="text-slate-900">{formatIndianNumber(syncedLast7Days)}</strong> ({syncedLast7DaysPct.toFixed(1)}%)
              </span>
            </div>
            <ProgressBar value={syncedLast7DaysPct} color="#f59e0b" className="h-2" />
          </div>

          <div>
            <div className="mb-1 flex items-baseline justify-between text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Stale (&gt;7 days)
              </span>
              <span className="tabular-nums text-slate-500">
                <strong className="text-slate-900">{formatIndianNumber(staleAccounts)}</strong> ({staleAccountsPct.toFixed(1)}%)
              </span>
            </div>
            <ProgressBar value={staleAccountsPct} color="#f43f5e" className="h-2" />
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
          <p className="text-[11px] font-medium text-slate-400">FI Fetch Success Rate</p>
          <p className="mt-0.5 text-base font-bold text-slate-900">{successfulSyncRate.toFixed(1)}%</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
          <p className="text-[11px] font-medium text-slate-400">FI Fetch Failures</p>
          <p className="mt-0.5 text-base font-bold text-rose-600">{failedSyncRate.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
};
