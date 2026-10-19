import { cn } from '../../utils/cn';

interface SkeletonCardProps {
  className?: string;
  lines?: number;
}

export const SkeletonCard = ({ className, lines = 3 }: SkeletonCardProps) => (
  <div
    className={cn(
      'relative overflow-hidden rounded-xl border border-slate-200/60 bg-white p-5',
      'before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-linear-to-r before:from-transparent before:via-[#D2F865]/20 before:to-transparent',
      className
    )}
    aria-busy="true"
    aria-label="Loading"
  >
    <div className="flex items-center justify-between">
      <div className="h-4 w-1/3 rounded-md bg-slate-200/80" />
      <div className="h-9 w-9 rounded-xl bg-slate-200/80" />
    </div>
    <div className="mt-5 h-8 w-1/2 rounded-md bg-slate-200/80" />
    <div className="mt-5 space-y-2.5">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 rounded-md bg-slate-100" style={{ width: `${90 - i * 15}%` }} />
      ))}
    </div>
  </div>
);
