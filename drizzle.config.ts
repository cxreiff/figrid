import type { Config } from "drizzle-kit"

if (!process.env.DATABASE_URL) {
    throw new Error("Missing environment variable: DATABASE_URL")
}

export default {
    schema: "./src/database/schema/*",
    driver: "mysql2",
    dbCredentials: {
        uri: process.env.DATABASE_URL,
    },
} satisfies Config
