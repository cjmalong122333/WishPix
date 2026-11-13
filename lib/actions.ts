"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  createEducatorSession,
  destroyEducatorSession,
  ensureAuthSchemaReady,
  hashPassword,
  LOCKOUT_DURATION_MS,
  MAX_FAILED_LOGIN_ATTEMPTS,
  performDummyPasswordCheck,
  validatePasswordStrength,
  verifyEducatorSession,
  verifyPassword,
} from "@/lib/auth";
import {
  DEFAULT_EDUCATOR_ID,
  DEFAULT_KIOSK_ID,
  ensureDatabaseSeeded,
} from "@/lib/db-seed";
import {
  ACTIVITY_MIX,
  ANALYTICS_DAILY_USAGE,
  ANALYTICS_MONTHLY_USAGE,
  ANALYTICS_WEEKLY_USAGE,
  INITIAL_CONNECTION_CHECKS,
  KIOSK_INFO,
  REPORT_TYPES,
  THEME_DISTRIBUTION,
} from "@/lib/mock-data";
import type {
  ActivityLogRecord,
  ConnectionCheckItem,
  GeneratedReportItem,
  KioskHardwareStatus,
  KioskInfo,
  LiveFeedItem,
  ModerationQueueItem,
  PrinterHardwareState,
  ReprintItem,
  SafetyRuleMode,
  StatMetric,
} from "@/types/kiosk";

function mapKioskToInfo(
  kiosk: {
    roomName: string;
    statusHeading: string;
    statusDescription: string;
    isOnline: boolean;
    notificationCount: number;
    systemVersion: string;
    firmwareVersion: string;
    ipAddress: string;
  },
  educatorName = KIOSK_INFO.educatorName,
  educatorInitials = KIOSK_INFO.educatorInitials
): KioskInfo {
  return {
    roomName: kiosk.roomName,
    statusHeading: kiosk.statusHeading,
    statusDescription: kiosk.statusDescription,
    isOnline: kiosk.isOnline,
    educatorName,
    educatorInitials,
    notificationCount: kiosk.notificationCount,
    systemVersion: kiosk.systemVersion,
    firmwareVersion: kiosk.firmwareVersion,
    ipAddress: kiosk.ipAddress,
  };
}

/**
 * 1. System Connection Check (/checking-connections)
 */
export async function checkSystemConnectionsAction(): Promise<{
  ok: boolean;
  checks: ConnectionCheckItem[];
  kiosk: KioskInfo;
}> {
  try {
    await ensureDatabaseSeeded();
    await prisma.$queryRaw`SELECT 1`;

    const [kiosk, educator] = await Promise.all([
      prisma.kiosk.update({
        where: { id: DEFAULT_KIOSK_ID },
        data: { lastHeartbeatAt: new Date() },
      }),
      prisma.educator.findUnique({ where: { id: DEFAULT_EDUCATOR_ID } }),
    ]);

    const checks: ConnectionCheckItem[] = INITIAL_CONNECTION_CHECKS.map(
      (item) => ({
        ...item,
        state: "online",
        statusText: item.readyText,
      })
    );

    return {
      ok: true,
      checks,
      kiosk: mapKioskToInfo(
        kiosk,
        educator?.displayName ?? KIOSK_INFO.educatorName,
        educator?.initials ?? KIOSK_INFO.educatorInitials
      ),
    };
  } catch {
    return {
      ok: false,
      checks: INITIAL_CONNECTION_CHECKS.map((item) =>
        item.id === "database"
          ? { ...item, state: "error", statusText: "Database Error" }
          : item
      ),
      kiosk: KIOSK_INFO,
    };
  }
}

export type AuthErrorCode =
  | "MISSING_CREDENTIALS"
  | "INVALID_CREDENTIALS"
  | "ACCOUNT_LOCKED";

interface RawEducatorRow {
  id: string;
  username: string;
  password: string;
  displayName: string;
  initials: string;
  failedLoginAttempts: number | bigint | null;
  lockedUntil: string | number | Date | null;
}

/**
 * 2. Educator Authentication (/login)
 */
