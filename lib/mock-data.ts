import type {
  ConnectionCheckItem,
  KioskInfo,
  QuickActionItem,
  StatMetric,
} from "@/types/kiosk";

export const KIOSK_INFO: KioskInfo = {
  roomName: "Rainbow Room",
  statusHeading: "WAITING FOR TEACHER",
  isOnline: true,
  educatorName: "Jamie",
  educatorInitials: "JM",
  notificationCount: 2,
  systemVersion: "System v2.4.1",
};

export const INITIAL_CONNECTION_CHECKS: ConnectionCheckItem[] = [
  {
    id: "internet",
    label: "Internet Connection",
    statusText: "Online",
    state: "online",
  },
  {
    id: "database",
    label: "Database Connection",
    statusText: "Checking",
    state: "checking",
  },
  {
    id: "kiosk",
    label: "Kiosk Connection",
    statusText: "Waiting",
    state: "waiting",
  },
];

export const DASHBOARD_METRICS: StatMetric[] = [
  {
    id: "total-activities",
    label: "Total Activities",
    value: "3",
    subtitle: "Sessions run today",
    icon: "layers",
    variant: "blue",
  },
  {
    id: "total-prints",
    label: "Total Prints",
    value: "420",
    subtitle: "↑ 12% from last week",
    icon: "printer",
    variant: "purple",
  },
  {
    id: "active-session",
    label: "Active Session",
    value: "None",
    subtitle: "Start one below",
    icon: "play",
    variant: "purple",
  },
  {
    id: "most-used-theme",
    label: "Most Used Theme",
    value: "Animals",
    subtitle: "21 pictures today",
    icon: "chart",
    variant: "blue",
  },
];

export const QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: "start-session",
    title: "Start Session",
    description: "Set up activity, theme and safety",
    icon: "play",
    variant: "primary",
    href: "/session-setup",
  },
  {
    id: "pause-session",
    title: "Pause Session",
    description: "Temporarily stop generation",
    icon: "pause",
    variant: "muted-blue",
  },
  {
    id: "end-session",
    title: "End Session",
    description: "Save logs and sync analytics",
    icon: "stop",
    variant: "muted-coral",
  },
  {
    id: "restart-kiosk",
    title: "Restart Kiosk",
    description: "Reboot the kiosk hardware",
    icon: "restart",
    variant: "secondary",
  },
];
