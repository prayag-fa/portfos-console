"use client";

import React from "react";

export default function AccountsOverview({ accounts }) {
  if (!accounts || accounts.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <h3 className="text-base font-semibold text-gray-900 mb-3">Accounts in this Journey</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {accounts.map((account) => (
          <div key={account.id} className="border border-gray-200 rounded-md p-3 bg-gray-50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-900">{account.id}</span>
              <span className="text-xs text-gray-500">{account.type}</span>
            </div>
            <div className="text-xs text-gray-600">{account.maskedNumber}</div>
            <div className="text-xs text-gray-400 mt-1">({account.vintage})</div>
          </div>
        ))}
      </div>
    </div>
  );
} 