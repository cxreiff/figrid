import { relations } from "drizzle-orm"
import {
    index,
    int,
    mysqlEnum,
    mysqlTable,
    text,
    varchar,
} from "drizzle-orm/mysql-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import type { z } from "zod"
import { users } from "~/database/schema/auth.server.ts"
import {
    create_update_timestamps,
    fixer,
    incrementing_id,
} from "~/database/shared.server.ts"

export const grids = mysqlTable("grids", {
    ...incrementing_id,
    ...create_update_timestamps,

    name: text("name").notNull(),
    description: text("description"),

    first_id: int("first_tile").notNull(),
    user_id: int("user_id").notNull(),
})

export const grids_relations = relations(grids, ({ one, many }) => ({
    user: one(users, {
        fields: [grids.user_id],
        references: [users.id],
    }),
    first: one(tiles, {
        fields: [grids.first_id],
        references: [tiles.id],
    }),
    tiles: many(tiles),
    items: many(items),
}))

export const grids_select_schema = createSelectSchema(grids, fixer)
export const grids_insert_schema = createInsertSchema(grids, fixer)
export type GridsSelectModel = z.infer<typeof grids_select_schema>
export type GridsInsertModel = z.infer<typeof grids_insert_schema>

export const tiles = mysqlTable(
    "tiles",
    {
        ...incrementing_id,
        ...create_update_timestamps,

        name: text("name").notNull(),
        summary: text("summary"),
        description: text("description"),

        north_id: int("north_id"),
        east_id: int("east_id"),
        south_id: int("south_id"),
        west_id: int("west_id"),
        up_id: int("up_id"),
        down_id: int("down_id"),

        image_url: varchar("image_url", { length: 2083 }),

        user_id: int("user_id").notNull(),
        grid_id: int("grid_id").notNull(),
    },
    (t) => ({
        grid_id: index("grid_id").on(t.grid_id),
    }),
)

export const tiles_relations = relations(tiles, ({ one, many }) => ({
    user: one(users, {
        fields: [tiles.user_id],
        references: [users.id],
    }),
    grid: one(grids, {
        fields: [tiles.grid_id],
        references: [grids.id],
    }),
    north: one(tiles, {
        fields: [tiles.north_id],
        references: [tiles.id],
    }),
    east: one(tiles, {
        fields: [tiles.east_id],
        references: [tiles.id],
    }),
    south: one(tiles, {
        fields: [tiles.south_id],
        references: [tiles.id],
    }),
    west: one(tiles, {
        fields: [tiles.west_id],
        references: [tiles.id],
    }),
    items: many(items),
}))

export const tiles_select_schema = createSelectSchema(tiles, fixer)
export const tiles_insert_schema = createInsertSchema(tiles, fixer)
export type TilesSelectModel = z.infer<typeof tiles_select_schema>
export type TilesInsertModel = z.infer<typeof tiles_insert_schema>

export const items = mysqlTable("items", {
    ...incrementing_id,
    ...create_update_timestamps,

    type: mysqlEnum("type", ["key", "pass"]),
    name: text("name").notNull(),
    summary: text("summary"),
    description: text("description"),

    user_id: int("user_id").notNull(),
    grid_id: int("grid_id").notNull(),
    tile_id: int("tile_id").notNull(),
})

export const items_relations = relations(items, ({ one }) => ({
    user: one(users, {
        fields: [items.user_id],
        references: [users.id],
    }),
    grid: one(grids, {
        fields: [items.user_id],
        references: [grids.id],
    }),
    tile: one(tiles, {
        fields: [items.user_id],
        references: [tiles.id],
    }),
}))

export const items_select_schema = createSelectSchema(items, fixer)
export const items_insert_schema = createInsertSchema(items, fixer)
export type ItemsSelectModel = z.infer<typeof items_select_schema>
export type ItemsInsertModel = z.infer<typeof items_insert_schema>
