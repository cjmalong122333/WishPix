import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  SESSION_COOKIE_NAME,
  signSessionToken,
  verifySessionToken,
} from "@/lib/session-crypto";

const SCRYPT_PREFIX = "scrypt$";
const SCRYPT_KEYLEN = 64;

const SHIFT_SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours
const REMEMBER_ME_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const MAX_FAILED_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

let authTablesEnsured = false;

/**
 * Ensures the SQLite database has the Educator security columns and EducatorSession table,
 * even if the running Node process initialized PrismaClient before the schema change.
 */
export async function ensureAuthSchemaReady(): Promise<void> {
  if (authTablesEnsured) return;
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "EducatorSession" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "tokenHash" TEXT NOT NULL,
        "educatorId" TEXT NOT NULL,
        "rememberMe" BOOLEAN NOT NULL DEFAULT false,
        "expiresAt" DATETIME NOT NULL,
        "lastActiveAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "EducatorSession_educatorId_fkey" FOREIGN KEY ("educatorId") REFERENCES "Educator" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "EducatorSession_tokenHash_key" ON "EducatorSession"("tokenHash");
    `);
  } catch {
    // Table/index already exists
  }

  const alterStatements = [
    `ALTER TABLE "Educator" ADD COLUMN "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0;`,
    `ALTER TABLE "Educator" ADD COLUMN "lockedUntil" DATETIME;`,
    `ALTER TABLE "Educator" ADD COLUMN "lastLoginAt" DATETIME;`,
  ];
  for (const stmt of alterStatements) {
    try {
      await prisma.$executeRawUnsafe(stmt);
    } catch {
      // Column already exists
    }
  }

  authTablesEnsured = true;
}

/**
 * Generates a salted scrypt hash in the format: scrypt$<saltHex>$<derivedKeyHex>
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  return `${SCRYPT_PREFIX}${salt}$${derivedKey}`;
}

export function isHashedPassword(storedPassword: string): boolean {
  return storedPassword.startsWith(SCRYPT_PREFIX);
}

/**
 * Timing-safe password verification supporting both scrypt hashes and
 * automatic one-time migration from legacy plaintext seeded passwords.
 */
export function verifyPassword(
  passwordInput: string,
  storedPassword: string
): { valid: boolean; needsRehash: boolean } {
  if (isHashedPassword(storedPassword)) {
    const parts = storedPassword.split("$");
    if (parts.length !== 3) {
      return { valid: false, needsRehash: false };
    }
    const [, salt, storedHex] = parts;
    try {
      const derivedBuffer = scryptSync(passwordInput, salt, SCRYPT_KEYLEN);
      const storedBuffer = Buffer.from(storedHex, "hex");
      if (derivedBuffer.length !== storedBuffer.length) {
        return { valid: false, needsRehash: false };
      }
      const valid = timingSafeEqual(derivedBuffer, storedBuffer);
      return { valid, needsRehash: false };
    } catch {
      return { valid: false, needsRehash: false };
    }
  }

  // Legacy plaintext fallback with timing-safe comparison & automatic rehash upgrade
  const inputHash = createHash("sha256").update(passwordInput).digest();
  const storedHash = createHash("sha256").update(storedPassword).digest();
  const valid = timingSafeEqual(inputHash, storedHash);
  return { valid, needsRehash: valid };
}

/**
 * Performs a dummy scrypt computation when a username does not exist
 * to prevent timing-based username enumeration attacks.
 */
export function performDummyPasswordCheck(passwordInput: string): void {
  const dummySalt = "0123456789abcdef0123456789abcdef";
  scryptSync(passwordInput, dummySalt, SCRYPT_KEYLEN);
}

export function validatePasswordStrength(password: string): {
  valid: boolean;
  errorEn?: string;
  errorFil?: string;
} {
  if (password.length < 8) {
    return {
      valid: false,
      errorEn: "Password must be at least 8 characters long.",
      errorFil: "Ang password ay dapat hindi bababa sa 8 karakter.",
    };
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return {
      valid: false,
      errorEn: "Password must include at least one letter and one number.",
      errorFil: "Ang password ay dapat may kahit isang titik at isang numero.",
    };
  }
  return { valid: true };
}

