export type ConnectionState = "online" | "checking" | "waiting" | "error";

export interface ConnectionCheckItem {
  id: string;
  label: string;
  statusText: string;
  state: ConnectionState;
}

export type StatIconType = "layers" | "printer" | "play" | "chart";

export type StatAccentVariant = "blue" | "purple";

export interface StatMetric {
  id: string;
  label: string;
  value: string;
  subtitle: string;
  icon: StatIconType;
  variant: StatAccentVariant;
}

export type QuickActionIconType = "play" | "pause" | "stop" | "restart";

export type QuickActionVariant = "primary" | "muted-blue" | "muted-coral" | "secondary";

export interface QuickActionItem {
  id: string;
  title: string;
  description: string;
  icon: QuickActionIconType;
  variant: QuickActionVariant;
  href?: string;
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
  isOnline: boolean;
  educatorName: string;
  educatorInitials: string;
  notificationCount: number;
  systemVersion: string;
}
