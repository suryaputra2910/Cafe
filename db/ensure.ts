import { getDb } from "./index";
import { sql } from "drizzle-orm";
let ensured = false;
/**
 * Creates every table if it does not already exist.
 * Safe to call repeatedly - it only actually runs once per process.
 */
export async function ensureSchema(): Promise<boolean> {
  if (ensured) return true;
  if (!process.env.DATABASE_URL) return false;
  try {
    const db = await getDb();
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" serial PRIMARY KEY,
        "name" text NOT NULL,
        "email" text NOT NULL UNIQUE,
        "password" text NOT NULL,
        "phone" text,
        "role" text NOT NULL DEFAULT 'customer',
        "created_at" timestamp NOT NULL DEFAULT now()
      );
    `);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "tables" (
        "id" serial PRIMARY KEY,
        "number" text NOT NULL UNIQUE,
        "capacity" integer NOT NULL,
        "location" text NOT NULL DEFAULT 'Indoor',
        "status" text NOT NULL DEFAULT 'available',
        "description" text
      );
    `);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "bookings" (
        "id" serial PRIMARY KEY,
        "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "table_id" integer NOT NULL REFERENCES "tables"("id") ON DELETE CASCADE,
        "booking_code" text NOT NULL UNIQUE,
        "date" text NOT NULL,
        "time" text NOT NULL,
        "guests" integer NOT NULL,
        "status" text NOT NULL DEFAULT 'pending',
        "preorder_items" text,
        "notes" text,
        "created_at" timestamp NOT NULL DEFAULT now()
      );
    `);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "menu_items" (
        "id" serial PRIMARY KEY,
        "name" text NOT NULL,
        "category" text NOT NULL,
        "price" integer NOT NULL,
        "image" text,
        "description" text,
        "is_available" boolean NOT NULL DEFAULT true
      );
    `);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "settings" (
        "id" serial PRIMARY KEY,
        "key" text NOT NULL UNIQUE,
        "value" text NOT NULL
      );
    `);
    ensured = true;
    return true;
  } catch (error) {
    console.warn("[db] ensureSchema notice: local database not reachable.");
    return false;
  }
}
/**
 * Runs a database query but never throws.
 * Returns `fallback` when the DB is unreachable or DATABASE_URL is missing.
 */
export async function safeQuery<T>(
  run: () => Promise<T>,
  fallback: T
): Promise<T> {
  if (!process.env.DATABASE_URL) {
    return fallback;
  }
  try {
    return await run();
  } catch {
    // Schema might not exist yet - try to create it once, then retry.
    const ok = await ensureSchema();
    if (!ok) return fallback;
    try {
      return await run();
    } catch {
      console.warn("[db] query notice: local database query bypassed.");
      return fallback;
    }
  }
}
