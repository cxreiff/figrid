import { relations } from "drizzle-orm"
import { int, mysqlEnum, mysqlTable } from "drizzle-orm/mysql-core"
import { event_instances } from "~/database/schema/events.server.ts"
import { grids } from "~/database/schema/grids.server.ts"
import { lock_instances } from "~/database/schema/locks.server.ts"
import { tiles } from "~/database/schema/tiles.server.ts"
import {
    grid_resource_fields,
    name_summary_description,
} from "~/database/shared.server.ts"

export const gates = mysqlTable("gates", {
    ...grid_resource_fields,
    ...name_summary_description,

    type: mysqlEnum("type", [
        "north",
        "east",
        "south",
        "west",
        "up",
        "down",
        "other",
    ]).notNull(),

    from_tile_id: int("from_tile_id").notNull(),
    to_tile_id: int("to_tile_id").notNull(),
})

export const gates_relations = relations(gates, ({ one, many }) => ({
    grid: one(grids, {
        fields: [gates.grid_id],
        references: [grids.id],
    }),
    from_tile: one(tiles, {
        fields: [gates.from_tile_id],
        references: [tiles.id],
        relationName: "from",
    }),
    to_tile: one(tiles, {
        fields: [gates.to_tile_id],
        references: [tiles.id],
        relationName: "to",
    }),
    event_instances: many(event_instances),
    lock_instances: many(lock_instances),
}))
