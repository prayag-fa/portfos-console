import { RefreshCw, RotateCcw, Webhook } from 'lucide-react';

// Step actions configuration
export const stepActions = [
  {
    name: 'Consent Journey',
    stepLevelActions: [
      {
        icon: Webhook,
        onClick: () => {},
        title: 'View Webhook'
      },
      {
        icon: RotateCcw,
        onClick: () => {},
        title: 'Retrigger Webhook'
      }
    ],
    stepLevelTime: true
  },
  {
    name: 'Account Details Fetch',
    stepLevelActions: [
      {
        icon: RefreshCw,
        onClick: () => {},
        title: 'Re-trigger Data Fetch'
      }
    ],
    accountLevelActions: [
      // {
      //   icon: Webhook,
      //   onClick: () => {},
      //   title: 'View Webhook'
      // },
      // {
      //   icon: RotateCcw,
      //   onClick: () => {},
      //   title: 'Retrigger Webhook'
      // }
    ],
    accountLevelTime: true
  },
  {
    name: 'Data Back Filling',
    accountLevelActions: [
      // {
      //   icon: RefreshCw,
      //   onClick: () => {},
      //   title: 'Re-trigger Data Backfilling'
      // }
    ],
    yearLevelActions: [
      // {
      //   icon: Webhook,
      //   onClick: () => {},
      //   title: 'View Webhook'
      // },
      // {
      //   icon: RotateCcw,
      //   onClick: () => {},
      //   title: 'Re-trigger Webhook'
      // },
      // {
      //   icon: RefreshCw,
      //   onClick: () => {},
      //   title: 'Re-trigger Data Backfilling'
      // }
    ],
    yearLevelTime: true
  },
  {
    name: 'Analysis',
    stepLevelActions: [
      // {
      //   icon: Webhook,
      //   onClick: () => {},
      //   title: 'View Webhook'
      // },
      // {
      //   icon: RotateCcw,
      //   onClick: () => {},
      //   title: 'Retrigger Webhook'
      // },
      {
        icon: RefreshCw,
        onClick: () => {},
        title: 'Re-trigger Data Analysis'
      }
    ],
    stepLevelTime: true
  }
];

export const refreshStepActions = [stepActions[1], stepActions[3]];
