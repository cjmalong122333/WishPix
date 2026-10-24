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
}

export interface ActivityOption {
  id: string;
  title: string;
  description: string;
  icon: "palette" | "pencil" | "sparkles";
  accent: "blue" | "purple" | "green";
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
