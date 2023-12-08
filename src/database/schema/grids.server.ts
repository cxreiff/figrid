import { relations } from "drizzle-orm"
import { index, int, mysqlEnum, mysqlTable } from "drizzle-orm/mysql-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import type { z } from "zod"
import { users } from "~/database/schema/auth.server.ts"
import {
    create_update_timestamps,
    fixer,
    incrementing_id,
    name_summary_description,
} from "~/database/shared.server.ts"

export const grids = mysqlTable("grids", {
    ...incrementing_id,
    ...create_update_timestamps,
    ...name_summary_description,

    player_id: int("player_id").notNull(),
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
    player: one(characters, {
        fields: [grids.player_id],
        references: [characters.id],
    }),
    tiles: many(tiles),
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
        ...name_summary_description,

        north_id: int("north_id"),
        east_id: int("east_id"),
        south_id: int("south_id"),
        west_id: int("west_id"),
        up_id: int("up_id"),
        down_id: int("down_id"),

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
    item_instances: many(item_instances),
    character_instances: many(character_instances),
}))

export const tiles_select_schema = createSelectSchema(tiles, fixer)
export const tiles_insert_schema = createInsertSchema(tiles, fixer)
export type TilesSelectModel = z.infer<typeof tiles_select_schema>
export type TilesInsertModel = z.infer<typeof tiles_insert_schema>

export const items = mysqlTable("items", {
    ...incrementing_id,
    ...create_update_timestamps,
    ...name_summary_description,

    type: mysqlEnum("type", ["key", "pass"]),

    user_id: int("user_id").notNull(),
    grid_id: int("grid_id").notNull(),
})

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
}))

export const items_select_schema = createSelectSchema(items, fixer)
export const items_insert_schema = createInsertSchema(items, fixer)
export type ItemsSelectModel = z.infer<typeof items_select_schema>
export type ItemsInsertModel = z.infer<typeof items_insert_schema>

export const item_instances = mysqlTable("item_instances", {
    ...incrementing_id,
    ...create_update_timestamps,

    grid_id: int("grid_id").notNull(),
    tile_id: int("tile_id").notNull(),
    item_id: int("item_id").notNull(),
})

export const item_instances_relations = relations(
    item_instances,
    ({ one }) => ({
        grid: one(grids, {
            fields: [item_instances.grid_id],
            references: [grids.id],
        }),
        tile: one(tiles, {
            fields: [item_instances.tile_id],
            references: [tiles.id],
        }),
        item: one(items, {
            fields: [item_instances.item_id],
            references: [items.id],
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
    ...name_summary_description,

    user_id: int("user_id").notNull(),
    grid_id: int("grid_id").notNull(),
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

    grid_id: int("grid_id").notNull(),
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
