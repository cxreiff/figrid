import { remember } from "@epic-web/remember"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

if (!process.env.POSTGRES_URL) {
  throw new Error("Missing environment variable: POSTGRES_URL")
}

export const db = remember("db", () =>
  drizzle(postgres(process.env.POSTGRES_URL)),
)
