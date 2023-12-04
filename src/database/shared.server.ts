import { serial, timestamp } from "drizzle-orm/mysql-core"
import { z } from "zod"

export const incrementing_id = {
    id: serial("id").primaryKey().unique().autoincrement(),
}

export const create_update_timestamps = {
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull().onUpdateNow(),
}

export const fixer = {
    created_at: z.string().or(z.date()),
    updated_at: z.string().or(z.date()),
}
