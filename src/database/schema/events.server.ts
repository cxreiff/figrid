import { relations } from "drizzle-orm"
import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core"
import { users } from "~/database/schema/auth.server.ts"
import { characters } from "~/database/schema/characters.server.ts"
import { grids } from "~/database/schema/grids.server.ts"
import { item_instances } from "~/database/schema/items.server.ts"
import { locks } from "~/database/schema/locks.server.ts"
import { requirements } from "~/database/schema/requirements.server.ts"
import { tiles } from "~/database/schema/tiles.server.ts"
import {
    grid_resource_fields,
    name_summary_description,
} from "~/database/shared.server.ts"

export const events = mysqlTable("events", {
    ...grid_resource_fields,
    ...name_summary_description,

    parent_id: int("parent_id"),
    trigger: varchar("trigger", { length: 256 }),
})

export const events_relations = relations(events, ({ one, many }) => ({
    user: one(users, {
        fields: [events.user_id],
        references: [users.id],
    }),
    grid: one(grids, {
        fields: [events.grid_id],
        references: [grids.id],
    }),
    parent: one(events, {
        fields: [events.parent_id],
        references: [events.id],
        relationName: "child",
    }),
    child_events: many(events, { relationName: "child" }),
    unlocks_locks: many(locks, { relationName: "unlocks" }),
    locks_locks: many(locks, { relationName: "locks" }),
    items_received: many(item_instances),
    requirements: many(requirements),
    instances: many(event_instances),
}))

export const event_instances = mysqlTable("event_instances", {
    ...grid_resource_fields,

    event_id: int("event_id").notNull(),
    parent_tile_id: int("parent_tile_id"),
    parent_character_id: int("parent_character_id"),
})

export const event_instances_relations = relations(
    event_instances,
    ({ one }) => ({
        event: one(events, {
            fields: [event_instances.event_id],
            references: [events.id],
        }),
        parent_character: one(characters, {
            fields: [event_instances.parent_character_id],
            references: [characters.id],
        }),
        parent_tile: one(tiles, {
            fields: [event_instances.parent_tile_id],
            references: [tiles.id],
        }),
    }),
)
