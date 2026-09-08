import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

config({ path: ".env.local" });
config();

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
const email = (process.env.OWNER_EMAIL || "").trim().toLowerCase();
if (!email) throw new Error("OWNER_EMAIL is required");
const readline = createInterface({ input, output });
const password = await readline.question(`Create password for ${email}: `, { mask: "*" });
readline.close();
if (password.length < 12) throw new Error("Owner password must be at least 12 characters");
const passwordHash = await bcrypt.hash(password, 12);
const sql = neon(process.env.DATABASE_URL);
await sql`INSERT INTO owner_users (email, password_hash) VALUES (${email}, ${passwordHash}) ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`;
console.log(`Owner account ready for ${email}`);