import { relations } from "drizzle-orm"
import { int, mysqlTable } from "drizzle-orm/mysql-core"
import { users } from "~/database/schema/auth.server.ts"
import {
    character_instances,
    characters,
} from "~/database/schema/characters.server.ts"
import { events } from "~/database/schema/events.server.ts"
import { gates } from "~/database/schema/gates.server.ts"
import { item_instances, items } from "~/database/schema/items.server.ts"
import { lock_instances, locks } from "~/database/schema/locks.server.ts"
import { tiles } from "~/database/schema/tiles.server.ts"
import {
    create_update_timestamps,
    incrementing_id,
    name_summary_description,
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
    lock_instances: many(lock_instances),
    items: many(items),
    item_instances: many(item_instances),
    characters: many(characters),
    character_instances: many(character_instances),
}))
