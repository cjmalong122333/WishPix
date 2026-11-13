import { prisma } from "@/lib/prisma";
import { hashPassword, isHashedPassword } from "@/lib/auth";
import {
  ACTIVITY_LOGS_DATA,
  KIOSK_INFO,
  LIVE_GENERATION_FEED,
  MODERATION_ITEMS,
  REPRINT_HISTORY,
} from "@/lib/mock-data";

export const DEFAULT_KIOSK_ID = "kiosk-rainbow-room";
export const DEFAULT_EDUCATOR_ID = "educator-jamie";

let seedPromise: Promise<void> | null = null;

export async function ensureDatabaseSeeded(): Promise<void> {
  if (seedPromise) {
    return seedPromise;
  }

  seedPromise = (async () => {
    try {
      const existingKiosk = await prisma.kiosk.findUnique({
        where: { id: DEFAULT_KIOSK_ID },
      });

      if (existingKiosk) {
        // Ensure all existing educator passwords are upgraded from plaintext to scrypt hashes
        const existingEducators = await prisma.educator.findMany();
        for (const edu of existingEducators) {
          if (!isHashedPassword(edu.password)) {
            await prisma.educator.update({
              where: { id: edu.id },
              data: { password: hashPassword(edu.password) },
            });
          }
        }
        return;
      }

      // 1. Seed default Educator (Jamie) and AppSettings with scrypt hashed password
      await prisma.educator.upsert({
        where: { username: "jamie" },
        update: {},
        create: {
          id: DEFAULT_EDUCATOR_ID,
          username: "jamie",
          password: hashPassword("password123"),
          displayName: KIOSK_INFO.educatorName,
          initials: KIOSK_INFO.educatorInitials,
          settings: {
            create: {
              displayLanguage: "English",
              themeId: "deep-blue",
              volume: 70,
              autoSleepEnabled: true,
              autoSleepDuration: "15 minutes",
              autoLogoutEnabled: true,
              autoLogoutDuration: "30 minutes",
            },
          },
        },
      });

      // 2. Seed Registered Kiosk (Rainbow Room)
      await prisma.kiosk.upsert({
        where: { id: DEFAULT_KIOSK_ID },
        update: {},
        create: {
          id: DEFAULT_KIOSK_ID,
          roomName: KIOSK_INFO.roomName,
          statusHeading: KIOSK_INFO.statusHeading,
          statusDescription: KIOSK_INFO.statusDescription,
          isOnline: KIOSK_INFO.isOnline,
          hardwareStatus: "online",
          printerState: "ready",
          paperTrayLevel: 18,
          temperatureC: 41,
          networkLatencyMs: 24,
          liveStage: 1,
          queueCount: 0,
          notificationCount: KIOSK_INFO.notificationCount,
          systemVersion: KIOSK_INFO.systemVersion,
          firmwareVersion: KIOSK_INFO.firmwareVersion ?? "2.4.1",
          ipAddress: KIOSK_INFO.ipAddress ?? "192.168.1.42",
          safetyLevel: "STANDARD",
        },
      });

      // 3. Seed 3 Sessions for Today so dashboard metrics match initial baseline
      const sessionSpecs = [
        {
          id: "session-today-1",
          status: "ended",
          activityId: "color-create",
          activityTitle: "Color & Create",
          subOptionId: "single-object",
          subOptionTitle: "Single Object Coloring",
          themeId: "animals",
          themeTitle: "Animals",
          safetyMode: "STANDARD",
        },
        {
          id: "session-today-2",
          status: "ended",
          activityId: "trace-learn",
          activityTitle: "Trace & Learn",
          subOptionId: "letter-tracing",
          subOptionTitle: "Letter & Word Tracing",
          themeId: "fruits",
          themeTitle: "Fruits",
          safetyMode: "STANDARD",
        },
        {
          id: "session-today-3",
          status: "ended",
          activityId: "free-play",
          activityTitle: "Free Play",
          subOptionId: "guided-free-play",
          subOptionTitle: "Guided Imagination",
          themeId: "transportation",
          themeTitle: "Transportation",
          safetyMode: "STANDARD",
        },
      ];

      for (const s of sessionSpecs) {
        await prisma.session.upsert({
          where: { id: s.id },
          update: {},
          create: {
            ...s,
            kioskId: DEFAULT_KIOSK_ID,
            educatorId: DEFAULT_EDUCATOR_ID,
          },
        });
      }

      // 4. Seed Live Feed Items as Generations
      for (const feed of LIVE_GENERATION_FEED) {
        await prisma.generation.upsert({
          where: { id: `feed-${feed.id}` },
          update: {},
          create: {
            id: `feed-${feed.id}`,
            sessionId: "session-today-1",
            kioskId: DEFAULT_KIOSK_ID,
            title: feed.title,
            subtitle: feed.subtitle,
            badgeText: feed.badgeText,
            badgeVariant: feed.badgeVariant,
            icon: feed.icon,
            requiresAction: Boolean(feed.requiresAction),
            actionNote: feed.actionNote ?? null,
            dateLabel: "Oct 12",
            timeLabel: feed.timestamp,
            safetyStatus: feed.badgeVariant === "danger" ? "Blocked" : "Success",
            printStatus:
              feed.badgeVariant === "danger" ? "Not printed" : "Printed",
            theme: feed.icon === "plane" ? "Transportation" : "Animals",
            activityType: "Color & Create",
            reprintCount: 0,
            isReprintable: false,
            showInLiveFeed: true,
          },
        });
      }

      // 5. Seed Reprint History Items as Reprint-Ready Generations
      for (const rep of REPRINT_HISTORY) {
        await prisma.generation.upsert({
          where: { id: rep.id },
          update: {},
          create: {
            id: rep.id,
            sessionId: "session-today-1",
            kioskId: DEFAULT_KIOSK_ID,
            title: rep.title,
            subtitle:
              rep.status === "printed"
                ? "Generated & printed successfully"
                : "Printer paper jam / failed",
            badgeText: rep.status === "printed" ? "Success" : "Failed",
            badgeVariant: rep.status === "printed" ? "success" : "danger",
            icon: rep.theme === "Transportation" ? "plane" : "cat",
            requiresAction: false,
            dateLabel: "Oct 12",
            timeLabel: rep.timestamp,
            safetyStatus: "Success",
            printStatus: rep.status === "printed" ? "Printed" : "Failed",
            theme: rep.theme,
            activityType: rep.activity,
            reprintCount: rep.reprintCount ?? 0,
            isReprintable: true,
            showInLiveFeed: false,
          },
        });
      }

      // 6. Seed Activity Log Records as Historical Generations
      for (const log of ACTIVITY_LOGS_DATA) {
        await prisma.generation.upsert({
          where: { id: log.id },
          update: {},
          create: {
            id: log.id,
            sessionId: "session-today-1",
            kioskId: DEFAULT_KIOSK_ID,
            title: `${log.theme} (${log.activityType})`,
            subtitle:
              log.safetyStatus === "Blocked"
                ? "Rejected by Safety Filter"
                : "Generated & printed successfully",
            badgeText: log.safetyStatus === "Blocked" ? "Safety Flag" : "Success",
            badgeVariant: log.safetyStatus === "Blocked" ? "danger" : "success",
            icon: log.safetyStatus === "Blocked" ? "ban" : "cat",
            requiresAction: false,
            dateLabel: log.date,
            timeLabel: log.time,
            safetyStatus: log.safetyStatus,
            printStatus: log.printStatus,
            theme: log.theme,
            activityType: log.activityType,
            reprintCount: 0,
            isReprintable: false,
            showInLiveFeed: false,
          },
        });
      }

      // 7. Seed Moderation Queue Items
      for (const mod of MODERATION_ITEMS) {
        await prisma.moderationItem.upsert({
          where: { id: mod.id },
          update: {},
          create: {
            id: mod.id,
            generationId:
              mod.id === "mod-1" ? "feed-blocked-request" : undefined,
            categoryLabel: mod.categoryLabel,
            categoryVariant: mod.categoryVariant,
            timestamp: mod.timestamp,
            theme: mod.theme,
            status: mod.status,
            statusBadge: mod.statusBadge,
            originalSpeech: mod.originalSpeech,
            recognizedText: mod.recognizedText ?? null,
            resolutionNote: mod.resolutionNote ?? null,
            resolvedAt: mod.status !== "pending" ? new Date() : null,
          },
        });
      }
    } finally {
      seedPromise = null;
    }
  })();

  return seedPromise;
}
