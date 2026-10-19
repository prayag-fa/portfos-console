import { useNavigate } from 'react-router-dom';
import { AlarmClock, Ban, CheckCircle2, Clock3, type LucideIcon } from 'lucide-react';
import type { UseQueryResult } from '@tanstack/react-query';
import type { AccountHealth, ApiEnvelope, ConsentMetrics } from '../../types/analytics';
import { SkeletonCard } from '../common/SkeletonCard';
import { QueryErrorCard } from '../common/QueryErrorCard';
import { AnimatedNumber } from '../common/AnimatedNumber';
import { CardHeader } from '../common/CardHeader';
import { cn } from '../../utils/cn';
import { surface } from '../../utils/styles';

const CARD_HEIGHT = 'h-full min-h-[330px]';

interface Tile {
  label: string;
  value: number;
  icon: LucideIcon;
  tile: string;
  badge?: string;
  filter?: string;
}

interface ConsentLifecycleSectionProps {
  query: UseQueryResult<ApiEnvelope<ConsentMetrics>>;
  accountHealth?: UseQueryResult<AccountHealth>;
}

export const ConsentLifecycleSection = ({ query, accountHealth }: ConsentLifecycleSectionProps) => {
  const navigate = useNavigate();
  if (query.isLoading || accountHealth?.isLoading) {
    return <SkeletonCard className={CARD_HEIGHT} lines={4} />;
  }
  if (query.isError && !accountHealth?.data) {
    return <QueryErrorCard resource="account lifecycle" onRetry={() => query.refetch()} className={CARD_HEIGHT} />;
  }

  const c = query.data?.data;
  const ah = accountHealth?.data;

  const linked = ah?.linked ?? c?.activeConsents ?? 0;
  const expiring = ah?.expiringConsent ?? c?.expiringConsentsNext30Days ?? 0;
  const expired = ah?.expiredConsent ?? c?.expiredConsents ?? 0;
  const revoked = ah?.revokedConsent ?? c?.revokedConsents ?? 0;

  const tiles: Tile[] = [
    { label: 'Linked Accounts', value: linked, icon: CheckCircle2, tile: 'bg-emerald-50 text-emerald-600', badge: 'Active', filter: 'with-accounts' },
    { label: 'Consent Expiring (<30d)', value: expiring, icon: AlarmClock, tile: 'bg-amber-50 text-amber-600', badge: 'Action Required', filter: 'expiring-consents' },
    { label: 'Consent Expired', value: expired, icon: Clock3, tile: 'bg-slate-100 text-slate-500', badge: 'Expired' },
    { label: 'Consent Revoked', value: revoked, icon: Ban, tile: 'bg-rose-50 text-rose-500', badge: 'Revoked' },
  ];

  const allZero = tiles.every((t) => !t.value);

  return (
    <div className={cn(surface, 'animate-fade-up p-5 flex flex-col justify-between', CARD_HEIGHT)}>
      <CardHeader
        title="Linked Account Lifecycle"
        subtitle={allZero ? 'No activity in this period' : 'Status distribution across linked accounts'}
      />

      <div className="mt-5 grid grid-cols-2 gap-3">
        {tiles.map(({ label, value, icon: Icon, tile, badge, filter }) => (
          <div
            key={label}
            onClick={() => {
              if (filter) {
                navigate(`/users?filter=${filter}`);
              }
            }}
            className={cn(
              'relative rounded-xl border border-slate-100 p-3.5 transition duration-200',
              filter ? 'cursor-pointer hover:border-[#0D1912]/40 hover:bg-[#F3FDDB]/30 hover:shadow-md' : 'hover:shadow-lg hover:shadow-slate-900/5'
            )}
            title={filter ? `View ${label} customers` : undefined}
          >
            <div className="flex items-center justify-between">
              <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', tile)}>
                <Icon className="h-4 w-4" />
              </span>
              {badge && (
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                    badge === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                      : badge === 'Action Required'
                      ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                      : badge === 'Revoked'
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-slate-100 text-slate-500'
                  )}
                >
                  {badge}
                </span>
              )}
            </div>
            <p className="mt-3 text-[11px] font-medium text-slate-400">{label}</p>
            <p className="mt-0.5 text-lg font-bold text-slate-900">
              <AnimatedNumber value={value} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
