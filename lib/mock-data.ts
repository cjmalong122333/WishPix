import type {
  ActivityOption,
  ConnectionCheckItem,
  KioskInfo,
  KioskStatusPill,
  LiveFeedItem,
  ModerationQueueItem,
  QuickActionItem,
  StatMetric,
} from "@/types/kiosk";

export const KIOSK_INFO: KioskInfo = {
  roomName: "Rainbow Room",
  statusHeading: "WAITING FOR TEACHER",
  statusDescription:
    "No activity is running. Choose what the children will do next.",
  isOnline: true,
  educatorName: "Jamie",
  educatorInitials: "JM",
  notificationCount: 1,
  systemVersion: "System v2.4.1",
};

export const KIOSK_STATUS_PILLS: KioskStatusPill[] = [
  { id: "online", label: "Online", dotColor: "bg-[#22C55E]" },
  { id: "offline", label: "Offline", dotColor: "bg-[#94A3B8]" },
  { id: "sleeping", label: "Sleeping", dotColor: "bg-[#F59E0B]" },
  { id: "busy", label: "Busy", dotColor: "bg-[#EF4444]" },
  { id: "printing", label: "Printing", dotColor: "bg-[#A855F7]" },
];

export const INITIAL_CONNECTION_CHECKS: ConnectionCheckItem[] = [
  {
    id: "internet",
    label: "Internet Connection",
    statusText: "Online",
    readyText: "Online",
    state: "online",
  },
  {
    id: "database",
    label: "Database Connection",
    statusText: "Checking",
    readyText: "Database Connected",
    state: "checking",
  },
  {
    id: "kiosk",
    label: "Kiosk Connection",
    statusText: "Waiting",
    readyText: "Kiosk Connected",
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
    value: "47",
    subtitle: "63 pictures generated",
    icon: "printer",
    variant: "purple",
  },
  {
    id: "active-session",
    label: "Active Session",
    value: "None",
    subtitle: "Start one below",
    icon: "play",
    variant: "indigo",
  },
  {
    id: "most-used-theme",
    label: "Most Used Theme",
    value: "Animals",
    subtitle: "21 pictures today",
    icon: "chart",
    variant: "green",
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
    variant: "muted-slate",
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
    variant: "muted-amber",
  },
];

export const SESSION_ACTIVITIES: ActivityOption[] = [
  {
    id: "color-create",
    title: "Color & Create",
    description: "Child generates coloring pages.",
    icon: "palette",
    accent: "blue",
  },
  {
    id: "trace-learn",
    title: "Trace & Learn",
    description: "Child generates tracing worksheets.",
    icon: "pencil",
    accent: "purple",
  },
  {
    id: "free-play",
    title: "Free Play",
    description: "Open generation.",
    icon: "sparkles",
    accent: "green",
  },
];

export const LIVE_STATUS_STAGES = [
  { step: 1, label: "Waiting", active: true },
  { step: 2, label: "Listening", active: false },
  { step: 3, label: "Processing", active: false },
  { step: 4, label: "Generating", active: false },
  { step: 5, label: "Printing", active: false },
];

export const LIVE_GENERATION_FEED: LiveFeedItem[] = [
  {
    id: "blocked-request",
    title: "Blocked Request",
    badgeText: "Safety Flag",
    badgeVariant: "danger",
    timestamp: "9:15 AM",
    subtitle: "Rejected by Safety Filter (Keyword match)",
    icon: "ban",
    requiresAction: true,
    actionNote: "Action required by teacher",
  },
  {
    id: "red-airplane",
    title: "Red Airplane",
    badgeText: "Success",
    badgeVariant: "success",
    timestamp: "9:12 AM",
    subtitle: "Generated & printed successfully",
    icon: "plane",
  },
  {
    id: "cat",
    title: "Cat",
    badgeText: "Success",
    badgeVariant: "info",
    timestamp: "9:10 AM",
    subtitle: "Generated & printed successfully",
    icon: "cat",
  },
];

export const MODERATION_ITEMS: ModerationQueueItem[] = [
  {
    id: "mod-1",
    categoryLabel: "Violent Content",
    categoryVariant: "danger",
    timestamp: "9:15 AM",
    theme: "Animals",
    status: "pending",
    statusBadge: "Needs review",
    originalSpeech: '"draw a scary monstah that kill people"',
    recognizedText: '"Draw a scary monster that kills people"',
  },
  {
    id: "mod-2",
    categoryLabel: "Restricted Phrase",
    categoryVariant: "warning",
    timestamp: "8:52 AM",
    theme: "Animals",
    status: "blocked",
    statusBadge: "Kept blocked",
    originalSpeech: '"you are stupid"',
    resolutionNote: "Action completed by Teacher",
  },
  {
    id: "mod-3",
    categoryLabel: "Unsafe Context",
    categoryVariant: "purple",
    timestamp: "8:40 AM",
    theme: "Fruits",
    status: "overridden",
    statusBadge: "Overridden",
    originalSpeech: '"a knife for the apple"',
    resolutionNote: "Approved & printed",
  },
];
