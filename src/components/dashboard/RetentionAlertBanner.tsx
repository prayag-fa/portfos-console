import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Download, Users, X } from 'lucide-react';
import { formatIndianNumber } from '../../utils/formatters';

interface RetentionAlertBannerProps {
  expiringCount: number;
  expiredCount?: number;
  onExportCampaign?: () => void;
  onViewExpiringUsers?: () => void;
}

export const RetentionAlertBanner = ({
  expiringCount,
  expiredCount = 0,
  onExportCampaign,
  onViewExpiringUsers,
}: RetentionAlertBannerProps) => {
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();
  const totalActionable = expiringCount + expiredCount;

  if (totalActionable === 0 || dismissed) return null;

  const handleNavigateToUsers = () => {
    if (onViewExpiringUsers) {
      onViewExpiringUsers();
    } else {
      navigate('/users?filter=expiring-consents');
    }
  };

  return (
    <div
      role="alert"
      className="relative flex animate-fade-up flex-wrap items-center justify-between gap-4 overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-amber-50/90 p-4 shadow-sm"
    >
      <span className="absolute inset-y-0 left-0 w-1 bg-amber-400" />
      <div
        onClick={handleNavigateToUsers}
        className="group flex flex-1 items-start gap-3.5 pr-4 cursor-pointer"
        title="Click to view customers with expiring consent"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 shadow-sm transition group-hover:scale-105 group-hover:bg-amber-200">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-bold text-amber-950 transition group-hover:text-amber-800">
              Consent Renewal Alert: {formatIndianNumber(expiringCount)} Consents Expiring Soon (30d)
              {expiredCount > 0 && (
                <span className="ml-2 font-normal text-amber-800">
                  · {formatIndianNumber(expiredCount)} Expired Consents
                </span>
              )}
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900 transition group-hover:bg-amber-300">
              View List <ArrowRight className="h-2.5 w-2.5 transition group-hover:translate-x-0.5" />
            </span>
          </div>
          <p className="mt-0.5 text-xs text-amber-900/80">
            Customers with expiring or expired consents will halt FI data fetch sessions.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 pl-12 sm:pl-0 shrink-0">
        <button
          type="button"
          onClick={handleNavigateToUsers}
          className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-amber-600/20 transition hover:bg-amber-700 active:scale-95"
        >
          <Users className="h-3.5 w-3.5" />
          <span>View Expiring Users</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

        {onExportCampaign && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onExportCampaign();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 shadow-sm transition hover:bg-amber-50 active:scale-95"
          >
            <Download className="h-3.5 w-3.5 text-amber-700" />
            <span className="hidden sm:inline">Export Renewal Cohort</span>
            <span className="sm:hidden">Export</span>
          </button>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setDismissed(true);
          }}
          aria-label="Dismiss alert"
          className="rounded-lg p-1.5 text-amber-700 transition hover:bg-amber-100/70"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
