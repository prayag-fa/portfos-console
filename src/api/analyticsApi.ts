import { apiClient } from './client';
import { getFiMetadata } from '../config/fiMetadata';
import type {
  AccountCount,
  AccountHealth,
  AccountMetrics,
  AccountTrend,
  AnalyticsParams,
  ApiEnvelope,
  ConsentMetrics,
  ConsoleSummaryResponse,
  DimensionBreakdownResponse,
  FipBreakdownItem,
  FipBreakdownResponse,
  FipPerformance,
  JourneyMetrics,
  SpendAnalyticsSummary,
  SyncFreshnessMetrics,
  TrendGroupBy,
  TrendPoint,
  UserCount,
  UserJourneyStatItem,
  UserJourneyStatsParams,
  UserJourneyStatsResponse,
  UserMetrics,
  UserTrend,
} from '../types/analytics';

const ANALYTICS_API_ENABLED = false;

const DUMMY_METRICS: Record<string, any> = {
  users: {
    totalUsers: 3420,
    mau: 2380,
    mauDeltaPercentage: 14.8,
    dau: 820,
    dauMauRatio: 0.345,
    newUsers: 310,
  },
  journeys: {
    totalJourneys: 3890,
    completedJourneys: 3240,
    droppedJourneys: 650,
    journeyCompletionRate: 83.3,
    completionRateDelta: 5.2,
    avgConsentsPerCompletedJourney: 1.48,
    journeysDeltaPercentage: 11.4,
  },
  consents: {
    totalConsents: 4820,
    activeConsents: 4764,
    consentsGranted: 3240,
    expiringConsentsNext30Days: 84,
    expiredConsents: 36,
    revokedConsents: 20,
    consentsDeltaPercentage: 12.6,
  },
  accounts: {
    totalAccountsAdded: 4820,
    accountsDeltaPercentage: 12.4,
    avgAccountsPerUser: 1.4,
    breakupByFiType: [
      { fiType: 'DEPOSIT', accountCount: 2760, percentage: 57.3 },
      { fiType: 'MUTUAL_FUNDS', accountCount: 1050, percentage: 21.8 },
      { fiType: 'EQUITIES', accountCount: 570, percentage: 11.8 },
      { fiType: 'INSURANCE_POLICIES', accountCount: 240, percentage: 5.0 },
      { fiType: 'TERM_DEPOSIT', accountCount: 110, percentage: 2.3 },
      { fiType: 'GSTR1_3B', accountCount: 50, percentage: 1.0 },
      { fiType: 'NPS', accountCount: 25, percentage: 0.5 },
      { fiType: 'ETF', accountCount: 15, percentage: 0.3 },
    ],
  },
};

