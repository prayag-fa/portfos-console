import { RefreshCw, RotateCcw, Webhook } from "lucide-react";

// Mock data for the application
export const mockUsers = [
  {
    id: 1,
    clientUserId: "USER001",
    journeyCount: 3,
    lastJourneyTime: "2025-08-04T10:30:00Z",
    accountsLinked: 6,
    status: "success",
    successRate: 85,
    lastRefresh: {
      time: "2025-08-04T14:20:00Z",
      status: "completed",
      accountsCount: 6,
    },
  },
  {
    id: 2,
    clientUserId: "USER002",
    journeyCount: 2,
    lastJourneyTime: "2025-08-03T14:20:00Z",
    accountsLinked: 4,
    status: "success",
    successRate: 100,
    lastRefresh: {
      time: "2025-08-03T16:45:00Z",
      status: "completed",
      accountsCount: 4,
    },
  },
  {
    id: 3,
    clientUserId: "USER003",
    journeyCount: 1,
    lastJourneyTime: "2025-08-02T09:15:00Z",
    accountsLinked: 2,
    status: "failed",
    successRate: 0,
    lastRefresh: {
      time: "2025-08-02T11:30:00Z",
      status: "failed",
      accountsCount: 2,
    },
  },
  {
    id: 4,
    clientUserId: "USER004",
    journeyCount: 3,
    lastJourneyTime: "2025-08-01T16:45:00Z",
    accountsLinked: 5,
    status: "success",
    successRate: 67,
    lastRefresh: {
      time: "2025-08-01T18:15:00Z",
      status: "in_progress",
      accountsCount: 5,
    },
  },
];

