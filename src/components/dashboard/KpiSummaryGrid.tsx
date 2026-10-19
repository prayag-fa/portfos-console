import { Activity, Landmark, Layers, Users } from 'lucide-react';
import type { UseQueryResult } from '@tanstack/react-query';
import type {
  AccountHealth,
  AccountMetrics,
  ApiEnvelope,
  ConsentMetrics,
  FipPerformance,
  JourneyMetrics,
  UserCount,
  UserMetrics,
} from '../../types/analytics';
import { MetricCard } from '../common/MetricCard';
import { SkeletonCard } from '../common/SkeletonCard';
import { QueryErrorCard } from '../common/QueryErrorCard';
import { formatIndianNumber, safePercentage } from '../../utils/formatters';

interface KpiSummaryGridProps {
  userCount: UseQueryResult<UserCount>;
  allTimeUserCount?: UseQueryResult<UserCount>;
  accountHealth: UseQueryResult<AccountHealth>;
  users: UseQueryResult<ApiEnvelope<UserMetrics>>;
  journeys: UseQueryResult<ApiEnvelope<JourneyMetrics>>;
  accounts: UseQueryResult<ApiEnvelope<AccountMetrics>>;
  consents: UseQueryResult<ApiEnvelope<ConsentMetrics>>;
  fipLeaderboard?: UseQueryResult<FipPerformance[]>;
  isAllTime?: boolean;
}

const CARD_HEIGHT = 'min-h-[148px]';

export const KpiSummaryGrid = ({
  userCount,
  allTimeUserCount,
  accountHealth,
  users,
  journeys,
  accounts,
  consents: _consents,
  fipLeaderboard,
  isAllTime = false,
}: KpiSummaryGridProps) => {
  const u = users.data?.data;
  const j = journeys.data?.data;
  const a = accounts.data?.data;

  const totalUsersValue = allTimeUserCount?.data?.totalUsers ?? userCount.data?.totalUsers ?? 0;
  const userCountLoading = allTimeUserCount ? allTimeUserCount.isLoading : userCount.isLoading;
  const userCountError = allTimeUserCount
    ? allTimeUserCount.isError || !totalUsersValue
    : userCount.isError || !userCount.data;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {userCountLoading ? (
        <SkeletonCard className={CARD_HEIGHT} lines={1} />
      ) : userCountError && !totalUsersValue ? (
        <QueryErrorCard
          resource="total users"
          onRetry={() => (allTimeUserCount ? allTimeUserCount.refetch() : userCount.refetch())}
          className={CARD_HEIGHT}
        />
      ) : (
        <MetricCard
          index={0}
          title="Total Users"
          icon={Users}
          accent="violet"
          value={totalUsersValue}
          isEmpty={!totalUsersValue}
          delta={isAllTime ? undefined : u?.mauDeltaPercentage}
          footer={
            isAllTime
              ? ``
              : u?.newUsers
                ? `+${formatIndianNumber(u.newUsers)} new users in period`
                : undefined
          }
        />
      )}

      {accountHealth.isLoading ? (
        <SkeletonCard className={CARD_HEIGHT} lines={1} />
      ) : accountHealth.isError || !accountHealth.data ? (
        <QueryErrorCard resource="linked accounts" onRetry={() => accountHealth.refetch()} className={CARD_HEIGHT} />
      ) : (() => {
        const linked = accountHealth.data.linked ?? 0;
        const expiring = accountHealth.data.expiringConsent ?? 0;
        const expired = accountHealth.data.expiredConsent ?? 0;
        const revoked = accountHealth.data.revokedConsent ?? 0;
        const activeStable = Math.max(0, linked - expiring);
        const avgAccounts = a?.avgAccountsPerUser ?? 2.4;

        return (
          <MetricCard
            index={1}
            title="Linked Accounts"
            icon={Layers}
            accent="orange"
            value={linked}
            isEmpty={!linked}
            delta={isAllTime ? undefined : a?.accountsDeltaPercentage}
            progress={{
              value: Math.min(100, (avgAccounts / 4) * 100),
              label: `${avgAccounts.toFixed(1)} avg accounts / user`,
            }}
            breakdown={[
              { label: 'Active', value: activeStable, color: '#fb923c' },
              { label: 'Expiring (<30d)', value: expiring, color: '#fbbf24' },
            ]}
            footer={
              isAllTime
                ? `${formatIndianNumber(expiring)} expiring soon (<30d) · ${formatIndianNumber(expired + revoked)} revoked / expired`
                : a?.totalAccountsAdded
                  ? `+${formatIndianNumber(a.totalAccountsAdded)} added in period · ${formatIndianNumber(expiring)} expiring`
                  : `${formatIndianNumber(expiring)} expiring soon (<30d)`
            }
          />
        );
      })()}

      {journeys.isLoading ? (
        <SkeletonCard className={CARD_HEIGHT} lines={1} />
      ) : journeys.isError || !j ? (
        <QueryErrorCard resource="journeys" onRetry={() => journeys.refetch()} className={CARD_HEIGHT} />
      ) : (
        <MetricCard
          index={2}
          title="Consent Journeys"
          icon={Activity}
          accent="teal"
          value={j.totalJourneys ?? 0}
          isEmpty={!j.totalJourneys}
          delta={isAllTime ? undefined : (j.completionRateDelta || j.journeysDeltaPercentage)}
          progress={{
            value: safePercentage(j.completedJourneys, j.totalJourneys),
            label: `${safePercentage(j.completedJourneys, j.totalJourneys).toFixed(1)}% accepted`,
          }}
          footer={
            `${(j.avgConsentsPerCompletedJourney ?? 1.2).toFixed(1)} consents / accepted journey · ${formatIndianNumber(
              j.droppedJourneys ?? 0
            )} dropped`
          }
        />
      )}

      {fipLeaderboard?.isLoading ? (
        <SkeletonCard className={CARD_HEIGHT} lines={1} />
      ) : fipLeaderboard?.isError || !fipLeaderboard?.data ? (
        <QueryErrorCard resource="FIP directory" onRetry={() => fipLeaderboard?.refetch()} className={CARD_HEIGHT} />
      ) : (() => {
        const list = fipLeaderboard.data ?? [];
        const fipMap = new Map<string, number>();
        list.forEach((f) => {
          fipMap.set(f.fipId, (fipMap.get(f.fipId) ?? 0) + (f.accountCount ?? 0));
        });
        const totalFips = fipMap.size;
        const totalFipAccounts = Array.from(fipMap.values()).reduce((sum, c) => sum + c, 0);
        let topFipName = '';
        let topFipCount = 0;
        fipMap.forEach((count, name) => {
          if (count > topFipCount) {
            topFipCount = count;
            topFipName = name;
          }
        });
        const topFipShare = totalFipAccounts > 0 ? safePercentage(topFipCount, totalFipAccounts) : 0;
        const categories = new Set(list.map((f) => f.category || f.fiType)).size;

        return (
          <MetricCard
            index={3}
            title="Total FIPs"
            icon={Landmark}
            accent="sky"
            value={totalFips}
            isEmpty={!totalFips}
            progress={
              topFipName
                ? {
                    value: topFipShare,
                    label: `Top: ${topFipName} (${topFipShare.toFixed(1)}%)`,
                  }
                : undefined
            }
            footer={`${categories} institution categories · Banks, AMCs & Depositories`}
          />
        );
      })()}
    </div>
  );
};
