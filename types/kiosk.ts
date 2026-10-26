export type ConnectionState = "online" | "checking" | "waiting" | "error";

export interface ConnectionCheckItem {
  id: string;
  label: string;
  statusText: string;
  readyText: string;
  state: ConnectionState;
}

export type StatIconType = "layers" | "printer" | "play" | "chart";

export type StatAccentVariant = "blue" | "purple" | "indigo" | "green";

export interface StatMetric {
  id: string;
  label: string;
  value: string;
  subtitle: string;
  icon: StatIconType;
  variant: StatAccentVariant;
}

export type QuickActionIconType = "play" | "pause" | "stop" | "restart";

export type QuickActionVariant =
  | "primary"
  | "muted-slate"
  | "muted-coral"
  | "muted-amber";

export interface QuickActionItem {
  id: string;
  title: string;
  description: string;
  icon: QuickActionIconType;
  variant: QuickActionVariant;
  href?: string;
}

export type KioskHardwareStatus =
  | "online"
  | "offline"
  | "sleeping"
  | "busy"
  | "printing";

export interface KioskStatusPill {
  id: KioskHardwareStatus;
  label: string;
  dotColor: string;
}

export type NavIconName =
  | "dashboard"
  | "session-setup"
  | "live-session"
  | "moderation"
  | "print-management"
  | "kiosk-management"
  | "activity-logs"
  | "analytics"
  | "reports"
  | "settings";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: NavIconName;
  badge?: number;
}

export interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
}

export interface KioskInfo {
  roomName: string;
  statusHeading: string;
  statusDescription: string;
  isOnline: boolean;
  educatorName: string;
  educatorInitials: string;
  notificationCount: number;
  systemVersion: string;
  firmwareVersion?: string;
  ipAddress?: string;
}

export interface ActivitySubOption {
  id: string;
  title: string;
  description: string;
}

export interface ActivityOption {
  id: string;
  title: string;
  summaryTitle?: string;
  description: string;
  icon: "palette" | "pencil" | "sparkles";
  accent: "blue" | "purple" | "green";
  subOptions?: ActivitySubOption[];
}

export interface ThemeOption {
  id: string;
  title: string;
  tags: string[];
  icon:
    | "paw"
    | "plane"
    | "apple"
    | "users"
    | "shapes"
    | "palette"
    | "flower";
  accent:
    | "blue"
    | "orange"
    | "red"
    | "green"
    | "indigo"
    | "amber"
    | "pink";
}

export type SafetyRuleMode = "STRICT" | "STANDARD" | "CUSTOM";

export interface SafetyModeOption {
  id: SafetyRuleMode;
  title: string;
  subtitle: string;
  description: string;
  icon: "lock" | "shield" | "sliders";
}

export interface LiveFeedItem {
  id: string;
  title: string;
  badgeText: string;
  badgeVariant: "danger" | "success" | "info";
  timestamp: string;
  subtitle: string;
  icon: "ban" | "plane" | "cat";
  requiresAction?: boolean;
  actionNote?: string;
}

export type ModerationStatus = "pending" | "blocked" | "overridden";

export interface ModerationQueueItem {
  id: string;
  categoryLabel: string;
  categoryVariant: "danger" | "warning" | "purple";
  timestamp: string;
  theme: string;
  status: ModerationStatus;
  statusBadge: string;
  originalSpeech: string;
  recognizedText?: string;
  resolutionNote?: string;
}

export type PrinterHardwareState =
  | "ready"
  | "printing"
  | "error"
  | "no-paper";

export interface ReprintItem {
  id: string;
  title: string;
  status: "printed" | "failed";
  reprintCount?: number;
  theme: string;
  activity: string;
  timestamp: string;
}

export interface KioskControlItem {
  id: "restart" | "shutdown" | "sleep" | "wakeup";
  title: string;
  description: string;
  accent: "blue" | "red" | "amber" | "green";
}

export interface ActivityLogRecord {
  id: string;
  date: string;
  time: string;
  safetyStatus: "Success" | "Blocked";
  printStatus: "Printed" | "Not printed" | "Failed";
  theme: string;
  activityType: string;
}

export interface AnalyticsUsagePoint {
  label: string;
  generations: number;
  prints: number;
  isCurrent?: boolean;
}

export interface ThemeShareItem {
  id: string;
  name: string;
  percentage: number;
  color: string;
}

export interface ActivityMixItem {
  id: string;
  name: string;
  percentage: number;
  barColor: string;
  textColor: string;
}

export interface ReportTypeOption {
  id: "session" | "research";
  title: string;
  description: string;
}

export interface GeneratedReportItem {
  id: string;
  title: string;
  type: "session" | "research";
  generatedAt: string;
  summary: string;
}

export interface ThemeSwatchOption {
  id: string;
  label: string;
  hex: string;
}
