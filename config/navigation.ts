import type { NavSection } from "@/types/kiosk";

export const NAVIGATION_SECTIONS: NavSection[] = [
  {
    id: "teach",
    title: "TEACH",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        href: "/dashboard",
        icon: "dashboard",
      },
      {
        id: "session-setup",
        label: "Session Setup",
        href: "/session-setup",
        icon: "session-setup",
      },
      {
        id: "live-session",
        label: "Live Session",
        href: "/live-session",
        icon: "live-session",
      },
      {
        id: "moderation",
        label: "Moderation",
        href: "/moderation",
        icon: "moderation",
        badge: 1,
      },
    ],
  },
  {
    id: "hardware",
    title: "HARDWARE",
    items: [
      {
        id: "print-management",
        label: "Print Management",
        href: "/print-management",
        icon: "print-management",
      },
      {
        id: "kiosk-management",
        label: "Kiosk Management",
        href: "/kiosk-management",
        icon: "kiosk-management",
      },
    ],
  },
  {
    id: "insights",
    title: "INSIGHTS",
    items: [
      {
        id: "activity-logs",
        label: "Activity Logs",
        href: "/activity-logs",
        icon: "activity-logs",
      },
      {
        id: "analytics",
        label: "Analytics",
        href: "/analytics",
        icon: "analytics",
      },
      {
        id: "reports",
        label: "Reports",
        href: "/reports",
        icon: "reports",
      },
    ],
  },
  {
    id: "system",
    title: "SYSTEM",
    items: [
      {
        id: "settings",
        label: "Settings",
        href: "/settings",
        icon: "settings",
      },
    ],
  },
];
