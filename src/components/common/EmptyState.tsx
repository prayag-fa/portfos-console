import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center gap-4 py-6">
    <div className="relative flex h-44 w-44 items-center justify-center">
      <div className="absolute inset-0 rounded-full border-2 border-dashed border-slate-200" />
      <div className="absolute inset-6 rounded-full border-2 border-dashed border-slate-200" />
      <div className="absolute inset-12 rounded-full border-2 border-dashed border-slate-200" />
      <FolderOpen className="h-8 w-8 text-slate-300" />
    </div>
    <p className="text-sm text-slate-500">{message}</p>
  </div>
);
