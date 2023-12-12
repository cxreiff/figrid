import { int, serial, text, timestamp, varchar } from "drizzle-orm/mysql-core"
import { z } from "zod"

export const incrementing_id = {
    id: serial("id").primaryKey().unique().autoincrement(),
}

export const create_update_timestamps = {
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull().onUpdateNow(),
}

export const user_grid_ids = {
    user_id: int("user_id").notNull(),
    grid_id: int("grid_id").notNull(),
}

export const name_summary_description = {
    name: varchar("name", { length: 256 }).notNull(),
    summary: text("summary"),
    description: text("description"),
    image_url: varchar("image_url", { length: 2083 }),
}

export const fixer = {
    created_at: z.string().or(z.date()),
    updated_at: z.string().or(z.date()),
}
