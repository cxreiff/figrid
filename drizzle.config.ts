import type { Config } from "drizzle-kit"

if (!process.env.DATABASE_URL) {
    throw new Error("Missing environment variable: DATABASE_URL")
}

if (!process.env.DATABASE_TOKEN) {
    throw new Error("Missing environment variable: DATABASE_TOKEN")
}

export default {
    schema: "./src/database/schema/*",
    driver: "turso",
    dialect: "sqlite",
    dbCredentials: {
        url: process.env.DATABASE_URL,
        authToken: process.env.DATABASE_TOKEN,
    },
} satisfies Config