const simulateMockDelay = (min = 350, max = 550): Promise<void> => {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const get = async <T>(
  { workspace, startDate, endDate }: AnalyticsParams,
  resource: string,
  extraParams: Record<string, string | number> = {}
): Promise<ApiEnvelope<T>> => {
  if (ANALYTICS_API_ENABLED) {
    try {
      const params: Record<string, string | number> = { ...extraParams };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await apiClient.get<ApiEnvelope<T>>(`/v1/${workspace}/analytics/${resource}`, {
        params,
        headers: { 'x-workspace-id': workspace },
      });
      if (res.data?.data) return res.data;
    } catch {
      // fallback to dummy data
    }
  }

  await simulateMockDelay(300, 500);
  return {
    success: true,
    timestamp: new Date().toISOString(),
    data: (DUMMY_METRICS[resource] ?? {}) as T,
  };
};

const generateDummyTrend = (
  _workspace: string,
  _from: string,
  _to: string,
  groupBy: TrendGroupBy,
  baseVal: number,
  step: number
): TrendPoint[] => {
  const points = groupBy === 'daily' ? 14 : 10;
  const now = new Date();
  const arr: TrendPoint[] = [];
  for (let i = points - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * (groupBy === 'daily' ? 1 : 7) * 24 * 3600 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    const noise = Math.sin(i * 1.3) * step * 0.4;
    const count = Math.max(0, Math.round(baseVal + (points - i) * step + noise));
    const label = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    arr.push({
      label,
      startDate: dateStr,
      endDate: dateStr,
      count,
    });
  }
  return arr;
};

export const fetchUserCount = async ({ workspace, startDate, endDate }: AnalyticsParams) => {
  const params: Record<string, string> = {};
  if (startDate) params.from = startDate;
  if (endDate) params.to = endDate;

  try {
    const res = await apiClient.get<UserCount>(`/v1/${workspace}/console/count/user`, {
      params,
      headers: { 'x-workspace-id': workspace },
    });
    if (res.data?.totalUsers) return res.data;
  } catch {
    // fallback dummy
  }
  await simulateMockDelay(250, 450);
  return { totalUsers: 3420 };
};

export const fetchUserTrend = async (
  { workspace, startDate, endDate }: AnalyticsParams,
  groupBy: TrendGroupBy
): Promise<UserTrend> => {
  const params: Record<string, string> = { groupBy };
  if (startDate) params.from = startDate;
  if (endDate) params.to = endDate;

  try {
    const res = await apiClient.get<UserTrend>(`/v1/${workspace}/console/trends/count/user`, {
      params,
      headers: { 'x-workspace-id': workspace },
    });
    if (res.data?.data?.length) return res.data;
  } catch {
    // fallback dummy
  }
  await simulateMockDelay(350, 550);
  const from = startDate ?? '2026-03-24';
  const to = endDate ?? '2026-04-24';
  const data = generateDummyTrend(workspace, from, to, groupBy, 240, 25);
  return {
    workspace,
    from,
    to,
    groupBy,
    totalUsers: data.reduce((s, p) => s + p.count, 0),
    data,
  };
};

export const fetchAccountCount = async ({ workspace, startDate, endDate }: AnalyticsParams) => {
  const params: Record<string, string> = {};
  if (startDate) params.from = startDate;
  if (endDate) params.to = endDate;

  try {
    const res = await apiClient.get<AccountCount>(`/v1/${workspace}/console/count/account`, {
      params,
      headers: { 'x-workspace-id': workspace },
    });
    if (res.data?.totalAccounts) return res.data;
  } catch {
    // fallback dummy
  }
  await simulateMockDelay(250, 450);
  return { totalAccounts: 4820 };
};

export const fetchAccountTrend = async (
  { workspace, startDate, endDate }: AnalyticsParams,
  groupBy: TrendGroupBy
): Promise<AccountTrend> => {
  const params: Record<string, string> = { groupBy };
  if (startDate) params.from = startDate;
  if (endDate) params.to = endDate;

  try {
    const res = await apiClient.get<AccountTrend>(`/v1/${workspace}/console/trends/count/account`, {
      params,
      headers: { 'x-workspace-id': workspace },
    });
    if (res.data?.data?.length) return res.data;
  } catch {
    // fallback dummy
  }
  await simulateMockDelay(350, 550);
  const from = startDate ?? '2026-03-24';
  const to = endDate ?? '2026-04-24';
  const data = generateDummyTrend(workspace, from, to, groupBy, 340, 35);
  return {
    workspace,
    from,
    to,
    groupBy,
    totalAccounts: data.reduce((s, p) => s + p.count, 0),
    data,
  };
};

let summaryInFlight: { key: string; promise: Promise<ConsoleSummaryResponse> } | null = null;

export const fetchConsoleSummary = async ({
  workspace,
  startDate,
  endDate,
}: AnalyticsParams): Promise<ConsoleSummaryResponse> => {
  const cacheKey = `${workspace}_${startDate ?? ''}_${endDate ?? ''}`;
  if (summaryInFlight && summaryInFlight.key === cacheKey) {
    return summaryInFlight.promise;
  }

  const exec = async (): Promise<ConsoleSummaryResponse> => {
    const params: Record<string, string> = {};
    if (startDate) params.from = startDate;
    if (endDate) params.to = endDate;

    try {
      const res = await apiClient.get<ConsoleSummaryResponse>(
        `/v1/${workspace}/console/summary`,
        {
          params,
          headers: { 'x-workspace-id': workspace },
        }
      );
      if (res.data?.data) {
        return res.data;
      }
    } catch {
      // fallback to provided summary data when offline / dev mode
    }

    await simulateMockDelay(350, 550);

    return {
      data: {
        journeys: {
          total: 3890,
          previousTotal: 3480,
          completed: 3240,
          dropped: 650,
        },
        consents: {
          total: 4820,
          previousTotal: 4210,
          expired: 36,
          revoked: 20,
        },
        meta: {
          tenantId: workspace || 'finarkein',
          from: startDate || '2026-03-24',
          to: endDate || '2026-11-24',
          previousFrom: '2025-07-21',
          previousTo: '2026-03-23',
          updatedAt: '2026-10-17 11:53:46.145',
        },
      },
    };
  };

  const promise = exec().finally(() => {
    if (summaryInFlight?.key === cacheKey) {
      summaryInFlight = null;
    }
  });

  summaryInFlight = { key: cacheKey, promise };
  return promise;
};

export const fetchAccountHealth = async (p: AnalyticsParams): Promise<AccountHealth> => {
  const summary = await fetchConsoleSummary(p);
  const c = summary.data.consents;
  const total = c.total ?? 4820;
  const expired = c.expired ?? 36;
  const revoked = c.revoked ?? 20;
  const linked = Math.max(0, total - expired - revoked);

  return {
    linked,
    expiringConsent: 84,
    expiredConsent: expired,
    revokedConsent: revoked,
  };
};

export const fetchUserMetrics = (p: AnalyticsParams) => get<UserMetrics>(p, 'users');

export const fetchJourneyMetrics = async (p: AnalyticsParams): Promise<ApiEnvelope<JourneyMetrics>> => {
  const summary = await fetchConsoleSummary(p);
  const j = summary.data.journeys;
  const c = summary.data.consents;
  const meta = summary.data.meta;
  const total = j.total ?? 3890;
  const completed = j.completed ?? 3240;
  const dropped = j.dropped ?? 650;
  const prev = j.previousTotal ?? 3480;
  const journeyCompletionRate = total > 0 ? (completed / total) * 100 : 83.3;
  const journeysDeltaPercentage = prev > 0 ? ((total - prev) / prev) * 100 : 11.8;
  const avgConsentsPerCompletedJourney = completed > 0 ? Number((c.total / completed).toFixed(2)) : 1.48;

  return {
    success: true,
    timestamp: meta.updatedAt || new Date().toISOString(),
    data: {
      totalJourneys: total,
      completedJourneys: completed,
      droppedJourneys: dropped,
      journeyCompletionRate,
      completionRateDelta: journeysDeltaPercentage,
      avgConsentsPerCompletedJourney,
      journeysDeltaPercentage,
    },
  };
};

export const fetchConsentMetrics = async (
  p: AnalyticsParams,
  _expiringWithinDays = 30
): Promise<ApiEnvelope<ConsentMetrics>> => {
  const summary = await fetchConsoleSummary(p);
  const c = summary.data.consents;
  const meta = summary.data.meta;
  const total = c.total ?? 4820;
  const prev = c.previousTotal ?? 4210;
  const expired = c.expired ?? 36;
  const revoked = c.revoked ?? 20;
  const activeConsents = Math.max(0, total - expired - revoked);
  const consentsDeltaPercentage = prev > 0 ? ((total - prev) / prev) * 100 : 14.5;

  return {
    success: true,
    timestamp: meta.updatedAt || new Date().toISOString(),
    data: {
      consentsGranted: total,
      consentsDeltaPercentage,
      activeConsents,
      expiringConsentsNext30Days: 84,
      expiredConsents: expired,
      revokedConsents: revoked,
    },
  };
};

export const fetchAccountMetrics = (p: AnalyticsParams) => get<AccountMetrics>(p, 'accounts');

const FALLBACK_FIP_BREAKDOWN: FipBreakdownItem[] = [
  { key: 'fip@finbank', fiType: 'DEPOSIT', count: 2420 },
  { key: 'nebulon@finarkein', fiType: 'MUTUAL_FUNDS', count: 940 },
  { key: 'BARB0KIMXXX', fiType: 'DEPOSIT', count: 340 },
  { key: 'nebulon@finarkein', fiType: 'EQUITIES', count: 310 },
  { key: 'fip@finbank', fiType: 'MUTUAL_FUNDS', count: 220 },
  { key: 'nebulon@finarkein', fiType: 'INSURANCE_POLICIES', count: 190 },
  { key: 'talic-fip', fiType: 'INSURANCE_POLICIES', count: 120 },
  { key: 'nebulon@finarkein', fiType: 'GSTR1_3B', count: 80 },
  { key: 'sirius@finarkein', fiType: 'EQUITIES', count: 75 },
  { key: 'absli-fip', fiType: 'INSURANCE_POLICIES', count: 55 },
  { key: 'mli-fip', fiType: 'INSURANCE_POLICIES', count: 40 },
  { key: 'sirius@finarkein', fiType: 'MUTUAL_FUNDS', count: 30 },
];

const mapFipItem = (item: FipBreakdownItem): FipPerformance => {
  const meta = getFiMetadata(item.fiType);
  return {
    fipId: item.key,
    fipName: item.key,
    fiType: meta.label || item.fiType,
    accountCount: item.count,
  };
};

export const fetchFipLeaderboard = async ({
  workspace,
  startDate,
  endDate,
}: AnalyticsParams): Promise<FipPerformance[]> => {
  const params: Record<string, string> = { dimension: 'fip' };
  if (startDate) params.from = startDate;
  if (endDate) params.to = endDate;

  try {
    const res = await apiClient.get<FipBreakdownResponse>(
      `/v1/${workspace}/console/accounts/breakdown`,
      {
        params,
        headers: { 'x-workspace-id': workspace },
      }
    );
    if (res.data?.data && Array.isArray(res.data.data)) {
      return res.data.data.map(mapFipItem);
    }
  } catch {
    // fallback to provided breakdown data
  }

  await simulateMockDelay(300, 500);
  return FALLBACK_FIP_BREAKDOWN.map(mapFipItem);
};

export const fetchSpendAnalytics = async (_p: AnalyticsParams): Promise<SpendAnalyticsSummary> => {
  await new Promise((resolve) => setTimeout(resolve, 450));
  return {
    avgMonthlyOutflowPerUser: 18450,
    topCategory: 'Loan & EMI Repayments',
    categories: [
      { category: 'Loan & EMI Repayments', percentage: 31.4, estimatedVolumeCr: 3.8, color: '#6366f1' },
      { category: 'Utilities & Bills', percentage: 22.8, estimatedVolumeCr: 2.7, color: '#06b6d4' },
      { category: 'Groceries & Household', percentage: 17.5, estimatedVolumeCr: 2.1, color: '#10b981' },
      { category: 'Food & Dining', percentage: 12.6, estimatedVolumeCr: 1.5, color: '#f59e0b' },
      { category: 'Travel & Commute', percentage: 8.9, estimatedVolumeCr: 1.1, color: '#8b5cf6' },
      { category: 'Shopping & Leisure', percentage: 6.8, estimatedVolumeCr: 0.8, color: '#ec4899' },
    ],
  };
};

export const fetchSyncFreshness = async (_p: AnalyticsParams): Promise<SyncFreshnessMetrics> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return {
    syncedLast24Hours: 4070,
    syncedLast24HoursPct: 84.5,
    syncedLast7Days: 580,
    syncedLast7DaysPct: 12.0,
    staleAccounts: 170,
    staleAccountsPct: 3.5,
    totalSyncAttempts: 5640,
    successfulSyncRate: 97.4,
    failedSyncRate: 2.6,
  };
};

