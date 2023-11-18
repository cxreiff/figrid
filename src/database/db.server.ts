import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import { remember } from "@epic-web/remember";
import * as schema from "./schema.server";
// import { migrate } from "drizzle-orm/planetscale-serverless/migrator";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing environment variable: DATABASE_PATH");
}

export const db = remember("db", () =>
  drizzle(
    connect({
      url: process.env.DATABASE_URL,
    }),
    { schema },
  ),
);

// void migrate(db, { migrationsFolder: "drizzle/migrations" });
