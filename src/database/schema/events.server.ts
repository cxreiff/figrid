import { relations } from "drizzle-orm"
import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core"
import { characters } from "~/database/schema/characters.server.ts"
import { gates } from "~/database/schema/gates.server.ts"
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

    triggers_unlock_id: int("triggers_unlock_id"),
    triggers_lock_id: int("triggers_lock_id"),
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
    triggers_unlock: one(locks, {
        fields: [events.triggers_unlock_id],
        references: [locks.id],
        relationName: "unlocks",
    }),
    triggers_lock: one(locks, {
        fields: [events.triggers_lock_id],
        references: [locks.id],
        relationName: "locks",
    }),
    children: many(events, { relationName: "child" }),
    instances: many(event_instances),
    item_instances: many(item_instances),
    lock_instances: many(lock_instances),
}))

export const event_instances = mysqlTable("event_instances", {
    ...grid_resource_fields,

    event_id: int("event_id").notNull(),
    parent_tile_id: int("parent_tile_id"),
    parent_character_id: int("parent_character_id"),
    parent_gate_id: int("parent_gate_id"),
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
        parent_gate: one(gates, {
            fields: [event_instances.parent_gate_id],
            references: [gates.id],
        }),
    }),
)
