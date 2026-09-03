import { Pool } from "pg";

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function closeDb(): Promise<void> {
  await db.end();
}
