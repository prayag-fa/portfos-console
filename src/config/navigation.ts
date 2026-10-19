import { LayoutDashboard, Users, type LucideIcon } from 'lucide-react';

export interface NavPage {
  path: string;
  label: string;
  icon: LucideIcon;
  description: string;
  comingSoon?: boolean;
}

export const NAV_PAGES: NavPage[] = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, description: 'FIU analytics and Account Aggregator overview' },
  {
    path: '/users',
    label: 'Users',
    icon: Users,
    description: 'Onboarding, activity and retention of customers.',
  },
];
