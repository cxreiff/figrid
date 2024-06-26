import { relations } from "drizzle-orm"
import { integer, sqliteTable, unique } from "drizzle-orm/sqlite-core"
import { assets } from "~/database/schema/assets.server.ts"
import { event_instances } from "~/database/schema/events.server.ts"
import { grids } from "~/database/schema/grids.server.ts"
import { tiles } from "~/database/schema/tiles.server.ts"
import {
    grid_resource_fields,
    name_summary_description,
    can_have_image,
} from "~/database/shared.server.ts"

export const characters = sqliteTable(
    "characters",
    {
        ...grid_resource_fields,
        ...name_summary_description,
        ...can_have_image,
    },
    (t) => ({
        name: unique().on(t.grid_id, t.name),
    }),
)

export const characters_relations = relations(characters, ({ one, many }) => ({
    grid: one(grids, {
        fields: [characters.grid_id],
        references: [grids.id],
    }),
    image_asset: one(assets, {
        fields: [characters.image_asset_id],
        references: [assets.id],
    }),
    event_instances: many(event_instances),
    instances: many(character_instances),
}))

export const character_instances = sqliteTable("character_instances", {
    ...grid_resource_fields,

    tile_id: integer("tile_id").notNull(),
    character_id: integer("character_id").notNull(),
})

export const character_instances_relations = relations(
    character_instances,
    ({ one }) => ({
        grid: one(grids, {
            fields: [character_instances.grid_id],
            references: [grids.id],
        }),
        character: one(characters, {
            fields: [character_instances.character_id],
            references: [characters.id],
        }),
        tile: one(tiles, {
            fields: [character_instances.tile_id],
            references: [tiles.id],
        }),
    }),
)
