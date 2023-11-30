import { serial, timestamp } from "drizzle-orm/mysql-core"

export const incrementing_id = {
    id: serial("id").primaryKey().unique().autoincrement(),
}

export const create_update_timestamps = {
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull().onUpdateNow(),
}
