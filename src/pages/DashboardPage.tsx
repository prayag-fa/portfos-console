import { useMemo } from 'react';
import type { AccountTrend, UserTrend } from '../types/analytics';
import { Header } from '../components/layout/Header';
import { RetentionAlertBanner } from '../components/dashboard/RetentionAlertBanner';
import { KpiSummaryGrid } from '../components/dashboard/KpiSummaryGrid';
import { TrendSection } from '../components/dashboard/TrendSection';
import { JourneyFunnelSection } from '../components/dashboard/JourneyFunnelSection';
import { ConsentLifecycleSection } from '../components/dashboard/ConsentLifecycleSection';
import { FiTypeDistributionSection } from '../components/dashboard/FiTypeDistributionSection';
import { FipLeaderboardSection } from '../components/dashboard/FipLeaderboardSection';
import {
  useAccountHealth,
  useAccountMetrics,
  useAccountTrend,
  useAllTimeUserCount,
  useConsentMetrics,
  useFipLeaderboard,
  useFiTypeBreakdown,
  useJourneyMetrics,
  useUserCount,
  useUserMetrics,
  useUserTrend,
} from '../hooks/useAnalytics';
import { useAuth } from '../hooks/useAuth';
import { useDashboardFilters } from '../hooks/useDashboardFilters';
import { exportAnalyticsToCsv } from '../utils/csvExport';

export const DashboardPage = () => {
  const { workspace, startDate, endDate, isAllTime, update, setPreset } = useDashboardFilters();
  const { session } = useAuth();
  const params = { workspace, startDate, endDate };

  const userCount = useUserCount(params);
  const allTimeUserCount = useAllTimeUserCount({ workspace });
  const accountHealth = useAccountHealth(params);
  const users = useUserMetrics(params);
  const journeys = useJourneyMetrics(params);
  const consents = useConsentMetrics(params);
  const accounts = useAccountMetrics(params);
  const fiTypeBreakdown = useFiTypeBreakdown(params);
  const fipLeaderboard = useFipLeaderboard(params);

  const lastUpdated = useMemo(() => {
    const envelopeStamps = [users, journeys, consents, accounts]
      .map((q) => q.data?.timestamp)
      .filter((t): t is string => Boolean(t));
    if (fiTypeBreakdown.data?.meta?.updated) {
      envelopeStamps.push(fiTypeBreakdown.data.meta.updated);
    }
    envelopeStamps.sort();
    return envelopeStamps[envelopeStamps.length - 1];
  }, [users.data, journeys.data, consents.data, accounts.data, fiTypeBreakdown.data]);

  const hasData = Boolean(
    userCount.data || accountHealth.data || users.data || journeys.data || consents.data || accounts.data || fiTypeBreakdown.data
  );

  return (
    <>
      <Header
        startDate={startDate}
        endDate={endDate}
        lastUpdated={lastUpdated}
        username={session?.username ?? ''}
        canExport={hasData}
        onPreset={setPreset}
        onDateChange={update}
        onExport={() =>
          exportAnalyticsToCsv(workspace, startDate, endDate, {
            users: users.data?.data
              ? { ...users.data.data, totalUsers: allTimeUserCount.data?.totalUsers ?? userCount.data?.totalUsers ?? users.data.data.totalUsers }
              : undefined,
            journeys: journeys.data?.data,
            consents: consents.data?.data,
            accounts: accounts.data?.data
              ? {
                  ...accounts.data.data,
                  totalAccountsAdded: accountHealth.data?.linked ?? accounts.data.data.totalAccountsAdded,
                }
              : undefined,
            fiBreakdown: fiTypeBreakdown.data?.data,
            fip: fipLeaderboard.data,
          })
        }
      />

      <main className="space-y-5 px-4 pb-28 pt-6 sm:px-8 lg:pb-10">
        <RetentionAlertBanner
          expiringCount={consents.data?.data?.expiringConsentsNext30Days ?? accountHealth.data?.expiringConsent ?? 0}
          expiredCount={consents.data?.data?.expiredConsents ?? accountHealth.data?.expiredConsent ?? 0}
          onExportCampaign={() => {
            const expiring = consents.data?.data?.expiringConsentsNext30Days ?? accountHealth.data?.expiringConsent ?? 0;
            const expired = consents.data?.data?.expiredConsents ?? accountHealth.data?.expiredConsent ?? 0;
            const rows = [
              ['Portfos Consent Renewal Cohort'],
              ['Workspace (FIU)', workspace],
              ['Expiring Consents (<30d)', expiring],
              ['Expired Consents', expired],
              ['Export Timestamp', new Date().toISOString()],
              ['Campaign Target', 'Consent Renewal Push / SMS Cohort'],
            ];
            const csv = 'data:text/csv;charset=utf-8,' + rows.map((r) => r.join(',')).join('\n');
            const link = document.createElement('a');
            link.href = encodeURI(csv);
            link.download = `portfos-renewal-cohort-${workspace}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        />

        {/* Global Executive KPI Metrics Grid */}
        <KpiSummaryGrid
          userCount={userCount}
          allTimeUserCount={allTimeUserCount}
          accountHealth={accountHealth}
          users={users}
          journeys={journeys}
          accounts={accounts}
          consents={consents}
          fipLeaderboard={fipLeaderboard}
          isAllTime={isAllTime}
        />

        {/* Generic Modular Widget Grid: Any widget can be placed anywhere */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Widget: Consent Journey Funnel */}
          <div className="lg:col-span-6">
            <JourneyFunnelSection query={journeys} />
          </div>

          {/* Widget: Linked Account Lifecycle */}
          <div className="lg:col-span-6">
            <ConsentLifecycleSection query={consents} accountHealth={accountHealth} />
          </div>

          {/* Widget: Linked Accounts Trend */}
          <div className="lg:col-span-6">
            <TrendSection<AccountTrend>
              title="Accounts Linked"
              unit="linked accounts"
              resource="account trend"
              emptyMessage={isAllTime ? 'No accounts found.' : 'No linked accounts in this period.'}
              gradientId="accountTrendFill"
              color="#10b981"
              variant="area"
              isAllTime={isAllTime}
              useTrend={(groupBy) => useAccountTrend(params, groupBy)}
              totalOf={(d) => d.totalAccounts ?? d.data?.reduce((sum, p) => sum + (p.count ?? 0), 0)}
            />
          </div>

          {/* Widget: User Registrations Trend */}
          <div className="lg:col-span-6">
            <TrendSection<UserTrend>
              title="User Registrations"
              unit="new users"
              resource="user trend"
              emptyMessage={isAllTime ? 'No users found.' : 'No new users in this period.'}
              gradientId="userTrendFill"
              color="#65a30d"
              variant="bar"
              isAllTime={isAllTime}
              useTrend={(groupBy) => useUserTrend(params, groupBy)}
              totalOf={(d) => d.totalUsers}
            />
          </div>

          {/* Widget: FI Types Distribution (Donut + 9 FI Types Breakdown) */}
          <div className="lg:col-span-6">
            <FiTypeDistributionSection query={fiTypeBreakdown} />
          </div>

          {/* Widget: Financial Information Providers (FIPs) */}
          <div className="lg:col-span-6">
            <FipLeaderboardSection query={fipLeaderboard} />
          </div>
        </div>
      </main>
    </>
  );
};
