import { int, serial, text, timestamp, varchar } from "drizzle-orm/mysql-core"

export const incrementing_id = {
    id: serial("id").primaryKey().autoincrement(),
}

export const create_update_timestamps = {
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull().onUpdateNow(),
}

export const user_grid_ids = {
    user_id: int("user_id").notNull(),
    grid_id: int("grid_id").notNull(),
}

export const grid_resource_fields = {
    ...incrementing_id,
    ...create_update_timestamps,
    ...user_grid_ids,
}

export const name_summary_description = {
    name: varchar("name", { length: 256 }).notNull(),
    summary: text("summary"),
    description: text("description"),
}

export const can_have_image = {
    image_asset_id: int("image_asset_id"),
}
