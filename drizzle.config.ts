import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing environment variable: DATABASE_PATH");
}

export default {
  schema: "./src/database/schema.server.ts",
  out: "./drizzle/migrations",
  driver: "mysql2",
  dbCredentials: {
    uri: process.env.DATABASE_URL,
  },
} satisfies Config;
