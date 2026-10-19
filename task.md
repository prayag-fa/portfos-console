# PROMPT FOR CLAUDE CODE: Build Portfos Tenant Analytics Dashboard (Phase 1)

## 1. Project Overview & Objective
Build a clean, high-performance, enterprise-grade B2B **Tenant Analytics Dashboard** from scratch for **Portfos** (Finarkein's Account Aggregator & Personal Finance platform).

The dashboard is used by institutional clients (banks, NBFCs, fintechs) to monitor user adoption, journey conversion rates, ReBIT consent lifecycle health, and linked account distributions under RBI's Account Aggregator framework.

**Core Directives:**
- **AUTHENTICATION & LOGIN:** Complete login page (`/login`), protected routing, session persistence, and logout flow.
- **NO MOCK DATA:** Connect directly to real backend REST APIs via `VITE_API_BASE_URL`.
- **DATA FRESHNESS (NON-REALTIME):** Data is batch-processed/snapshot-based. Display a clear **"Last updated"** timestamp badge in the header using the API response `timestamp`.
- **ACTIONABLE PM VALUE:** Includes comparison deltas (`vs prior period`), one-click **CSV Report Export**, and **Actionable Retention Alert Callouts** for expiring consents.
- **STATE EXCELLENCE:** Complete, first-class implementation of **Loading States** (shimmer skeletons), **Error States** (per-card retry boundaries), and **Zero States** (empty data handling with defensive math).

---

## 2. Tech Stack & Environment Setup
- **Framework:** React 19 + TypeScript (strict mode) + Vite
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite` + `@import "tailwindcss";` in CSS) + `lucide-react` icons + `clsx` / `tailwind-merge`
- **Charts:** Recharts (v3+ compatible with React 19)
- **Data Fetching & Cache:** `@tanstack/react-query` (v5)
- **HTTP Client:** Axios
- **Dates & Math:** `date-fns`
- **Routing & State:** `react-router-dom` (v7) — Protected routes (`/` ➔ `/login` when unauthenticated), with URL search params for dashboard filters

### 2.1 Environment File Template (`.env.example`)
Create a `.env.example` file in the root:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_DEFAULT_WORKSPACE=finarkein
```

### 2.2 Vite Dev Server Reverse Proxy (`vite.config.ts`)
To prevent local browser **CORS errors** when calling the Java backend from `localhost:5173`:
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      '/v1': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
```

---

## 3. Authentication & Session Flow

### 3.1 Login Page (`/login`)
- **Route:** `/login` (Public route).
- **Form Fields:**
  - `Username / Email` (text input, e.g. `superadmin`)
  - `Password` (password input with show/hide toggle)
- **Validation & Feedback:**
  - Client-side validation: username and password are required.
  - Loading spinner on "Sign In" button during request.
  - Inline error alert on `401 Unauthorized`: *"Invalid username or password. Please try again."*
  - Session Expired Notice: If URL has `?expired=true`, display an amber notice: *"Your session has expired. Please sign in again."*

### 3.2 Login API Specification (Exact Backend Contract)
- **Method:** `POST /v1/console/login`
- **Full URL:** `{VITE_API_BASE_URL}/v1/console/login`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "username": "superadmin",
  "password": "ChangeMe@123"
}
```
- **Response Format (`200 OK`):**
```json
{
  "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 900,
  "refreshExpiresIn": 28800,
  "username": "superadmin",
  "tenant": "utimf",
  "role": "SUPER_ADMIN"
}
```

### 3.3 Session Storage & Axios Interceptors
- On successful login:
  - Store access token: `sessionStorage.setItem('accessToken', res.data.accessToken)`.
  - Store refresh token: `sessionStorage.setItem('refreshToken', res.data.refreshToken)`.
  - Store tenant/workspace: `sessionStorage.setItem('workspace', res.data.tenant)`.
  - Store user info: `sessionStorage.setItem('username', res.data.username)`.
  - Store role: `sessionStorage.setItem('role', res.data.role)`.
  - Navigate to `/` (Dashboard).
- **Axios Request Interceptor:** Automatically attaches:
  - `Authorization: Bearer <sessionStorage.accessToken>`
  - `x-workspace-id: <sessionStorage.workspace>`
- **Axios Response Interceptor (401 Handling):**
  - If any API returns a `401 Unauthorized`, clear `sessionStorage` and redirect to `/login?expired=true`.

### 3.4 Protected Route (`ProtectedRoute.tsx`)
Wrap the dashboard with an authentication gate:
```tsx
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = sessionStorage.getItem('accessToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};
```

### 3.5 Header User Menu & Logout Flow
In the dashboard header:
- Display user avatar / name / workspace badge.
- A **"Log out"** button that clears `sessionStorage` and navigates to `/login`.

---

## 4. Architecture, State & Resilience

### 4.1 URL-Driven State (Single Source of Truth)
All dashboard filters are synchronized via URL query parameters so that views are bookmarkable, shareable, and refresh-safe:
`?workspace=finarkein&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

- Changing the date range or workspace updates the URL search params.
- React Query hooks reactively consume these params via query keys:
  `['analytics', '<resource>', workspace, startDate, endDate]`

### 4.2 Defensive Math & Number Formatting (`src/utils/formatters.ts`)
```ts
import { format, parseISO } from 'date-fns';

/** Prevents division by zero */
export const safePercentage = (numerator: number, denominator: number): number => {
  if (!denominator || denominator <= 0) return 0;
  return Number(((numerator / denominator) * 100).toFixed(1));
};

/** Indian Number Formatting (e.g. 1,20,450) */
export const formatIndianNumber = (num: number | undefined | null): string => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

/** Format API timestamp to friendly "Last updated" format */
export const formatLastUpdated = (isoString?: string): string => {
  if (!isoString) return 'Pending sync';
  try {
    return format(parseISO(isoString), 'dd MMM yyyy, hh:mm a');
  } catch {
    return isoString;
  }
};
```

### 4.3 ReBIT Financial Information Type (`FIType`) Registry
```ts
export const REBIT_FI_METADATA: Record<FIType, { label: string; icon: LucideIcon; color: string; bgClass: string }> = {
  DEPOSIT:            { label: 'Bank Accounts',             icon: Landmark,    color: '#3B82F6', bgClass: 'bg-blue-500/10 text-blue-600' },
  MUTUAL_FUNDS:       { label: 'Mutual Funds',              icon: PieChart,    color: '#10B981', bgClass: 'bg-emerald-500/10 text-emerald-600' },
  EQUITIES:           { label: 'Stocks & Equities',         icon: TrendingUp,  color: '#8B5CF6', bgClass: 'bg-purple-500/10 text-purple-600' },
  TERM_DEPOSIT:       { label: 'Fixed Deposits (FD)',       icon: ShieldCheck, color: '#F59E0B', bgClass: 'bg-amber-500/10 text-amber-600' },
  RECURRING_DEPOSIT:  { label: 'Recurring Deposits (RD)',   icon: Repeat,      color: '#06B6D4', bgClass: 'bg-cyan-500/10 text-cyan-600' },
  NPS:                { label: 'National Pension System',   icon: Award,       color: '#EC4899', bgClass: 'bg-pink-500/10 text-pink-600' },
  ETF:                { label: 'Exchange Traded Funds',     icon: LineChart,   color: '#6366F1', bgClass: 'bg-indigo-500/10 text-indigo-600' },
  LIFE_INSURANCE:     { label: 'Life Insurance',            icon: HeartPulse,  color: '#EF4444', bgClass: 'bg-red-500/10 text-red-600' },
  GENERAL_INSURANCE:  { label: 'General Insurance',         icon: Shield,      color: '#14B8A6', bgClass: 'bg-teal-500/10 text-teal-600' },
  BONDS:              { label: 'Bonds',                     icon: Banknote,    color: '#64748B', bgClass: 'bg-slate-500/10 text-slate-600' },
  DEBENTURES:         { label: 'Debentures',                icon: FileText,    color: '#78716C', bgClass: 'bg-stone-500/10 text-stone-600' },
  PPF:                { label: 'Public Provident Fund',     icon: Wallet,      color: '#84CC16', bgClass: 'bg-lime-500/10 text-lime-600' },
  OTHER:              { label: 'Other Assets',              icon: HelpCircle,  color: '#A855F7', bgClass: 'bg-fuchsia-500/10 text-fuchsia-600' },
};
```

---

## 5. Loading, Error & Zero States Specifications

### 5.1 Loading States (Skeleton Loaders)
- While a card's query is in `isLoading` state, display a matching **Shimmer Skeleton (`animate-pulse`)**.
- **No Layout Shift (Zero CLS):** Skeletons must have the exact width/height of the resolved cards.

### 5.2 Error States & Per-Widget Error Boundaries
- **No Global Crashes:** If one endpoint errors (e.g. `500 Internal Server Error` on `/consents`), **only the affected card renders an error box**. All other cards render normally.
- **Card Error Component (`QueryErrorCard`):**
  - Displays an `AlertCircle` icon in amber/red.
  - Clear message: *"Unable to load [resource name] data"*.
  - A clear **"Retry" button** that executes `refetch()`.

### 5.3 Zero States (Empty Data Handling)
When a workspace is new or a date range has `0` activity:
- **KPI Counters:** Show `0` (never `NaN` or `undefined`) with a subtle subtext: *"No activity in this period"*.
- **Journey Funnel:** If `totalJourneys == 0`, render empty progress tracks with a badge: `No journeys initiated`.
- **Donut Chart:** If `totalAccountsAdded == 0` or `breakupByFiType` is empty, render a clean concentric dashed circle with a subtle `FolderOpen` icon and copy: *"No linked accounts found for this period."*

---

## 6. Backend Analytics REST API Specifications
All analytics requests go to:
`Base URL: {VITE_API_BASE_URL}/v1/{workspace}/analytics`

**Global Headers:**
- `Authorization: Bearer <token>`
- `x-workspace-id: <workspaceId>`
- `Content-Type: application/json`

**Query Parameters:**
- `startDate`: `YYYY-MM-DD` (defaults to trailing 30 days)
- `endDate`: `YYYY-MM-DD` (defaults to today)
*(Note: There is NO `window` property in any response payload).*

---

### Endpoint 1: User Activity Metrics
- **Method:** `GET /v1/{workspace}/analytics/users`
- **Query Params:** `startDate`, `endDate`
- **Response Format:**
```json
{
  "success": true,
  "timestamp": "2026-10-16T15:55:00Z",
  "data": {
    "totalUsers": 120450,
    "mau": 84210,
    "mauDeltaPercentage": 12.4,
    "dau": 14120,
    "dauMauRatio": 0.1677,
    "newUsers": 18200
  }
}
```

---

### Endpoint 2: Journeys Metrics
- **Method:** `GET /v1/{workspace}/analytics/journeys`
- **Query Params:** `startDate`, `endDate`
- **Response Format:**
```json
{
  "success": true,
  "timestamp": "2026-10-16T15:55:00Z",
  "data": {
    "totalJourneys": 92100,
    "journeysDeltaPercentage": 8.5,
    "completedJourneys": 72206,
    "droppedJourneys": 19894,
    "journeyCompletionRate": 78.4,
    "completionRateDelta": 2.1,
    "avgConsentsPerCompletedJourney": 2.45
  }
}
```

---

### Endpoint 3: Consent Lifecycle Health
- **Method:** `GET /v1/{workspace}/analytics/consents`
- **Query Params:** `startDate`, `endDate`, `expiringWithinDays` (default: `30`)
- **Response Format:**
```json
{
  "success": true,
  "timestamp": "2026-10-16T15:55:00Z",
  "data": {
    "consentsGranted": 176904,
    "consentsDeltaPercentage": 14.2,
    "activeConsents": 164200,
    "expiringConsentsNext30Days": 14100,
    "expiredConsents": 5800,
    "revokedConsents": 2300
  }
}
```

---

### Endpoint 4: Linked Accounts & FIType Distribution
- **Method:** `GET /v1/{workspace}/analytics/accounts`
- **Query Params:** `startDate`, `endDate`
- **Response Format:**
```json
{
  "success": true,
  "timestamp": "2026-10-16T15:55:00Z",
  "data": {
    "totalAccountsAdded": 186400,
    "accountsDeltaPercentage": 15.3,
    "avgAccountsPerUser": 2.21,
    "breakupByFiType": [
      { "fiType": "DEPOSIT", "accountCount": 108112, "percentage": 58.00 },
      { "fiType": "MUTUAL_FUNDS", "accountCount": 41008, "percentage": 22.00 },
      { "fiType": "EQUITIES", "accountCount": 22368, "percentage": 12.00 },
      { "fiType": "TERM_DEPOSIT", "accountCount": 9320, "percentage": 5.00 },
      { "fiType": "RECURRING_DEPOSIT", "accountCount": 3728, "percentage": 2.00 },
      { "fiType": "NPS", "accountCount": 1864, "percentage": 1.00 },
      { "fiType": "ETF", "accountCount": 932, "percentage": 0.50 },
      { "fiType": "LIFE_INSURANCE", "accountCount": 559, "percentage": 0.30 },
      { "fiType": "GENERAL_INSURANCE", "accountCount": 373, "percentage": 0.20 }
    ]
  }
}
```

---

## 7. UI Layout & Component Requirements

### A. Authentication View (`src/pages/LoginPage.tsx`)
- Modern, centered card with Portfos branding.
- Form: Workspace input, Username input, Password input (eye toggle), "Sign In" button with spinner.
- Error alerts on failed auth (`401`) and session expiry (`?expired=true`).

### B. Header Bar (Dashboard)
- **Logo & Title:** "Portfos Analytics" with an enterprise badge (`Tenant Console`).
- **Workspace Selector:** Dropdown displaying active workspace ID.
- **Date Filter Pills:**
  - `Last 7 Days`
  - `Last 30 Days` (Active by default)
  - `Last 90 Days`
  - Custom Date Range Picker (`startDate` - `endDate` formatted in `yyyy-MM-dd`)
- **Last Updated Indicator:** Badge displaying the latest timestamp returned from the API responses:
  - Formatted via `formatLastUpdated(timestamp)` (e.g. `Last updated: 16 Oct 2026, 03:55 PM`).
  - Subtle secondary note/tooltip: *"Batch snapshot (non-realtime)"*.
- **CSV Export Action:** **"Export Report (CSV)"** button with `Download` icon. Client-side CSV generation downloading all active metrics.
- **Manual Refresh Action:** Button that calls `queryClient.invalidateQueries({ queryKey: ['analytics'] })` with an animating spin icon.
- **User & Logout Profile:** Shows user name and a **"Log out"** button.

### C. Actionable Retention Banner (Conditionally Rendered)
When `expiringConsentsNext30Days > 0`:
- Render an enterprise-grade alert banner with amber border and an `AlertTriangle` icon:
  - **Heading:** *"Retention Alert: {{formatIndianNumber(expiringConsentsNext30Days)}} Consents Expiring in the Next 30 Days"*
  - **Subtext:** *"Customers with expired consents will lose real-time net-worth sync and transaction refresh. Trigger a re-link notification campaign to preserve data continuity."*

### D. Row 1: Executive KPI Summary with Period Deltas (4 Cards)
1. **Active Users (MAU / DAU):** Formatted MAU + Period Delta + DAU + Stickiness Badge.
2. **Journeys & Conversion:** Total Journeys + Completion Rate (%) + Multi-consent stat (`2.45 Consents/Journey`).
3. **Accounts Ingested:** Total Accounts + Period Delta + Depth indicator (`2.21 Avg Accounts / User`).
4. **Consent Portfolio Health:** Active Consents + Period Delta + Amber badge (`⚠️ 14,100 Expiring in 30d`).

### E. Row 2: Journey Funnel & Consent Lifecycle (2 Columns)
1. **Journey Funnel Card:** Horizontal progress bars: Initiated ➔ Completed (78.4%) vs Dropped (21.6%).
2. **Consent Lifecycle Card:** Status grid: 🟢 Active, 🟠 Expiring (30d), ⚪ Expired (30d), 🔴 Revoked.

### F. Row 3: ReBIT FIType Distribution (Full Width)
- **Left (5/12 width):** Interactive Recharts Donut chart with smooth hover animations and center total count. Shows clean empty state if total accounts is 0.
- **Right (7/12 width):** Breakdown Table with columns: Asset Class (Icon + Badge + Label), Linked Accounts (Count), Share (%) with inline progress bar.

---

## 8. CSV Export Utility (`src/utils/csvExport.ts`)
```ts
export const exportAnalyticsToCsv = (
  workspace: string,
  startDate: string,
  endDate: string,
  data: {
    users?: any;
    journeys?: any;
    consents?: any;
    accounts?: any;
  }
) => {
  const rows = [
    ['Portfos Tenant Analytics Report'],
    ['Workspace', workspace],
    ['Period', `${startDate} to ${endDate}`],
    ['Generated At', new Date().toISOString()],
    [],
    ['-- USER METRICS --'],
    ['Total Registered Users', data.users?.totalUsers ?? 'N/A'],
    ['MAU', data.users?.mau ?? 'N/A'],
    ['MAU Growth vs Prior Period', `${data.users?.mauDeltaPercentage ?? 0}%`],
    ['DAU', data.users?.dau ?? 'N/A'],
    ['DAU/MAU Stickiness', `${((data.users?.dauMauRatio ?? 0) * 100).toFixed(1)}%`],
    [],
    ['-- JOURNEY METRICS --'],
    ['Total Journeys Initiated', data.journeys?.totalJourneys ?? 'N/A'],
    ['Completed Journeys', data.journeys?.completedJourneys ?? 'N/A'],
    ['Dropped Journeys', data.journeys?.droppedJourneys ?? 'N/A'],
    ['Journey Completion Rate', `${data.journeys?.journeyCompletionRate ?? 0}%`],
    ['Avg Consents per Completed Journey', data.journeys?.avgConsentsPerCompletedJourney ?? 'N/A'],
    [],
    ['-- CONSENT LIFECYCLE --'],
    ['Consents Granted', data.consents?.consentsGranted ?? 'N/A'],
    ['Active Consents', data.consents?.activeConsents ?? 'N/A'],
    ['Expiring in Next 30 Days', data.consents?.expiringConsentsNext30Days ?? 'N/A'],
    ['Expired Consents', data.consents?.expiredConsents ?? 'N/A'],
    ['Revoked Consents', data.consents?.revokedConsents ?? 'N/A'],
    [],
    ['-- ACCOUNTS BY REBIT FI TYPE --'],
    ['FI Type', 'Account Count', 'Share Percentage'],
    ...(data.accounts?.breakupByFiType || []).map((item: any) => [
      item.fiType,
      item.accountCount,
      `${item.percentage}%`
    ])
  ];

  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `portfos-analytics-${workspace}-${startDate}-to-${endDate}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
```

---

## 9. Directory Structure
```
src/
├── api/
│   ├── client.ts             # Axios instance with baseURL, token & 401 redirect
│   ├── authApi.ts            # POST /v1/console/login
│   └── analyticsApi.ts       # Typed API calls for /users, /journeys, /consents, /accounts
├── types/
│   ├── auth.ts               # Login credentials, UserSession interfaces
│   └── analytics.ts          # TypeScript interfaces, DTOs & ReBIT FIType enum
├── config/
│   └── fiMetadata.ts         # Centralized REBIT_FI_METADATA registry
├── hooks/
│   ├── useAuth.ts            # Auth state, login mutation, logout action
│   └── useAnalytics.ts       # TanStack React Query custom hooks
├── utils/
│   ├── formatters.ts         # safePercentage, formatIndianNumber, formatLastUpdated
│   └── csvExport.ts          # Client-side CSV export utility
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx# Gate redirecting to /login when unauthenticated
│   ├── layout/
│   │   ├── Header.tsx        # Branding, workspace, "Last updated", CSV export, user logout
│   │   └── DateFilter.tsx    # Date range preset pills and date pickers
│   ├── common/
│   │   ├── MetricCard.tsx    # Reusable KPI card with delta badge & subtext
│   │   ├── SkeletonCard.tsx  # Shimmer skeleton loader
│   │   ├── QueryErrorCard.tsx# Error state with retry action
│   │   └── EmptyState.tsx    # Clean zero-data placeholder
│   └── dashboard/
│       ├── RetentionAlertBanner.tsx # Actionable expiring consents alert
│       ├── KpiSummaryGrid.tsx
│       ├── JourneyFunnelSection.tsx
│       ├── ConsentLifecycleSection.tsx
│       └── FiTypeDistributionSection.tsx
├── pages/
│   ├── LoginPage.tsx         # Enterprise sign-in view
│   └── DashboardPage.tsx     # Authenticated dashboard view
├── App.tsx                   # Routes: /login (public) & / (protected)
├── main.tsx                  # QueryClientProvider & BrowserRouter entry
└── index.css                 # Tailwind v4 entry (@import "tailwindcss";)
```

---

## 10. Definition of Done & Verification Checklist
Before completing your execution, Claude Code must verify:
- [ ] Run `npm run typecheck` — zero TypeScript errors.
- [ ] Run `npm run build` — bundle compiles successfully without missing assets or build errors.
- [ ] Verify **Authentication Flow**:
  - Unauthenticated access to `/` redirects to `/login`.
  - Submitting `/login` fires `POST /v1/console/login` and stores token in `sessionStorage`.
  - Clicking "Log out" clears `sessionStorage` and redirects back to `/login`.
  - `401 Unauthorized` responses automatically route to `/login?expired=true`.
- [ ] Ensure all 4 Analytics API hooks pass `startDate`, `endDate`, and `x-workspace-id` correctly with `Bearer` token header.
- [ ] Verify **"Last updated" Badge**: Extracts the `timestamp` field from API responses and formats it (e.g. `Last updated: 16 Oct 2026, 03:55 PM`).
- [ ] Verify **Period Deltas**: KPI cards properly render green/red badges (`↑ X% vs prior period`).
- [ ] Verify **CSV Export**: Clicking "Export Report (CSV)" downloads a clean, properly formatted `.csv` file.
- [ ] Verify **Retention Alert Banner**: Renders amber warning when `expiringConsentsNext30Days > 0`.
- [ ] Verify **Loading States**: Skeletons match card dimensions with smooth shimmer animation.
- [ ] Verify **Error States**: Throwing/simulating an error on any single query renders `QueryErrorCard` with a functional "Retry" button without crashing the dashboard.
- [ ] Verify **Zero States**: When data is 0 or empty arrays, verify no `NaN%` appears and Recharts renders a clean empty state.
