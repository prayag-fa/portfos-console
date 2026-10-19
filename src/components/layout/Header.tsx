import { useState } from 'react';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { Check, Clock, Download, RefreshCw } from 'lucide-react';
import { DateFilter } from './DateFilter';
import { Hint } from '../common/Hint';
import { useToast } from '../common/Toast';
import { formatLastUpdated } from '../../utils/formatters';
import { cn } from '../../utils/cn';

import type { DatePreset } from '../../hooks/useDashboardFilters';

interface HeaderProps {
  startDate?: string;
  endDate?: string;
  lastUpdated?: string;
  username: string;
  canExport: boolean;
  onPreset: (preset: DatePreset) => void;
  onDateChange: (range: { startDate?: string; endDate?: string }) => void;
  onExport: () => void;
}

export const Header = ({
  startDate,
  endDate,
  lastUpdated,
  username,
  canExport,
  onPreset,
  onDateChange,
  onExport,
}: HeaderProps) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const isFetching = useIsFetching({ queryKey: ['analytics'] }) > 0;
  const [exported, setExported] = useState(false);

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['analytics'] });
    toast.push('success', 'Dashboard refreshed');
  };

  const handleExport = () => {
    onExport();
    setExported(true);
    toast.push('success', 'Report downloaded as CSV');
    window.setTimeout(() => setExported(false), 1800);
  };

  return (
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
            <h1 className="truncate text-xl font-bold tracking-tight text-slate-900">
              Welcome {username || 'back'}!{' '}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Hint label="Batch snapshot (non-realtime)">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                Last updated: {formatLastUpdated(lastUpdated)}
              </div>
            </Hint>
            <Hint label="Refresh data">
              <button
                type="button"
                onClick={refresh}
                disabled={isFetching}
                aria-label="Refresh data"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-600 ring-1 ring-slate-200 transition hover:bg-[#F3FDDB] hover:text-[#0D1912] hover:ring-[#D2F865] active:scale-95 disabled:cursor-wait"
              >
                <RefreshCw className={cn('h-4 w-4', isFetching && 'animate-spin text-[#0D1912]')} />
              </button>
            </Hint>
            <button
              type="button"
              onClick={handleExport}
              disabled={!canExport}
              className={cn(
                'inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition active:scale-95',
                exported
                  ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                  : 'bg-[#D2F865] text-[#0D1912] font-semibold shadow-sm shadow-[#D2F865]/30 hover:bg-[#C2ED4B]',
                'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none'
              )}
            >
              {exported ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
              {exported ? 'Exported' : 'Export Report (CSV)'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 px-4 py-2.5 sm:px-8">
          <DateFilter startDate={startDate} endDate={endDate} onPreset={onPreset} onChange={onDateChange} />
        </div>
      </div>
    </header>
  );
};
