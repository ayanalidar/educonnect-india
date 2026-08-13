import * as crypto from "crypto";

const AUTH_SECRET = process.env.AUTH_SECRET || "educonnect-dev-secret";
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

/** Timing-safe string comparison to prevent timing attacks */
function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Password hashing — uses scrypt (Node.js built-in PBKDF)
 * with a per-user salt. Resistant to rainbow tables.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  // Support legacy HMAC hashes (for backward compat with seeded data)
  if (!stored.includes(":")) {
    const legacyHash = crypto.createHmac("sha256", AUTH_SECRET).update(password).digest("hex");
    return safeCompare(legacyHash, stored);
  }
  const [salt, hash] = stored.split(":");
  const verifyHash = crypto.scryptSync(password, salt, 64).toString("hex");
  return safeCompare(hash, verifyHash);
}

/** Create a signed token with 24h expiry */
export function makeToken(userId: string): string {
  const payload = { sub: userId, iat: Date.now(), exp: Date.now() + TOKEN_EXPIRY_MS };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", AUTH_SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

/** Verify token signature + check expiry. Returns null if invalid or expired. */
export function verifyToken(token: string): { sub: string; iat: number; exp: number } | null {
  try {
    const [body, sig] = token.split(".");
    if (!body || !sig) return null;
    const expected = crypto.createHmac("sha256", AUTH_SECRET).update(body).digest("base64url");
    if (!safeCompare(sig, expected)) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (typeof payload.sub !== "string") return null;
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: Request): string | null {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export async function getUserFromRequest(req: Request) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  if (payload.sub.startsWith("PARENT:")) return null;
  const { db } = await import("@/lib/db");
  const user = await db.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      branch: true,
      phone: true,
      avatarColor: true,
    },
  });
  return user;
}

/** Simple in-memory rate limiter (per IP) */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string, maxRequests: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  entry.count++;
  return entry.count <= maxRequests;
}

export function getClientIP(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}