export const mockJourneys = {
  "USER001": [
    {
      id: 1,
      mobile: "+91 98765 46011",
      journeyStartTime: "2025-08-04T10:30:00Z",
      journeyDuration: "12m 45s",
      journeyStatus: "completed",
      accountsCount: 3,
      hasIssues: false,
      accounts: [
        {
          id: "ACC001",
          type: "Mutual Funds",
          maskedNumber: "XXXX XXXX 0068",
          vintage: "2020-2024",
        },
        {
          id: "ACC002",
          type: "Deposit",
          maskedNumber: "XXXX XXXX 9898",
          vintage: "2021-2024",
        },
        {
          id: "ACC003",
          type: "Equities",
          maskedNumber: "XXXX XXXX 5977",
          vintage: "2019-2024",
        },
      ],
    },
    {
      id: 2,
      mobile: "+91 97654 36011",
      journeyStartTime: "2025-08-03T14:20:00Z",
      journeyDuration: "25m 15s",
      journeyStatus: "completed",
      accountsCount: 2,
      hasIssues: false,
      accounts: [
        {
          id: "ACC004",
          type: "Mutual Funds",
          maskedNumber: "XXXX XXXX 5822",
          vintage: "2005-2024",
        },
        {
          id: "ACC005",
          type: "Equities",
          maskedNumber: "XXXX XXXX 2211",
          vintage: "2010-2024",
        },
      ],
    },
    {
      id: 3,
      mobile: "+91 98765 46011",
      journeyStartTime: "2025-08-02T09:15:00Z",
      journeyDuration: "8m 30s",
      journeyStatus: "failed",
      accountsCount: 1,
      hasIssues: true,
      accounts: [
        {
          id: "ACC006",
          type: "Deposit",
          maskedNumber: "XXXX XXXX 1261",
          vintage: "2023-2024",
        },
      ],
    },
  ],
  "USER002": [
    {
      id: 1,
      mobile: "+91 98765 46012",
      journeyStartTime: "2025-08-03T14:20:00Z",
      journeyDuration: "15m 30s",
      journeyStatus: "completed",
      accountsCount: 3,
      hasIssues: false,
      accounts: [
        {
          id: "ACC007",
          type: "Mutual Funds",
          maskedNumber: "XXXX XXXX 1234",
          vintage: "2020-2024",
        },
        {
          id: "ACC008",
          type: "Deposit",
          maskedNumber: "XXXX XXXX 5678",
          vintage: "2021-2024",
        },
        {
          id: "ACC009",
          type: "Equities",
          maskedNumber: "XXXX XXXX 9012",
          vintage: "2022-2024",
        },
      ],
    },
    {
      id: 2,
      mobile: "+91 98765 46012",
      journeyStartTime: "2025-08-01T11:45:00Z",
      journeyDuration: "18m 20s",
      journeyStatus: "completed",
      accountsCount: 1,
      hasIssues: false,
      accounts: [
        {
          id: "ACC010",
          type: "Mutual Funds",
          maskedNumber: "XXXX XXXX 3456",
          vintage: "2018-2024",
        },
      ],
    },
  ],
  "USER003": [
    {
      id: 1,
      mobile: "+91 98765 46013",
      journeyStartTime: "2025-08-02T09:15:00Z",
      journeyDuration: "5m 45s",
      journeyStatus: "failed",
      accountsCount: 2,
      hasIssues: true,
      accounts: [
        {
          id: "ACC011",
          type: "Deposit",
          maskedNumber: "XXXX XXXX 3456",
          vintage: "2023-2024",
        },
        {
          id: "ACC012",
          type: "Mutual Funds",
          maskedNumber: "XXXX XXXX 7890",
          vintage: "2022-2024",
        },
      ],
    },
  ],
  "USER004": [
    {
      id: 1,
      mobile: "+91 98765 46014",
      journeyStartTime: "2025-08-01T16:45:00Z",
      journeyDuration: "22m 10s",
      journeyStatus: "completed",
      accountsCount: 2,
      hasIssues: false,
      accounts: [
        {
          id: "ACC013",
          type: "Mutual Funds",
          maskedNumber: "XXXX XXXX 2345",
          vintage: "2020-2024",
        },
        {
          id: "ACC014",
          type: "Equities",
          maskedNumber: "XXXX XXXX 6789",
          vintage: "2021-2024",
        },
      ],
    },
    {
      id: 2,
      mobile: "+91 98765 46014",
      journeyStartTime: "2025-07-30T13:20:00Z",
      journeyDuration: "30m 45s",
      journeyStatus: "in_progress",
      accountsCount: 2,
      hasIssues: true,
      accounts: [
        {
          id: "ACC015",
          type: "Deposit",
          maskedNumber: "XXXX XXXX 0123",
          vintage: "2022-2024",
        },
        {
          id: "ACC016",
          type: "Mutual Funds",
          maskedNumber: "XXXX XXXX 4567",
          vintage: "2019-2024",
        },
      ],
    },
    {
      id: 3,
      mobile: "+91 98765 46014",
      journeyStartTime: "2025-07-28T10:10:00Z",
      journeyDuration: "12m 30s",
      journeyStatus: "failed",
      accountsCount: 1,
      hasIssues: true,
      accounts: [
        {
          id: "ACC017",
          type: "Equities",
          maskedNumber: "XXXX XXXX 8901",
          vintage: "2023-2024",
        },
      ],
    },
  ],
  "default": [
    {
      id: 1,
      mobile: "+91 98765 46000",
      journeyStartTime: "2025-08-04T10:30:00Z",
      journeyDuration: "12m 45s",
      journeyStatus: "completed",
      accountsCount: 3,
      hasIssues: false,
      accounts: [
        {
          id: "ACC001",
          type: "Mutual Funds",
          maskedNumber: "XXXX XXXX 0068",
          vintage: "2020-2024",
        },
        {
          id: "ACC002",
          type: "Deposit",
          maskedNumber: "XXXX XXXX 9898",
          vintage: "2021-2024",
        },
        {
          id: "ACC003",
          type: "Equities",
          maskedNumber: "XXXX XXXX 5977",
          vintage: "2019-2024",
        },
      ],
    },
  ],
};


