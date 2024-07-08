import { relations } from "drizzle-orm"
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core"
import { assets } from "~/database/schema/assets.server.ts"
import { characters } from "~/database/schema/characters.server.ts"
import { gates } from "~/database/schema/gates.server.ts"
import { grids } from "~/database/schema/grids.server.ts"
import { item_instances } from "~/database/schema/items.server.ts"
import { lock_instances, locks } from "~/database/schema/locks.server.ts"
import { tiles } from "~/database/schema/tiles.server.ts"
import {
    grid_resource_fields,
    name_summary_description,
    can_have_image,
} from "~/database/shared.server.ts"

export const events = sqliteTable(
    "events",
    {
        ...grid_resource_fields,
        ...name_summary_description,
        ...can_have_image,

        parent_id: integer("parent_id"),
        trigger: text("trigger", { length: 256 }).notNull().default("trigger"),

        triggers_unlock_id: integer("triggers_unlock_id"),
        triggers_lock_id: integer("triggers_lock_id"),
    },
    (t) => ({
        name: unique().on(t.grid_id, t.name),
    }),
)

export const events_relations = relations(events, ({ one, many }) => ({
    grid: one(grids, {
        fields: [events.grid_id],
        references: [grids.id],
    }),
    image_asset: one(assets, {
        fields: [events.image_asset_id],
        references: [assets.id],
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

export const event_instances = sqliteTable("event_instances", {
    ...grid_resource_fields,

    event_id: integer("event_id").notNull(),
    tile_id: integer("tile_id"),
    character_id: integer("character_id"),
    gate_id: integer("gate_id"),
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
        character: one(characters, {
            fields: [event_instances.character_id],
            references: [characters.id],
        }),
        tile: one(tiles, {
            fields: [event_instances.tile_id],
            references: [tiles.id],
        }),
        gate: one(gates, {
            fields: [event_instances.gate_id],
            references: [gates.id],
        }),
    }),
)
