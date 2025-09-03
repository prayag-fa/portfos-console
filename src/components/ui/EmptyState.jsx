'use client';

import { Search, Users, BarChart3, RefreshCw, Plus } from 'lucide-react';

const EmptyStateTypes = {
  search: {
    icon: Search,
    title: 'No results found',
    description: 'Try adjusting your search terms or filters',
    actionText: 'Clear filters',
    actionIcon: RefreshCw
  },
  users: {
    icon: Users,
    title: 'No users found',
    description: 'There are no users matching your criteria',
    actionText: 'Add user',
    actionIcon: Plus
  },
  journeys: {
    icon: BarChart3,
    title: 'No journeys found',
    description: "This user hasn't completed any journeys yet",
    actionText: 'View all users',
    actionIcon: Users
  },
  accounts: {
    icon: RefreshCw,
    title: 'No refresh data',
    description: 'No refresh data available for this user',
    actionText: 'Refresh now',
    actionIcon: RefreshCw
  },
  default: {
    icon: Search,
    title: 'No data found',
    description: "There's nothing to display here",
    actionText: 'Try again',
    actionIcon: RefreshCw
  }
};

export default function EmptyState({
  type = 'default',
  title,
  description,
  actionText,
  onAction,
  showAction = true,
  className = ''
}) {
  const emptyStateType = EmptyStateTypes[type] || EmptyStateTypes.default;
  const Icon = emptyStateType.icon;
  const ActionIcon = emptyStateType.actionIcon;

  const finalTitle = title || emptyStateType.title;
  const finalDescription = description || emptyStateType.description;
  const finalActionText = actionText || emptyStateType.actionText;

  return (
    <div className={`py-12 text-center ${className}`}>
      <div className='mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100'>
        <Icon className='size-8 text-gray-400' />
      </div>
      <h3 className='mb-2 text-lg font-medium text-gray-900'>{finalTitle}</h3>
      <p className='mx-auto mb-6 max-w-sm text-sm text-gray-500'>{finalDescription}</p>
      {showAction && onAction && (
        <button
          onClick={onAction}
          className='inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors duration-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        >
          <ActionIcon className='mr-2 size-4' />
          {finalActionText}
        </button>
      )}
    </div>
  );
}
