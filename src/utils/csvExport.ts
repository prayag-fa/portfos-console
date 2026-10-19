import type {
  AccountMetrics,
  ConsentMetrics,
  DimensionBreakdownItem,
  FipPerformance,
  JourneyMetrics,
  UserJourneyStatItem,
  UserMetrics,
} from '../types/analytics';
import { getFiMetadata } from '../config/fiMetadata';
import { safePercentage } from './formatters';

export const exportAnalyticsToCsv = (
  workspace: string,
  startDate?: string,
  endDate?: string,
  data: {
    users?: UserMetrics;
    journeys?: JourneyMetrics;
    consents?: ConsentMetrics;
    accounts?: AccountMetrics;
    fiBreakdown?: DimensionBreakdownItem[];
    fip?: FipPerformance[];
  } = {}
) => {
  const periodLabel = startDate && endDate ? `${startDate} to ${endDate}` : 'All Time';
  const rows: (string | number)[][] = [
    ['Portfos FIU Analytics Report'],
    ['Workspace (FIU)', workspace],
    ['Period', periodLabel],
    ['Generated At', new Date().toISOString()],
    [],
    ['-- USER METRICS --'],
    ['Total Registered Users', data.users?.totalUsers ?? 'N/A'],
    ['MAU', data.users?.mau ?? 'N/A'],
    ['MAU Growth vs Prior Period', `${data.users?.mauDeltaPercentage ?? 0}%`],
    [],
    ['-- CONSENT JOURNEY METRICS --'],
    ['Consent Requests Initiated', data.journeys?.totalJourneys ?? 'N/A'],
    ['Consent Accepted', data.journeys?.completedJourneys ?? 'N/A'],
    ['Consent Dropped', data.journeys?.droppedJourneys ?? 'N/A'],
    ['Consent Acceptance Rate', `${data.journeys?.journeyCompletionRate ?? 0}%`],
    ['Avg Consents Granted per Accepted Journey', data.journeys?.avgConsentsPerCompletedJourney ?? 'N/A'],
    [],
    ['-- LINKED ACCOUNTS & LIFECYCLE --'],
    ['Linked Accounts', data.accounts?.totalAccountsAdded ?? data.consents?.activeConsents ?? 'N/A'],
    ['Consent Expiring (<30d)', data.consents?.expiringConsentsNext30Days ?? 'N/A'],
    ['Consent Expired', data.consents?.expiredConsents ?? 'N/A'],
    ['Consent Revoked', data.consents?.revokedConsents ?? 'N/A'],
    [],
    ['-- ACCOUNTS BY FI TYPE --'],
    ['FI Type', 'Account Count', 'Share Percentage'],
    ...(data.fiBreakdown
      ? (() => {
          const tot = data.fiBreakdown.reduce((s, i) => s + i.count, 0) || 1;
          return data.fiBreakdown.map((item) => [
            getFiMetadata(item.key).label,
            item.count,
            `${safePercentage(item.count, tot).toFixed(1)}%`,
          ]);
        })()
      : (data.accounts?.breakupByFiType || []).map((item) => [
          item.fiType,
          item.accountCount,
          `${item.percentage}%`,
        ])),
    [],
    ['-- FINANCIAL INFORMATION PROVIDERS (FIPS) --'],
    ['FIP', 'FI Type', 'Linked Accounts'],
    ...(data.fip || []).map((f) => [
      f.fipName,
      f.fiType,
      f.accountCount,
    ]),
  ];

  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  const fileTag = startDate && endDate ? `${startDate}-to-${endDate}` : 'all-time';
  link.setAttribute('download', `portfos-analytics-${workspace}-${fileTag}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportUsersToCsv = (
  workspace: string,
  users: UserJourneyStatItem[] = []
) => {
  const rows: (string | number)[][] = [
    ['Portfos Console - Customer Accounts & Consent Journeys Report'],
    ['Workspace (FIU)', workspace],
    ['Generated At', new Date().toISOString()],
    ['Total Customers Exported', users.length],
    [],
    [
      'Client User ID',
      'Created On',
      'Last Account Added On',
      'Total Accounts',
      'FIP ID',
      'FI Type',
      'Masked Account Number',
      'Consent Status',
      'Consent Expiry',
      'Account Last Updated',
      'Finarkein Account ID',
    ],
  ];

  users.forEach((u) => {
    if (u.accounts.length === 0) {
      rows.push([
        u.clientUserId,
        u.createdOn,
        u.recentConsentOn ?? 'None',
        0,
        'N/A',
        'N/A',
        'N/A',
        'NO_ACCOUNTS',
        'N/A',
        'N/A',
        'N/A',
      ]);
    } else {
      u.accounts.forEach((acc, idx) => {
        rows.push([
          idx === 0 ? u.clientUserId : '',
          idx === 0 ? u.createdOn : '',
          idx === 0 ? (u.recentConsentOn ?? 'None') : '',
          idx === 0 ? u.accounts.length : '',
          acc.fipId,
          acc.fiType,
          acc.maskedAccountNumber,
          acc.consentStatus,
          acc.consentExpiry ?? '',
          acc.updatedOn ?? '',
          acc.fnrkAccountId,
        ]);
      });
    }
  });

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    rows.map((e) => e.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `portfos-users-${workspace}-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
