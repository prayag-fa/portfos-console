export type FIType =
  | 'DEPOSIT'
  | 'MUTUAL_FUNDS'
  | 'EQUITIES'
  | 'NPS'
  | 'GENERAL_INSURANCE'
  | 'LIFE_INSURANCE'
  | 'TERM_DEPOSIT'
  | 'RECURRING_DEPOSIT'
  | 'ETF'
  | 'GSTR1_3B'
  | 'INSURANCE_POLICIES'
  | 'OTHER';

export interface ApiEnvelope<T> {
  success: boolean;
  timestamp: string;
  data: T;
}

export interface UserMetrics {
  totalUsers: number;
  mau: number;
  mauDeltaPercentage: number;
  dau: number;
  dauMauRatio: number;
  newUsers: number;
}

export interface UserCount {
  totalUsers: number;
}

export interface AccountCount {
  totalAccounts: number;
}

export interface AccountHealth {
  linked: number;
  expiringConsent: number;
  expiredConsent: number;
  revokedConsent: number;
}

export type TrendGroupBy = 'daily' | 'weekly';

export interface TrendPoint {
  label: string;
  startDate: string;
  endDate: string;
  count: number;
}

export interface Trend {
  workspace: string;
  from: string;
  to: string;
  groupBy: TrendGroupBy;
  data: TrendPoint[];
}

export interface UserTrend extends Trend {
  totalUsers: number;
}

export interface AccountTrend extends Trend {
  totalAccounts?: number;
}

export interface JourneyMetrics {
  totalJourneys: number;
  journeysDeltaPercentage: number;
  completedJourneys: number;
  droppedJourneys: number;
  journeyCompletionRate: number;
  completionRateDelta: number;
  avgConsentsPerCompletedJourney: number;
}

export interface ConsentMetrics {
  consentsGranted: number;
  consentsDeltaPercentage: number;
  activeConsents: number;
  expiringConsentsNext30Days: number;
  expiredConsents: number;
  revokedConsents: number;
}

export interface FiTypeBreakup {
  fiType: FIType;
  accountCount: number;
  percentage: number;
}

export interface AccountMetrics {
  totalAccountsAdded: number;
  accountsDeltaPercentage: number;
  avgAccountsPerUser: number;
  breakupByFiType: FiTypeBreakup[];
}

export interface AnalyticsParams {
  workspace: string;
  startDate?: string;
  endDate?: string;
}

export interface DimensionBreakdownItem {
  key: string;
  count: number;
}

export interface DimensionBreakdownMeta {
  tenantId?: string;
  dimension: string;
  from?: string;
  to?: string;
  updated?: string;
}

export interface DimensionBreakdownResponse {
  data: DimensionBreakdownItem[];
  meta: DimensionBreakdownMeta;
}

export interface FipBreakdownItem {
  key: string;
  fiType: string;
  count: number;
}

export interface FipBreakdownResponse {
  data: FipBreakdownItem[];
  meta: DimensionBreakdownMeta;
}

export interface ConsoleSummaryJourneys {
  total: number;
  previousTotal: number;
  completed: number;
  dropped: number;
}

export interface ConsoleSummaryConsents {
  total: number;
  previousTotal: number;
  expired: number;
  revoked: number;
}

export interface ConsoleSummaryMeta {
  tenantId: string;
  from: string;
  to: string;
  previousFrom?: string;
  previousTo?: string;
  updatedAt: string;
}

export interface ConsoleSummaryData {
  journeys: ConsoleSummaryJourneys;
  consents: ConsoleSummaryConsents;
  meta: ConsoleSummaryMeta;
}

export interface ConsoleSummaryResponse {
  data: ConsoleSummaryData;
}

export interface FipPerformance {
  fipId: string;
  fipName: string;
  fiType: string;
  accountCount: number;
  category?: 'BANK' | 'MUTUAL_FUND' | 'DEPOSITORY' | 'INSURANCE';
}

export interface SpendCategoryBreakdown {
  category: string;
  percentage: number;
  estimatedVolumeCr: number;
  color: string;
}

export interface SpendAnalyticsSummary {
  avgMonthlyOutflowPerUser: number;
  topCategory: string;
  categories: SpendCategoryBreakdown[];
}

export interface SyncFreshnessMetrics {
  syncedLast24Hours: number;
  syncedLast24HoursPct: number;
  syncedLast7Days: number;
  syncedLast7DaysPct: number;
  staleAccounts: number;
  staleAccountsPct: number;
  totalSyncAttempts: number;
  successfulSyncRate: number;
  failedSyncRate: number;
}

export interface UserAccountItem {
  fipId: string;
  fipName?: string;
  fiType: string;
  fnrkAccountId: string;
  maskedAccountNumber: string;
  consentStatus: 'ACTIVE' | 'REVOKED' | 'EXPIRED' | string;
  consentExpiry?: string;
  updatedOn?: string;
}

export interface UserConsentJourneyItem {
  requestId: string;
  status: 'SUCCESS' | 'COMPLETED' | 'ABANDONED' | 'FAILED' | string;
  updatedOn: string;
}

export interface UserJourneyStatItem {
  clientUserId: string;
  createdOn: string;
  recentConsentOn: string | null;
  accounts: UserAccountItem[];
  consentJourneys: UserConsentJourneyItem[];
}

export interface UserJourneyStatsResponse {
  data: UserJourneyStatItem[];
}

export interface UserJourneyStatsParams {
  workspace: string;
  page?: number;
  size?: number;
  sortBy?: string;
  search?: string;
}
