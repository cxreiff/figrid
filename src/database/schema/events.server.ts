import { relations } from "drizzle-orm"
import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core"
import { characters } from "~/database/schema/characters.server.ts"
import { grids } from "~/database/schema/grids.server.ts"
import { item_instances } from "~/database/schema/items.server.ts"
import { lock_instances, locks } from "~/database/schema/locks.server.ts"
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

    trigger_unlock_id: int("unlock_id"),
    trigger_lock_id: int("lock_id"),
})

export const events_relations = relations(events, ({ one, many }) => ({
    grid: one(grids, {
        fields: [events.grid_id],
        references: [grids.id],
    }),
    parent: one(events, {
        fields: [events.parent_id],
        references: [events.id],
        relationName: "child",
    }),
    trigger_unlock: one(locks, {
        fields: [events.trigger_unlock_id],
        references: [locks.id],
        relationName: "unlocks",
    }),
    trigger_lock: one(locks, {
        fields: [events.trigger_lock_id],
        references: [locks.id],
        relationName: "locks",
    }),
    child_events: many(events, { relationName: "child" }),
    instances: many(event_instances),
    grants: many(item_instances),
    locked_by: many(lock_instances),
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
        grid: one(grids, {
            fields: [event_instances.grid_id],
            references: [grids.id],
        }),
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
