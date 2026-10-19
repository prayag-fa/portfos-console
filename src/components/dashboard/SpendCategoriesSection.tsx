import { CreditCard, ShoppingBag, Utensils, Zap, Car, Sparkles, type LucideIcon } from 'lucide-react';
import type { UseQueryResult } from '@tanstack/react-query';
import type { SpendAnalyticsSummary } from '../../types/analytics';
import { SkeletonCard } from '../common/SkeletonCard';
import { QueryErrorCard } from '../common/QueryErrorCard';
import { CardHeader } from '../common/CardHeader';
import { ProgressBar } from '../common/ProgressBar';
import { formatIndianCurrency } from '../../utils/formatters';
import { cn } from '../../utils/cn';
import { surface } from '../../utils/styles';

const CARD_HEIGHT = 'min-h-[380px]';

interface SpendCategoriesSectionProps {
  query: UseQueryResult<SpendAnalyticsSummary>;
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'Loan & EMI Repayments': CreditCard,
  'Utilities & Bills': Zap,
  'Groceries & Household': ShoppingBag,
  'Food & Dining': Utensils,
  'Travel & Commute': Car,
  'Shopping & Leisure': Sparkles,
};

export const SpendCategoriesSection = ({ query }: SpendCategoriesSectionProps) => {
  if (query.isLoading) return <SkeletonCard className={CARD_HEIGHT} lines={5} />;
  if (query.isError || !query.data) {
    return <QueryErrorCard resource="spend analytics" onRetry={() => query.refetch()} className={CARD_HEIGHT} />;
  }

  const { avgMonthlyOutflowPerUser, topCategory, categories } = query.data;

  return (
    <div className={cn(surface, 'animate-fade-up p-5', CARD_HEIGHT)}>
      <CardHeader
        title="Consumer Spending Mix"
        subtitle={`Avg ${formatIndianCurrency(avgMonthlyOutflowPerUser)} monthly outflow / linked user`}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3FDDB] px-3 py-1 text-xs font-semibold text-[#0D1912] ring-1 ring-[#DDF882]">
          Top: {topCategory}
        </span>
      </CardHeader>

      <div className="mt-5 space-y-4">
        {categories.map((item) => {
          const Icon = CATEGORY_ICONS[item.category] ?? CreditCard;
          return (
            <div key={item.category} className="group">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-md"
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-semibold text-slate-800">{item.category}</span>
                </div>
                <div className="tabular-nums text-right text-slate-500">
                  <span className="font-bold text-slate-900">{item.percentage.toFixed(1)}%</span>
                  {item.estimatedVolumeCr > 0 && (
                    <span className="ml-2 text-[11px] text-slate-400">
                      (~₹{item.estimatedVolumeCr.toFixed(1)} Cr)
                    </span>
                  )}
                </div>
              </div>
              <ProgressBar value={item.percentage} color={item.color} className="h-2" />
            </div>
          );
        })}
      </div>

    </div>
  );
};
