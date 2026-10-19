import { useQuery } from '@tanstack/react-query';
import {
  fetchAccountCount,
  fetchAccountHealth,
  fetchAccountMetrics,
  fetchAccountTrend,
  fetchConsentMetrics,
  fetchConsoleSummary,
  fetchFipLeaderboard,
  fetchFiTypeBreakdown,
  fetchJourneyMetrics,
  fetchSpendAnalytics,
  fetchSyncFreshness,
  fetchUserCount,
  fetchUserJourneyStats,
  fetchUserMetrics,
  fetchUserTrend,
} from '../api/analyticsApi';
import type { AnalyticsParams, TrendGroupBy, UserJourneyStatsParams } from '../types/analytics';

const STALE_TIME = 5 * 60 * 1000;

const options = { staleTime: STALE_TIME, retry: 1 };

export const useUserCount = ({ workspace, startDate, endDate }: AnalyticsParams) =>
  useQuery({
    queryKey: ['analytics', 'userCount', workspace, startDate, endDate],
    queryFn: () => fetchUserCount({ workspace, startDate, endDate }),
    ...options,
  });

export const useAllTimeUserCount = ({ workspace }: { workspace: string }) =>
  useQuery({
    queryKey: ['analytics', 'allTimeUserCount', workspace],
    queryFn: () => fetchUserCount({ workspace }),
    ...options,
  });

export const useUserTrend = (
  { workspace, startDate, endDate }: AnalyticsParams,
  groupBy: TrendGroupBy
) =>
  useQuery({
    queryKey: ['analytics', 'userTrend', workspace, startDate, endDate, groupBy],
    queryFn: () => fetchUserTrend({ workspace, startDate, endDate }, groupBy),
    ...options,
  });

export const useAccountCount = ({ workspace, startDate, endDate }: AnalyticsParams) =>
  useQuery({
    queryKey: ['analytics', 'accountCount', workspace, startDate, endDate],
    queryFn: () => fetchAccountCount({ workspace, startDate, endDate }),
    ...options,
  });

export const useAccountTrend = (
  { workspace, startDate, endDate }: AnalyticsParams,
  groupBy: TrendGroupBy
) =>
  useQuery({
    queryKey: ['analytics', 'accountTrend', workspace, startDate, endDate, groupBy],
    queryFn: () => fetchAccountTrend({ workspace, startDate, endDate }, groupBy),
    ...options,
  });

export const useAccountHealth = ({ workspace, startDate, endDate }: AnalyticsParams) =>
  useQuery({
    queryKey: ['analytics', 'accountHealth', workspace, startDate, endDate],
    queryFn: () => fetchAccountHealth({ workspace, startDate, endDate }),
    ...options,
  });

export const useUserMetrics = ({ workspace, startDate, endDate }: AnalyticsParams) =>
  useQuery({
    queryKey: ['analytics', 'users', workspace, startDate, endDate],
    queryFn: () => fetchUserMetrics({ workspace, startDate, endDate }),
    ...options,
  });

export const useJourneyMetrics = ({ workspace, startDate, endDate }: AnalyticsParams) =>
  useQuery({
    queryKey: ['analytics', 'journeys', workspace, startDate, endDate],
    queryFn: () => fetchJourneyMetrics({ workspace, startDate, endDate }),
    ...options,
  });

export const useConsentMetrics = ({ workspace, startDate, endDate }: AnalyticsParams) =>
  useQuery({
    queryKey: ['analytics', 'consents', workspace, startDate, endDate],
    queryFn: () => fetchConsentMetrics({ workspace, startDate, endDate }),
    ...options,
  });

export const useAccountMetrics = ({ workspace, startDate, endDate }: AnalyticsParams) =>
  useQuery({
    queryKey: ['analytics', 'accounts', workspace, startDate, endDate],
    queryFn: () => fetchAccountMetrics({ workspace, startDate, endDate }),
    ...options,
  });

export const useFipLeaderboard = ({ workspace, startDate, endDate }: AnalyticsParams) =>
  useQuery({
    queryKey: ['analytics', 'fipLeaderboard', workspace, startDate, endDate],
    queryFn: () => fetchFipLeaderboard({ workspace, startDate, endDate }),
    ...options,
  });

export const useSpendAnalytics = ({ workspace, startDate, endDate }: AnalyticsParams) =>
  useQuery({
    queryKey: ['analytics', 'spendCategories', workspace, startDate, endDate],
    queryFn: () => fetchSpendAnalytics({ workspace, startDate, endDate }),
    ...options,
  });

export const useSyncFreshness = ({ workspace, startDate, endDate }: AnalyticsParams) =>
  useQuery({
    queryKey: ['analytics', 'syncFreshness', workspace, startDate, endDate],
    queryFn: () => fetchSyncFreshness({ workspace, startDate, endDate }),
    ...options,
  });

export const useFiTypeBreakdown = ({ workspace, startDate, endDate }: AnalyticsParams) =>
  useQuery({
    queryKey: ['analytics', 'fiTypeBreakdown', workspace, startDate, endDate],
    queryFn: () => fetchFiTypeBreakdown({ workspace, startDate, endDate }),
    ...options,
  });

export const useConsoleSummary = ({ workspace, startDate, endDate }: AnalyticsParams) =>
  useQuery({
    queryKey: ['analytics', 'consoleSummary', workspace, startDate, endDate],
    queryFn: () => fetchConsoleSummary({ workspace, startDate, endDate }),
    ...options,
  });

export const useUserJourneyStats = (params: UserJourneyStatsParams) =>
  useQuery({
    queryKey: ['analytics', 'userJourneyStats', params.workspace, params.page, params.size, params.sortBy, params.search],
    queryFn: () => fetchUserJourneyStats(params),
    ...options,
  });
