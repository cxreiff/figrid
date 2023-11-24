import type { Config } from "drizzle-kit"

if (!process.env.DATABASE_URL) {
  throw new Error("Missing environment variable: DATABASE_PATH")
}

export default {
  schema: "./src/database/schema.server.ts",
  out: "./drizzle/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
} satisfies Config
