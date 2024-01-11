import { relations } from "drizzle-orm"
import { index, mysqlTable } from "drizzle-orm/mysql-core"
import { character_instances } from "~/database/schema/characters.server.ts"
import { event_instances } from "~/database/schema/events.server.ts"
import { gates } from "~/database/schema/gates.server.ts"
import { grids } from "~/database/schema/grids.server.ts"
import { item_instances } from "~/database/schema/items.server.ts"
import {
    grid_resource_fields,
    name_summary_description,
} from "~/database/shared.server.ts"

export const tiles = mysqlTable(
    "tiles",
    {
        ...grid_resource_fields,
        ...name_summary_description,
    },
    (t) => ({
        grid_id: index("grid_id").on(t.grid_id),
    }),
)

export const tiles_relations = relations(tiles, ({ one, many }) => ({
    grid: one(grids, {
        fields: [tiles.grid_id],
        references: [grids.id],
    }),
    gates: many(gates, { relationName: "from" }),
    gates_in: many(gates, { relationName: "to" }),
    item_instances: many(item_instances),
    character_instances: many(character_instances),
    event_instances: many(event_instances),
}))
