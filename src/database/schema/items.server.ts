import { relations } from "drizzle-orm"
import { int, mysqlEnum, mysqlTable, unique } from "drizzle-orm/mysql-core"
import { users } from "~/database/schema/auth.server.ts"
import { events } from "~/database/schema/events.server.ts"
import { grids } from "~/database/schema/grids.server.ts"
import { requirements } from "~/database/schema/requirements.server.ts"
import { tiles } from "~/database/schema/tiles.server.ts"
import {
    grid_resource_fields,
    name_summary_description,
} from "~/database/shared.server.ts"

export const items = mysqlTable(
    "items",
    {
        ...grid_resource_fields,
        ...name_summary_description,

        type: mysqlEnum("type", ["key", "pass"]),
    },
    (t) => ({
        unique_name: unique("unique_name").on(t.id, t.name),
    }),
)

export const items_relations = relations(items, ({ one, many }) => ({
    user: one(users, {
        fields: [items.user_id],
        references: [users.id],
    }),
    grid: one(grids, {
        fields: [items.user_id],
        references: [grids.id],
    }),
    requiring_events: many(events),
    requirements: many(requirements),
    instances: many(item_instances),
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
