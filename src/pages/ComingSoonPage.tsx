import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { NavPage } from '../config/navigation';

export const ComingSoonPage = ({ page }: { page: NavPage }) => {
  const Icon = page.icon;

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200/70 bg-white/85 px-4 backdrop-blur-md sm:px-8">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">{page.label}</h1>
      </header>

      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 pb-28 lg:pb-0">
        <div className="w-full max-w-md animate-fade-up text-center">
          <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
            <span aria-hidden className="absolute inset-0 rounded-full border-2 border-dashed border-slate-200" />
            <span aria-hidden className="absolute inset-3 rounded-full border-2 border-dashed border-slate-200" />
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0D1912] text-[#D2F865] ring-1 ring-[#1E3326] shadow-lg shadow-black/10">
              <Icon className="h-8 w-8" />
            </span>
          </div>

          <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[#F3FDDB] px-3 py-1 text-xs font-semibold text-[#0D1912] ring-1 ring-[#DDF882]">
            <Sparkles className="h-3.5 w-3.5 text-[#65A30D]" />
            Coming soon
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{page.label} is on its way</h2>
          <p className="mt-2 text-sm text-slate-500">{page.description} We are still building this page.</p>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-[#F3FDDB] hover:text-[#0D1912] hover:ring-[#D2F865] active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </main>
    </>
  );
};
