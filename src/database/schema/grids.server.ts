import { relations } from "drizzle-orm"
import { index, int, mysqlTable, text } from "drizzle-orm/mysql-core"
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

        name: text("name"),
        description: text("description"),

        north_id: int("north_id"),
        east_id: int("east_id"),
        south_id: int("south_id"),
        west_id: int("west_id"),

        grid_id: int("grid_id").notNull(),
        user_id: int("user_id").notNull(),
    },
    (t) => ({
        grid_id: index("grid_id").on(t.grid_id),
    }),
)

export const tiles_relations = relations(tiles, ({ one }) => ({
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
}))

export const tiles_select_schema = createSelectSchema(tiles, fixer)
export const tiles_insert_schema = createInsertSchema(tiles, fixer)
export type TilesSelectModel = z.infer<typeof tiles_select_schema>
export type TilesInsertModel = z.infer<typeof tiles_insert_schema>