function hashSessionId(sessionId: string): string {
  return createHash("sha256").update(sessionId).digest("hex");
}

/**
 * Creates a database-backed EducatorSession using raw parameterized SQL
 * (compatible even with pre-existing PrismaClient instances in dev) and sets the signed HttpOnly cookie.
 */
export async function createEducatorSession(
  educatorId: string,
  rememberMe = false
): Promise<{ expiresAt: Date }> {
  await ensureAuthSchemaReady();

  const durationMs = rememberMe
    ? REMEMBER_ME_DURATION_MS
    : SHIFT_SESSION_DURATION_MS;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + durationMs);
  const rawTokenId = randomBytes(24).toString("hex");
  const tokenHash = hashSessionId(rawTokenId);
  const sessionRowId = `sess_${randomBytes(12).toString("hex")}`;

  // Clean up expired sessions for this educator
  await prisma
    .$executeRaw`DELETE FROM "EducatorSession" WHERE "educatorId" = ${educatorId} AND "expiresAt" < ${now.toISOString()}`
    .catch(() => {});

  await prisma.$executeRaw`
    INSERT INTO "EducatorSession" ("id", "tokenHash", "educatorId", "rememberMe", "expiresAt", "lastActiveAt", "createdAt")
    VALUES (${sessionRowId}, ${tokenHash}, ${educatorId}, ${rememberMe ? 1 : 0}, ${expiresAt.toISOString()}, ${now.toISOString()}, ${now.toISOString()})
  `;

  const signedToken = await signSessionToken({
    sessionId: rawTokenId,
    educatorId,
    expiresAtMs: expiresAt.getTime(),
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return { expiresAt };
}

interface RawSessionJoinRow {
  sessionId: string;
  rememberMe: number | boolean;
  expiresAt: string | number | Date;
  educatorId: string;
  username: string;
  displayName: string;
  initials: string;
}

/**
 * Verifies the active educator session against both the HMAC signature and SQLite database.
 */
export async function verifyEducatorSession(): Promise<{
  educator: {
    id: string;
    username: string;
    displayName: string;
    initials: string;
  };
  sessionId: string;
  rememberMe: boolean;
} | null> {
  try {
    await ensureAuthSchemaReady();

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const payload = await verifySessionToken(token);
    if (!payload) return null;

    const tokenHash = hashSessionId(payload.sessionId);
    const rows = await prisma.$queryRaw<RawSessionJoinRow[]>`
      SELECT
        s."id" as "sessionId",
        s."rememberMe" as "rememberMe",
        s."expiresAt" as "expiresAt",
        e."id" as "educatorId",
        e."username" as "username",
        e."displayName" as "displayName",
        e."initials" as "initials"
      FROM "EducatorSession" s
      INNER JOIN "Educator" e ON e."id" = s."educatorId"
      WHERE s."tokenHash" = ${tokenHash}
      LIMIT 1
    `;

    const row = rows[0];
    if (!row) return null;

    const expiresMs = new Date(row.expiresAt).getTime();
    if (Number.isNaN(expiresMs) || expiresMs <= Date.now()) {
      return null;
    }

    return {
      educator: {
        id: row.educatorId,
        username: row.username,
        displayName: row.displayName,
        initials: row.initials,
      },
      sessionId: row.sessionId,
      rememberMe: Boolean(row.rememberMe),
    };
  } catch {
    return null;
  }
}

/**
 * Deletes the current session from SQLite and clears the HttpOnly cookie.
 */
export async function destroyEducatorSession(): Promise<void> {
  try {
    await ensureAuthSchemaReady();

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const payload = await verifySessionToken(token);

    if (payload) {
      const tokenHash = hashSessionId(payload.sessionId);
      await prisma
        .$executeRaw`DELETE FROM "EducatorSession" WHERE "tokenHash" = ${tokenHash}`
        .catch(() => {});
    }

    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch {
    // Ignore cookie errors outside request context
  }
}
