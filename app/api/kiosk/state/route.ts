import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_KIOSK_ID, ensureDatabaseSeeded } from "@/lib/db-seed";

export async function GET() {
  await connection();
  await ensureDatabaseSeeded();

  const [kiosk, activeSession, feed] = await Promise.all([
    prisma.kiosk.findUniqueOrThrow({ where: { id: DEFAULT_KIOSK_ID } }),
    prisma.session.findFirst({
      where: { kioskId: DEFAULT_KIOSK_ID, status: { in: ["active", "paused"] } },
      orderBy: { startedAt: "desc" },
    }),
    prisma.generation.findMany({
      where: { kioskId: DEFAULT_KIOSK_ID, showInLiveFeed: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return Response.json({
    kiosk,
    activeSession: activeSession
      ? {
          ...activeSession,
          blockedWords: JSON.parse(activeSession.blockedWordsJson || "[]"),
          allowedWords: JSON.parse(activeSession.allowedWordsJson || "[]"),
          allowedLanguages: JSON.parse(
            activeSession.allowedLanguagesJson || '["English","Filipino"]'
          ),
        }
      : null,
    feed,
  });
}

export async function POST(request: Request) {
  await ensureDatabaseSeeded();
  const body = (await request.json()) as {
    liveStage?: number;
    queueCount?: number;
    hardwareStatus?: string;
    printerState?: string;
    paperTrayLevel?: number;
    temperatureC?: number;
  };

  const kiosk = await prisma.kiosk.update({
    where: { id: DEFAULT_KIOSK_ID },
    data: {
      ...(typeof body.liveStage === "number" ? { liveStage: body.liveStage } : {}),
      ...(typeof body.queueCount === "number"
        ? { queueCount: body.queueCount }
        : {}),
      ...(typeof body.hardwareStatus === "string"
        ? {
            hardwareStatus: body.hardwareStatus,
            isOnline: body.hardwareStatus !== "offline",
          }
        : {}),
      ...(typeof body.printerState === "string"
        ? { printerState: body.printerState }
        : {}),
      ...(typeof body.paperTrayLevel === "number"
        ? { paperTrayLevel: body.paperTrayLevel }
        : {}),
      ...(typeof body.temperatureC === "number"
        ? { temperatureC: body.temperatureC }
        : {}),
      lastHeartbeatAt: new Date(),
    },
  });

  return Response.json({ ok: true, kiosk });
}
