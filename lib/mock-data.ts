import type {
  ActivityLogRecord,
  ActivityMixItem,
  ActivityOption,
  AnalyticsUsagePoint,
  ConnectionCheckItem,
  KioskControlItem,
  KioskInfo,
  KioskStatusPill,
  LiveFeedItem,
  ModerationQueueItem,
  QuickActionItem,
  ReportTypeOption,
  ReprintItem,
  SafetyModeOption,
  StatMetric,
  ThemeOption,
  ThemeShareItem,
  ThemeSwatchOption,
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
  firmwareVersion: "2.4.1",
  ipAddress: "192.168.1.42",
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
    summaryTitle: "Color and Create",
    description: "Child generates coloring pages.",
    icon: "palette",
    accent: "blue",
    subOptions: [
      {
        id: "single-object",
        title: "Single Object Coloring",
        description: "One large outline, easy for small hands",
      },
      {
        id: "scene-coloring",
        title: "Scene Coloring",
        description: "Multiple objects arranged in a scene",
      },
      {
        id: "pattern-coloring",
        title: "Pattern Coloring",
        description: "Repeating shapes and borders",
      },
    ],
  },
  {
    id: "trace-learn",
    title: "Trace & Learn",
    summaryTitle: "Trace and Learn",
    description: "Child generates tracing worksheets.",
    icon: "pencil",
    accent: "purple",
    subOptions: [
      {
        id: "letter-tracing",
        title: "Letter & Word Tracing",
        description: "Guided dotted letters with picture cues",
      },
      {
        id: "shape-line-tracing",
        title: "Shape & Line Tracing",
        description: "Pre-writing paths and basic geometric outlines",
      },
    ],
  },
  {
    id: "free-play",
    title: "Free Play",
    summaryTitle: "Free Play",
    description: "Open generation.",
    icon: "sparkles",
    accent: "green",
    subOptions: [
      {
        id: "guided-free-play",
        title: "Guided Imagination",
        description: "Open voice prompts within selected classroom theme",
      },
      {
        id: "story-illustration",
        title: "Story Illustration",
        description: "Children describe characters and scenes to print",
      },
    ],
  },
];

export const SESSION_THEMES: ThemeOption[] = [
  {
    id: "animals",
    title: "Animals",
    tags: ["Cat", "Dog", "Lion"],
    icon: "paw",
    accent: "blue",
  },
  {
    id: "transportation",
    title: "Transportation",
    tags: ["Car", "Jeepney", "Airplane"],
    icon: "plane",
    accent: "orange",
  },
  {
    id: "fruits",
    title: "Fruits",
    tags: ["Apple", "Mango", "Banana"],
    icon: "apple",
    accent: "red",
  },
  {
    id: "community-helpers",
    title: "Community Helpers",
    tags: ["Doctor", "Teacher", "Firefighter"],
    icon: "users",
    accent: "green",
  },
  {
    id: "shapes",
    title: "Shapes",
    tags: ["Circle", "Square", "Triangle"],
    icon: "shapes",
    accent: "indigo",
  },
  {
    id: "colors",
    title: "Colors",
    tags: ["Red", "Blue", "Yellow"],
    icon: "palette",
    accent: "amber",
  },
  {
    id: "nature",
    title: "Nature",
    tags: ["Tree", "Flower", "Butterfly"],
    icon: "flower",
    accent: "pink",
  },
];

