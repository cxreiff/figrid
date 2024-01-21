import { relations } from "drizzle-orm"
import { mysqlEnum, mysqlTable, varchar } from "drizzle-orm/mysql-core"
import { characters } from "~/database/schema/characters.server.ts"
import { events } from "~/database/schema/events.server.ts"
import { grids } from "~/database/schema/grids.server.ts"
import { items } from "~/database/schema/items.server.ts"
import { tiles } from "~/database/schema/tiles.server.ts"
import { grid_resource_fields } from "~/database/shared.server.ts"

export const assets = mysqlTable("assets", {
    ...grid_resource_fields,

    resource_type: mysqlEnum("resource_type", [
        "grid",
        "tile",
        "event",
        "character",
        "item",
    ]).notNull(),
    asset_type: mysqlEnum("asset_type", ["image"]).default("image").notNull(),
    filename: varchar("filename", { length: 256 }).notNull(),
})

export const assets_relations = relations(assets, ({ many }) => ({
    grids: many(grids),
    tiles: many(tiles),
    events: many(events),
    characters: many(characters),
    items: many(items),
}))
