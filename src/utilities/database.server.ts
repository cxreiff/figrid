import { remember } from "@epic-web/remember"
import { drizzle } from "drizzle-orm/planetscale-serverless"
import { connect } from "@planetscale/database"

export const db = remember("db", () =>
  drizzle(connect({ url: process.env.DATABASE_URL })),
)
