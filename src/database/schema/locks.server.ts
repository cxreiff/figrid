import { relations } from "drizzle-orm"
import { boolean, int, mysqlTable, unique } from "drizzle-orm/mysql-core"
import { events } from "~/database/schema/events.server.ts"
import { gates } from "~/database/schema/gates.server.ts"
import { grids } from "~/database/schema/grids.server.ts"
import { items } from "~/database/schema/items.server.ts"
import {
    grid_resource_fields,
    name_summary_description,
} from "~/database/shared.server.ts"

export const locks = mysqlTable(
    "locks",
    {
        ...grid_resource_fields,
        ...name_summary_description,

        required_item_id: int("required_item_id"),
        consumes: boolean("consumes").default(false).notNull(),
    },
    (t) => ({
        name: unique().on(t.grid_id, t.name),
    }),
)

export const locks_relations = relations(locks, ({ one, many }) => ({
    grid: one(grids, {
        fields: [locks.grid_id],
        references: [grids.id],
    }),
    required_item: one(items, {
        fields: [locks.required_item_id],
        references: [items.id],
    }),
    unlocking_events: many(events, {
        relationName: "unlocks",
    }),
    locking_events: many(events, {
        relationName: "locks",
    }),
    instances: many(lock_instances),
}))

export const lock_instances = mysqlTable("lock_instances", {
    ...grid_resource_fields,

    lock_id: int("lock_id").notNull(),

    event_id: int("event_id"),
    gate_id: int("gate_id"),

    inverse: boolean("inverse").default(false).notNull(),
    hidden: boolean("hidden").default(false).notNull(),
})

export const lock_instances_relations = relations(
    lock_instances,
    ({ one }) => ({
        grid: one(grids, {
            fields: [lock_instances.grid_id],
            references: [grids.id],
        }),
        lock: one(locks, {
            fields: [lock_instances.lock_id],
            references: [locks.id],
        }),
        event: one(events, {
            fields: [lock_instances.event_id],
            references: [events.id],
        }),
        gate: one(gates, {
            fields: [lock_instances.gate_id],
            references: [gates.id],
        }),
    }),
)
