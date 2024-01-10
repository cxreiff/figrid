import { relations } from "drizzle-orm"
import { int, mysqlTable } from "drizzle-orm/mysql-core"
import { users } from "~/database/schema/auth.server.ts"
import { event_instances } from "~/database/schema/events.server.ts"
import { grids } from "~/database/schema/grids.server.ts"
import { tiles } from "~/database/schema/tiles.server.ts"
import {
    grid_resource_fields,
    name_summary_description,
} from "~/database/shared.server.ts"

export const characters = mysqlTable("characters", {
    ...grid_resource_fields,
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
    event_instances: many(event_instances),
    instances: many(character_instances),
}))

export const character_instances = mysqlTable("character_instances", {
    ...grid_resource_fields,

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
