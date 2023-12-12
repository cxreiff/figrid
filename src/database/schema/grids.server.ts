import { relations } from "drizzle-orm"
import { index, int, mysqlEnum, mysqlTable } from "drizzle-orm/mysql-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import type { z } from "zod"
import { users } from "~/database/schema/auth.server.ts"
import {
    character_instances,
    characters,
    item_instances,
    items,
} from "~/database/schema/entities.server.ts"
import { events, locks, requirements } from "~/database/schema/events.server.ts"
import {
    create_update_timestamps,
    fixer,
    incrementing_id,
    name_summary_description,
    user_grid_ids,
} from "~/database/shared.server.ts"

export const grids = mysqlTable("grids", {
    ...incrementing_id,
    ...create_update_timestamps,
    ...name_summary_description,

    user_id: int("user_id").notNull(),

    player_id: int("player_id").notNull(),
    first_id: int("first_tile").notNull(),
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
    player: one(characters, {
        fields: [grids.player_id],
        references: [characters.id],
    }),
    tiles: many(tiles),
    gates: many(gates),
    events: many(events),
    locks: many(locks),
    requirements: many(requirements),
    items: many(items),
    characters: many(characters),
    item_instances: many(item_instances),
    character_instances: many(character_instances),
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
        ...user_grid_ids,
        ...name_summary_description,
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
    gates: many(gates, { relationName: "from" }),
    gates_in: many(gates, { relationName: "to" }),
    item_instances: many(item_instances),
    character_instances: many(character_instances),
}))

export const tiles_select_schema = createSelectSchema(tiles, fixer)
export const tiles_insert_schema = createInsertSchema(tiles, fixer)
export type TilesSelectModel = z.infer<typeof tiles_select_schema>
export type TilesInsertModel = z.infer<typeof tiles_insert_schema>

export const gates = mysqlTable("gates", {
    ...incrementing_id,
    ...create_update_timestamps,
    ...user_grid_ids,

    type: mysqlEnum("type", [
        "north",
        "east",
        "south",
        "west",
        "up",
        "down",
        "other",
    ]).notNull(),

    from_id: int("from_id").notNull(),
    to_id: int("to_id").notNull(),
    event_id: int("event_id"),
})

export const gates_relations = relations(gates, ({ one, many }) => ({
    user: one(users, {
        fields: [gates.user_id],
        references: [users.id],
    }),
    grid: one(grids, {
        fields: [gates.grid_id],
        references: [grids.id],
    }),
    from: one(tiles, {
        fields: [gates.from_id],
        references: [tiles.id],
        relationName: "from",
    }),
    to: one(tiles, {
        fields: [gates.to_id],
        references: [tiles.id],
        relationName: "to",
    }),
    event: one(events, {
        fields: [gates.event_id],
        references: [events.id],
    }),
    requirements: many(requirements),
}))

export const gates_select_schema = createSelectSchema(gates, fixer)
export const gates_insert_schema = createInsertSchema(gates, fixer)
export type GatesSelectModel = z.infer<typeof gates_select_schema>
export type GatesInsertModel = z.infer<typeof gates_insert_schema>