export const mockJourneyTimeline = {
  "USER001": [
    {
    id: 1,
    mobile: "+91 98765 46011",
    journeyStartTime: "2025-08-04T10:30:00Z",
    journeyDuration: "12m 45s",
    journeyStatus: "completed",
    accounts: [
      {
        id: "ACC001",
        type: "Mutual Funds",
        maskedNumber: "XXXX XXXX 0068",
        vintage: "2020-2024",
      },
      {
        id: "ACC002",
        type: "Deposit",
        maskedNumber: "XXXX XXXX 9898",
        vintage: "2021-2024",
      },
      {
        id: "ACC003",
        type: "Equities",
        maskedNumber: "XXXX XXXX 5977",
        vintage: "2019-2024",
      },
    ],
    timeline: [
      {
        status: "completed",
        timestamp: "2025-08-04T10:32:15Z",
        duration: "1m 30s",        
      },
      {
        status: "completed",
        timestamp: "2025-08-04T10:33:45Z",
        duration: "3m 20s",
        accounts: [
          {
            id: "ACC001",
            status: "success",
          },
          {
            id: "ACC002",
            status: "success",
          },
          {
            id: "ACC003",
            status: "success",
          },
        ],
      },
      {
        status: "completed",
        timestamp: "2025-08-04T10:37:05Z",
        duration: "5m 40s",
        accounts: [
          {
            id: "ACC001",
            status: "success",
            yearlyData: [
              { year: 2024, status: "success" },
              { year: 2023, status: "success" },
              { year: 2022, status: "success" },
              { year: 2021, status: "success" },
              { year: 2020, status: "success" },
            ],
          },
          {
            id: "ACC002",
            status: "success",
            yearlyData: [
              { year: 2024, status: "success" },
              { year: 2023, status: "success" },
              { year: 2022, status: "success" },
              { year: 2021, status: "success" },
            ],
          },
          {
            id: "ACC003",
            status: "success",
            yearlyData: [
              { year: 2024, status: "success" },
              { year: 2023, status: "success" },
              { year: 2022, status: "success" },
              { year: 2021, status: "success" },
              { year: 2020, status: "success" },
              { year: 2019, status: "success" },
            ],
          },
        ],
      },
      {
        status: "completed",
        timestamp: "2025-08-04T10:45:00Z",
        duration: "2m 15s",
      },
    ],
  },{
    id: 2,
    mobile: "+91 97654 36011",
    journeyStartTime: "2025-08-03T14:20:00Z",
    journeyDuration: "25m 15s",
    journeyStatus: "completed",
    accounts: [
      {
        id: "ACC004",
        type: "Mutual Funds",
        maskedNumber: "XXXX XXXX 5822",
        vintage: "2005-2024",
      },
      {
        id: "ACC005",
        type: "Equities",
        maskedNumber: "XXXX XXXX 2211",
        vintage: "2010-2024",
      },
    ],
    timeline: [
      {
        status: "completed",
        timestamp: "2025-08-03T14:20:00Z",
        duration: "3m 45s",        
      },
      {
        status: "completed",
        timestamp: "2025-08-03T14:23:45Z",
        duration: "2m 10s",
        accounts: [
          {
            id: "ACC004",
            status: "success",
          },
          {
            id: "ACC005",
            status: "success",
          },
        ],
      },
      {
        status: "completed",
        timestamp: "2025-08-03T14:25:55Z",
        duration: "5m 30s",
        accounts: [
          {
            id: "ACC004",
            status: "success",
            yearlyData: [
              { year: 2024, status: "success" },
              { year: 2023, status: "success" },
              { year: 2022, status: "success" },
              { year: 2021, status: "success" },
              { year: 2020, status: "success" },
            ],
          },
          {
            id: "ACC005",
            status: "success",
            yearlyData: [
              { year: 2024, status: "success" },
              { year: 2023, status: "success" },
              { year: 2022, status: "success" },
              { year: 2021, status: "success" },
              { year: 2020, status: "success" },
            ],
          },
        ],
      },
      {
        status: "completed",
        timestamp: "2025-08-03T14:47:35Z",
        duration: "2m 40s"
      },
    ],
  },{
    id: 3,
    mobile: "+91 98765 46011",
    journeyStartTime: "2025-08-02T09:15:00Z",
    journeyDuration: "8m 30s",
    journeyStatus: "failed",
    accounts: [
      {
        id: "ACC006",
        type: "Mutual Funds",
        maskedNumber: "XXXX XXXX 1261",
        vintage: "2023-2024",
      },
    ],
    timeline: [
      {
        status: "completed",
        timestamp: "2025-08-02T09:15:00Z",
        duration: "2m 10s"
      },
      { 
        status: "completed",
        timestamp: "2025-08-02T09:17:10Z",
        duration: "1m 45s",
        accounts: [
          {
            id: "ACC006",
            status: "success",
          },
        ],
      },
      {
        status: "failed",
        timestamp: "2025-08-02T09:18:55Z",
        duration: "5m 35s",
        accounts: [
          {
            id: "ACC006",
            status: "failed",
            yearlyData: [
              { year: 2024, status: "failed" },
            ]
          },
        ],
      },
    ],
  }],
  "USER002": [
    {
    id: 1,
    mobile: "+91 98765 46012",
    journeyStartTime: "2025-08-03T14:20:00Z",
    journeyDuration: "15m 30s",
    journeyStatus: "completed",
    accounts: [
      {
        id: "ACC007",
        type: "Mutual Funds",
        maskedNumber: "XXXX XXXX 1234",
        vintage: "2020-2024",
      },
      {
        id: "ACC008",
        type: "Deposit",
        maskedNumber: "XXXX XXXX 5678",
        vintage: "2021-2024",
      },
      {
        id: "ACC009",
        type: "Equities",
        maskedNumber: "XXXX XXXX 9012",
        vintage: "2022-2024",
      },
    ],
    timeline: [
      {
        status: "completed",
        timestamp: "2025-08-03T14:20:00Z",
        duration: "2m 30s"
      },
      {
        status: "completed",
        timestamp: "2025-08-03T14:22:30Z",
        duration: "1m 45s",
        accounts: [
          {
            id: "ACC007",
            status: "success",
          },
          {
            id: "ACC008",
            status: "success",
          },
          {
            id: "ACC009",
            status: "success",
          },
        ],
      },
      {
        status: "partial",
        timestamp: "2025-08-03T14:24:15Z",
        duration: "4m 20s",
        accounts: [
          {
            id: "ACC007",
            status: "success",
            yearlyData: [
              { year: 2024, status: "success" },
              { year: 2023, status: "success" },
              { year: 2022, status: "success" },
              { year: 2021, status: "success" },
              { year: 2020, status: "success" },
            ],
          },
          {
            id: "ACC009",
            status: "partial",
            yearlyData: [
              { year: 2024, status: "success" },
              { year: 2023, status: "success" },
              { year: 2022, status: "success" },
              { year: 2021, status: "success" },
              { year: 2020, status: "failed" },
            ],
          },
        ],
      },
      {
        status: "completed",
        timestamp: "2025-08-03T14:26:55Z",
        duration: "2m 40s"
      },
    ],
  },{
    id: 2,
    mobile: "+91 98765 46012",
    journeyStartTime: "2025-08-01T11:45:00Z",
    journeyDuration: "18m 20s",
    journeyStatus: "completed",
    accounts: [
      {
        id: "ACC010",
        type: "Mutual Funds",
        maskedNumber: "XXXX XXXX 3456",
        vintage: "2018-2024",
      },
    ],
    timeline: [
      {
        status: "completed",
        timestamp: "2025-08-01T11:45:00Z",
        duration: "3m 15s"
      },
      {
        status: "completed",
        timestamp: "2025-08-01T11:48:15Z",
        duration: "2m 10s",
        accounts: [
          {
            id: "ACC010",
            status: "success",
          },
        ],
      },
      {
        status: "completed",
        timestamp: "2025-08-01T11:55:55Z",
        duration: "6m 45s",
        accounts: [
          {
            id: "ACC010",
            status: "success",
            yearlyData: [
              { year: 2024, status: "success" },
              { year: 2023, status: "success" },
              { year: 2022, status: "success" },
              { year: 2021, status: "success" },
              { year: 2020, status: "success" },
              { year: 2019, status: "success" },
              { year: 2018, status: "success" },
            ],
          },
        ],
      },
      { 
        status: "completed",
        timestamp: "2025-08-01T12:02:40Z",
        duration: "3m 10s",
      }
    ],
  }],
  "USER003": [{
    id: 1,
    mobile: "+91 98765 46013",
    journeyStartTime: "2025-08-02T09:15:00Z",
    journeyDuration: "5m 45s",
    journeyStatus: "failed",
    accounts: [
      {
        id: "ACC011",
        type: "Deposit",
        maskedNumber: "XXXX XXXX 3456",
        vintage: "2023-2024",
      },
      {
        id: "ACC012",
        type: "Mutual Funds",
        maskedNumber: "XXXX XXXX 7890",
        vintage: "2022-2024"
      },
    ],
    timeline: [
      {
        status: "completed",
        timestamp: "2025-08-02T09:15:00Z",
        duration: "2m 20s",
      },
      {
        status: "failed",
        timestamp: "2025-08-02T09:17:20Z",
        duration: "3m 25s",
        accounts: [
          {
            id: "ACC011",
            status: "failed",
            type: "Deposit",
            maskedNumber: "XXXX XXXX 3456",
          },
          {
            id: "ACC012",
            status: "failed",
            type: "Mutual Funds",
            maskedNumber: "XXXX XXXX 7890",
          },
        ],
      },
    ],
  }],
  "USER004": [{
    id: 1,
    mobile: "+91 98765 46014",
    journeyStartTime: "2025-08-01T16:45:00Z",
    journeyDuration: "22m 10s",
    journeyStatus: "completed",
    accounts: [
      {
        id: "ACC013",
        type: "Mutual Funds",
        maskedNumber: "XXXX XXXX 2345",
        vintage: "2020-2024",
      },
      {
        id: "ACC014",
        type: "Equities",
        maskedNumber: "XXXX XXXX 6789",
        vintage: "2021-2024",
      },
    ],
    timeline: [
      {
        status: "completed",
        timestamp: "2025-08-01T16:45:00Z",
        duration: "3m 45s"
      },
      {
        status: "completed",
        timestamp: "2025-08-01T16:48:45Z",
        duration: "2m 15s",
        accounts: [
          {
            id: "ACC013",
            status: "success",
          },
          {
            id: "ACC014",
            status: "success",
          },
        ],
      },
      {
        status: "completed",
        timestamp: "2025-08-01T16:57:20Z",
        duration: "8m 30s",
        accounts: [
          {
            id: "ACC013",
            status: "success",
            yearlyData: [
              { year: 2024, status: "success" },
              { year: 2023, status: "success" },
              { year: 2022, status: "success" },
              { year: 2021, status: "success" },
              { year: 2020, status: "success" },
            ],
          },
          {
            id: "ACC014",
            status: "success",
            yearlyData: [
              { year: 2024, status: "success" },
              { year: 2023, status: "success" },
              { year: 2022, status: "success" },
              { year: 2021, status: "success" },
            ],
          },
        ],
      },
      {
        status: "completed",
        timestamp: "2025-08-01T17:05:50Z",
        duration: "3m 45s",
      },
    ],
  },{
    id: 2,
    mobile: "+91 98765 46014",
    journeyStartTime: "2025-07-30T13:20:00Z",
    journeyDuration: "30m 45s",
    journeyStatus: "in_progress",
    accounts: [
      {
        id: "ACC015",
        type: "Deposit",
        maskedNumber: "XXXX XXXX 0123",
        vintage: "2022-2024",
      },
      {
        id: "ACC016",
        type: "Mutual Funds",
        maskedNumber: "XXXX XXXX 4567",
        vintage: "2019-2024",
      },
    ],
    timeline: [
      {
        status: "completed",
        timestamp: "2025-07-30T13:20:00Z",
        duration: "4m 15s",
      },
      {
        status: "completed",
        timestamp: "2025-07-30T13:24:15Z",
        duration: "2m 30s",   
        accounts: [
          {
            id: "ACC015",
            status: "success",
          },
          {
            id: "ACC016",
            status: "success",
          },
        ],
      },
      {
        status: "completed",
        timestamp: "2025-07-30T13:26:45Z",
        duration: "7m 20s",
        accounts: [
          {
            id: "ACC015",
            status: "success",
            yearlyData: [
              { year: 2024, status: "success" },
              { year: 2023, status: "success" },
              { year: 2022, status: "success" },
            ],
          },
          {
            id: "ACC016",
            status: "in_progress",
            yearlyData: [
              { year: 2024, status: "success" },
              { year: 2023, status: "success" },
              { year: 2022, status: "success" },
              { year: 2021, status: "success" },
              { year: 2020, status: "in_progress" },
              { year: 2019, status: "in_progress" },
            ],
          },
        ],
      },
      {
        status: "in_progress",
        timestamp: "2025-07-30T13:34:05Z",
        duration: "16m 40s",
      },
    ],
  },{
    id: 3,
    mobile: "+91 98765 46014",
    journeyStartTime: "2025-07-28T10:10:00Z",
    journeyDuration: "12m 30s",
    journeyStatus: "failed",
    accounts: [
      {
        id: "ACC017",
        type: "Equities",
        maskedNumber: "XXXX XXXX 8901",
        vintage: "2023-2024",
      },
    ],
    timeline: [
      {
        status: "completed",
        timestamp: "2025-07-28T10:10:00Z",
        duration: "2m 45s"
      },
      {
        status: "completed",
        timestamp: "2025-07-28T10:12:45Z",
        duration: "1m 55s",
        accounts: [
          {
            id: "ACC017",
            status: "success",
          },
        ],
      },
      {
        status: "failed",
        timestamp: "2025-07-28T10:14:40Z",
        duration: "7m 50s",         
        accounts: [
          {
            id: "ACC017",
            status: "failed",
          },
        ],
      },
    ],
  }],
};

