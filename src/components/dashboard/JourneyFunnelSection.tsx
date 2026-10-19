import type { UseQueryResult } from '@tanstack/react-query';
import type { ApiEnvelope, JourneyMetrics } from '../../types/analytics';
import { SkeletonCard } from '../common/SkeletonCard';
import { QueryErrorCard } from '../common/QueryErrorCard';
import { ProgressBar } from '../common/ProgressBar';
import { RingProgress } from '../common/RingProgress';
import { CardHeader, LegendDot } from '../common/CardHeader';
import { Chip } from '../common/Chip';
import { cn } from '../../utils/cn';
import { surface } from '../../utils/styles';
import { formatIndianNumber, safePercentage } from '../../utils/formatters';

const CARD_HEIGHT = 'h-full min-h-[330px]';

const Row = ({ label, count, pct, color }: { label: string; count: number; pct: number; color: string }) => (
  <div>
    <div className="mb-1.5 flex items-baseline justify-between text-xs">
      <span className="font-medium text-slate-600">{label}</span>
      <span className="tabular-nums text-slate-400">
        <span className="font-semibold text-slate-800">{formatIndianNumber(count)}</span> · {pct.toFixed(1)}%
      </span>
    </div>
    <ProgressBar value={pct} color={color} className="h-2" />
  </div>
);

export const JourneyFunnelSection = ({ query }: { query: UseQueryResult<ApiEnvelope<JourneyMetrics>> }) => {
  if (query.isLoading) return <SkeletonCard className={CARD_HEIGHT} lines={4} />;
  if (query.isError || !query.data?.data) {
    return <QueryErrorCard resource="journey funnel" onRetry={() => query.refetch()} className={CARD_HEIGHT} />;
  }

  const j = query.data.data;
  const total = j.totalJourneys ?? 0;
  const completedPct = safePercentage(j.completedJourneys, total);
  const droppedPct = safePercentage(j.droppedJourneys, total);

  return (
    <div className={cn(surface, 'animate-fade-up p-5 flex flex-col justify-between', CARD_HEIGHT)}>
      <CardHeader title="Consent Journey Funnel">
        {total === 0 ? (
          <Chip>No consent requests</Chip>
        ) : (
          <>
            <LegendDot color="#10b981" label="Accepted" />
            <LegendDot color="#fb7185" label="Dropped" />
          </>
        )}
      </CardHeader>

      <div className="mt-6 flex items-center gap-6">
        <RingProgress value={completedPct} color="#10b981" size={96} stroke={10} />
        <div className="min-w-0 flex-1 space-y-4">
          <Row label="Consent Requested" count={total} pct={total > 0 ? 100 : 0} color="#7c5cf0" />
          <Row label="Consent Accepted" count={j.completedJourneys ?? 0} pct={completedPct} color="#10b981" />
          <Row label="Consent Dropped" count={j.droppedJourneys ?? 0} pct={droppedPct} color="#fb7185" />
        </div>
      </div>

      {total > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1 font-medium text-slate-700">
            Conversion: <span className="font-semibold text-[#0D1912]">{(j.avgConsentsPerCompletedJourney ?? 1.2).toFixed(1)}</span> consents granted / accepted journey
          </span>
          {Number.isFinite(j.completionRateDelta) && j.completionRateDelta !== 0 && (
            <span className={cn('font-semibold', j.completionRateDelta > 0 ? 'text-emerald-600' : 'text-rose-600')}>
              {j.completionRateDelta > 0 ? '▲ +' : '▼ '}
              {Math.abs(j.completionRateDelta).toFixed(1)}% vs prior period
            </span>
          )}
        </div>
      )}
    </div>
  );
};
