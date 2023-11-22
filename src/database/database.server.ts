import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { remember } from "@epic-web/remember";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing environment variable: DATABASE_URL");
}

export const db = remember("db", () =>
  drizzle(new Pool({ connectionString: process.env.DATABASE_URL })),
);