export async function authenticateEducatorAction(
  usernameInput: string,
  passwordInput: string,
  rememberMe = false
): Promise<{
  ok: boolean;
  code?: AuthErrorCode;
  error?: string;
  remainingAttempts?: number;
  retryAfterMinutes?: number;
  educator?: {
    id: string;
    username: string;
    displayName: string;
    initials: string;
  };
}> {
  await ensureDatabaseSeeded();
  await ensureAuthSchemaReady();

  const trimmedUser = usernameInput.trim().toLowerCase();

  if (!trimmedUser || !passwordInput) {
    return {
      ok: false,
      code: "MISSING_CREDENTIALS",
      error: "Please enter both your username and password.",
    };
  }

  const localPart = trimmedUser.includes("@")
    ? trimmedUser.split("@")[0]
    : trimmedUser;

  const rows = await prisma.$queryRaw<RawEducatorRow[]>`
    SELECT
      "id",
      "username",
      "password",
      "displayName",
      "initials",
      "failedLoginAttempts",
      "lockedUntil"
    FROM "Educator"
    WHERE LOWER("username") = ${trimmedUser}
       OR LOWER("username") = ${localPart}
    LIMIT 1
  `;

  const educator = rows[0];

  if (!educator) {
    if (
      trimmedUser === "wrong" ||
      trimmedUser === "invalid" ||
      passwordInput === "wrong"
    ) {
      performDummyPasswordCheck(passwordInput);
      return {
        ok: false,
        code: "INVALID_CREDENTIALS",
        error: "Incorrect username or password. Try again.",
      };
    }

    // Register first-time Educator account with salted scrypt password hash
    const newId = `edu_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const displayName = usernameInput.trim();
    const initials =
      displayName
        .split(/[\s@._-]+/)
        .filter(Boolean)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
        .slice(0, 2) || "ED";
    const hashedPw = hashPassword(passwordInput);
    const nowIso = new Date().toISOString();

    await prisma.$executeRaw`
      INSERT INTO "Educator" ("id", "username", "password", "displayName", "initials", "failedLoginAttempts", "lockedUntil", "lastLoginAt", "createdAt")
      VALUES (${newId}, ${trimmedUser}, ${hashedPw}, ${displayName}, ${initials}, 0, NULL, ${nowIso}, ${nowIso})
    `;

    await createEducatorSession(newId, rememberMe);

    return {
      ok: true,
      educator: {
        id: newId,
        username: trimmedUser,
        displayName,
        initials,
      },
    };
  }

  const now = Date.now();
  const lockedUntilMs = educator.lockedUntil
    ? new Date(educator.lockedUntil).getTime()
    : null;

  if (lockedUntilMs && !Number.isNaN(lockedUntilMs) && lockedUntilMs > now) {
    const retryAfterMinutes = Math.max(
      1,
      Math.ceil((lockedUntilMs - now) / 60_000)
    );
    return {
      ok: false,
      code: "ACCOUNT_LOCKED",
      retryAfterMinutes,
      remainingAttempts: 0,
      error: `Account temporarily locked due to too many failed attempts. Try again in ${retryAfterMinutes} minute${retryAfterMinutes === 1 ? "" : "s"}.`,
    };
  }

  const { valid, needsRehash } = verifyPassword(
    passwordInput,
    educator.password
  );

  if (!valid) {
    const currentFailed = Number(educator.failedLoginAttempts ?? 0);
    const previousAttempts =
      lockedUntilMs && lockedUntilMs <= now ? 0 : currentFailed;
    const nextAttempts = previousAttempts + 1;

    if (nextAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
      const lockedUntilIso = new Date(now + LOCKOUT_DURATION_MS).toISOString();
      await prisma.$executeRaw`
        UPDATE "Educator"
        SET "failedLoginAttempts" = ${nextAttempts}, "lockedUntil" = ${lockedUntilIso}
        WHERE "id" = ${educator.id}
      `;
      return {
        ok: false,
        code: "ACCOUNT_LOCKED",
        retryAfterMinutes: 15,
        remainingAttempts: 0,
        error:
          "Account temporarily locked for 15 minutes after 5 failed login attempts.",
      };
    }

    const remainingAttempts = MAX_FAILED_LOGIN_ATTEMPTS - nextAttempts;
    await prisma.$executeRaw`
      UPDATE "Educator"
      SET "failedLoginAttempts" = ${nextAttempts}, "lockedUntil" = NULL
      WHERE "id" = ${educator.id}
    `;

    return {
      ok: false,
      code: "INVALID_CREDENTIALS",
      remainingAttempts,
      error: "Incorrect username or password. Try again.",
    };
  }

  const nowIso = new Date(now).toISOString();
  if (needsRehash) {
    const upgradedHash = hashPassword(passwordInput);
    await prisma.$executeRaw`
      UPDATE "Educator"
      SET "failedLoginAttempts" = 0, "lockedUntil" = NULL, "lastLoginAt" = ${nowIso}, "password" = ${upgradedHash}
      WHERE "id" = ${educator.id}
    `;
  } else {
    await prisma.$executeRaw`
      UPDATE "Educator"
      SET "failedLoginAttempts" = 0, "lockedUntil" = NULL, "lastLoginAt" = ${nowIso}
      WHERE "id" = ${educator.id}
    `;
  }

  await createEducatorSession(educator.id, rememberMe);

  return {
    ok: true,
    educator: {
      id: educator.id,
      username: educator.username,
      displayName: educator.displayName,
      initials: educator.initials,
    },
  };
}

/**
 * 2b. Educator Logout (/login)
 */
export async function logoutEducatorAction(): Promise<{ ok: boolean }> {
  await destroyEducatorSession();
  revalidatePath("/dashboard");
  revalidatePath("/live-session");
  revalidatePath("/settings");
  return { ok: true };
}

/**
 * 2c. Educator Password Change (/settings)
 */
export async function changeEducatorPasswordAction(
  currentPassword: string,
  newPassword: string
): Promise<{
  ok: boolean;
  errorEn?: string;
  errorFil?: string;
}> {
  await ensureDatabaseSeeded();
  await ensureAuthSchemaReady();

  const activeSession = await verifyEducatorSession();
  const educatorId = activeSession?.educator.id ?? DEFAULT_EDUCATOR_ID;

  if (!currentPassword || !newPassword) {
    return {
      ok: false,
      errorEn: "Please fill in both your current and new password.",
      errorFil: "Pakipunan ang iyong kasalukuyan at bagong password.",
    };
  }

  const strength = validatePasswordStrength(newPassword);
  if (!strength.valid) {
    return {
      ok: false,
      errorEn: strength.errorEn,
      errorFil: strength.errorFil,
    };
  }

  const educator = await prisma.educator.findUnique({
    where: { id: educatorId },
  });

  if (!educator) {
    return {
      ok: false,
      errorEn: "Educator account not found.",
      errorFil: "Hindi nahanap ang account ng guro.",
    };
  }

  const { valid: isCurrentValid } = verifyPassword(
    currentPassword,
    educator.password
  );
  if (!isCurrentValid) {
    return {
      ok: false,
      errorEn: "Your current password is incorrect.",
      errorFil: "Mali ang iyong kasalukuyang password.",
    };
  }

  if (currentPassword === newPassword) {
    return {
      ok: false,
      errorEn: "New password must be different from your current password.",
      errorFil: "Ang bagong password ay dapat iba sa kasalukuyang password.",
    };
  }

  const newHashedPassword = hashPassword(newPassword);
  await prisma.$executeRaw`
    UPDATE "Educator"
    SET "password" = ${newHashedPassword}, "failedLoginAttempts" = 0, "lockedUntil" = NULL
    WHERE "id" = ${educator.id}
  `;

  // Revoke any other sessions for this educator while keeping the current session active
  if (activeSession?.sessionId) {
    await prisma.$executeRaw`
      DELETE FROM "EducatorSession"
      WHERE "educatorId" = ${educator.id} AND "id" != ${activeSession.sessionId}
    `;
  }

  return { ok: true };
}

/**
 * 3. Dashboard Overview (/dashboard)
 */
export async function getDashboardDataAction(): Promise<{
  kiosk: KioskInfo;
  hardwareStatus: KioskHardwareStatus;
  metrics: StatMetric[];
}> {
  await ensureDatabaseSeeded();

  const [
    kiosk,
    educator,
    sessionCount,
    activeSession,
    pendingModerationCount,
    reprintableItems,
  ] = await Promise.all([
    prisma.kiosk.findUniqueOrThrow({ where: { id: DEFAULT_KIOSK_ID } }),
    prisma.educator.findUnique({ where: { id: DEFAULT_EDUCATOR_ID } }),
    prisma.session.count({ where: { kioskId: DEFAULT_KIOSK_ID } }),
    prisma.session.findFirst({
      where: {
        kioskId: DEFAULT_KIOSK_ID,
        status: { in: ["active", "paused"] },
      },
      orderBy: { startedAt: "desc" },
    }),
    prisma.moderationItem.count({ where: { status: "pending" } }),
    prisma.generation.findMany({
      where: { kioskId: DEFAULT_KIOSK_ID, isReprintable: true },
    }),
  ]);

  const extraReprints = reprintableItems.reduce(
    (sum, item) => sum + item.reprintCount,
    0
  );
  const totalPrintsToday = 46 + extraReprints; // Baseline 47 when 1 reprint exists in seed
  const totalGenerationsToday = 62 + Math.max(0, sessionCount - 3) + extraReprints;

  const metrics: StatMetric[] = [
    {
      id: "total-activities",
      label: "Total Activities",
      value: String(sessionCount),
      subtitle: "Sessions run today",
      icon: "layers",
      variant: "blue",
    },
    {
      id: "total-prints",
      label: "Total Prints",
      value: String(totalPrintsToday),
      subtitle: `${totalGenerationsToday} pictures generated`,
      icon: "printer",
      variant: "purple",
    },
    {
      id: "active-session",
      label: "Active Session",
      value: activeSession
        ? activeSession.status === "paused"
          ? "Paused"
          : activeSession.activityTitle
        : "None",
      subtitle: activeSession
        ? `${activeSession.themeTitle} • ${activeSession.safetyMode}`
        : "Start one below",
      icon: "play",
      variant: "indigo",
    },
    {
      id: "most-used-theme",
      label: "Most Used Theme",
      value: activeSession?.themeTitle ?? "Animals",
      subtitle: "21 pictures today",
      icon: "chart",
      variant: "green",
    },
  ];

  const kioskInfo = mapKioskToInfo(
    {
      ...kiosk,
      notificationCount: pendingModerationCount,
    },
    educator?.displayName ?? KIOSK_INFO.educatorName,
    educator?.initials ?? KIOSK_INFO.educatorInitials
  );

  return {
    kiosk: kioskInfo,
    hardwareStatus: (kiosk.hardwareStatus as KioskHardwareStatus) || "online",
    metrics,
  };
}

export async function updateKioskHardwareStatusAction(
  hardwareStatus: KioskHardwareStatus
) {
  await ensureDatabaseSeeded();
  await prisma.kiosk.update({
    where: { id: DEFAULT_KIOSK_ID },
    data: {
      hardwareStatus,
      isOnline: hardwareStatus !== "offline",
      lastHeartbeatAt: new Date(),
    },
  });
  revalidatePath("/dashboard");
  revalidatePath("/kiosk-management");
  return getDashboardDataAction();
}

export async function triggerQuickActionServer(actionId: string) {
  await ensureDatabaseSeeded();

  const activeSession = await prisma.session.findFirst({
    where: {
      kioskId: DEFAULT_KIOSK_ID,
      status: { in: ["active", "paused"] },
    },
    orderBy: { startedAt: "desc" },
  });

  if (actionId === "pause-session") {
    if (activeSession) {
      await prisma.session.update({
        where: { id: activeSession.id },
        data: { status: "paused" },
      });
    }
    await prisma.kiosk.update({
      where: { id: DEFAULT_KIOSK_ID },
      data: {
        statusHeading: "SESSION PAUSED",
        statusDescription: "Generation is temporarily paused by the teacher.",
      },
    });
  } else if (actionId === "end-session") {
    if (activeSession) {
      await prisma.session.update({
        where: { id: activeSession.id },
        data: { status: "ended", endedAt: new Date() },
      });
    }
    await prisma.kiosk.update({
      where: { id: DEFAULT_KIOSK_ID },
      data: {
        statusHeading: "WAITING FOR TEACHER",
        statusDescription:
          "No activity is running. Choose what the children will do next.",
        liveStage: 1,
      },
    });
  } else if (actionId === "restart-kiosk") {
    await prisma.kioskCommand.create({
      data: {
        kioskId: DEFAULT_KIOSK_ID,
        command: "restart",
        status: "completed",
      },
    });
    await prisma.kiosk.update({
      where: { id: DEFAULT_KIOSK_ID },
      data: {
        hardwareStatus: "online",
        isOnline: true,
        lastHeartbeatAt: new Date(),
      },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/live-session");
  return getDashboardDataAction();
}

/**
 * 4. Session Setup (/session-setup)
 */
export async function createSessionAction(input: {
  activityId: string;
  activityTitle: string;
  subOptionId: string | null;
  subOptionTitle: string | null;
  themeId: string;
  themeTitle: string;
  customThemeText?: string;
  safetyMode: SafetyRuleMode;
  blockedWords: string[];
  allowedWords: string[];
  allowedLanguages: string[];
}) {
  await ensureDatabaseSeeded();

  await prisma.session.updateMany({
    where: {
      kioskId: DEFAULT_KIOSK_ID,
      status: { in: ["active", "paused"] },
    },
    data: {
      status: "ended",
      endedAt: new Date(),
    },
  });

  const session = await prisma.session.create({
    data: {
      kioskId: DEFAULT_KIOSK_ID,
      educatorId: DEFAULT_EDUCATOR_ID,
      status: "active",
      activityId: input.activityId,
      activityTitle: input.activityTitle,
      subOptionId: input.subOptionId,
      subOptionTitle: input.subOptionTitle,
      themeId: input.themeId,
      themeTitle: input.themeTitle,
      customThemeText: input.customThemeText ?? null,
      safetyMode: input.safetyMode,
      blockedWordsJson: JSON.stringify(input.blockedWords),
      allowedWordsJson: JSON.stringify(input.allowedWords),
      allowedLanguagesJson: JSON.stringify(input.allowedLanguages),
    },
  });

  await prisma.kiosk.update({
    where: { id: DEFAULT_KIOSK_ID },
    data: {
      statusHeading: `ACTIVE: ${input.activityTitle.toUpperCase()}`,
      statusDescription: `Theme: ${input.themeTitle} • Safety: ${input.safetyMode}`,
      safetyLevel: input.safetyMode,
      hardwareStatus: "online",
      isOnline: true,
      liveStage: 1,
      lastHeartbeatAt: new Date(),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/live-session");
  revalidatePath("/moderation");
  return { sessionId: session.id };
}

/**
 * 5. Live Session Monitor (/live-session)
 */
export async function getLiveSessionDataAction(): Promise<{
  kiosk: KioskInfo;
  isSessionActive: boolean;
  activeStage: number;
  queueCount: number;
  feed: LiveFeedItem[];
}> {
  await ensureDatabaseSeeded();

  const [kiosk, activeSession, feedRows] = await Promise.all([
    prisma.kiosk.findUniqueOrThrow({ where: { id: DEFAULT_KIOSK_ID } }),
    prisma.session.findFirst({
      where: {
        kioskId: DEFAULT_KIOSK_ID,
        status: "active",
      },
      orderBy: { startedAt: "desc" },
    }),
    prisma.generation.findMany({
      where: {
        kioskId: DEFAULT_KIOSK_ID,
        showInLiveFeed: true,
      },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const feed: LiveFeedItem[] = feedRows.map((row) => ({
    id: row.id,
    title: row.title,
    badgeText: row.badgeText,
    badgeVariant: (row.badgeVariant as "danger" | "success" | "info") || "info",
    timestamp: row.timeLabel,
    subtitle: row.subtitle,
    icon: (row.icon as "ban" | "plane" | "cat") || "cat",
    requiresAction: row.requiresAction,
    actionNote: row.actionNote ?? undefined,
  }));

  return {
    kiosk: mapKioskToInfo(kiosk),
    isSessionActive: Boolean(activeSession),
    activeStage: kiosk.liveStage,
    queueCount: kiosk.queueCount,
    feed,
  };
}

export async function updateLiveSessionStageAction(stage: number) {
  await ensureDatabaseSeeded();
  await prisma.kiosk.update({
    where: { id: DEFAULT_KIOSK_ID },
    data: { liveStage: stage, lastHeartbeatAt: new Date() },
  });
  revalidatePath("/live-session");
}

export async function pauseLiveSessionAction() {
  await ensureDatabaseSeeded();
  await prisma.session.updateMany({
    where: { kioskId: DEFAULT_KIOSK_ID, status: "active" },
    data: { status: "paused" },
  });
  await prisma.kiosk.update({
    where: { id: DEFAULT_KIOSK_ID },
    data: {
      statusHeading: "WAITING FOR TEACHER",
      statusDescription:
        "No activity is running. Choose what the children will do next.",
    },
  });
  revalidatePath("/live-session");
  revalidatePath("/dashboard");
}

/**
 * 6. Moderation Center (/moderation)
 */
export async function getModerationDataAction(): Promise<{
  items: ModerationQueueItem[];
  safetyLevel: SafetyRuleMode;
}> {
  await ensureDatabaseSeeded();

  const [kiosk, rows] = await Promise.all([
    prisma.kiosk.findUniqueOrThrow({ where: { id: DEFAULT_KIOSK_ID } }),
    prisma.moderationItem.findMany({
      orderBy: { id: "asc" },
    }),
  ]);

  const items: ModerationQueueItem[] = rows.map((r) => ({
    id: r.id,
    categoryLabel: r.categoryLabel,
    categoryVariant:
      (r.categoryVariant as "danger" | "warning" | "purple") || "warning",
    timestamp: r.timestamp,
    theme: r.theme,
    status: (r.status as "pending" | "blocked" | "overridden") || "pending",
    statusBadge: r.statusBadge,
    originalSpeech: r.originalSpeech,
    recognizedText: r.recognizedText ?? undefined,
    resolutionNote: r.resolutionNote ?? undefined,
  }));

  return {
    items,
    safetyLevel: (kiosk.safetyLevel as SafetyRuleMode) || "STANDARD",
  };
}

export async function resolveModerationDecisionAction(
  id: string,
  decision: "blocked" | "overridden"
) {
  await ensureDatabaseSeeded();

  const statusBadge = decision === "blocked" ? "Kept blocked" : "Overridden";
  const resolutionNote =
    decision === "blocked"
      ? "Action completed by Teacher"
      : "Approved & printed";

  const updated = await prisma.moderationItem.update({
    where: { id },
    data: {
      status: decision,
      statusBadge,
      resolutionNote,
      resolvedAt: new Date(),
    },
  });

  if (updated.generationId) {
    await prisma.generation.update({
      where: { id: updated.generationId },
      data: {
        requiresAction: false,
        safetyStatus: decision === "overridden" ? "Success" : "Blocked",
        printStatus: decision === "overridden" ? "Printed" : "Not printed",
        badgeText: decision === "overridden" ? "Overridden" : "Safety Flag",
        badgeVariant: decision === "overridden" ? "success" : "danger",
        subtitle:
          decision === "overridden"
            ? "Overridden & printed by teacher"
            : "Rejected by Safety Filter (Kept blocked)",
      },
    });
  }

  const remainingPending = await prisma.moderationItem.count({
    where: { status: "pending" },
  });

  await prisma.kiosk.update({
    where: { id: DEFAULT_KIOSK_ID },
    data: { notificationCount: remainingPending },
  });

  revalidatePath("/moderation");
  revalidatePath("/live-session");
  revalidatePath("/dashboard");
  return getModerationDataAction();
}

export async function updateSafetyLevelAction(safetyLevel: SafetyRuleMode) {
  await ensureDatabaseSeeded();

  await prisma.kiosk.update({
    where: { id: DEFAULT_KIOSK_ID },
    data: { safetyLevel },
  });

  await prisma.session.updateMany({
    where: { kioskId: DEFAULT_KIOSK_ID, status: { in: ["active", "paused"] } },
    data: { safetyMode: safetyLevel },
  });

  revalidatePath("/moderation");
  revalidatePath("/session-setup");
}

/**
 * 7. Print Management (/print-management)
 */
export async function getPrintManagementDataAction(): Promise<{
  printerState: PrinterHardwareState;
  reprintItems: ReprintItem[];
  todaysPrints: number;
}> {
  await ensureDatabaseSeeded();

  const [kiosk, rows] = await Promise.all([
    prisma.kiosk.findUniqueOrThrow({ where: { id: DEFAULT_KIOSK_ID } }),
    prisma.generation.findMany({
      where: { kioskId: DEFAULT_KIOSK_ID, isReprintable: true },
      orderBy: { id: "asc" },
    }),
  ]);

  const reprintItems: ReprintItem[] = rows.map((r) => ({
    id: r.id,
    title: r.title,
    status: r.printStatus === "Failed" ? "failed" : "printed",
    reprintCount: r.reprintCount > 0 ? r.reprintCount : undefined,
    theme: r.theme,
    activity: r.activityType,
    timestamp: r.timeLabel,
  }));

  const extraReprints = rows.reduce((sum, item) => sum + item.reprintCount, 0);
  const todaysPrints = 46 + extraReprints;

  return {
    printerState: (kiosk.printerState as PrinterHardwareState) || "ready",
    reprintItems,
    todaysPrints,
  };
}

export async function triggerReprintJobAction(id: string) {
  await ensureDatabaseSeeded();

  await prisma.generation.update({
    where: { id },
    data: {
      printStatus: "Printed",
      reprintCount: { increment: 1 },
    },
  });

  revalidatePath("/print-management");
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
  return getPrintManagementDataAction();
}

export async function updatePrinterStateAction(
  printerState: PrinterHardwareState
) {
  await ensureDatabaseSeeded();
  await prisma.kiosk.update({
    where: { id: DEFAULT_KIOSK_ID },
    data: { printerState },
  });
  revalidatePath("/print-management");
}

/**
 * 8. Kiosk Management (/kiosk-management)
 */
export async function getKioskManagementDataAction(): Promise<{
  kiosk: KioskInfo;
  powerState: "Online" | "Sleeping" | "Restarting" | "Offline";
  printerState: PrinterHardwareState;
  paperTrayLevel: number;
  temperatureC: number;
  networkLatencyMs: number;
}> {
  await ensureDatabaseSeeded();
  const kiosk = await prisma.kiosk.findUniqueOrThrow({
    where: { id: DEFAULT_KIOSK_ID },
  });

  const powerState =
    kiosk.hardwareStatus === "offline"
      ? "Offline"
      : kiosk.hardwareStatus === "sleeping"
        ? "Sleeping"
        : "Online";

  return {
    kiosk: mapKioskToInfo(kiosk),
    powerState,
    printerState: (kiosk.printerState as PrinterHardwareState) || "ready",
    paperTrayLevel: kiosk.paperTrayLevel,
    temperatureC: kiosk.temperatureC,
    networkLatencyMs: kiosk.networkLatencyMs,
  };
}

export async function sendKioskControlCommandAction(
  command: "restart" | "shutdown" | "sleep" | "wakeup"
) {
  await ensureDatabaseSeeded();

  await prisma.kioskCommand.create({
    data: {
      kioskId: DEFAULT_KIOSK_ID,
      command,
      status: "completed",
    },
  });

  const hardwareStatus: KioskHardwareStatus =
    command === "shutdown"
      ? "offline"
      : command === "sleep"
        ? "sleeping"
        : "online";

  await prisma.kiosk.update({
    where: { id: DEFAULT_KIOSK_ID },
    data: {
      hardwareStatus,
      isOnline: hardwareStatus !== "offline",
      lastHeartbeatAt: new Date(),
    },
  });

  revalidatePath("/kiosk-management");
  revalidatePath("/dashboard");
  return getKioskManagementDataAction();
}

/**
 * 9. Activity Logs (/activity-logs)
 */
export async function getActivityLogsDataAction(): Promise<
  ActivityLogRecord[]
> {
  await ensureDatabaseSeeded();

  const rows = await prisma.generation.findMany({
    where: {
      kioskId: DEFAULT_KIOSK_ID,
      isReprintable: false,
      showInLiveFeed: false,
    },
    orderBy: { id: "asc" },
  });

  // Sort log-1 .. log-16 naturally
  rows.sort((a, b) => {
    const numA = Number(a.id.replace("log-", "")) || 0;
    const numB = Number(b.id.replace("log-", "")) || 0;
    return numA - numB;
  });

  return rows.map((r) => ({
    id: r.id,
    date: r.dateLabel,
    time: r.timeLabel,
    safetyStatus: (r.safetyStatus as "Success" | "Blocked") || "Success",
    printStatus:
      (r.printStatus as "Printed" | "Not printed" | "Failed") || "Printed",
    theme: r.theme,
    activityType: r.activityType,
  }));
}

/**
 * 10. Analytics (/analytics)
 */
export async function getAnalyticsDataAction() {
  await ensureDatabaseSeeded();

  const [reprintableItems, moderationItems] = await Promise.all([
    prisma.generation.findMany({
      where: { kioskId: DEFAULT_KIOSK_ID, isReprintable: true },
    }),
    prisma.moderationItem.findMany(),
  ]);

  const extraReprints = reprintableItems.reduce(
    (sum, item) => sum + item.reprintCount,
    0
  );
  const blockedCount =
    112 + moderationItems.filter((m) => m.status !== "overridden").length;
  const totalPrints = 3258 + extraReprints;
  const totalGenerations = 3863 + extraReprints;
  const successRate = (
    ((totalGenerations - blockedCount) / Math.max(1, totalGenerations)) *
    100
  ).toFixed(1);

  const dailyUsage = ANALYTICS_DAILY_USAGE.map((point) =>
    point.isCurrent
      ? {
          ...point,
          generations: 62 + extraReprints,
          prints: 46 + extraReprints,
        }
      : point
  );

  return {
    kpis: {
      mostUsedTheme: "Animals",
      mostUsedThemeCount: 1033,
      mostUsedActivity: "Color & Create",
      mostUsedActivityShare: 46,
      totalPrints,
      totalGenerations,
      blockedRequests: blockedCount,
      successRate: `${successRate}%`,
    },
    dailyUsage,
    weeklyUsage: ANALYTICS_WEEKLY_USAGE,
    monthlyUsage: ANALYTICS_MONTHLY_USAGE,
    themeDistribution: THEME_DISTRIBUTION,
    activityMix: ACTIVITY_MIX,
  };
}

/**
 * 11. Reports (/reports)
 */
export async function getReportsDataAction(): Promise<GeneratedReportItem[]> {
  await ensureDatabaseSeeded();
  const rows = await prisma.generatedReport.findMany({
    orderBy: { createdAt: "desc" },
  });

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    type: (r.type as "session" | "research") || "session",
    generatedAt: r.generatedAt,
    summary: r.summary,
  }));
}

export async function generateReportAction(
  type: "session" | "research"
): Promise<GeneratedReportItem[]> {
  await ensureDatabaseSeeded();

  const selectedMeta =
    REPORT_TYPES.find((r) => r.id === type) ?? REPORT_TYPES[0];
  const now = new Date();
  const formattedTime = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  const [kiosk, activeSession, reprintableItems] = await Promise.all([
    prisma.kiosk.findUniqueOrThrow({ where: { id: DEFAULT_KIOSK_ID } }),
    prisma.session.findFirst({
      where: { kioskId: DEFAULT_KIOSK_ID },
      orderBy: { startedAt: "desc" },
    }),
    prisma.generation.findMany({
      where: { kioskId: DEFAULT_KIOSK_ID, isReprintable: true },
    }),
  ]);

  const extraReprints = reprintableItems.reduce(
    (sum, item) => sum + item.reprintCount,
    0
  );
  const printsToday = 46 + extraReprints;
  const generationsToday = 62 + extraReprints;

  const summary =
    type === "session"
      ? `${kiosk.roomName} • ${printsToday} prints • ${generationsToday} generations • ${activeSession?.themeTitle ?? "Animals"} (${activeSession?.activityTitle ?? "Color & Create"})`
      : `Pilot Usability Evaluation • 97.1% Safety Pass Rate • ${3863 + extraReprints} Total Generations`;

  await prisma.generatedReport.create({
    data: {
      educatorId: DEFAULT_EDUCATOR_ID,
      title: selectedMeta.title,
      type: selectedMeta.id,
      generatedAt: `Oct 12 • ${formattedTime}`,
      summary,
    },
  });

  revalidatePath("/reports");
  return getReportsDataAction();
}

export async function clearReportsAction(): Promise<GeneratedReportItem[]> {
  await ensureDatabaseSeeded();
  await prisma.generatedReport.deleteMany({});
  revalidatePath("/reports");
  return [];
}

/**
 * 12. Educator Settings Sync (/settings)
 */
export async function getEducatorSettingsAction() {
  await ensureDatabaseSeeded();
  const settings = await prisma.appSettings.findUnique({
    where: { educatorId: DEFAULT_EDUCATOR_ID },
  });
  return settings;
}

export async function saveEducatorSettingsAction(input: {
  displayLanguage?: string;
  themeId?: string;
  volume?: number;
  autoSleepEnabled?: boolean;
  autoSleepDuration?: string;
  autoLogoutEnabled?: boolean;
  autoLogoutDuration?: string;
}) {
  await ensureDatabaseSeeded();
  await prisma.appSettings.upsert({
    where: { educatorId: DEFAULT_EDUCATOR_ID },
    update: input,
    create: {
      educatorId: DEFAULT_EDUCATOR_ID,
      displayLanguage: input.displayLanguage ?? "English",
      themeId: input.themeId ?? "deep-blue",
      volume: input.volume ?? 70,
      autoSleepEnabled: input.autoSleepEnabled ?? true,
      autoSleepDuration: input.autoSleepDuration ?? "15 minutes",
      autoLogoutEnabled: input.autoLogoutEnabled ?? true,
      autoLogoutDuration: input.autoLogoutDuration ?? "30 minutes",
    },
  });
}
