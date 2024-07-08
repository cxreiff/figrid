import { defineConfig } from "drizzle-kit"

if (!process.env.DATABASE_URL) {
    throw new Error("Missing environment variable: DATABASE_URL")
}

if (!process.env.DATABASE_TOKEN) {
    throw new Error("Missing environment variable: DATABASE_TOKEN")
}

export default defineConfig({
    driver: "turso",
    dialect: "sqlite",
    schema: "./src/database/schema/*",
    out: "./drizzle",
    dbCredentials: {
        url: process.env.DATABASE_URL,
        authToken: process.env.DATABASE_TOKEN,
    },
})
