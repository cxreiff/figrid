import { relations } from "drizzle-orm"
import { int, mysqlEnum, mysqlTable } from "drizzle-orm/mysql-core"
import { users } from "~/database/schema/auth.server.ts"
import { events } from "~/database/schema/events.server.ts"
import { grids } from "~/database/schema/grids.server.ts"
import { requirements } from "~/database/schema/requirements.server.ts"
import { tiles } from "~/database/schema/tiles.server.ts"
import { grid_resource_fields } from "~/database/shared.server.ts"

export const gates = mysqlTable("gates", {
    ...grid_resource_fields,

    type: mysqlEnum("type", [
        "north",
        "east",
        "south",
        "west",
        "up",
        "down",
        "other",
    ]).notNull(),

    from_id: int("from_id").notNull(),
    to_id: int("to_id").notNull(),
    event_id: int("event_id"),
})

export const gates_relations = relations(gates, ({ one, many }) => ({
    user: one(users, {
        fields: [gates.user_id],
        references: [users.id],
    }),
    grid: one(grids, {
        fields: [gates.grid_id],
        references: [grids.id],
    }),
    from: one(tiles, {
        fields: [gates.from_id],
        references: [tiles.id],
        relationName: "from",
    }),
    to: one(tiles, {
        fields: [gates.to_id],
        references: [tiles.id],
        relationName: "to",
    }),
    event: one(events, {
        fields: [gates.event_id],
        references: [events.id],
    }),
    requirements: many(requirements),
}))
