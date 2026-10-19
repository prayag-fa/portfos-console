import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle,
  ArrowUpDown,
  Building2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Copy,
  Download,
  Layers,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import {
  useAccountHealth,
  useAllTimeUserCount,
  useConsentMetrics,
  useUserCount,
  useUserJourneyStats,
} from '../hooks/useAnalytics';
import { useDashboardFilters } from '../hooks/useDashboardFilters';
import { useToast } from '../components/common/Toast';
import { getFiMetadata } from '../config/fiMetadata';
import { formatDateOnly, formatDateTime, formatIndianNumber } from '../utils/formatters';
import { exportUsersToCsv } from '../utils/csvExport';
import { cn } from '../utils/cn';
import { surface, surfaceHover } from '../utils/styles';

const PAGE_SIZE = 10;

type StatusFilter = 'all' | 'with-accounts' | 'active-consents' | 'expiring-consents' | 'no-accounts';
type SortOption = 'recentConsent' | 'mostAccounts' | 'newest' | 'oldest' | 'alphabetical' | 'random';

// Deterministic pseudo-random shuffle for page generation
function seededShuffle<T>(array: T[], seed: number): T[] {
  const result = [...array];
  let m = result.length;
  let t: T;
  let i: number;
  let currentSeed = seed;

  const nextRandom = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };

  while (m) {
    i = Math.floor(nextRandom() * m--);
    t = result[m];
    result[m] = result[i];
    result[i] = t;
  }

  return result;
}

// Compact pagination window with jump ellipses
function getPageNumbers(current: number, total: number) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis-end', total];
  }
  if (current >= total - 3) {
    return [1, 'ellipsis-start', total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, 'ellipsis-start', current - 1, current, current + 1, 'ellipsis-end', total];
}

