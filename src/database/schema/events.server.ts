import { relations } from "drizzle-orm"
import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core"
import { users } from "~/database/schema/auth.server.ts"
import { item_instances, items } from "~/database/schema/entities.server.ts"
import { gates, grids } from "~/database/schema/grids.server.ts"
import {
    create_update_timestamps,
    incrementing_id,
    name_summary_description,
    user_grid_ids,
} from "~/database/shared.server.ts"

export const events = mysqlTable("events", {
    ...incrementing_id,
    ...create_update_timestamps,
    ...user_grid_ids,
    ...name_summary_description,

    parent_id: int("parent_id"),
    trigger: varchar("trigger", { length: 256 }),
    required_item_id: int("required_item_id"),

    unlock_lock_id: int("unlock_lock_id"),
    lock_lock_id: int("lock_lock_id"),
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
    parent_event: one(events, {
        fields: [events.parent_id],
        references: [events.id],
        relationName: "child",
    }),
    required_item: one(items, {
        fields: [events.required_item_id],
        references: [items.id],
    }),
    unlock_lock: one(locks, {
        fields: [events.unlock_lock_id],
        references: [locks.id],
    }),
    lock_lock: one(locks, {
        fields: [events.lock_lock_id],
        references: [locks.id],
    }),
    child_events: many(events, { relationName: "child" }),
    items_received: many(item_instances),
    requirements: many(requirements),
}))

export const locks = mysqlTable("locks", {
    ...incrementing_id,
    ...create_update_timestamps,
    ...user_grid_ids,
    ...name_summary_description,
})

export const locks_relations = relations(locks, ({ one, many }) => ({
    user: one(users, {
        fields: [locks.user_id],
        references: [users.id],
    }),
    grid: one(grids, {
        fields: [locks.grid_id],
        references: [grids.id],
    }),
    requirements: many(requirements),
    unlockers: many(events, { relationName: "unlockers" }),
    lockers: many(events, { relationName: "lockers" }),
}))

export const requirements = mysqlTable("requirements", {
    ...incrementing_id,
    ...create_update_timestamps,
    ...user_grid_ids,
    ...name_summary_description,

    lock_id: int("lock_id").notNull(),
    event_id: int("event_id"),
    gate_id: int("gate_id"),
})

export const requirements_relations = relations(requirements, ({ one }) => ({
    user: one(users, {
        fields: [requirements.user_id],
        references: [users.id],
    }),
    grid: one(grids, {
        fields: [requirements.grid_id],
        references: [grids.id],
    }),
    lock: one(locks, {
        fields: [requirements.lock_id],
        references: [locks.id],
    }),
    event: one(events, {
        fields: [requirements.event_id],
        references: [events.id],
    }),
    gate: one(gates, {
        fields: [requirements.gate_id],
        references: [gates.id],
    }),
}))