// Refresh timeline data
export const mockRefreshTimeline = {
  "USER001": {
    id: "refresh-001",
    refreshTime: "2025-08-04T14:20:00Z",
    status: "completed",
    duration: "8m 30s",
    accounts: [
      {
        id: "ACC001",
        type: "Mutual Funds",
        maskedNumber: "XXXX XXXX 0068",
        vintage: "2020-2024",
      },
      {
        id: "ACC002",
        type: "Deposit",
        maskedNumber: "XXXX XXXX 9898",
        vintage: "2021-2024",
      },
      {
        id: "ACC003",
        type: "Equities",
        maskedNumber: "XXXX XXXX 5977",
        vintage: "2019-2024",
      },
      {
        id: "ACC004",
        type: "Mutual Funds",
        maskedNumber: "XXXX XXXX 5822",
        vintage: "2005-2024",
      },
      {
        id: "ACC005",
        type: "Equities",
        maskedNumber: "XXXX XXXX 2211",
        vintage: "2010-2024",
      },
      {
        id: "ACC006",
        type: "Mutual Funds",
        maskedNumber: "XXXX XXXX 1261",
        vintage: "2023-2024",
      },
    ],
    timeline: [
      {
        status: "completed",
        timestamp: "2025-08-04T14:20:00Z",
        duration: "5m 15s",
        accounts: [
          {
            id: "ACC001",
            status: "success",
          },
          {
            id: "ACC002",
            status: "success",
          },
          {
            id: "ACC003",
            status: "success",
          },
          {
            id: "ACC004",
            status: "success",
          },
          {
            id: "ACC005",
            status: "success",
          },
          {
            id: "ACC006",
            status: "success",
          },
        ],
      },
      {
        status: "completed",
        timestamp: "2025-08-04T14:25:15Z",
        duration: "3m 15s"
      },
    ],
  },
  "USER002": {
    id: "refresh-002",
    refreshTime: "2025-08-03T16:45:00Z",
    status: "completed",
    duration: "6m 45s",
    accounts: [
      {
        id: "ACC007",
        type: "Mutual Funds",
        maskedNumber: "XXXX XXXX 1234",
        vintage: "2020-2024",
      },
      {
        id: "ACC008",
        type: "Deposit",
        maskedNumber: "XXXX XXXX 5678",
        vintage: "2021-2024",
      },
      {
        id: "ACC009",
        type: "Equities",
        maskedNumber: "XXXX XXXX 9012",
        vintage: "2022-2024",
      },
      {
        id: "ACC010",
        type: "Mutual Funds",
        maskedNumber: "XXXX XXXX 3456",
        vintage: "2018-2024",
      },
    ],
    timeline: [
      {
        status: "completed",
        timestamp: "2025-08-03T16:45:00Z",
        duration: "4m 20s",
        accounts: [
          {
            id: "ACC007",
            status: "success",
          },
          {
            id: "ACC008",
            status: "success",
          },
          {
            id: "ACC009",
            status: "success",
          },
          {
            id: "ACC010",
            status: "success",
          },
        ],
      },
      {
        status: "completed",
        timestamp: "2025-08-03T16:49:20Z",
        duration: "2m 25s",
      },
    ],
  },
  "USER003": {
    id: "refresh-003",
    refreshTime: "2025-08-02T11:30:00Z",
    status: "failed",
    duration: "3m 45s",
    accounts: [
      {
        id: "ACC011",
        type: "Deposit",
        maskedNumber: "XXXX XXXX 3456",
        vintage: "2023-2024",
      },
      {
        id: "ACC012",
        type: "Mutual Funds",
        maskedNumber: "XXXX XXXX 7890",
        vintage: "2022-2024",
      },
    ],
    timeline: [
      {
        status: "completed",
        timestamp: "2025-08-02T11:30:00Z",
        duration: "2m 15s",
        accounts: [
          {
            id: "ACC011",
            status: "success",
          },
          {
            id: "ACC012",
            status: "success",
          },
        ],
      },
      {
        status: "failed",
        timestamp: "2025-08-02T11:32:15Z",
        duration: "1m 30s"
      },
    ],
  },
  "USER004": {
    id: "refresh-004",
    refreshTime: "2025-08-01T18:15:00Z",
    status: "in_progress",
    duration: "12m 30s",
    accounts: [
      {
        id: "ACC013",
        type: "Mutual Funds",
        maskedNumber: "XXXX XXXX 2345",
        vintage: "2020-2024",
      },
      {
        id: "ACC014",
        type: "Equities",
        maskedNumber: "XXXX XXXX 6789",
        vintage: "2021-2024",
      },
      {
        id: "ACC015",
        type: "Deposit",
        maskedNumber: "XXXX XXXX 0123",
        vintage: "2022-2024",
      },
      {
        id: "ACC016",
        type: "Mutual Funds",
        maskedNumber: "XXXX XXXX 4567",
        vintage: "2019-2024",
      },
      {
        id: "ACC017",
        type: "Equities",
        maskedNumber: "XXXX XXXX 8901",
        vintage: "2023-2024",
      },
    ],
    timeline: [
      {
        status: "completed",
        timestamp: "2025-08-01T18:15:00Z",
        duration: "8m 45s",
        accounts: [
          {
            id: "ACC013",
            status: "success",
          },
          {
            id: "ACC014",
            status: "success",
          },
          {
            id: "ACC015",
            status: "success",
          },
          {
            id: "ACC016",
            status: "success",
          },
          {
            id: "ACC017",
            status: "success",
          },
        ],
      },
      {
        status: "in_progress",
        timestamp: "2025-08-01T18:23:45Z",
        duration: "3m 45s"
      },
    ],
  },
};

