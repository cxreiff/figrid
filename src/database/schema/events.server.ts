import { relations } from "drizzle-orm"
import { boolean, int, mysqlTable, varchar } from "drizzle-orm/mysql-core"
import { users } from "~/database/schema/auth.server.ts"
import {
    characters,
    item_instances,
    items,
} from "~/database/schema/entities.server.ts"
import { gates, grids, tiles } from "~/database/schema/grids.server.ts"
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
    parent_tile_id: int("parent_tile_id"),
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
    parent_character: one(characters, {
        fields: [events.parent_character_id],
        references: [characters.id],
    }),
    parent_tile: one(tiles, {
        fields: [events.parent_tile_id],
        references: [tiles.id],
    }),
    child_events: many(events, { relationName: "child" }),
    unlocks_locks: many(locks, { relationName: "unlocks" }),
    locks_locks: many(locks, { relationName: "locks" }),
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

    lock_id: int("lock_id"),
    item_id: int("item_id"),

    event_id: int("event_id"),
    gate_id: int("gate_id"),

    inverse: boolean("inverse").default(false).notNull(),
    visible: boolean("visible").default(true).notNull(),
    consumes: boolean("consumes").default(false).notNull(),
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
    item: one(items, {
        fields: [requirements.item_id],
        references: [items.id],
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
