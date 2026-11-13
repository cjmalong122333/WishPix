export const SESSION_COOKIE_NAME = "wishpix_session";

export interface SessionTokenPayload {
  sessionId: string;
  educatorId: string;
  expiresAtMs: number;
}

function getSecretKeyBytes(): Uint8Array {
  const secret =
    process.env.SESSION_SECRET ||
    "wishpix_educator_hmac_secret_key_v1_9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c";
  return new TextEncoder().encode(secret);
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array | null {
  try {
    const padded = str.replace(/-/g, "+").replace(/_/g, "/");
    const padLen = (4 - (padded.length % 4)) % 4;
    const base64 = padded + "=".repeat(padLen);
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

async function getCryptoKey(): Promise<CryptoKey> {
  const keyBytes = getSecretKeyBytes();
  return crypto.subtle.importKey(
    "raw",
    keyBytes.buffer as ArrayBuffer,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signSessionToken(
  payload: SessionTokenPayload
): Promise<string> {
  const rawPayload = JSON.stringify(payload);
  const payloadB64 = toBase64Url(new TextEncoder().encode(rawPayload));
  const key = await getCryptoKey();
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadB64)
  );
  const sigB64 = toBase64Url(new Uint8Array(signatureBuffer));
  return `${payloadB64}.${sigB64}`;
}

export async function verifySessionToken(
  token: string | undefined | null
): Promise<SessionTokenPayload | null> {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, sigB64] = parts;
  const sigBytes = fromBase64Url(sigB64);
  const payloadBytes = fromBase64Url(payloadB64);
  if (!sigBytes || !payloadBytes) return null;

  try {
    const key = await getCryptoKey();
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes.buffer as ArrayBuffer,
      new TextEncoder().encode(payloadB64)
    );
    if (!isValid) return null;

    const decoded = JSON.parse(
      new TextDecoder().decode(payloadBytes)
    ) as Partial<SessionTokenPayload>;

    if (
      typeof decoded.sessionId !== "string" ||
      typeof decoded.educatorId !== "string" ||
      typeof decoded.expiresAtMs !== "number"
    ) {
      return null;
    }

    if (Date.now() >= decoded.expiresAtMs) {
      return null;
    }

    return {
      sessionId: decoded.sessionId,
      educatorId: decoded.educatorId,
      expiresAtMs: decoded.expiresAtMs,
    };
  } catch {
    return null;
  }
}