// Refresh trends data for health status
export const mockRefreshTrends = {
  "USER001": {
    lastMonth: {
      totalRefreshes: 12,
      successfulRefreshes: 11,
      failedRefreshes: 1,
      averageDuration: "7m 30s",
      successRate: 91.7,
      trend: "improving",
    },
    lastWeek: {
      totalRefreshes: 3,
      successfulRefreshes: 3,
      failedRefreshes: 0,
      averageDuration: "6m 45s",
      successRate: 100,
      trend: "stable",
    },
  },
  "USER002": {
    lastMonth: {
      totalRefreshes: 8,
      successfulRefreshes: 8,
      failedRefreshes: 0,
      averageDuration: "5m 20s",
      successRate: 100,
      trend: "excellent",
    },
    lastWeek: {
      totalRefreshes: 2,
      successfulRefreshes: 2,
      failedRefreshes: 0,
      averageDuration: "4m 15s",
      successRate: 100,
      trend: "improving",
    },
  },
  "USER003": {
    lastMonth: {
      totalRefreshes: 15,
      successfulRefreshes: 8,
      failedRefreshes: 7,
      averageDuration: "12m 45s",
      successRate: 53.3,
      trend: "declining",
    },
    lastWeek: {
      totalRefreshes: 4,
      successfulRefreshes: 1,
      failedRefreshes: 3,
      averageDuration: "15m 20s",
      successRate: 25,
      trend: "critical",
    },
  },
  "USER004": {
    lastMonth: {
      totalRefreshes: 10,
      successfulRefreshes: 7,
      failedRefreshes: 3,
      averageDuration: "9m 15s",
      successRate: 70,
      trend: "stable",
    },
    lastWeek: {
      totalRefreshes: 2,
      successfulRefreshes: 1,
      failedRefreshes: 1,
      averageDuration: "11m 30s",
      successRate: 50,
      trend: "declining",
    },
  },
};

