import { relations } from "drizzle-orm"
import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core"
import { users } from "~/database/schema/auth.server.ts"
import {
    characters,
    item_instances,
    items,
} from "~/database/schema/entities.server.ts"
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
    parent_character_id: int("parent_character_id"),
    trigger: varchar("trigger", { length: 256 }),

    must_have_item_id: int("must_have_item_id"),
    must_be_unlocked_id: int("must_be_unlocked_id"),
    must_be_locked_id: int("must_be_locked_id"),
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
    parent_character: one(characters, {
        fields: [events.parent_character_id],
        references: [characters.id],
    }),
    must_have_item: one(items, {
        fields: [events.must_have_item_id],
        references: [items.id],
    }),
    must_be_unlocked: one(locks, {
        fields: [events.must_be_unlocked_id],
        references: [locks.id],
    }),
    must_be_locked: one(locks, {
        fields: [events.must_be_locked_id],
        references: [locks.id],
    }),
    child_events: many(events, { relationName: "child" }),
    unlocks: many(locks, { relationName: "unlocks" }),
    locks: many(locks, { relationName: "locks" }),
    items_received: many(item_instances),
    requirements: many(requirements),
}))

export const locks = mysqlTable("locks", {
    ...incrementing_id,
    ...create_update_timestamps,
    ...user_grid_ids,
    ...name_summary_description,

    unlocked_by_id: int("unlocked_by_id"),
    locked_by_id: int("locked_by_id"),
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
    unlocked_by: one(events, {
        fields: [locks.unlocked_by_id],
        references: [events.id],
        relationName: "unlocks",
    }),
    locked_by: one(events, {
        fields: [locks.locked_by_id],
        references: [events.id],
        relationName: "locks",
    }),
    requirements: many(requirements),
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
