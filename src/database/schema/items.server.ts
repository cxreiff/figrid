import { relations } from "drizzle-orm"
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core"
import { ITEM_TYPES } from "~/database/enums.ts"
import { assets } from "~/database/schema/assets.server.ts"
import { events } from "~/database/schema/events.server.ts"
import { grids } from "~/database/schema/grids.server.ts"
import { locks } from "~/database/schema/locks.server.ts"
import { tiles } from "~/database/schema/tiles.server.ts"
import {
    grid_resource_fields,
    name_summary_description,
    can_have_image,
} from "~/database/shared.server.ts"

export const items = sqliteTable(
    "items",
    {
        ...grid_resource_fields,
        ...name_summary_description,
        ...can_have_image,

        type: text("type", { enum: ITEM_TYPES }).default("basic").notNull(),
    },
    (t) => ({
        name: unique().on(t.grid_id, t.name),
    }),
)

export const items_relations = relations(items, ({ one, many }) => ({
    grid: one(grids, {
        fields: [items.grid_id],
        references: [grids.id],
    }),
    image_asset: one(assets, {
        fields: [items.image_asset_id],
        references: [assets.id],
    }),
    instances: many(item_instances),
    required_by: many(locks),
}))

export const item_instances = sqliteTable("item_instances", {
    ...grid_resource_fields,

    item_id: integer("item_id").notNull(),
    tile_id: integer("tile_id"),
    event_id: integer("event_id"),
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