export const SAFETY_MODES: SafetyModeOption[] = [
  {
    id: "STRICT",
    title: "STRICT",
    subtitle: "MAXIMUM FILTERING",
    description:
      "Only preset child-friendly requests pass. Best for the youngest groups.",
    icon: "lock",
  },
  {
    id: "STANDARD",
    title: "STANDARD",
    subtitle: "RECOMMENDED",
    description:
      "Blocks violence, adult content and unsafe phrases while allowing everyday play.",
    icon: "shield",
  },
  {
    id: "CUSTOM",
    title: "CUSTOM",
    subtitle: "TEACHER DEFINED",
    description:
      "Start from Standard and add your own blocked and allowed words.",
    icon: "sliders",
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

export const REPRINT_HISTORY: ReprintItem[] = [
  {
    id: "rep-1",
    title: "Red Airplane",
    status: "printed",
    theme: "Transportation",
    activity: "Color & Create",
    timestamp: "9:12 AM",
  },
  {
    id: "rep-2",
    title: "Cat",
    status: "printed",
    reprintCount: 1,
    theme: "Animals",
    activity: "Color & Create",
    timestamp: "9:10 AM",
  },
  {
    id: "rep-3",
    title: "Letter M tracing",
    status: "printed",
    theme: "Animals",
    activity: "Trace & Learn",
    timestamp: "9:04 AM",
  },
  {
    id: "rep-4",
    title: "Mango",
    status: "printed",
    theme: "Fruits",
    activity: "Color & Create",
    timestamp: "8:58 AM",
  },
  {
    id: "rep-5",
    title: "Jeepney",
    status: "failed",
    theme: "Transportation",
    activity: "Free Play",
    timestamp: "8:49 AM",
  },
  {
    id: "rep-6",
    title: "Doctor",
    status: "printed",
    theme: "Community Helpers",
    activity: "Color & Create",
    timestamp: "8:44 AM",
  },
];

export const KIOSK_CONTROLS: KioskControlItem[] = [
  {
    id: "restart",
    title: "Restart",
    description: "Reboot and reconnect",
    accent: "blue",
  },
  {
    id: "shutdown",
    title: "Shutdown",
    description: "Power the kiosk off",
    accent: "red",
  },
  {
    id: "sleep",
    title: "Sleep",
    description: "Low power, screen off",
    accent: "amber",
  },
  {
    id: "wakeup",
    title: "Wake Up",
    description: "Bring the kiosk back",
    accent: "green",
  },
];

export const ACTIVITY_LOGS_DATA: ActivityLogRecord[] = [
  {
    id: "log-1",
    date: "Oct 12",
    time: "2:48 PM",
    safetyStatus: "Success",
    printStatus: "Printed",
    theme: "Animals",
    activityType: "Color & Create",
  },
  {
    id: "log-2",
    date: "Oct 12",
    time: "2:41 PM",
    safetyStatus: "Success",
    printStatus: "Printed",
    theme: "Animals",
    activityType: "Color & Create",
  },
  {
    id: "log-3",
    date: "Oct 12",
    time: "2:36 PM",
    safetyStatus: "Blocked",
    printStatus: "Not printed",
    theme: "Animals",
    activityType: "Color & Create",
  },
  {
    id: "log-4",
    date: "Oct 12",
    time: "10:22 AM",
    safetyStatus: "Success",
    printStatus: "Printed",
    theme: "Fruits",
    activityType: "Trace & Learn",
  },
  {
    id: "log-5",
    date: "Oct 12",
    time: "10:15 AM",
    safetyStatus: "Success",
    printStatus: "Printed",
    theme: "Fruits",
    activityType: "Trace & Learn",
  },
  {
    id: "log-6",
    date: "Oct 12",
    time: "10:09 AM",
    safetyStatus: "Success",
    printStatus: "Failed",
    theme: "Fruits",
    activityType: "Trace & Learn",
  },
  {
    id: "log-7",
    date: "Oct 11",
    time: "1:59 PM",
    safetyStatus: "Success",
    printStatus: "Printed",
    theme: "Transportation",
    activityType: "Free Play",
  },
  {
    id: "log-8",
    date: "Oct 11",
    time: "1:51 PM",
    safetyStatus: "Success",
    printStatus: "Printed",
    theme: "Transportation",
    activityType: "Free Play",
  },
  {
    id: "log-9",
    date: "Oct 11",
    time: "11:34 AM",
    safetyStatus: "Success",
    printStatus: "Printed",
    theme: "Community Helpers",
    activityType: "Color & Create",
  },
  {
    id: "log-10",
    date: "Oct 11",
    time: "11:20 AM",
    safetyStatus: "Success",
    printStatus: "Printed",
    theme: "Community Helpers",
    activityType: "Color & Create",
  },
  {
    id: "log-11",
    date: "Oct 10",
    time: "2:15 PM",
    safetyStatus: "Success",
    printStatus: "Printed",
    theme: "Shapes",
    activityType: "Trace & Learn",
  },
  {
    id: "log-12",
    date: "Oct 10",
    time: "2:04 PM",
    safetyStatus: "Blocked",
    printStatus: "Not printed",
    theme: "Animals",
    activityType: "Free Play",
  },
  {
    id: "log-13",
    date: "Oct 10",
    time: "10:45 AM",
    safetyStatus: "Success",
    printStatus: "Printed",
    theme: "Colors",
    activityType: "Color & Create",
  },
  {
    id: "log-14",
    date: "Oct 9",
    time: "1:30 PM",
    safetyStatus: "Success",
    printStatus: "Printed",
    theme: "Nature",
    activityType: "Color & Create",
  },
  {
    id: "log-15",
    date: "Oct 9",
    time: "10:12 AM",
    safetyStatus: "Success",
    printStatus: "Printed",
    theme: "Animals",
    activityType: "Trace & Learn",
  },
  {
    id: "log-16",
    date: "Oct 8",
    time: "9:48 AM",
    safetyStatus: "Success",
    printStatus: "Printed",
    theme: "Fruits",
    activityType: "Color & Create",
  },
];

export const ANALYTICS_DAILY_USAGE: AnalyticsUsagePoint[] = [
  { label: "Oct 7", generations: 52, prints: 41 },
  { label: "Oct 8", generations: 78, prints: 66 },
  { label: "Oct 9", generations: 64, prints: 51 },
  { label: "Oct 10", generations: 92, prints: 80 },
  { label: "Oct 11", generations: 86, prints: 74 },
  { label: "Oct 12", generations: 73, prints: 62 },
  { label: "Today", generations: 63, prints: 47, isCurrent: true },
];

export const ANALYTICS_WEEKLY_USAGE: AnalyticsUsagePoint[] = [
  { label: "Wk 1", generations: 340, prints: 295 },
  { label: "Wk 2", generations: 420, prints: 368 },
  { label: "Wk 3", generations: 390, prints: 334 },
  { label: "Wk 4", generations: 485, prints: 412 },
  { label: "Wk 5", generations: 460, prints: 398 },
  { label: "Last Wk", generations: 510, prints: 445 },
  { label: "This Wk", generations: 380, prints: 312, isCurrent: true },
];

export const ANALYTICS_MONTHLY_USAGE: AnalyticsUsagePoint[] = [
  { label: "May", generations: 820, prints: 710 },
  { label: "Jun", generations: 940, prints: 805 },
  { label: "Jul", generations: 1120, prints: 960 },
  { label: "Aug", generations: 1350, prints: 1150 },
  { label: "Sep", generations: 1420, prints: 1210 },
  { label: "Oct", generations: 1280, prints: 1096, isCurrent: true },
];

export const THEME_DISTRIBUTION: ThemeShareItem[] = [
  { id: "animals", name: "Animals", percentage: 31, color: "#0F253E" },
  { id: "fruits", name: "Fruits", percentage: 24, color: "#0066FF" },
  {
    id: "transportation",
    name: "Transportation",
    percentage: 20,
    color: "#38BDF8",
  },
  {
    id: "community-helpers",
    name: "Community Helpers",
    percentage: 14,
    color: "#818CF8",
  },
  { id: "colors", name: "Colors", percentage: 11, color: "#C4B5FD" },
];

export const ACTIVITY_MIX: ActivityMixItem[] = [
  {
    id: "color-create",
    name: "Color & Create",
    percentage: 46,
    barColor: "bg-[#0F253E]",
    textColor: "text-[#0F253E]",
  },
  {
    id: "trace-learn",
    name: "Trace & Learn",
    percentage: 33,
    barColor: "bg-[#0066FF]",
    textColor: "text-[#0066FF]",
  },
  {
    id: "free-play",
    name: "Free Play",
    percentage: 21,
    barColor: "bg-[#38BDF8]",
    textColor: "text-[#0284C7]",
  },
];

export const REPORT_TYPES: ReportTypeOption[] = [
  {
    id: "session",
    title: "Session Report",
    description:
      "Activity used, theme used, total prints and total generations.",
  },
  {
    id: "research",
    title: "Research Evaluation Report",
    description:
      "For usability testing, pilot testing and Chapter 4 results.",
  },
];

export const THEME_SWATCHES: ThemeSwatchOption[] = [
  { id: "deep-blue", label: "Deep Blue", hex: "#0F253E" },
  { id: "ocean", label: "Ocean", hex: "#14827B" },
  { id: "midnight", label: "Midnight", hex: "#3B5980" },
  { id: "slate", label: "Slate", hex: "#546875" },
];