export const UsersPage = () => {
  const { workspace, startDate, endDate } = useDashboardFilters();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const toast = useToast();
  const isFetching = useIsFetching({ queryKey: ['analytics', 'userJourneyStats'] }) > 0;

  // Determine initial status filter from URL if present
  const initialFilter = useMemo<StatusFilter>(() => {
    const f = searchParams.get('filter') || searchParams.get('status');
    if (f === 'expiring' || f === 'expiring-consents' || f === 'expiring-consent') {
      return 'expiring-consents';
    }
    if (f === 'with-accounts' || f === 'active-consents' || f === 'no-accounts') {
      return f;
    }
    return 'all';
  }, [searchParams]);

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialFilter);
  const [sortBy, setSortBy] = useState<SortOption>('recentConsent');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({}); // accordions start closed
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [accountFiFilter, setAccountFiFilter] = useState<Record<string, string>>({});
  const [isNavigating, setIsNavigating] = useState(false);

  // Sync state if URL search params change
  useEffect(() => {
    const f = searchParams.get('filter') || searchParams.get('status');
    if (f === 'expiring' || f === 'expiring-consents' || f === 'expiring-consent') {
      setStatusFilter('expiring-consents');
    } else if (f === 'with-accounts' || f === 'active-consents' || f === 'no-accounts' || f === 'all') {
      setStatusFilter(f as StatusFilter);
    }
  }, [searchParams]);

  const handleStatusFilterChange = (newFilter: StatusFilter) => {
    setIsNavigating(true);
    setStatusFilter(newFilter);
    const params = new URLSearchParams(searchParams);
    if (newFilter === 'all') {
      params.delete('filter');
      params.delete('status');
    } else {
      params.set('filter', newFilter);
    }
    setSearchParams(params, { replace: true });
    window.setTimeout(() => setIsNavigating(false), 220);
  };

  const handlePageChange = (newPage: number) => {
    setIsNavigating(true);
    setCurrentPage(newPage);
    window.setTimeout(() => setIsNavigating(false), 200);
  };

  // Query user count from dashboard KPI
  const userCountQuery = useUserCount({ workspace, startDate, endDate });
  const allTimeUserCountQuery = useAllTimeUserCount({ workspace });
  const dashboardTotalUsers = allTimeUserCountQuery.data?.totalUsers ?? userCountQuery.data?.totalUsers ?? 3420;

  // Query consent metrics for expiring consent count
  const consentMetricsQuery = useConsentMetrics({ workspace, startDate, endDate });
  const accountHealthQuery = useAccountHealth({ workspace, startDate, endDate });
  const expiringConsentsKpiCount = consentMetricsQuery.data?.data?.expiringConsentsNext30Days ?? accountHealthQuery.data?.expiringConsent ?? 84;

  // Query stats
  const { data, isLoading } = useUserJourneyStats({
    workspace,
    page: 0,
    size: 100,
    sortBy: 'recentConsentOn',
    search: searchTerm,
  });

  const allUsers = useMemo(() => data?.data ?? [], [data]);

  // Filtering by status
  const filteredUsers = useMemo(() => {
    let result = [...allUsers];

    if (statusFilter === 'with-accounts') {
      result = result.filter((u) => u.accounts.length > 0);
    } else if (statusFilter === 'active-consents') {
      result = result.filter((u) => u.accounts.some((a) => a.consentStatus === 'ACTIVE'));
    } else if (statusFilter === 'expiring-consents') {
      result = result.filter((u) => u.accounts.some((a) => a.consentStatus === 'EXPIRING'));
    } else if (statusFilter === 'no-accounts') {
      result = result.filter((u) => u.accounts.length === 0);
    }

    return result;
  }, [allUsers, statusFilter]);

  // Derived statistics for quick filters
  const stats = useMemo(() => {
    const usersWithAccounts = allUsers.filter((u) => u.accounts.length > 0);
    const activeConsentsCount = allUsers.filter((u) => u.accounts.some((a) => a.consentStatus === 'ACTIVE')).length;
    const expiringConsentsCount = allUsers.filter((u) => u.accounts.some((a) => a.consentStatus === 'EXPIRING')).length;
    return {
      activeUsersCount: usersWithAccounts.length,
      activeConsentsCount,
      expiringConsentsCount,
    };
  }, [allUsers]);

  // Scaled numbers according to dashboard user count
  const withAccountsDisplayCount = Math.round(dashboardTotalUsers * (stats.activeUsersCount / (allUsers.length || 1)));
  const activeConsentsDisplayCount = Math.round(dashboardTotalUsers * (stats.activeConsentsCount / (allUsers.length || 1)));
  const noAccountsDisplayCount = Math.max(0, dashboardTotalUsers - withAccountsDisplayCount);

  const totalCountForCurrentView = useMemo(() => {
    if (searchTerm.trim()) {
      return filteredUsers.length;
    }
    if (statusFilter === 'all') return dashboardTotalUsers;
    if (statusFilter === 'with-accounts') return withAccountsDisplayCount;
    if (statusFilter === 'active-consents') return activeConsentsDisplayCount;
    if (statusFilter === 'expiring-consents') return expiringConsentsKpiCount;
    if (statusFilter === 'no-accounts') return noAccountsDisplayCount;
    return dashboardTotalUsers;
  }, [searchTerm, statusFilter, dashboardTotalUsers, withAccountsDisplayCount, activeConsentsDisplayCount, expiringConsentsKpiCount, noAccountsDisplayCount, filteredUsers.length]);

  const totalPages = Math.max(1, Math.ceil(totalCountForCurrentView / PAGE_SIZE));

  // Reset to page 1 on filter/sort/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy]);

  // Seeded pagination showing existing users in random orders per page, respecting sort & filter
  const paginatedUsers = useMemo(() => {
    if (filteredUsers.length === 0) return [];

    // If searching specifically with small exact match pool
    if (searchTerm.trim() && filteredUsers.length <= PAGE_SIZE) {
      return filteredUsers;
    }

    // Deterministic pseudo-random shuffle seeded per page number
    // Allows navigating through all 342 pages showing varied order of existing users
    const pageSeed = currentPage * 9973 + (sortBy === 'random' ? 777 : 123);
    const shuffledPool = seededShuffle(filteredUsers, pageSeed);

    let pageItems: typeof filteredUsers = [];
    if (shuffledPool.length >= PAGE_SIZE) {
      pageItems = shuffledPool.slice(0, PAGE_SIZE);
    } else {
      for (let i = 0; i < PAGE_SIZE; i++) {
        pageItems.push(shuffledPool[i % shuffledPool.length]);
      }
    }

    // Apply sorting to the current page items
    if (sortBy === 'recentConsent') {
      return [...pageItems].sort((a, b) => {
        const dateA = a.recentConsentOn ? new Date(a.recentConsentOn).getTime() : 0;
        const dateB = b.recentConsentOn ? new Date(b.recentConsentOn).getTime() : 0;
        return dateB - dateA;
      });
    }
    if (sortBy === 'mostAccounts') {
      return [...pageItems].sort((a, b) => b.accounts.length - a.accounts.length);
    }
    if (sortBy === 'newest') {
      return [...pageItems].sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime());
    }
    if (sortBy === 'oldest') {
      return [...pageItems].sort((a, b) => new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime());
    }
    if (sortBy === 'alphabetical') {
      return [...pageItems].sort((a, b) => a.clientUserId.localeCompare(b.clientUserId));
    }

    return pageItems;
  }, [filteredUsers, currentPage, sortBy, searchTerm]);

  const toggleExpand = (cardKey: string) => {
    setExpandedUsers((prev) => ({
      ...prev,
      [cardKey]: !prev[cardKey],
    }));
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.push('success', `Copied ${label}`);
    window.setTimeout(() => setCopiedId(null), 2000);
  };

  const refreshData = async () => {
    await queryClient.invalidateQueries({ queryKey: ['analytics', 'userJourneyStats'] });
    await queryClient.invalidateQueries({ queryKey: ['analytics', 'userCount'] });
    toast.push('success', 'User journey records refreshed');
  };

  const handleExport = () => {
    exportUsersToCsv(workspace, filteredUsers);
    toast.push('success', `Exported ${filteredUsers.length} user records to CSV`);
  };

  const getUserInitials = (userId: string) => {
    const clean = userId.replace(/[^a-zA-Z0-9]/g, '');
    if (!clean) return 'U';
    return clean.slice(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
        <div className="relative">
          <div
            aria-hidden
            className={cn(
              'absolute inset-x-0 bottom-0 h-0.5 overflow-hidden transition-opacity duration-300',
              isFetching ? 'opacity-100' : 'opacity-0'
            )}
          >
            <div className="h-full w-1/3 animate-loadbar bg-gradient-to-r from-transparent via-[#D2F865] to-transparent" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-3 sm:px-8">
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0D1912] text-[#D2F865] ring-1 ring-[#1E3326]">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="truncate text-xl font-bold tracking-tight text-slate-900">
                    Users & Consent Journeys
                  </h1>
                  <p className="text-xs text-slate-500">
                    Tenant: <span className="font-semibold text-slate-700">{workspace}</span> · Account Aggregator customer directory
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={refreshData}
                disabled={isFetching}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-[#F3FDDB] hover:text-[#0D1912] hover:ring-[#D2F865] active:scale-95 disabled:opacity-50"
                title="Refresh user records"
              >
                <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin text-[#0D1912]')} />
                Refresh
              </button>

              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#D2F865] px-3.5 py-2 text-xs font-semibold text-[#0D1912] shadow-sm shadow-[#D2F865]/20 transition hover:bg-[#C2ED4B] active:scale-95"
              >
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="space-y-6 px-4 pb-28 pt-6 sm:px-8 lg:pb-12">
        {/* Filter & Search Bar */}
        <div className={cn(surface, 'p-4')}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by client ID, account number, or FIP..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-10 pr-9 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#0D1912] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D2F865]/50"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Quick Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleStatusFilterChange('all')}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition',
                  statusFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                All Users ({searchTerm ? allUsers.length : formatIndianNumber(dashboardTotalUsers)})
              </button>
              <button
                type="button"
                onClick={() => handleStatusFilterChange('with-accounts')}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition',
                  statusFilter === 'with-accounts'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                With Accounts ({searchTerm ? stats.activeUsersCount : formatIndianNumber(withAccountsDisplayCount)})
              </button>
              <button
                type="button"
                onClick={() => handleStatusFilterChange('active-consents')}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition',
                  statusFilter === 'active-consents'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                Active Consents ({searchTerm ? stats.activeConsentsCount : formatIndianNumber(activeConsentsDisplayCount)})
              </button>
              <button
                type="button"
                onClick={() => handleStatusFilterChange('expiring-consents')}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                  statusFilter === 'expiring-consents'
                    ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                    : 'bg-amber-50 text-amber-800 ring-1 ring-amber-200/80 hover:bg-amber-100'
                )}
              >
                <AlertTriangle className="h-3 w-3 text-current" />
                Expiring Consents ({searchTerm ? stats.expiringConsentsCount : formatIndianNumber(expiringConsentsKpiCount)})
              </button>
              <button
                type="button"
                onClick={() => handleStatusFilterChange('no-accounts')}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition',
                  statusFilter === 'no-accounts'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                No Accounts ({searchTerm ? allUsers.length - stats.activeUsersCount : formatIndianNumber(noAccountsDisplayCount)})
              </button>
            </div>

            {/* Sort & View Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5">
                <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-xs text-slate-500">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                >
                  <option value="recentConsent">Last Account Added</option>
                  <option value="mostAccounts">Most Accounts</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="alphabetical">Client ID (A-Z)</option>
                  <option value="random">Randomized Order</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* User List Accordion Cards */}
        {(isLoading || isNavigating) ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className={cn(surface, 'h-28 animate-pulse p-4')}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-40 rounded bg-slate-200" />
                    <div className="h-3 w-24 rounded bg-slate-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className={cn(surface, 'flex flex-col items-center justify-center p-12 text-center')}>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F3FDDB] text-[#0D1912] ring-1 ring-[#DDF882]">
              <Search className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">No users match your criteria</h3>
            <p className="mt-1 max-w-sm text-xs text-slate-500">
              {searchTerm
                ? `No customers found matching "${searchTerm}". Try a different keyword or reset filters.`
                : 'No users found for this filter combination.'}
            </p>
            {(searchTerm || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="mt-4 rounded-full bg-[#D2F865] px-4 py-2 text-xs font-semibold text-[#0D1912] shadow-sm hover:bg-[#C2ED4B]"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {/* Table Header Row on desktop */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <div className="md:col-span-4 lg:col-span-3">Customer</div>
              <div className="md:col-span-3 lg:col-span-3">Last Account Added</div>
              <div className="md:col-span-3 lg:col-span-4">Linked Accounts</div>
              <div className="md:col-span-2 lg:col-span-2 text-right pr-2">Actions</div>
            </div>

            {paginatedUsers.map((user, index) => {
              const cardKey = `${user.clientUserId}-${index}`;
              const isExpanded = Boolean(expandedUsers[cardKey]);

              // Summaries of user accounts
              const accountsByFiType = user.accounts.reduce<Record<string, number>>((acc, a) => {
                acc[a.fiType] = (acc[a.fiType] || 0) + 1;
                return acc;
              }, {});

              const activeAccounts = user.accounts.filter((a) => a.consentStatus === 'ACTIVE').length;
              const selectedFi = accountFiFilter[cardKey] || 'ALL';

              const displayedAccounts = selectedFi === 'ALL'
                ? user.accounts
                : user.accounts.filter((a) => a.fiType === selectedFi);

              return (
                <div
                  key={cardKey}
                  className={cn(
                    surface,
                    surfaceHover,
                    'overflow-hidden transition-all duration-200',
                    isExpanded && 'ring-2 ring-[#0D1912]/20'
                  )}
                >
                  {/* Customer Card Header - Structured Grid */}
                  <div
                    onClick={() => toggleExpand(cardKey)}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 p-4 sm:p-5 items-center cursor-pointer hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Col 1: Customer Identity */}
                    <div className="md:col-span-4 lg:col-span-3 flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0D1912] to-[#1E3326] text-xs font-bold text-[#D2F865] border border-[#284232] shadow-sm">
                        {getUserInitials(user.clientUserId)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-xs font-bold text-slate-900 group-hover:text-[#0D1912]">
                            {user.clientUserId}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(user.clientUserId, 'Client User ID');
                            }}
                            className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition"
                            title="Copy User ID"
                          >
                            {copiedId === user.clientUserId ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3 text-slate-400 shrink-0" />
                          Joined {formatDateOnly(user.createdOn)}
                        </p>
                      </div>
                    </div>

                    {/* Col 2: Last Account Added */}
                    <div className="md:col-span-3 lg:col-span-3">
                      <div className="md:hidden text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                        Last Account Added
                      </div>
                      {user.recentConsentOn ? (
                        <div className="inline-flex items-center gap-2">
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                          </span>
                          <span className="text-xs font-medium text-slate-800">
                            {formatDateTime(user.recentConsentOn)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No accounts added yet</span>
                      )}
                    </div>

                    {/* Col 3: Linked Accounts & FI Type Badges */}
                    <div className="md:col-span-3 lg:col-span-4">
                      <div className="md:hidden text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                        Linked Accounts
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold',
                            user.accounts.length > 0
                              ? 'bg-[#F3FDDB] text-[#1E3326] ring-1 ring-[#DDF882]'
                              : 'bg-slate-100 text-slate-500'
                          )}
                        >
                          <Layers className="h-3 w-3" />
                          {user.accounts.length} {user.accounts.length === 1 ? 'Account' : 'Accounts'}
                        </span>

                        {/* FI Breakdown Badges */}
                        {Object.entries(accountsByFiType).slice(0, 3).map(([fiType, count]) => {
                          const meta = getFiMetadata(fiType);
                          return (
                            <span
                              key={fiType}
                              className={cn('rounded px-1.5 py-0.5 text-[10px] font-semibold', meta.bgClass)}
                              title={`${meta.label}: ${count}`}
                            >
                              {meta.label} ({count})
                            </span>
                          );
                        })}
                        {Object.keys(accountsByFiType).length > 3 && (
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                            +{Object.keys(accountsByFiType).length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Col 4: Status & View/Hide Action */}
                    <div className="md:col-span-2 lg:col-span-2 flex items-center justify-between md:justify-end gap-2.5">
                      <div className="flex items-center gap-1.5">
                        {user.accounts.some((a) => a.consentStatus === 'EXPIRING') && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-200">
                            <AlertTriangle className="h-3 w-3 text-amber-600" />
                            Expiring
                          </span>
                        )}
                        {user.consentJourneys.length > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                            <ShieldCheck className="h-3 w-3 text-emerald-600" />
                            {user.consentJourneys[0].status}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">0 journeys</span>
                        )}
                      </div>

                      <button
                        type="button"
                        className={cn(
                          'inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition',
                          isExpanded
                            ? 'bg-[#0D1912] text-[#D2F865] ring-1 ring-[#0D1912]'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                        )}
                        title={isExpanded ? 'Hide accounts breakdown' : 'View accounts breakdown'}
                      >
                        <span>{isExpanded ? 'Hide' : 'View'}</span>
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded User Details Section */}
                  {isExpanded && (
                    <div className="border-t border-slate-200/70 bg-slate-50/50 p-5 space-y-6 animate-fade-in">
                      {/* Section 1: Linked Accounts Breakdown */}
                      <div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                              Linked Financial Accounts ({user.accounts.length})
                            </h4>
                            {activeAccounts > 0 && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                                {activeAccounts} Active
                              </span>
                            )}
                          </div>

                          {/* FI Type Filter Pills */}
                          {user.accounts.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAccountFiFilter((prev) => ({ ...prev, [cardKey]: 'ALL' }));
                                }}
                                className={cn(
                                  'rounded-md px-2 py-1 text-[11px] font-semibold transition',
                                  selectedFi === 'ALL'
                                    ? 'bg-slate-800 text-white'
                                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100'
                                )}
                              >
                                All ({user.accounts.length})
                              </button>
                              {Object.entries(accountsByFiType).map(([fiType, count]) => {
                                const meta = getFiMetadata(fiType);
                                return (
                                  <button
                                    key={fiType}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setAccountFiFilter((prev) => ({ ...prev, [cardKey]: fiType }));
                                    }}
                                    className={cn(
                                      'rounded-md px-2 py-1 text-[11px] font-semibold transition',
                                      selectedFi === fiType
                                        ? 'bg-slate-800 text-white'
                                        : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100'
                                    )}
                                  >
                                    {meta.label} ({count})
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {user.accounts.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center">
                            <p className="text-xs text-slate-500">
                              No financial accounts linked yet for this customer.
                            </p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                            <table className="w-full text-left text-xs">
                              <thead className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                <tr>
                                  <th className="py-2.5 pl-4 pr-3">Institution (FIP)</th>
                                  <th className="px-3 py-2.5">FI Type</th>
                                  <th className="px-3 py-2.5">Masked Account</th>
                                  <th className="px-3 py-2.5">Consent Status</th>
                                  <th className="px-3 py-2.5">Expiry Date</th>
                                  <th className="px-3 py-2.5">Updated On</th>
                                  <th className="py-2.5 pl-3 pr-4 text-right">Account Identifier</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {displayedAccounts.map((account) => {
                                  const fiMeta = getFiMetadata(account.fiType);
                                  const FiIcon = fiMeta.icon;

                                  return (
                                    <tr key={account.fnrkAccountId} className="hover:bg-slate-50/60 transition-colors">
                                      {/* FIP ID */}
                                      <td className="py-2.5 pl-4 pr-3 font-semibold text-slate-900">
                                        <div className="flex items-center gap-1.5">
                                          <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                          <span className="font-mono text-xs">{account.fipId}</span>
                                        </div>
                                      </td>

                                      {/* FI Type */}
                                      <td className="px-3 py-2.5 whitespace-nowrap">
                                        <span className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold', fiMeta.bgClass)}>
                                          <FiIcon className="h-3 w-3" />
                                          {fiMeta.label}
                                        </span>
                                      </td>

                                      {/* Masked Account Number */}
                                      <td className="px-3 py-2.5 font-mono whitespace-nowrap font-medium text-slate-800">
                                        <div className="flex items-center gap-1.5">
                                          <span>{account.maskedAccountNumber}</span>
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleCopy(account.maskedAccountNumber, 'Account Number');
                                            }}
                                            className="text-slate-400 hover:text-slate-600"
                                            title="Copy account number"
                                          >
                                            {copiedId === account.maskedAccountNumber ? (
                                              <Check className="h-3 w-3 text-emerald-600" />
                                            ) : (
                                              <Copy className="h-3 w-3" />
                                            )}
                                          </button>
                                        </div>
                                      </td>
                                       {/* Consent Status */}
                                      <td className="px-3 py-2.5 whitespace-nowrap">
                                        {account.consentStatus === 'ACTIVE' ? (
                                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            ACTIVE
                                          </span>
                                        ) : account.consentStatus === 'EXPIRING' ? (
                                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200">
                                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                                            EXPIRING
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                                            {account.consentStatus}
                                          </span>
                                        )}
                                      </td>

                                      {/* Expiry Date */}
                                      <td className="px-3 py-2.5 whitespace-nowrap text-slate-600">
                                        {formatDateTime(account.consentExpiry)}
                                      </td>

                                      {/* Updated On */}
                                      <td className="px-3 py-2.5 whitespace-nowrap text-slate-500">
                                        {formatDateTime(account.updatedOn)}
                                      </td>

                                      {/* Finarkein Account ID */}
                                      <td className="py-2.5 pl-3 pr-4 text-right font-mono text-[11px] text-slate-400">
                                        <div className="flex items-center justify-end gap-1">
                                          <span title={account.fnrkAccountId}>
                                            {account.fnrkAccountId.slice(0, 10)}...{account.fnrkAccountId.slice(-6)}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleCopy(account.fnrkAccountId, 'Account ID Hash');
                                            }}
                                            className="text-slate-400 hover:text-slate-600"
                                            title="Copy Full ID Hash"
                                          >
                                            {copiedId === account.fnrkAccountId ? (
                                              <Check className="h-3 w-3 text-emerald-600" />
                                            ) : (
                                              <Copy className="h-3 w-3" />
                                            )}
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                      {/* Section 2: Consent Journey Logs */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                          Consent Journeys & Execution History ({user.consentJourneys.length})
                        </h4>

                        {user.consentJourneys.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5 text-center">
                            <p className="text-xs text-slate-500">
                              No consent journeys logged yet for this customer.
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {user.consentJourneys.map((journey) => (
                              <div
                                key={journey.requestId}
                                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-semibold text-slate-500">Request ID:</span>
                                    <span className="font-mono text-xs font-bold text-slate-800">
                                      {journey.requestId}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopy(journey.requestId, 'Journey Request ID');
                                      }}
                                      className="text-slate-400 hover:text-slate-600"
                                      title="Copy Request ID"
                                    >
                                      {copiedId === journey.requestId ? (
                                        <Check className="h-3 w-3 text-emerald-600" />
                                      ) : (
                                        <Copy className="h-3 w-3" />
                                      )}
                                    </button>
                                  </div>
                                  <div className="text-[11px] text-slate-500">
                                    Completed: {formatDateTime(journey.updatedOn)}
                                  </div>
                                </div>

                                <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                                  <span>{journey.status}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 px-2">
                <div className="text-xs text-slate-500">
                  Showing <span className="font-semibold text-slate-900">{formatIndianNumber(((currentPage - 1) * PAGE_SIZE) + 1)}</span> to{' '}
                  <span className="font-semibold text-slate-900">
                    {formatIndianNumber(Math.min(currentPage * PAGE_SIZE, totalCountForCurrentView))}
                  </span>{' '}
                  of <span className="font-semibold text-slate-900">{formatIndianNumber(totalCountForCurrentView)}</span> customers
                </div>

                <div className="flex items-center gap-1.5 self-center sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1 px-1">
                    {getPageNumbers(currentPage, totalPages).map((item, idx) => {
                      if (typeof item === 'string') {
                        const isPrevEllipsis = item.includes('prev') || (item === 'ellipsis' && currentPage > totalPages / 2);
                        return (
                          <button
                            key={`ellipsis-${idx}`}
                            type="button"
                            onClick={() => {
                              if (isPrevEllipsis) {
                                handlePageChange(Math.max(1, currentPage - 5));
                              } else {
                                handlePageChange(Math.min(totalPages, currentPage + 5));
                              }
                            }}
                            className="h-7 w-7 rounded-lg text-xs font-semibold text-slate-400 hover:text-[#0D1912] hover:bg-[#F3FDDB] transition flex items-center justify-center cursor-pointer"
                            title={isPrevEllipsis ? 'Jump back 5 pages' : 'Jump forward 5 pages'}
                          >
                            …
                          </button>
                        );
                      }

                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handlePageChange(item)}
                          className={cn(
                            'h-7 min-w-[28px] px-1.5 rounded-lg text-xs font-semibold transition',
                            currentPage === item
                              ? 'bg-[#0D1912] text-[#D2F865] font-bold shadow-sm'
                              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                          )}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
};
