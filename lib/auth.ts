import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { getDb, requireDb } from "./db";

const SESSION_COOKIE = "powerlens_session";
const SESSION_DAYS = 14;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function authenticateOwner(email: string, password: string) {
  const db = getDb();
  if (!db) return null;
  const rows = (await db`SELECT id, email, password_hash FROM owner_users WHERE email = ${email.toLowerCase()} LIMIT 1`) as unknown as Array<{ id: string; email: string; password_hash: string }>;
  const owner = rows[0] as { id: string; email: string; password_hash: string } | undefined;
  if (!owner || !(await bcrypt.compare(password, owner.password_hash))) return null;
  return owner;
}

export async function createSession(userId: string) {
  const db = requireDb();
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db`INSERT INTO owner_sessions (user_id, token_hash, expires_at) VALUES (${userId}, ${tokenHash}, ${expiresAt.toISOString()})`;
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function getOwnerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const db = getDb();
  if (!db) return null;
  const tokenHash = hashToken(token);
  const rows = (await db`
    SELECT owner_users.id, owner_users.email
    FROM owner_sessions
    JOIN owner_users ON owner_users.id = owner_sessions.user_id
    WHERE owner_sessions.token_hash = ${tokenHash} AND owner_sessions.expires_at > NOW()
    LIMIT 1
  `) as unknown as Array<{ id: string; email: string }>;
  return (rows[0] as { id: string; email: string } | undefined) || null;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const db = getDb();
  if (token && db) await db`DELETE FROM owner_sessions WHERE token_hash = ${hashToken(token)}`;
  cookieStore.delete(SESSION_COOKIE);
}

export async function requireOwner() {
  const owner = await getOwnerSession();
  if (!owner) throw new Error("UNAUTHORIZED");
  return owner;
}
