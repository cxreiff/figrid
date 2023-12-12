import { relations } from "drizzle-orm"
import { int, mysqlEnum, mysqlTable, unique } from "drizzle-orm/mysql-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import type { z } from "zod"
import { users } from "~/database/schema/auth.server.ts"
import { events } from "~/database/schema/events.server.ts"
import { grids, tiles } from "~/database/schema/grids.server.ts"
import {
    create_update_timestamps,
    fixer,
    incrementing_id,
    name_summary_description,
    user_grid_ids,
} from "~/database/shared.server.ts"

export const items = mysqlTable(
    "items",
    {
        ...incrementing_id,
        ...create_update_timestamps,
        ...user_grid_ids,
        ...name_summary_description,

        type: mysqlEnum("type", ["key", "pass"]),
    },
    (t) => ({
        unique_name: unique("unique_name").on(t.id, t.name),
    }),
)

export const items_relations = relations(items, ({ one, many }) => ({
    user: one(users, {
        fields: [items.user_id],
        references: [users.id],
    }),
    grid: one(grids, {
        fields: [items.user_id],
        references: [grids.id],
    }),
    item_instances: many(item_instances),
    requiring_events: many(events),
}))

export const items_select_schema = createSelectSchema(items, fixer)
export const items_insert_schema = createInsertSchema(items, fixer)
export type ItemsSelectModel = z.infer<typeof items_select_schema>
export type ItemsInsertModel = z.infer<typeof items_insert_schema>

export const item_instances = mysqlTable("item_instances", {
    ...incrementing_id,
    ...create_update_timestamps,
    ...user_grid_ids,

    item_id: int("item_id").notNull(),
    tile_id: int("tile_id"),
    event_id: int("event_id"),
})

export const item_instances_relations = relations(
    item_instances,
    ({ one }) => ({
        grid: one(grids, {
            fields: [item_instances.grid_id],
            references: [grids.id],
        }),
        item: one(items, {
            fields: [item_instances.item_id],
            references: [items.id],
        }),
        tile: one(tiles, {
            fields: [item_instances.tile_id],
            references: [tiles.id],
        }),
        event: one(events, {
            fields: [item_instances.event_id],
            references: [events.id],
        }),
    }),
)

export const item_instances_select_schema = createSelectSchema(
    item_instances,
    fixer,
)
export const item_instances_insert_schema = createInsertSchema(
    item_instances,
    fixer,
)
export type ItemInstancesSelectModel = z.infer<
    typeof item_instances_select_schema
>
export type ItemInstancesInsertModel = z.infer<
    typeof item_instances_insert_schema
>

export const characters = mysqlTable("characters", {
    ...incrementing_id,
    ...create_update_timestamps,
    ...user_grid_ids,
    ...name_summary_description,
})

export const characters_relations = relations(characters, ({ one, many }) => ({
    user: one(users, {
        fields: [characters.user_id],
        references: [users.id],
    }),
    grid: one(grids, {
        fields: [characters.grid_id],
        references: [grids.id],
    }),
    character_instances: many(character_instances),
}))

export const characters_select_schema = createSelectSchema(characters, fixer)
export const characters_insert_schema = createInsertSchema(characters, fixer)
export type CharactersSelectModel = z.infer<typeof characters_select_schema>
export type CharactersInsertModel = z.infer<typeof characters_insert_schema>

export const character_instances = mysqlTable("character_instances", {
    ...incrementing_id,
    ...create_update_timestamps,
    ...user_grid_ids,

    tile_id: int("tile_id").notNull(),
    character_id: int("character_id").notNull(),
})

export const character_instances_relations = relations(
    character_instances,
    ({ one }) => ({
        grid: one(grids, {
            fields: [character_instances.grid_id],
            references: [grids.id],
        }),
        tile: one(tiles, {
            fields: [character_instances.tile_id],
            references: [tiles.id],
        }),
        character: one(characters, {
            fields: [character_instances.character_id],
            references: [characters.id],
        }),
    }),
)

export const character_instances_select_schema = createSelectSchema(
    character_instances,
    fixer,
)
export const character_instances_insert_schema = createInsertSchema(
    character_instances,
    fixer,
)
export type CharacterInstancesSelectModel = z.infer<
    typeof character_instances_select_schema
>
export type CharacterInstancesInsertModel = z.infer<
    typeof character_instances_insert_schema
>
