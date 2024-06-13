import { relations } from "drizzle-orm"
import { sqliteTable, text } from "drizzle-orm/sqlite-core"
import { ASSET_RESOURCE_TYPES, ASSET_TYPES } from "~/database/enums.ts"
import { characters } from "~/database/schema/characters.server.ts"
import { events } from "~/database/schema/events.server.ts"
import { grids } from "~/database/schema/grids.server.ts"
import { items } from "~/database/schema/items.server.ts"
import { tiles } from "~/database/schema/tiles.server.ts"
import { grid_resource_fields } from "~/database/shared.server.ts"

export const assets = sqliteTable("assets", {
    ...grid_resource_fields,

    resource_type: text("resource_type", {
        enum: ASSET_RESOURCE_TYPES,
    }).notNull(),
    asset_type: text("asset_type", { enum: ASSET_TYPES })
        .default("images")
        .notNull(),
    filename: text("filename", { length: 256 }).notNull(),
    label: text("label", { length: 256 }),
})

export const assets_relations = relations(assets, ({ one, many }) => ({
    grid: one(grids, {
        fields: [assets.grid_id],
        references: [grids.id],
        relationName: "grid_assets",
    }),
    image_for_grids: many(grids, { relationName: "image_for_grids" }),
    tiles: many(tiles),
    events: many(events),
    characters: many(characters),
    items: many(items),
}))
