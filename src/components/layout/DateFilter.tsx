import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { differenceInCalendarDays, format, parseISO } from 'date-fns';
import { SegmentedControl } from '../common/SegmentedControl';
import type { DatePreset } from '../../hooks/useDashboardFilters';

interface DateFilterProps {
  startDate?: string;
  endDate?: string;
  onPreset: (preset: DatePreset) => void;
  onChange: (range: { startDate?: string; endDate?: string }) => void;
}

export const DateFilter = ({ startDate, endDate, onPreset, onChange }: DateFilterProps) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [customOpen, setCustomOpen] = useState(false);

  let current: DatePreset | 'custom' = 'all';
  if (customOpen) {
    current = 'custom';
  } else if (!startDate && !endDate) {
    current = 'all';
  } else if (startDate && endDate) {
    const span = differenceInCalendarDays(parseISO(endDate), parseISO(startDate));
    if (endDate === today && (span === 7 || span === 30 || span === 90)) {
      current = span;
    } else {
      current = 'custom';
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SegmentedControl<DatePreset | 'custom'>
        ariaLabel="Date range"
        value={current}
        onChange={(v) => {
          if (v === 'custom') {
            setCustomOpen(true);
            if (!startDate || !endDate) {
              const defaultEnd = today;
              const defaultStart = format(new Date(Date.now() - 30 * 86400000), 'yyyy-MM-dd');
              onChange({ startDate: defaultStart, endDate: defaultEnd });
            }
          } else {
            setCustomOpen(false);
            onPreset(v);
          }
        }}
        options={[
          { value: 'all', label: 'All Time' },
          { value: 7, label: 'Last 7 Days' },
          { value: 30, label: 'Last 30 Days' },
          { value: 90, label: 'Last 90 Days' },
          { value: 'custom', label: <><CalendarDays className="h-3.5 w-3.5" />Custom</> },
        ]}
      />
      {current === 'custom' && (
        <div className="flex animate-pop items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs text-slate-400 shadow-sm">
          <input
            type="date"
            aria-label="Start date"
            value={startDate ?? ''}
            max={endDate ?? today}
            onChange={(e) => e.target.value && onChange({ startDate: e.target.value })}
            className="rounded-md bg-transparent px-1 py-0.5 text-xs font-medium text-slate-700 outline-none"
          />
          <span>to</span>
          <input
            type="date"
            aria-label="End date"
            value={endDate ?? today}
            min={startDate ?? ''}
            max={today}
            onChange={(e) => e.target.value && onChange({ endDate: e.target.value })}
            className="rounded-md bg-transparent px-1 py-0.5 text-xs font-medium text-slate-700 outline-none"
          />
        </div>
      )}
    </div>
  );
};