export const fetchFiTypeBreakdown = async ({
  workspace,
  startDate,
  endDate,
}: AnalyticsParams): Promise<DimensionBreakdownResponse> => {
  const params: Record<string, string> = { dimension: 'fiType' };
  if (startDate) params.from = startDate;
  if (endDate) params.to = endDate;

  try {
    const res = await apiClient.get<DimensionBreakdownResponse>(
      `/v1/${workspace}/console/accounts/breakdown`,
      {
        params,
        headers: { 'x-workspace-id': workspace },
      }
    );
    if (res.data?.data) return res.data;
  } catch {
    // fallback to provided data when endpoint is pending
  }

  await simulateMockDelay(300, 500);

  return {
    data: [
      { key: 'DEPOSIT', count: 2760 },
      { key: 'MUTUAL_FUNDS', count: 1050 },
      { key: 'EQUITIES', count: 570 },
      { key: 'INSURANCE_POLICIES', count: 240 },
      { key: 'TERM_DEPOSIT', count: 110 },
      { key: 'GSTR1_3B', count: 50 },
      { key: 'NPS', count: 25 },
      { key: 'ETF', count: 15 },
    ],
    meta: {
      tenantId: workspace || 'finarkein',
      dimension: 'fiType',
      from: startDate ?? '2026-03-24',
      to: endDate ?? '2026-04-24',
      updated: '2026-10-16T15:55:00Z',
    },
  };
};

