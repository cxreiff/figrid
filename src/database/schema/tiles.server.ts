import { relations } from "drizzle-orm"
import { sqliteTable, unique } from "drizzle-orm/sqlite-core"
import { assets } from "~/database/schema/assets.server.ts"
import { character_instances } from "~/database/schema/characters.server.ts"
import { event_instances } from "~/database/schema/events.server.ts"
import { gates } from "~/database/schema/gates.server.ts"
import { grids } from "~/database/schema/grids.server.ts"
import { item_instances } from "~/database/schema/items.server.ts"
import {
    grid_resource_fields,
    name_summary_description,
    can_have_image,
} from "~/database/shared.server.ts"

export const tiles = sqliteTable(
    "tiles",
    {
        ...grid_resource_fields,
        ...name_summary_description,
        ...can_have_image,
    },
    (t) => ({
        name: unique().on(t.grid_id, t.name),
    }),
)

export const tiles_relations = relations(tiles, ({ one, many }) => ({
    grid: one(grids, {
        fields: [tiles.grid_id],
        references: [grids.id],
    }),
    image_asset: one(assets, {
        fields: [tiles.image_asset_id],
        references: [assets.id],
    }),
    gates_out: many(gates, { relationName: "from" }),
    gates_in: many(gates, { relationName: "to" }),
    item_instances: many(item_instances),
    character_instances: many(character_instances),
    event_instances: many(event_instances),
}))
