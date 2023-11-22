import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { remember } from "@epic-web/remember";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing environment variable: DATABASE_PATH");
}

export const db = remember("db", () =>
  drizzle(postgres(process.env.DATABASE_URL)),
);
