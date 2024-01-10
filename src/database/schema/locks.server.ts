import { relations } from "drizzle-orm"
import { int, mysqlTable } from "drizzle-orm/mysql-core"
import { users } from "~/database/schema/auth.server.ts"
import { events } from "~/database/schema/events.server.ts"
import { grids } from "~/database/schema/grids.server.ts"
import { requirements } from "~/database/schema/requirements.server.ts"
import {
    grid_resource_fields,
    name_summary_description,
} from "~/database/shared.server.ts"

export const locks = mysqlTable("locks", {
    ...grid_resource_fields,
    ...name_summary_description,

    unlocked_by_id: int("unlocked_by_id"),
    locked_by_id: int("locked_by_id"),
})

export const locks_relations = relations(locks, ({ one, many }) => ({
    user: one(users, {
        fields: [locks.user_id],
        references: [users.id],
    }),
    grid: one(grids, {
        fields: [locks.grid_id],
        references: [grids.id],
    }),
    unlocked_by: one(events, {
        fields: [locks.unlocked_by_id],
        references: [events.id],
        relationName: "unlocks",
    }),
    locked_by: one(events, {
        fields: [locks.locked_by_id],
        references: [events.id],
        relationName: "locks",
    }),
    requirements: many(requirements),
}))