const FALLBACK_USER_JOURNEY_STATS: UserJourneyStatItem[] = [
  {
    clientUserId: 'ajayvija12',
    createdOn: '2024-09-17T14:36:00.121+00:00',
    recentConsentOn: null,
    accounts: [],
    consentJourneys: [],
  },
  {
    clientUserId: 'sarvesh@finarkein',
    createdOn: '2024-09-17T13:16:25.689+00:00',
    recentConsentOn: '2024-11-27T10:20:57.567+00:00',
    accounts: [
      {
        fipId: 'nebulon@finarkein',
        fiType: 'MUTUAL_FUNDS',
        fnrkAccountId: '7eedb5e1863ec1eacbf3206be34e9377a11f0b1581f4116d90e275711600647d',
        maskedAccountNumber: '128-XXXXXX2102',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-10-11T11:16:59.000+00:00',
        updatedOn: '2024-10-11T11:17:55.097+00:00',
      },
      {
        fipId: 'nebulon@finarkein',
        fiType: 'MUTUAL_FUNDS',
        fnrkAccountId: 'a90df75eb117b441760edcdc871ddf96d2ab08f7cf7023fdca8002a83e86dca4',
        maskedAccountNumber: '128-XXXXXXXX5678',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-10-21T17:19:51.000+00:00',
        updatedOn: '2024-10-21T17:21:08.970+00:00',
      },
      {
        fipId: 'fip@finbank',
        fiType: 'DEPOSIT',
        fnrkAccountId: '0c24e19f02bb7dd4b75ea72df1eb0eeef5d9620d4208faff42fc90ab8fe10cc2',
        maskedAccountNumber: 'FNRKXXXXXX0609',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-10-11T11:16:59.000+00:00',
        updatedOn: '2024-10-11T11:17:55.092+00:00',
      },
      {
        fipId: 'fip@finbank',
        fiType: 'DEPOSIT',
        fnrkAccountId: '61d81aecc8cec4cd67191a9047659942232821ad598b00f45621f9710d6da506',
        maskedAccountNumber: 'FNRKXXXXXX1982',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-10-22T10:07:18.807+00:00',
        updatedOn: '2024-10-23T11:41:34.589+00:00',
      },
      {
        fipId: 'nebulon@finarkein',
        fiType: 'EQUITIES',
        fnrkAccountId: 'f458a8c75591b8b6cbacd8be032c1d9e1e170032dc30198c9c3006365780c30b',
        maskedAccountNumber: 'FNRKXXXXXX4004',
        consentStatus: 'EXPIRING',
        consentExpiry: '2026-10-30T12:57:01.102+00:00',
        updatedOn: '2024-10-15T12:57:23.637+00:00',
      },
      {
        fipId: 'fip@finbank',
        fiType: 'DEPOSIT',
        fnrkAccountId: 'c0f6a1a37be647586bfa85d60b2151cd041d7b34b7928595bd10f751de0be7b8',
        maskedAccountNumber: 'FNRKXXXXXXX5872',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-10-11T11:16:59.000+00:00',
        updatedOn: '2024-10-11T11:17:55.118+00:00',
      },
      {
        fipId: 'fip@finbank',
        fiType: 'DEPOSIT',
        fnrkAccountId: '3e0db41c703100a43562a24eb12857dd482f7386c1f2f12f9a2526165f0391da',
        maskedAccountNumber: 'FNRKXXXXXXXX0001',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-10-11T11:16:59.000+00:00',
        updatedOn: '2024-10-11T11:17:55.115+00:00',
      },
      {
        fipId: 'fip@finbank',
        fiType: 'DEPOSIT',
        fnrkAccountId: 'fcb2f70b3d612e91ab2c7ba1791a54356bb217889a2a87f3ea925160d29ede22',
        maskedAccountNumber: 'FNRKXXXXXXXX0002',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-10-11T11:16:59.000+00:00',
        updatedOn: '2024-10-11T11:17:55.107+00:00',
      },
      {
        fipId: 'fip@finbank',
        fiType: 'DEPOSIT',
        fnrkAccountId: 'b50bcb874d5d4b0812dec073b6f9f7add7a2d8964b9332438c0f848ca189c16d',
        maskedAccountNumber: 'FNRKXXXXXXXX0003',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-10-22T10:05:58.000+00:00',
        updatedOn: '2024-11-05T13:32:40.932+00:00',
      },
      {
        fipId: 'fip@finbank',
        fiType: 'DEPOSIT',
        fnrkAccountId: '697ae094d3cd7f2dd896739283c94fd542e569a2bcd78e50128f1609266d0d7a',
        maskedAccountNumber: 'FNRKXXXXXXXX0004',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-10-11T11:16:59.000+00:00',
        updatedOn: '2024-10-11T11:17:55.101+00:00',
      },
      {
        fipId: 'nebulon@finarkein',
        fiType: 'INSURANCE_POLICIES',
        fnrkAccountId: '5bfbe5a422098e8293a66c555e866378348578523e921f5969b130c1738ddf71',
        maskedAccountNumber: 'FNRKXXXXXXXX0005',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-10-21T11:14:53.000+00:00',
        updatedOn: '2024-10-21T11:15:54.326+00:00',
      },
      {
        fipId: 'talic-fip',
        fiType: 'INSURANCE_POLICIES',
        fnrkAccountId: '84754138558e00790b619ca754e9ad3fdaceb678220d465cc7468d00942a8140',
        maskedAccountNumber: 'FNRKXXXXXXXX0005',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-10-15T10:40:25.198+00:00',
        updatedOn: '2024-10-15T10:41:45.485+00:00',
      },
      {
        fipId: 'nebulon@finarkein',
        fiType: 'EQUITIES',
        fnrkAccountId: '66b33c379a71123369b50b04c6ddfc753c776ae91f26207bc8c294ca0312047b',
        maskedAccountNumber: 'FNRKXXXXXXXX3123',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-10-15T10:54:27.286+00:00',
        updatedOn: '2024-10-15T10:55:13.973+00:00',
      },
      {
        fipId: 'nebulon@finarkein',
        fiType: 'GSTR1_3B',
        fnrkAccountId: '5d661d91e5233444fb3c64d6588163a625c42cbdec3e6e89c414bc4a3ba895cd',
        maskedAccountNumber: 'FNRKXXXXXXXXX2788',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-27T10:19:12.164+00:00',
        updatedOn: '2024-11-27T10:20:57.568+00:00',
      },
      {
        fipId: 'nebulon@finarkein',
        fiType: 'MUTUAL_FUNDS',
        fnrkAccountId: '18de16bc8b8a2523bcb73c89efabb0f64ed342fde79cf0483a31566535f164d4',
        maskedAccountNumber: 'SBI-XXXXXXXX0006',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-10-15T10:54:27.286+00:00',
        updatedOn: '2024-10-15T10:55:13.977+00:00',
      },
      {
        fipId: 'absli-fip',
        fiType: 'INSURANCE_POLICIES',
        fnrkAccountId: '801047ab630776c8c381b08d525fa4c49af878f3a284514da70d25574d2851f8',
        maskedAccountNumber: 'XXXXX0135',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-10-15T10:40:25.198+00:00',
        updatedOn: '2024-10-15T10:41:45.473+00:00',
      },
      {
        fipId: 'mli-fip',
        fiType: 'INSURANCE_POLICIES',
        fnrkAccountId: '40b04c9271ee4dca71a43773c246738e87325b0654a255d746ecbdb477ee3beb',
        maskedAccountNumber: 'XXXXX9646',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-10-15T10:40:25.198+00:00',
        updatedOn: '2024-10-15T10:41:45.475+00:00',
      },
      {
        fipId: 'talic-fip',
        fiType: 'INSURANCE_POLICIES',
        fnrkAccountId: 'ee4ce1c488eb4d93b859ad05adc44ff2a8d6ec9e840823834cc37b525777364d',
        maskedAccountNumber: 'XXXXXX1779',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-10-15T10:40:25.198+00:00',
        updatedOn: '2024-10-15T10:41:45.490+00:00',
      },
      {
        fipId: 'talic-fip',
        fiType: 'INSURANCE_POLICIES',
        fnrkAccountId: 'a6ac9584a628a733a0220f2996fbd8750fbdb1829ade97f815cbfe06c6baec44',
        maskedAccountNumber: 'XXXXXX5294',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-10-15T10:40:25.198+00:00',
        updatedOn: '2024-10-15T10:41:45.490+00:00',
      },
    ],
    consentJourneys: [
      {
        requestId: '817d2942-d867-418d-b33d-936a6ea4e43a',
        status: 'SUCCESS',
        updatedOn: '2026-08-17T10:01:27.513+00:00',
      },
    ],
  },
  {
    clientUserId: 'ajayfinarkein12',
    createdOn: '2024-09-17T05:41:23.716+00:00',
    recentConsentOn: null,
    accounts: [],
    consentJourneys: [],
  },
  {
    clientUserId: 'user@finarkein',
    createdOn: '2024-10-02T09:14:22.000+00:00',
    recentConsentOn: '2024-11-20T14:10:05.000+00:00',
    accounts: [
      {
        fipId: 'fip@finbank',
        fiType: 'DEPOSIT',
        fnrkAccountId: '4a123f8b8a2523bcb73c89efabb0f64ed342fde79cf0483a31566535f164d411',
        maskedAccountNumber: 'FNRKXXXXXX8812',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-20T14:10:05.000+00:00',
        updatedOn: '2024-11-20T14:11:15.000+00:00',
      },
      {
        fipId: 'nebulon@finarkein',
        fiType: 'MUTUAL_FUNDS',
        fnrkAccountId: '9c551d91e5233444fb3c64d6588163a625c42cbdec3e6e89c414bc4a3ba895a1',
        maskedAccountNumber: '128-XXXXXX4401',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-20T14:10:05.000+00:00',
        updatedOn: '2024-11-20T14:11:15.000+00:00',
      },
      {
        fipId: 'talic-fip',
        fiType: 'INSURANCE_POLICIES',
        fnrkAccountId: '3d881eacbf3206be34e9377a11f0b1581f4116d90e275711600647d7eedb5e18',
        maskedAccountNumber: 'XXXXXX8912',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-20T14:10:05.000+00:00',
        updatedOn: '2024-11-20T14:11:15.000+00:00',
      },
      {
        fipId: 'nebulon@finarkein',
        fiType: 'EQUITIES',
        fnrkAccountId: '1e170032dc30198c9c3006365780c30bf458a8c75591b8b6cbacd8be032c1d9e',
        maskedAccountNumber: 'FNRKXXXXXX7721',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-20T14:10:05.000+00:00',
        updatedOn: '2024-11-20T14:11:15.000+00:00',
      },
    ],
    consentJourneys: [
      {
        requestId: '524f1181-a90d-45eb-92ab-08f7cf7023fd',
        status: 'SUCCESS',
        updatedOn: '2024-11-20T14:11:15.000+00:00',
      },
    ],
  },
  {
    clientUserId: 'rahul@finbank',
    createdOn: '2024-10-15T11:20:10.000+00:00',
    recentConsentOn: '2024-11-18T16:45:20.000+00:00',
    accounts: [
      {
        fipId: 'fip@finbank',
        fiType: 'DEPOSIT',
        fnrkAccountId: '7a123f8b8a2523bcb73c89efabb0f64ed342fde79cf0483a31566535f164d422',
        maskedAccountNumber: 'FNRKXXXXXX3349',
        consentStatus: 'EXPIRING',
        consentExpiry: '2026-11-04T16:45:20.000+00:00',
        updatedOn: '2024-11-18T16:46:12.000+00:00',
      },
      {
        fipId: 'nebulon@finarkein',
        fiType: 'MUTUAL_FUNDS',
        fnrkAccountId: '8b551d91e5233444fb3c64d6588163a625c42cbdec3e6e89c414bc4a3ba895b2',
        maskedAccountNumber: 'SBI-XXXXXXXX9921',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-18T16:45:20.000+00:00',
        updatedOn: '2024-11-18T16:46:12.000+00:00',
      },
    ],
    consentJourneys: [
      {
        requestId: '912c4431-7eed-4116-863e-c1eacbf3206b',
        status: 'SUCCESS',
        updatedOn: '2024-11-18T16:46:12.000+00:00',
      },
    ],
  },
  {
    clientUserId: 'admin@finarkein',
    createdOn: '2024-10-20T08:30:00.000+00:00',
    recentConsentOn: '2024-11-15T12:00:00.000+00:00',
    accounts: [
      {
        fipId: 'nebulon@finarkein',
        fiType: 'MUTUAL_FUNDS',
        fnrkAccountId: '2c331d91e5233444fb3c64d6588163a625c42cbdec3e6e89c414bc4a3ba895c3',
        maskedAccountNumber: 'UTI-XXXXXXXX5512',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-15T12:00:00.000+00:00',
        updatedOn: '2024-11-15T12:01:45.000+00:00',
      },
    ],
    consentJourneys: [
      {
        requestId: '631b8821-f458-48c7-5591-b8b6cbacd8be',
        status: 'SUCCESS',
        updatedOn: '2024-11-15T12:01:45.000+00:00',
      },
    ],
  },
  {
    clientUserId: 'vikram@wealth',
    createdOn: '2024-10-25T14:40:00.000+00:00',
    recentConsentOn: '2024-11-10T10:15:00.000+00:00',
    accounts: [
      {
        fipId: 'fip@finbank',
        fiType: 'DEPOSIT',
        fnrkAccountId: '5d221d91e5233444fb3c64d6588163a625c42cbdec3e6e89c414bc4a3ba895d4',
        maskedAccountNumber: 'FNRKXXXXXX9102',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-10T10:15:00.000+00:00',
        updatedOn: '2024-11-10T10:16:30.000+00:00',
      },
      {
        fipId: 'sirius@finarkein',
        fiType: 'EQUITIES',
        fnrkAccountId: '4f111d91e5233444fb3c64d6588163a625c42cbdec3e6e89c414bc4a3ba895e5',
        maskedAccountNumber: 'FNRKXXXXXX5541',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-10T10:15:00.000+00:00',
        updatedOn: '2024-11-10T10:16:30.000+00:00',
      },
      {
        fipId: 'nebulon@finarkein',
        fiType: 'GSTR1_3B',
        fnrkAccountId: '8e441d91e5233444fb3c64d6588163a625c42cbdec3e6e89c414bc4a3ba895f6',
        maskedAccountNumber: 'FNRKXXXXXXXXX9011',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-10T10:15:00.000+00:00',
        updatedOn: '2024-11-10T10:16:30.000+00:00',
      },
    ],
    consentJourneys: [
      {
        requestId: '741a9932-ee4c-4e1c-488e-b4d93b859ad0',
        status: 'SUCCESS',
        updatedOn: '2024-11-10T10:16:30.000+00:00',
      },
    ],
  },
  {
    clientUserId: 'neha@finarkein',
    createdOn: '2024-11-01T16:05:00.000+00:00',
    recentConsentOn: null,
    accounts: [],
    consentJourneys: [],
  },
  {
    clientUserId: 'karan@finbank',
    createdOn: '2024-11-04T10:12:00.000+00:00',
    recentConsentOn: '2024-11-05T09:20:00.000+00:00',
    accounts: [
      {
        fipId: 'fip@finbank',
        fiType: 'DEPOSIT',
        fnrkAccountId: '1a991d91e5233444fb3c64d6588163a625c42cbdec3e6e89c414bc4a3ba89507',
        maskedAccountNumber: 'FNRKXXXXXX7210',
        consentStatus: 'EXPIRING',
        consentExpiry: '2026-10-28T09:20:00.000+00:00',
        updatedOn: '2024-11-05T09:21:10.000+00:00',
      },
    ],
    consentJourneys: [
      {
        requestId: '312d7741-a6ac-4958-4a62-8a733a0220fb',
        status: 'SUCCESS',
        updatedOn: '2024-11-05T09:21:10.000+00:00',
      },
    ],
  },
  {
    clientUserId: 'prayag.test@finarkein',
    createdOn: '2024-11-06T14:10:00.000+00:00',
    recentConsentOn: '2024-11-26T14:20:00.000+00:00',
    accounts: [
      {
        fipId: 'nebulon@finarkein',
        fiType: 'MUTUAL_FUNDS',
        fnrkAccountId: '7a111eacbf3206be34e9377a11f0b1581f4116d90e275711600647d7eedb5e01',
        maskedAccountNumber: 'UTI-XXXXXXXX9810',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-26T14:20:00.000+00:00',
        updatedOn: '2024-11-26T14:21:05.000+00:00',
      },
      {
        fipId: 'fip@finbank',
        fiType: 'DEPOSIT',
        fnrkAccountId: '8b222eacbf3206be34e9377a11f0b1581f4116d90e275711600647d7eedb5e02',
        maskedAccountNumber: 'FNRKXXXXXX4190',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-26T14:20:00.000+00:00',
        updatedOn: '2024-11-26T14:21:05.000+00:00',
      },
      {
        fipId: 'sirius@finarkein',
        fiType: 'EQUITIES',
        fnrkAccountId: '9c333eacbf3206be34e9377a11f0b1581f4116d90e275711600647d7eedb5e03',
        maskedAccountNumber: 'FNRKXXXXXX6201',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-26T14:20:00.000+00:00',
        updatedOn: '2024-11-26T14:21:05.000+00:00',
      },
    ],
    consentJourneys: [
      {
        requestId: '8a91b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c',
        status: 'SUCCESS',
        updatedOn: '2024-11-26T14:21:05.000+00:00',
      },
    ],
  },
  {
    clientUserId: 'anuj@testbank',
    createdOn: '2024-11-07T09:15:00.000+00:00',
    recentConsentOn: '2024-11-25T11:10:00.000+00:00',
    accounts: [
      {
        fipId: 'fip@finbank',
        fiType: 'DEPOSIT',
        fnrkAccountId: '1d444eacbf3206be34e9377a11f0b1581f4116d90e275711600647d7eedb5e04',
        maskedAccountNumber: 'FNRKXXXXXX1082',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-25T11:10:00.000+00:00',
        updatedOn: '2024-11-25T11:12:00.000+00:00',
      },
      {
        fipId: 'talic-fip',
        fiType: 'INSURANCE_POLICIES',
        fnrkAccountId: '2e555eacbf3206be34e9377a11f0b1581f4116d90e275711600647d7eedb5e05',
        maskedAccountNumber: 'XXXXXX6643',
        consentStatus: 'EXPIRING',
        consentExpiry: '2026-10-31T11:10:00.000+00:00',
        updatedOn: '2024-11-25T11:12:00.000+00:00',
      },
    ],
    consentJourneys: [
      {
        requestId: '9b02c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
        status: 'SUCCESS',
        updatedOn: '2024-11-25T11:12:00.000+00:00',
      },
    ],
  },
  {
    clientUserId: 'test_user_om',
    createdOn: '2024-11-08T11:20:00.000+00:00',
    recentConsentOn: '2024-11-24T09:30:00.000+00:00',
    accounts: [
      {
        fipId: 'fip@finbank',
        fiType: 'DEPOSIT',
        fnrkAccountId: '3f666eacbf3206be34e9377a11f0b1581f4116d90e275711600647d7eedb5e06',
        maskedAccountNumber: 'FNRKXXXXXX9012',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-24T09:30:00.000+00:00',
        updatedOn: '2024-11-24T09:31:40.000+00:00',
      },
      {
        fipId: 'nebulon@finarkein',
        fiType: 'GSTR1_3B',
        fnrkAccountId: '4a777eacbf3206be34e9377a11f0b1581f4116d90e275711600647d7eedb5e07',
        maskedAccountNumber: 'FNRKXXXXXXXXX4199',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-24T09:30:00.000+00:00',
        updatedOn: '2024-11-24T09:31:40.000+00:00',
      },
    ],
    consentJourneys: [
      {
        requestId: '0c13d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
        status: 'SUCCESS',
        updatedOn: '2024-11-24T09:31:40.000+00:00',
      },
    ],
  },
  {
    clientUserId: 'test_dheeraj_01',
    createdOn: '2024-11-09T15:40:00.000+00:00',
    recentConsentOn: '2024-11-23T16:00:00.000+00:00',
    accounts: [
      {
        fipId: 'nebulon@finarkein',
        fiType: 'MUTUAL_FUNDS',
        fnrkAccountId: '5b888eacbf3206be34e9377a11f0b1581f4116d90e275711600647d7eedb5e08',
        maskedAccountNumber: '128-XXXXXX7701',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-23T16:00:00.000+00:00',
        updatedOn: '2024-11-23T16:01:25.000+00:00',
      },
      {
        fipId: 'fip@finbank',
        fiType: 'DEPOSIT',
        fnrkAccountId: '6c999eacbf3206be34e9377a11f0b1581f4116d90e275711600647d7eedb5e09',
        maskedAccountNumber: 'FNRKXXXXXX2155',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-23T16:00:00.000+00:00',
        updatedOn: '2024-11-23T16:01:25.000+00:00',
      },
    ],
    consentJourneys: [
      {
        requestId: '1d24e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
        status: 'SUCCESS',
        updatedOn: '2024-11-23T16:01:25.000+00:00',
      },
    ],
  },
  {
    clientUserId: 'ankit.test@finarkein',
    createdOn: '2024-11-10T10:00:00.000+00:00',
    recentConsentOn: '2024-11-22T10:45:00.000+00:00',
    accounts: [
      {
        fipId: 'nebulon@finarkein',
        fiType: 'MUTUAL_FUNDS',
        fnrkAccountId: '7d000eacbf3206be34e9377a11f0b1581f4116d90e275711600647d7eedb5e10',
        maskedAccountNumber: 'SBI-XXXXXXXX3311',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-22T10:45:00.000+00:00',
        updatedOn: '2024-11-22T10:46:10.000+00:00',
      },
      {
        fipId: 'sirius@finarkein',
        fiType: 'EQUITIES',
        fnrkAccountId: '8e111eacbf3206be34e9377a11f0b1581f4116d90e275711600647d7eedb5e11',
        maskedAccountNumber: 'FNRKXXXXXX8802',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-22T10:45:00.000+00:00',
        updatedOn: '2024-11-22T10:46:10.000+00:00',
      },
      {
        fipId: 'talic-fip',
        fiType: 'INSURANCE_POLICIES',
        fnrkAccountId: '9f222eacbf3206be34e9377a11f0b1581f4116d90e275711600647d7eedb5e12',
        maskedAccountNumber: 'XXXXXX9041',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-22T10:45:00.000+00:00',
        updatedOn: '2024-11-22T10:46:10.000+00:00',
      },
    ],
    consentJourneys: [
      {
        requestId: '2e35f6a7-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
        status: 'SUCCESS',
        updatedOn: '2024-11-22T10:46:10.000+00:00',
      },
    ],
  },
  {
    clientUserId: 'akash.qa_test',
    createdOn: '2024-11-11T13:30:00.000+00:00',
    recentConsentOn: '2024-11-21T15:30:00.000+00:00',
    accounts: [
      {
        fipId: 'fip@finbank',
        fiType: 'DEPOSIT',
        fnrkAccountId: '0a333eacbf3206be34e9377a11f0b1581f4116d90e275711600647d7eedb5e13',
        maskedAccountNumber: 'FNRKXXXXXX6123',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-21T15:30:00.000+00:00',
        updatedOn: '2024-11-21T15:31:18.000+00:00',
      },
    ],
    consentJourneys: [
      {
        requestId: '3f46a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
        status: 'SUCCESS',
        updatedOn: '2024-11-21T15:31:18.000+00:00',
      },
    ],
  },
  {
    clientUserId: 'prayag_enterprise',
    createdOn: '2024-11-12T08:45:00.000+00:00',
    recentConsentOn: '2024-11-17T13:20:00.000+00:00',
    accounts: [
      {
        fipId: 'fip@finbank',
        fiType: 'DEPOSIT',
        fnrkAccountId: '1b444eacbf3206be34e9377a11f0b1581f4116d90e275711600647d7eedb5e14',
        maskedAccountNumber: 'FNRKXXXXXX9920',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-17T13:20:00.000+00:00',
        updatedOn: '2024-11-17T13:21:40.000+00:00',
      },
      {
        fipId: 'sirius@finarkein',
        fiType: 'EQUITIES',
        fnrkAccountId: '2c555eacbf3206be34e9377a11f0b1581f4116d90e275711600647d7eedb5e15',
        maskedAccountNumber: 'FNRKXXXXXX3821',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-17T13:20:00.000+00:00',
        updatedOn: '2024-11-17T13:21:40.000+00:00',
      },
    ],
    consentJourneys: [
      {
        requestId: '4a57b8c9-0d1e-2f3a-4b5c-6d7e8f9a0b1c',
        status: 'SUCCESS',
        updatedOn: '2024-11-17T13:21:40.000+00:00',
      },
    ],
  },
  {
    clientUserId: 'anuj_finarkein_test',
    createdOn: '2024-11-13T10:10:00.000+00:00',
    recentConsentOn: null,
    accounts: [],
    consentJourneys: [],
  },
  {
    clientUserId: 'om@finbank',
    createdOn: '2024-11-14T11:00:00.000+00:00',
    recentConsentOn: '2024-11-16T12:00:00.000+00:00',
    accounts: [
      {
        fipId: 'fip@finbank',
        fiType: 'DEPOSIT',
        fnrkAccountId: '3d666eacbf3206be34e9377a11f0b1581f4116d90e275711600647d7eedb5e16',
        maskedAccountNumber: 'FNRKXXXXXX4488',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-16T12:00:00.000+00:00',
        updatedOn: '2024-11-16T12:01:30.000+00:00',
      },
      {
        fipId: 'nebulon@finarkein',
        fiType: 'MUTUAL_FUNDS',
        fnrkAccountId: '4e777eacbf3206be34e9377a11f0b1581f4116d90e275711600647d7eedb5e17',
        maskedAccountNumber: 'UTI-XXXXXXXX2240',
        consentStatus: 'EXPIRING',
        consentExpiry: '2026-11-02T12:00:00.000+00:00',
        updatedOn: '2024-11-16T12:01:30.000+00:00',
      },
    ],
    consentJourneys: [
      {
        requestId: '5b68c9d0-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
        status: 'SUCCESS',
        updatedOn: '2024-11-16T12:01:30.000+00:00',
      },
    ],
  },
  {
    clientUserId: 'dheeraj@finarkein',
    createdOn: '2024-11-15T09:40:00.000+00:00',
    recentConsentOn: '2024-11-14T08:15:00.000+00:00',
    accounts: [
      {
        fipId: 'nebulon@finarkein',
        fiType: 'MUTUAL_FUNDS',
        fnrkAccountId: '5f888eacbf3206be34e9377a11f0b1581f4116d90e275711600647d7eedb5e18',
        maskedAccountNumber: '128-XXXXXX9012',
        consentStatus: 'EXPIRING',
        consentExpiry: '2026-10-25T08:15:00.000+00:00',
        updatedOn: '2024-11-14T08:16:15.000+00:00',
      },
      {
        fipId: 'fip@finbank',
        fiType: 'DEPOSIT',
        fnrkAccountId: '6a999eacbf3206be34e9377a11f0b1581f4116d90e275711600647d7eedb5e19',
        maskedAccountNumber: 'FNRKXXXXXX8810',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-14T08:15:00.000+00:00',
        updatedOn: '2024-11-14T08:16:15.000+00:00',
      },
    ],
    consentJourneys: [
      {
        requestId: '6c79d0e1-2f3a-4b5c-6d7e-8f9a0b1c2d3e',
        status: 'SUCCESS',
        updatedOn: '2024-11-14T08:16:15.000+00:00',
      },
    ],
  },
  {
    clientUserId: 'test_ankit_uat',
    createdOn: '2024-11-16T12:15:00.000+00:00',
    recentConsentOn: null,
    accounts: [],
    consentJourneys: [],
  },
  {
    clientUserId: 'test_client_om99',
    createdOn: '2024-11-17T14:30:00.000+00:00',
    recentConsentOn: '2024-11-08T11:00:00.000+00:00',
    accounts: [
      {
        fipId: 'fip@finbank',
        fiType: 'DEPOSIT',
        fnrkAccountId: '7b000eacbf3206be34e9377a11f0b1581f4116d90e275711600647d7eedb5e20',
        maskedAccountNumber: 'FNRKXXXXXX7733',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-08T11:00:00.000+00:00',
        updatedOn: '2024-11-08T11:01:20.000+00:00',
      },
    ],
    consentJourneys: [
      {
        requestId: '7d80e1f2-3a4b-5c6d-7e8f-9a0b1c2d3e4f',
        status: 'SUCCESS',
        updatedOn: '2024-11-08T11:01:20.000+00:00',
      },
    ],
  },
  {
    clientUserId: 'dheeraj.test.sandbox',
    createdOn: '2024-11-18T10:00:00.000+00:00',
    recentConsentOn: '2024-11-03T14:30:00.000+00:00',
    accounts: [
      {
        fipId: 'fip@finbank',
        fiType: 'DEPOSIT',
        fnrkAccountId: '8c111eacbf3206be34e9377a11f0b1581f4116d90e275711600647d7eedb5e21',
        maskedAccountNumber: 'FNRKXXXXXX3910',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-11-03T14:30:00.000+00:00',
        updatedOn: '2024-11-03T14:31:10.000+00:00',
      },
    ],
    consentJourneys: [
      {
        requestId: '8e91f2a3-4b5c-6d7e-8f9a-0b1c2d3e4f5a',
        status: 'SUCCESS',
        updatedOn: '2024-11-03T14:31:10.000+00:00',
      },
    ],
  },
  {
    clientUserId: 'akash_test_user',
    createdOn: '2024-11-19T11:15:00.000+00:00',
    recentConsentOn: null,
    accounts: [],
    consentJourneys: [],
  },
  {
    clientUserId: 'test_anuj_beta',
    createdOn: '2024-11-20T16:00:00.000+00:00',
    recentConsentOn: '2024-10-28T16:00:00.000+00:00',
    accounts: [
      {
        fipId: 'nebulon@finarkein',
        fiType: 'MUTUAL_FUNDS',
        fnrkAccountId: '9d222eacbf3206be34e9377a11f0b1581f4116d90e275711600647d7eedb5e22',
        maskedAccountNumber: 'SBI-XXXXXXXX7744',
        consentStatus: 'ACTIVE',
        consentExpiry: '2025-10-28T16:00:00.000+00:00',
        updatedOn: '2024-10-28T16:01:50.000+00:00',
      },
    ],
    consentJourneys: [
      {
        requestId: '9f02a3b4-5c6d-7e8f-9a0b-1c2d3e4f5a6b',
        status: 'SUCCESS',
        updatedOn: '2024-10-28T16:01:50.000+00:00',
      },
    ],
  },
];

