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

/** Indian Currency Formatting (e.g. ₹ 34,250) */
export const formatIndianCurrency = (num: number | undefined | null): string => {
  if (num === null || num === undefined) return '₹ 0';
  return `₹ ${new Intl.NumberFormat('en-IN').format(num)}`;
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

/** Format ISO string to readable date/time (e.g., 17 Sep 2024, 08:06 PM) */
export const formatDateTime = (isoString?: string | null): string => {
  if (!isoString) return '—';
  try {
    return format(parseISO(isoString), 'dd MMM yyyy, hh:mm a');
  } catch {
    return isoString;
  }
};

/** Format ISO string to date only (e.g., 17 Sep 2024) */
export const formatDateOnly = (isoString?: string | null): string => {
  if (!isoString) return '—';
  try {
    return format(parseISO(isoString), 'dd MMM yyyy');
  } catch {
    return isoString;
  }
};
