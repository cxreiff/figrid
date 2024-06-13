import { sql } from "drizzle-orm"
import { integer, text } from "drizzle-orm/sqlite-core"

const timestamp = sql`(current_timestamp)`

export const incrementing_id = {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
}

export const create_update_timestamps = {
    created_at: text("created_at").notNull().default(timestamp),
    updated_at: integer("updated_at")
        .notNull()
        .default(timestamp)
        .$onUpdate(() => timestamp),
}

export const user_grid_ids = {
    user_id: integer("user_id").notNull(),
    grid_id: integer("grid_id").notNull(),
}

export const grid_resource_fields = {
    ...incrementing_id,
    ...create_update_timestamps,
    ...user_grid_ids,
}

export const name_summary_description = {
    name: text("name", { length: 256 }).notNull(),
    summary: text("summary"),
    description: text("description"),
}

export const can_have_image = {
    image_asset_id: integer("image_asset_id"),
}
