import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format, subDays } from 'date-fns';

const DATE_FMT = 'yyyy-MM-dd';
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export type DatePreset = 'all' | 7 | 30 | 90;

export interface DashboardFilters {
  workspace: string;
  startDate?: string;
  endDate?: string;
  isAllTime: boolean;
}

export const useDashboardFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<DashboardFilters>(() => {
    const startParam = searchParams.get('startDate');
    const endParam = searchParams.get('endDate');
    const hasValidDates =
      Boolean(startParam && ISO_DATE.test(startParam) && endParam && ISO_DATE.test(endParam));

    return {
      workspace:
        searchParams.get('workspace') ||
        sessionStorage.getItem('workspace') ||
        import.meta.env.VITE_DEFAULT_WORKSPACE ||
        '',
      startDate: hasValidDates ? (startParam as string) : undefined,
      endDate: hasValidDates ? (endParam as string) : undefined,
      isAllTime: !hasValidDates,
    };
  }, [searchParams]);

  const update = useCallback(
    (next: { workspace?: string; startDate?: string; endDate?: string }) => {
      const nextWorkspace = next.workspace ?? filters.workspace;
      const nextStart = 'startDate' in next ? next.startDate : filters.startDate;
      const nextEnd = 'endDate' in next ? next.endDate : filters.endDate;

      const newParams = new URLSearchParams();
      if (nextWorkspace) newParams.set('workspace', nextWorkspace);
      if (nextStart) newParams.set('startDate', nextStart);
      if (nextEnd) newParams.set('endDate', nextEnd);

      setSearchParams(newParams, { replace: true });
    },
    [filters, setSearchParams]
  );

  const setPreset = useCallback(
    (preset: DatePreset) => {
      if (preset === 'all') {
        update({ startDate: undefined, endDate: undefined });
      } else {
        const today = new Date();
        update({
          startDate: format(subDays(today, preset), DATE_FMT),
          endDate: format(today, DATE_FMT),
        });
      }
    },
    [update]
  );

  return { ...filters, update, setPreset };
};
