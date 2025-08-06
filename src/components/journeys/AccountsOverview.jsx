import React from "react";

export default function AccountsOverview({ accounts }) {
  if (!accounts || accounts.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Accounts in this Journey</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <div key={account.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">{account.id}</span>
              <span className="text-xs text-gray-500">{account.type}</span>
            </div>
            <div className="text-sm text-gray-600">{account.maskedNumber}</div>
            <div className="text-xs text-gray-400 mt-1">({account.vintage})</div>
          </div>
        ))}
      </div>
    </div>
  );
} 