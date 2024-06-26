import { relations } from "drizzle-orm"
import { integer, sqliteTable, unique } from "drizzle-orm/sqlite-core"
import { assets } from "~/database/schema/assets.server.ts"
import { users } from "~/database/schema/auth.server.ts"
import {
    character_instances,
    characters,
} from "~/database/schema/characters.server.ts"
import { event_instances, events } from "~/database/schema/events.server.ts"
import { gates } from "~/database/schema/gates.server.ts"
import { item_instances, items } from "~/database/schema/items.server.ts"
import { likes } from "~/database/schema/likes.server.ts"
import { lock_instances, locks } from "~/database/schema/locks.server.ts"
import { tiles } from "~/database/schema/tiles.server.ts"
import {
    create_update_timestamps,
    incrementing_id,
    name_summary_description,
    can_have_image,
} from "~/database/shared.server.ts"

export const grids = sqliteTable(
    "grids",
    {
        ...incrementing_id,
        ...create_update_timestamps,
        ...name_summary_description,
        ...can_have_image,

        user_id: integer("user_id").notNull(),

        player_id: integer("player_id").notNull(),
        first_tile_id: integer("first_tile_id").notNull(),
    },
    (t) => ({
        name: unique().on(t.name),
    }),
)

export const grids_relations = relations(grids, ({ one, many }) => ({
    user: one(users, {
        fields: [grids.user_id],
        references: [users.id],
    }),
    first_tile: one(tiles, {
        fields: [grids.first_tile_id],
        references: [tiles.id],
    }),
    player: one(characters, {
        fields: [grids.player_id],
        references: [characters.id],
    }),
    image_asset: one(assets, {
        fields: [grids.image_asset_id],
        references: [assets.id],
        relationName: "image_for_grids",
    }),
    assets: many(assets, { relationName: "grid_assets" }),
    tiles: many(tiles),
    gates: many(gates),
    events: many(events),
    event_instances: many(event_instances),
    locks: many(locks),
    lock_instances: many(lock_instances),
    items: many(items),
    item_instances: many(item_instances),
    characters: many(characters),
    character_instances: many(character_instances),
    likes: many(likes),
}))
