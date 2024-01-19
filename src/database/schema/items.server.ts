import { relations } from "drizzle-orm"
import { int, mysqlEnum, mysqlTable } from "drizzle-orm/mysql-core"
import { events } from "~/database/schema/events.server.ts"
import { grids } from "~/database/schema/grids.server.ts"
import { locks } from "~/database/schema/locks.server.ts"
import { tiles } from "~/database/schema/tiles.server.ts"
import {
    grid_resource_fields,
    name_summary_description,
} from "~/database/shared.server.ts"

export const items = mysqlTable("items", {
    ...grid_resource_fields,
    ...name_summary_description,

    type: mysqlEnum("type", ["basic", "key"]).default("basic").notNull(),
})

export const items_relations = relations(items, ({ one, many }) => ({
    grid: one(grids, {
        fields: [items.grid_id],
        references: [grids.id],
    }),
    instances: many(item_instances),
    required_by: many(locks),
}))

export const item_instances = mysqlTable("item_instances", {
    ...grid_resource_fields,

    item_id: int("item_id").notNull(),
    tile_id: int("tile_id"),
    event_id: int("event_id"),
})

export const item_instances_relations = relations(
    item_instances,
    ({ one }) => ({
        grid: one(grids, {
            fields: [item_instances.grid_id],
            references: [grids.id],
        }),
        item: one(items, {
            fields: [item_instances.item_id],
            references: [items.id],
        }),
        tile: one(tiles, {
            fields: [item_instances.tile_id],
            references: [tiles.id],
        }),
        event: one(events, {
            fields: [item_instances.event_id],
            references: [events.id],
        }),
    }),
)