// Step actions configuration
export const stepActions = [
  {
    name: "Consent Journey",
    stepLevelActions: [
      {
        icon: Webhook,
        onClick: () => console.log(`View webhook details`),
        title: "View Webhook",
      },
      {
        icon: RotateCcw,
        onClick: () => console.log(`Retrigger webhook`),
        title: "Retrigger Webhook",
      },
    ],
    stepLevelTime: true,
  },
  {
    name: "Account Details Fetch",
    stepLevelActions: [
      {
        icon: RefreshCw,
        onClick: () => console.log(`Re-trigger data fetch`),
        title: "Re-trigger Data Fetch",
      }
    ],
    accountLevelActions: [
      {
        icon: Webhook,
        onClick: () => console.log(`View webhook details`),
        title: "View Webhook",
      },
      {
        icon: RotateCcw,
        onClick: () => console.log(`Retrigger webhook`),
        title: "Retrigger Webhook",
      }
    ],
    accountLevelTime: true,
  },
  {
    name: "Data Back Filling",
    accountLevelActions: [
      {
        icon: RefreshCw,
        onClick: () => console.log(`Re-trigger data backfilling`),
        title: "Re-trigger Data Backfilling",
      }
    ],
    yearLevelActions: [
      {
        icon: Webhook,
        onClick: () => console.log(`View webhook details`),
        title: "View Webhook",
      },
      {
        icon: RotateCcw,
        onClick: () => console.log(`Re-trigger webhook`),
        title: "Re-trigger Webhook",
      },
      {
        icon: RefreshCw,
        onClick: () => console.log(`Re-trigger data backfilling`),
        title: "Re-trigger Data Backfilling",
      },
    ],
    yearLevelTime: true,
  },
  {
    name: "Analysis",
    stepLevelActions: [
      {
        icon: Webhook,
        onClick: () => console.log(`View webhook details`),
        title: "View Webhook",
      }, {
        icon: RotateCcw,
        onClick: () => console.log(`Retrigger webhook`),
        title: "Retrigger Webhook",
      }, {
        icon: RefreshCw,
        onClick: () => console.log(`Re-trigger data backfilling`),
        title: "Re-trigger Data Backfilling",
      }
    ],
    stepLevelTime: true,
  },
]; 

export const refreshStepActions = [
  stepActions[1], stepActions[3]
]