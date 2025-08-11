"use client";

import React from "react";
import { Search, Users, BarChart3, RefreshCw, Plus } from "lucide-react";

const EmptyStateTypes = {
  search: {
    icon: Search,
    title: "No results found",
    description: "Try adjusting your search terms or filters",
    actionText: "Clear filters",
    actionIcon: RefreshCw
  },
  users: {
    icon: Users,
    title: "No users found",
    description: "There are no users matching your criteria",
    actionText: "Add user",
    actionIcon: Plus
  },
  journeys: {
    icon: BarChart3,
    title: "No journeys found",
    description: "This user hasn't completed any journeys yet",
    actionText: "View all users",
    actionIcon: Users
  },
  accounts: {
    icon: RefreshCw,
    title: "No refresh data",
    description: "No refresh data available for this user",
    actionText: "Refresh now",
    actionIcon: RefreshCw
  },
  default: {
    icon: Search,
    title: "No data found",
    description: "There's nothing to display here",
    actionText: "Try again",
    actionIcon: RefreshCw
  }
};

export default function EmptyState({
  type = "default",
  title,
  description,
  actionText,
  onAction,
  showAction = true,
  className = ""
}) {
  const emptyStateType = EmptyStateTypes[type] || EmptyStateTypes.default;
  const Icon = emptyStateType.icon;
  const ActionIcon = emptyStateType.actionIcon;

  const finalTitle = title || emptyStateType.title;
  const finalDescription = description || emptyStateType.description;
  const finalActionText = actionText || emptyStateType.actionText;

  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{finalTitle}</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">{finalDescription}</p>
      {showAction && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          <ActionIcon className="w-4 h-4 mr-2" />
          {finalActionText}
        </button>
      )}
    </div>
  );
}
