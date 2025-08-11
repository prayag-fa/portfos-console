"use client";

import React from "react";
import { getRelativeTime, getTooltipText } from "@/lib/utils/formatters";
import StatusBadge from "@/components/ui/StatusBadge";
import BackfillingYears from "@/components/timeline/BackfillingYears";
import { 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import ActionButton from "../ui/ActionButton";

export default function TimelineStep({ 
  step, 
  index, 
  totalSteps, 
  accounts, 
  name,
  stepAction
}) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "in_progress":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-start mb-6 last:mb-0">
      <div className="flex flex-col items-center mr-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full border-3 border-white shadow-md bg-white">
          {getStatusIcon(step.status)}
        </div>
        {index < totalSteps - 1 && (
          <div className="w-0.5 h-12 bg-gray-300 mt-3"></div>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-4 bg-gray-50 rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              {name}
            </span>
            <StatusBadge status={step.status} />
          </div>
          {stepAction && stepAction.stepLevelTime && 
            <span 
              className="text-xs text-gray-500 cursor-help"
              title={getTooltipText(step.timestamp)}
            >
              {getRelativeTime(step.timestamp)}
            </span>
          }
        </div>
          {stepAction && stepAction.stepLevelTime && 
            <div className="flex items-center justify-between">
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Duration:</span> {step.duration || "--"}
                </div>
            </div>
          }
        </div>
        <div className="flex flex-col gap-4">
          {stepAction && stepAction.stepLevelActions && stepAction.stepLevelActions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {stepAction.stepLevelActions.map((action, idx) => (
                <ActionButton
                  key={idx}
                  icon={action.icon}
                  onClick={action.onClick}
                  title={action.title}
                />
              ))}
            </div>
          )}
          {step.accounts && step.accounts.length > 0 && (
            <div className="border-t border-gray-200 pt-3">
              <h5 className="text-xs font-medium text-gray-700 mb-2">Account-wise Actions</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2">
                {step.accounts.map((account, idx) => {
                  const _account = accounts.find(acc => acc.id === account.id);

                  if(!["Mutual Funds", "Equities"].includes(_account.type) && name === "Data Back Filling") {
                    return null;
                  }
                  return (
                    <div key={idx} className="border border-gray-200 rounded-md p-2 bg-white flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-medium text-gray-900">{account.id}</span>
                              {_account && (
                                <span className="text-xs text-gray-500">({_account.type})</span>
                              )}
                            </div>
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                              account.status === "success"
                                ? "text-green-600 bg-green-100"
                                : account.status === "partial"
                                ? "text-yellow-600 bg-yellow-100"
                                : "text-red-600 bg-red-100"
                            }`}>
                              {account.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {stepAction && stepAction.accountLevelTime && 
                              <span 
                                className="text-xs text-gray-500 cursor-help"
                                title={getTooltipText(account.timestamp)}
                              >
                                {getRelativeTime(account.timestamp)}
                              </span>
                            }
                          </div>
                        </div>

                        {stepAction && stepAction.accountLevelTime && 
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">Duration:</span> {account.duration || "--"}
                          </div>
                        }
                      </div>
                      {stepAction && stepAction.accountLevelActions && stepAction.accountLevelActions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {stepAction.accountLevelActions.map((action, idx) => (
                            <ActionButton key={idx} icon={action.icon} onClick={action.onClick} title={action.title} />
                          ))}
                        </div>
                      )}

                      {name === "Data Back Filling" && account.yearlyData && (
                        <BackfillingYears
                          yearlyData={account.yearlyData}
                          accountId={account.id}
                          index={index}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 