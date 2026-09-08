import { neon } from "@neondatabase/serverless";

let sqlClient: ReturnType<typeof neon> | null = null;

export function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;
  sqlClient ??= neon(connectionString);
  return sqlClient;
}

export function requireDb() {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not configured");
  return db;
}
