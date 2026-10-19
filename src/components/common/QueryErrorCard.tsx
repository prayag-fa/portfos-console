import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '../../utils/cn';

interface QueryErrorCardProps {
  resource: string;
  onRetry: () => void;
  className?: string;
}

export const QueryErrorCard = ({ resource, onRetry, className }: QueryErrorCardProps) => (
  <div
    role="alert"
    className={cn(
      'flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-rose-200 bg-rose-50/40 p-5 text-center',
      className
    )}
  >
    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-500">
      <AlertCircle className="h-5 w-5" />
    </span>
    <p className="text-sm font-medium text-slate-700">Unable to load {resource} data</p>
    <button
      type="button"
      onClick={onRetry}
      className="group inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-[#0D1912]/30 hover:bg-[#F3FDDB] hover:text-[#0D1912] active:scale-95"
    >
      <RefreshCw className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180" />
      Retry
    </button>
  </div>
);
