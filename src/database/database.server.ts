import { remember } from "@epic-web/remember";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing environment variable: DATABASE_URL");
}

export const db = remember("db", () =>
  drizzle(postgres(process.env.DATABASE_URL)),
);