export const fetchUserJourneyStats = async ({
  workspace,
  page = 0,
  size = 100,
  sortBy = 'recentConsentOn',
  search,
}: UserJourneyStatsParams): Promise<UserJourneyStatsResponse> => {
  const params: Record<string, string | number> = {
    page,
    size,
    sortBy,
  };

  try {
    const res = await apiClient.get<UserJourneyStatsResponse>(
      `/v1/${workspace}/console/journey/stats`,
      {
        params,
        headers: { 'x-workspace-id': workspace },
      }
    );
    if (res.data?.data) {
      let data = res.data.data;
      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        data = data.filter(
          (u) =>
            u.clientUserId.toLowerCase().includes(q) ||
            u.accounts.some(
              (acc) =>
                acc.maskedAccountNumber.toLowerCase().includes(q) ||
                acc.fipId.toLowerCase().includes(q) ||
                acc.fiType.toLowerCase().includes(q)
            )
        );
      }
      return { data };
    }
  } catch {
    // fallback when endpoint is pending or offline
  }

  await simulateMockDelay(350, 600);

  let filtered = [...FALLBACK_USER_JOURNEY_STATS];
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.clientUserId.toLowerCase().includes(q) ||
        u.accounts.some(
          (acc) =>
            acc.maskedAccountNumber.toLowerCase().includes(q) ||
            acc.fipId.toLowerCase().includes(q) ||
            acc.fiType.toLowerCase().includes(q)
        )
    );
  }

  return {
    data: filtered,
  };
};
